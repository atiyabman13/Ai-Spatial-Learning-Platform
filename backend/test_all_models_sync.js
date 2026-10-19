const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";
const ROOM_ID = "med-101";

const ALL_MODELS = [
    "Heart",
    "PlantCell",
    "Respiratory",
    "Digestive",
    "Brain",
    "Eye",
    "Skeleton",
    "DNA",
    "Mitosis",
    "DCMotor",
    "SolarSystem",
    "Atom"
];

function connectSocket(socket, name, timeoutMs = 6000) {
    return new Promise((resolve, reject) => {
        if (socket.connected) {
            return resolve();
        }
        const timer = setTimeout(() => {
            reject(new Error(`Timeout (${timeoutMs}ms) connecting ${name} to ${SERVER_URL}`));
        }, timeoutMs);
        socket.once("connect", () => {
            clearTimeout(timer);
            resolve();
        });
        socket.once("connect_error", (err) => {
            clearTimeout(timer);
            reject(new Error(`${name} connection error: ${err.message}`));
        });
    });
}

async function runTest() {
    console.log("🚀 Starting End-to-End Live 3D Classroom Synchronization Test across all 12 models...\n");

    let teacherSocket = null;
    let studentSocket = null;
    let lateStudentSocket = null;

    try {
        teacherSocket = io(SERVER_URL, { reconnection: false });
        studentSocket = io(SERVER_URL, { reconnection: false });

        await connectSocket(teacherSocket, "Teacher");
        await connectSocket(studentSocket, "Student");
        console.log("✅ Both Teacher and Student connected to Socket.IO server.");

        // Step 1: Teacher joins room and starts broadcast (register listeners before emit)
        const teacherJoinedPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout (15000ms) waiting for teacher to join room med-101. Note: MongoDB may be unavailable or Mongoose buffer timeout exceeded."));
            }, 15000);
            teacherSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            teacherSocket.once("room-join-error", (err) => {
                clearTimeout(timer);
                reject(new Error(`Teacher room-join-error: ${err.message || err.code || JSON.stringify(err)}`));
            });
        });

        teacherSocket.emit("join-room", {
            roomId: ROOM_ID,
            user: { name: "Dr. Sarah Mitchell", role: "teacher" }
        });

        const teacherConfirmation = await teacherJoinedPromise;
        console.log(`✅ Teacher confirmed joined room "${teacherConfirmation.roomId}".`);

        // Step 2: Student joins room (wait for teacher session activation first; register listeners before emit)
        const studentJoinedPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout (15000ms) waiting for student to join room med-101. Note: MongoDB may be unavailable or Mongoose buffer timeout exceeded."));
            }, 15000);
            studentSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            studentSocket.once("room-join-error", (err) => {
                clearTimeout(timer);
                reject(new Error(`Student room-join-error: ${err.message || err.code || JSON.stringify(err)}`));
            });
        });

        studentSocket.emit("join-room", {
            roomId: ROOM_ID,
            user: { name: "Student Alex", role: "student" }
        });
        const joinConfirmation = await studentJoinedPromise;
        console.log(`✅ Student confirmed joined room "${joinConfirmation.roomId}".`);

    // Helper to wait for student-spatial-update
    function waitForStudentUpdate(predicate, timeoutMs = 3000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                studentSocket.off("student-spatial-update", handler);
                reject(new Error(`Timeout waiting for state matching predicate`));
            }, timeoutMs);

            function handler(data) {
                if (predicate(data)) {
                    clearTimeout(timer);
                    studentSocket.off("student-spatial-update", handler);
                    resolve(data);
                }
            }

            studentSocket.on("student-spatial-update", handler);
        });
    }

    // Step 3: Test all 12 models and visualization settings
    for (const modelName of ALL_MODELS) {
        console.log(`\n🔍 Testing model: ${modelName}`);

        // A. Switch model
        let updatePromise = waitForStudentUpdate(d => d.model === modelName);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            wireframe: false,
            showLabels: false,
            explode: 0,
            slice: false,
            activePart: null,
            cameraPosition: [0, 0, 4.5],
            cameraTarget: [0, 0, 0]
        });
        let state = await updatePromise;
        console.log(`  ✓ Model switch synchronized: ${state.model}`);

        // B. Enable Wireframe
        updatePromise = waitForStudentUpdate(d => d.wireframe === true);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            wireframe: true
        });
        state = await updatePromise;
        console.log(`  ✓ Wireframe ON synchronized (wireframe: ${state.wireframe})`);

        // C. Disable Wireframe
        updatePromise = waitForStudentUpdate(d => d.wireframe === false);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            wireframe: false
        });
        state = await updatePromise;
        console.log(`  ✓ Wireframe OFF synchronized (wireframe: ${state.wireframe})`);

        // D. Enable Anatomical Labels
        updatePromise = waitForStudentUpdate(d => d.showLabels === true);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            showLabels: true
        });
        state = await updatePromise;
        console.log(`  ✓ Labels ON synchronized (showLabels: ${state.showLabels})`);

        // E. Disable Anatomical Labels
        updatePromise = waitForStudentUpdate(d => d.showLabels === false);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            showLabels: false
        });
        state = await updatePromise;
        console.log(`  ✓ Labels OFF synchronized (showLabels: ${state.showLabels})`);

        // F. Structure Selection / Highlight
        const testPart = `Structure_${modelName}`;
        updatePromise = waitForStudentUpdate(d => d.activePart === testPart);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            activePart: testPart
        });
        state = await updatePromise;
        console.log(`  ✓ Structure selection synchronized (activePart: ${state.activePart})`);

        // G. Explode slider adjustment
        updatePromise = waitForStudentUpdate(d => d.explode === 0.65);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            explode: 0.65
        });
        state = await updatePromise;
        console.log(`  ✓ Explode level synchronized (explode: ${state.explode})`);

        // H. Cross-section slice mode
        updatePromise = waitForStudentUpdate(d => d.slice === true);
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            slice: true
        });
        state = await updatePromise;
        console.log(`  ✓ Cross-section slice synchronized (slice: ${state.slice})`);

        // I. Camera Orbit & Zoom
        const newCamPos = [1.2, 2.4, 3.6];
        const newCamTgt = [0.1, -0.2, 0.3];
        updatePromise = waitForStudentUpdate(d => 
            d.cameraPosition && d.cameraPosition[0] === 1.2 && 
            d.cameraTarget && d.cameraTarget[0] === 0.1
        );
        teacherSocket.emit("teacher-spatial-control", {
            roomId: ROOM_ID,
            model: modelName,
            cameraPosition: newCamPos,
            cameraTarget: newCamTgt
        });
        state = await updatePromise;
        console.log(`  ✓ Camera position/orbit synchronized: [${state.cameraPosition}]`);
    }

    // Step 4: Test late-joining student reception of complete state
    console.log("\n🔍 Testing late-joining student state synchronization...");
    // Set a known non-default state on teacher
    teacherSocket.emit("teacher-spatial-control", {
        roomId: ROOM_ID,
        model: "Skeleton",
        wireframe: true,
        showLabels: true,
        explode: 0.45,
        slice: false,
        activePart: "Skull",
        cameraPosition: [2.5, 1.0, 5.0],
        cameraTarget: [0, 0.5, 0]
    });

    await new Promise(r => setTimeout(r, 200));

        // Connect a brand-new student socket
        lateStudentSocket = io(SERVER_URL, { reconnection: false });
        await connectSocket(lateStudentSocket, "Late Student");

        const lateJoinedPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout (6000ms) waiting for late student to join room"));
            }, 6000);
            lateStudentSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            lateStudentSocket.once("room-join-error", (err) => {
                clearTimeout(timer);
                reject(new Error(`Late student room-join-error: ${err.message || err.code}`));
            });
        });

        const lateStatePromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout (6000ms) waiting for late student spatial state"));
            }, 6000);
            lateStudentSocket.once("student-spatial-update", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
        });

        lateStudentSocket.emit("join-room", {
            roomId: ROOM_ID,
            user: { name: "Late Student Maya", role: "student" }
        });

        await lateJoinedPromise;
        const lateState = await lateStatePromise;
        console.log("  Late-joining student received initial state:", {
            model: lateState.model,
            wireframe: lateState.wireframe,
            showLabels: lateState.showLabels,
            explode: lateState.explode,
            activePart: lateState.activePart,
            cameraPosition: lateState.cameraPosition
        });

        if (
            lateState.model === "Skeleton" &&
            lateState.wireframe === true &&
            lateState.showLabels === true &&
            lateState.explode === 0.45 &&
            lateState.activePart === "Skull"
        ) {
            console.log("✅ Late-joining student successfully received COMPLETE active visualization state!");
        } else {
            throw new Error("Late-joining student did not receive complete state!");
        }

        // Step 5: Test participant roster update on student disconnect
        console.log("\n🔍 Testing participant roster update on disconnect...");
        const rosterPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error("Timeout (6000ms) waiting for roster update on student disconnect"));
            }, 6000);
            const handler = (data) => {
                const hasMaya = data.room?.students?.some(s => s.user?.name === "Late Student Maya");
                if (!hasMaya) {
                    clearTimeout(timer);
                    teacherSocket.off("room-participants", handler);
                    resolve(data);
                }
            };
            teacherSocket.on("room-participants", handler);
        });

        lateStudentSocket.close();
        const updatedRoster = await rosterPromise;
        console.log(`✅ Participant roster updated cleanly. Remaining students: ${updatedRoster.room?.students?.length}`);

        console.log("\n🎉 ALL 12 MODELS & CONTROLS SYNCHRONIZATION TESTS PASSED PERFECTLY!\n");
        process.exit(0);
    } finally {
        // Cleanup: end session and disconnect all test sockets safely
        try {
            if (teacherSocket && teacherSocket.connected) {
                teacherSocket.emit("teacher-end-session", { roomId: ROOM_ID });
            }
        } catch {
            // ignore
        }
        if (teacherSocket) teacherSocket.close();
        if (studentSocket) studentSocket.close();
        if (lateStudentSocket) lateStudentSocket.close();
    }
}

runTest().catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
});
