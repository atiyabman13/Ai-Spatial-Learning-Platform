const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";
const ROOM_ID = "med-101";

async function testTeacherWorkflow() {
    console.log("Testing Teacher Socket Workflow...");
    const teacherSocket = io(SERVER_URL, { reconnection: false });

    await new Promise((resolve, reject) => {
        teacherSocket.on("connect", resolve);
        teacherSocket.on("connect_error", reject);
    });
    console.log("1. Teacher socket connected.");

    // Teacher joins
    const teacherJoinPromise = new Promise((resolve) => {
        teacherSocket.on("room-joined", resolve);
    });

    teacherSocket.emit("join-room", {
        roomId: ROOM_ID,
        user: { name: "Dr. Sarah Mitchell", role: "teacher" }
    });

    const teacherJoined = await teacherJoinPromise;
    console.log("2. Teacher joined successfully:", teacherJoined.roomId);

    // Student joins
    const studentSocket = io(SERVER_URL, { reconnection: false });
    await new Promise((resolve) => studentSocket.on("connect", resolve));

    const studentJoinPromise = new Promise((resolve, reject) => {
        studentSocket.on("room-joined", resolve);
        studentSocket.on("room-join-error", reject);
    });

    studentSocket.emit("join-room", {
        roomId: ROOM_ID,
        user: { name: "Student Alex", role: "student" }
    });

    const studentJoined = await studentJoinPromise;
    console.log("3. Student joined successfully:", studentJoined.roomId);

    // Teacher broadcasts spatial control
    const syncPromise = new Promise((resolve) => {
        studentSocket.on("student-spatial-update", resolve);
    });

    teacherSocket.emit("teacher-spatial-control", {
        roomId: ROOM_ID,
        model: "Heart",
        explode: 0.5,
        slice: false,
        wireframe: false,
        showLabels: true,
        cameraPosition: [0, 0, 4.5],
        cameraTarget: [0, 0, 0]
    });

    const syncData = await syncPromise;
    console.log("4. Student received broadcast spatial state:", syncData.model, "explode:", syncData.explode);

    // Teacher ends session
    teacherSocket.emit("teacher-end-session", { roomId: ROOM_ID });
    teacherSocket.disconnect();
    studentSocket.disconnect();

    console.log("5. All checks passed successfully!");
}

testTeacherWorkflow().then(() => process.exit(0)).catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
