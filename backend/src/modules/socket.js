const { Server } = require("socket.io");
const ClassroomSession = require("../models/ClassroomSession");

let ioInstance = null;
const activeRooms = {};

/**
 * Broadcast classroom termination to all connected participants in room
 * and reset active room state.
 */
function notifyClassroomEnded(roomId, meta = {}) {
    if (ioInstance) {
        ioInstance.to(roomId).emit("classroom-ended", {
            roomId,
            endedAt: Date.now(),
            reason: meta.reason || "host-ended",
            message: meta.message || "The teacher has ended this classroom session."
        });
        try {
            ioInstance.in(roomId).socketsLeave(roomId);
        } catch (e) {
            console.warn("Notice evicting room sockets:", e.message);
        }
    }
    if (activeRooms[roomId]) {
        activeRooms[roomId].teacher = null;
        activeRooms[roomId].students = [];
        activeRooms[roomId].isActive = false;
        activeRooms[roomId].transformState = null;
    }
}

function socketInit(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("⚡ Client Connected:", socket.id);

        // Join Classroom Room
        socket.on("join-room", async ({ roomId, user }) => {
            if (!roomId || typeof roomId !== "string") return;
            const cleanRoomId = roomId.trim();

            if (user?.role === "teacher") {
                // Teacher is authorized to initialize or host the room
                socket.join(cleanRoomId);

                if (!activeRooms[cleanRoomId]) {
                    activeRooms[cleanRoomId] = {
                        roomId: cleanRoomId,
                        teacher: null,
                        students: [],
                        currentModel: "Heart",
                        transformState: null,
                        isActive: true
                    };
                }

                activeRooms[cleanRoomId].teacher = { socketId: socket.id, user };
                activeRooms[cleanRoomId].isActive = true;

                console.log(`👤 Teacher ${user?.name || socket.id} started/joined room: ${cleanRoomId}`);

                // Persist session to MongoDB in background
                try {
                    await ClassroomSession.findOneAndUpdate(
                        { roomId: cleanRoomId },
                        {
                            teacherName: user?.name || "Dr. Sarah Mitchell",
                            activeModel: activeRooms[cleanRoomId].currentModel,
                            isActive: true
                        },
                        { upsert: true, returnDocument: "after" }
                    );
                } catch (err) {
                    console.warn("ClassroomSession DB save notice:", err.message);
                }

                // Confirm join directly to caller socket
                socket.emit("room-joined", {
                    roomId: cleanRoomId,
                    room: activeRooms[cleanRoomId]
                });

                // Notify everyone in room of participant update
                io.to(cleanRoomId).emit("room-participants", {
                    roomId: cleanRoomId,
                    room: activeRooms[cleanRoomId]
                });

                // Broadcast classroom-started so waiting students discover the session
                io.emit("classroom-started", {
                    roomId: cleanRoomId,
                    teacherName: user?.name || "Teacher",
                    startedAt: Date.now()
                });
            } else {
                // Student Role: Enforce that an active session MUST exist in MongoDB started by teacher!
                const session = await ClassroomSession.findOne({ roomId: cleanRoomId, isActive: true });
                if (!session) {
                    console.warn(`🔒 Student join rejected for inactive room: ${cleanRoomId}`);
                    socket.emit("room-join-error", {
                        roomId: cleanRoomId,
                        code: "INACTIVE_SESSION",
                        message: "No active classroom session. Please wait for your teacher."
                    });
                    return;
                }

                socket.join(cleanRoomId);

                if (!activeRooms[cleanRoomId]) {
                    activeRooms[cleanRoomId] = {
                        roomId: cleanRoomId,
                        teacher: null,
                        students: [],
                        currentModel: session.activeModel || "Heart",
                        transformState: null,
                        isActive: true
                    };
                }

                // Avoid duplicate socket entries
                activeRooms[cleanRoomId].students = activeRooms[cleanRoomId].students.filter(s => s.socketId !== socket.id);
                activeRooms[cleanRoomId].students.push({ socketId: socket.id, user });

                console.log(`👤 Student ${user?.name || socket.id} joined active room: ${cleanRoomId}`);

                // Update connectedStudents in MongoDB without overwriting teacherId or activating inactive rooms
                try {
                    const connectedStudentsFormatted = activeRooms[cleanRoomId].students.map(s => ({
                        socketId: s.socketId,
                        studentName: s.user?.name || "Student"
                    }));
                    await ClassroomSession.findOneAndUpdate(
                        { roomId: cleanRoomId, isActive: true },
                        { connectedStudents: connectedStudentsFormatted }
                    );
                } catch (err) {
                    console.warn("ClassroomSession DB student update notice:", err.message);
                }

                // Confirm join directly to caller socket
                socket.emit("room-joined", {
                    roomId: cleanRoomId,
                    room: activeRooms[cleanRoomId]
                });

                // Notify everyone in room of participant update
                io.to(cleanRoomId).emit("room-participants", {
                    roomId: cleanRoomId,
                    room: activeRooms[cleanRoomId]
                });

                // Send current spatial state to newly joined student immediately
                const initialSpatialState = activeRooms[cleanRoomId].transformState || {
                    roomId: cleanRoomId,
                    model: activeRooms[cleanRoomId].currentModel || session.activeModel || "Heart",
                    explode: 0,
                    slice: false,
                    wireframe: false,
                    showLabels: false,
                    activePart: null,
                    hoveredPart: null,
                    cameraPosition: [0, 0, 4.5],
                    cameraTarget: [0, 0, 0]
                };
                socket.emit("student-spatial-update", initialSpatialState);
            }
        });

        // Leave Room
        socket.on("leave-room", async ({ roomId }) => {
            if (roomId && activeRooms[roomId]) {
                socket.leave(roomId);
                activeRooms[roomId].students = activeRooms[roomId].students.filter(
                    (s) => s.socketId !== socket.id
                );
                if (activeRooms[roomId].teacher?.socketId === socket.id) {
                    activeRooms[roomId].teacher = null;
                    activeRooms[roomId].isActive = false;
                    try {
                        await ClassroomSession.findOneAndUpdate(
                            { roomId },
                            { isActive: false, connectedStudents: [] }
                        );
                    } catch (err) {
                        console.warn("DB notice during teacher leave-room:", err.message);
                    }
                    notifyClassroomEnded(roomId, {
                        reason: "host-left",
                        message: "The teacher has left the classroom session."
                    });
                } else {
                    io.to(roomId).emit("room-participants", { roomId, room: activeRooms[roomId] });
                }
            }
        });

        // Teacher 3D Spatial Transform & Model Sync
        socket.on("teacher-spatial-control", async (data) => {
            const { roomId, model, activePart } = data;

            if (activeRooms[roomId]) {
                activeRooms[roomId].currentModel = model || activeRooms[roomId].currentModel;
                activeRooms[roomId].transformState = {
                    ...(activeRooms[roomId].transformState || {}),
                    ...data
                };

                try {
                    await ClassroomSession.findOneAndUpdate(
                        { roomId },
                        {
                            activeModel: activeRooms[roomId].currentModel,
                            activePart: activePart || null
                        }
                    );
                } catch (err) {
                    // non-blocking
                }
            }

            const stateToSend = (activeRooms[roomId] && activeRooms[roomId].transformState) ? activeRooms[roomId].transformState : data;
            // Broadcast complete latest state to all students in room
            socket.to(roomId).emit("student-spatial-update", stateToSend);
        });

        // Classroom Chat Message
        socket.on("send-message", ({ roomId, sender, message, timestamp }) => {
            io.to(roomId).emit("receive-message", {
                id: Date.now(),
                sender,
                message,
                timestamp: timestamp || new Date().toLocaleTimeString()
            });
        });

        // Teacher Explicitly Ends Entire Classroom Session
        socket.on("teacher-end-session", async ({ roomId }) => {
            if (!roomId) return;
            const room = activeRooms[roomId];
            // Enforce host validation: caller must be the active teacher socket
            if (room && room.teacher && room.teacher.socketId === socket.id) {
                console.log(`🛑 Teacher explicitly ended classroom via socket: ${roomId}`);
                try {
                    await ClassroomSession.findOneAndUpdate(
                        { roomId },
                        { isActive: false, connectedStudents: [] }
                    );
                } catch (err) {
                    console.warn("DB notice during teacher-end-session:", err.message);
                }
                notifyClassroomEnded(roomId, {
                    reason: "host-ended",
                    message: "The teacher has ended this classroom session."
                });
            }
        });

        // Leave Room / Disconnect
        socket.on("disconnect", async () => {
            console.log("❌ Client Disconnected:", socket.id);
            for (const roomId in activeRooms) {
                activeRooms[roomId].students = activeRooms[roomId].students.filter(
                    (s) => s.socketId !== socket.id
                );
                if (activeRooms[roomId].teacher?.socketId === socket.id) {
                    activeRooms[roomId].teacher = null;
                    activeRooms[roomId].isActive = false;
                    try {
                        await ClassroomSession.findOneAndUpdate(
                            { roomId },
                            { isActive: false, connectedStudents: [] }
                        );
                    } catch (err) {
                        console.warn("DB notice during teacher disconnect:", err.message);
                    }
                    notifyClassroomEnded(roomId, {
                        reason: "host-disconnected",
                        message: "The teacher has disconnected from the classroom session."
                    });
                } else {
                    io.to(roomId).emit("room-participants", { roomId, room: activeRooms[roomId] });
                }
            }
        });
    });

    return io;
}

socketInit.notifyClassroomEnded = notifyClassroomEnded;
socketInit.activeRooms = activeRooms;

module.exports = socketInit;
module.exports.notifyClassroomEnded = notifyClassroomEnded;
module.exports.activeRooms = activeRooms;