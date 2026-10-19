const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";
const MAIN_ROOM_ID = "med-101";
const ISOLATED_ROOM_ID = "med-999";

const REPRESENTATIVE_MODEL_PARTS = [
    { model: "Heart", part: "Aorta & Aortic Arch", part2: "Left Ventricle" },
    { model: "PlantCell", part: "Cell Wall & Membrane", part2: "Chloroplasts (Photosynthesis)" },
    { model: "Respiratory", part: "Trachea (Windpipe)", part2: "Right Lung (Pulmo Dexter)" },
    { model: "Digestive", part: "Esophagus & Cardia", part2: "Stomach (Gastric Reservoir)" },
    { model: "Brain", part: "Frontal Lobe (Left)", part2: "Cerebellum" },
    { model: "Eye", part: "Cornea & Anterior Chamber", part2: "Retina & Macula" },
    { model: "Skeleton", part: "Skull", part2: "Right Femur" },
    { model: "DNA", part: "Sugar-Phosphate Backbone (5' to 3')", part2: "Adenine = Thymine Base Pair" },
    { model: "Mitosis", part: "Cell Membrane & Cleavage Furrow", part2: "Sister Chromatids (Separating)" },
    { model: "DCMotor", part: "Stator Permanent Magnet (North Pole)", part2: "Armature Coil & Copper Windings" },
    { model: "SolarSystem", part: "Sun (Solar Fusion Core)", part2: "Earth" },
    { model: "Atom", part: "Nucleus (6 Protons + 6 Neutrons)", part2: "Inner K-Shell (n=1, 2 Electrons)" }
];

function connectSocket(socket, name, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
        if (socket.connected) return resolve();
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

async function runHoverSyncTestSuite() {
    console.log("🧪 Starting Real-Time Anatomical Hover-Label Synchronization Test Suite...\n");

    let teacherSocket = null;
    let studentSocket = null;
    let isolatedTeacherSocket = null;
    let isolatedStudentSocket = null;

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`  ✅ PASS: ${message}`);
        } else {
            failedTests++;
            console.error(`  ❌ FAIL: ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    try {
        teacherSocket = io(SERVER_URL, { reconnection: false });
        studentSocket = io(SERVER_URL, { reconnection: false });
        isolatedTeacherSocket = io(SERVER_URL, { reconnection: false });
        isolatedStudentSocket = io(SERVER_URL, { reconnection: false });

        await connectSocket(teacherSocket, "Teacher");
        await connectSocket(studentSocket, "Student");
        await connectSocket(isolatedTeacherSocket, "Isolated Teacher");
        await connectSocket(isolatedStudentSocket, "Isolated Student");
        console.log("🔌 All 4 test sockets connected to backend.\n");

        // 1. Join main classroom session (med-101)
        const teacherJoinPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Teacher join room med-101 timed out")), 10000);
            teacherSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            teacherSocket.once("room-join-error", reject);
        });
        teacherSocket.emit("join-room", {
            roomId: MAIN_ROOM_ID,
            user: { name: "Dr. Sarah Mitchell", role: "teacher" }
        });
        await teacherJoinPromise;
        console.log(`👤 Teacher initialized active room "${MAIN_ROOM_ID}".`);

        const studentJoinPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Student join room med-101 timed out")), 10000);
            studentSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            studentSocket.once("room-join-error", reject);
        });
        studentSocket.emit("join-room", {
            roomId: MAIN_ROOM_ID,
            user: { name: "Alex Student", role: "student" }
        });
        await studentJoinPromise;
        console.log(`👤 Student joined active room "${MAIN_ROOM_ID}".\n`);

        // 2. Join isolated classroom session (med-999) to verify strict room isolation
        const isolatedTeacherJoinPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Isolated teacher join timed out")), 10000);
            isolatedTeacherSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            isolatedTeacherSocket.once("room-join-error", reject);
        });
        isolatedTeacherSocket.emit("join-room", {
            roomId: ISOLATED_ROOM_ID,
            user: { name: "Prof. Isolation", role: "teacher" }
        });
        await isolatedTeacherJoinPromise;

        const isolatedStudentJoinPromise = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Isolated student join timed out")), 10000);
            isolatedStudentSocket.once("room-joined", (data) => {
                clearTimeout(timer);
                resolve(data);
            });
            isolatedStudentSocket.once("room-join-error", reject);
        });
        isolatedStudentSocket.emit("join-room", {
            roomId: ISOLATED_ROOM_ID,
            user: { name: "Isolated Student", role: "student" }
        });
        await isolatedStudentJoinPromise;
        console.log(`🔒 Isolated session in "${ISOLATED_ROOM_ID}" initialized for cross-room isolation check.\n`);

        // Helper to wait for student-spatial-update matching predicate
        function waitForStudentUpdate(predicate, label, timeoutMs = 4000) {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    studentSocket.off("student-spatial-update", handler);
                    reject(new Error(`Timeout (${timeoutMs}ms) waiting for student-spatial-update: ${label}`));
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

        console.log("===============================================================================");
        console.log("SECTION 1: Anatomical Hover-Label Real-Time Synchronization Across All 12 Models");
        console.log("===============================================================================");

        for (const { model, part, part2 } of REPRESENTATIVE_MODEL_PARTS) {
            console.log(`\n🎯 [${model}] Testing anatomical hover synchronization...`);

            // A. Switch model
            let updatePromise = waitForStudentUpdate(d => d.model === model, `Switch to ${model}`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                activePart: null,
                hoveredPart: null
            });
            let state = await updatePromise;
            assert(state.model === model, `${model}: Model switch synchronized to student`);

            // B. Hover Part 1
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === part, `Hover ${part}`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: part
            });
            state = await updatePromise;
            assert(state.hoveredPart === part, `${model}: Hover synchronized on "${part}"`);

            // C. Hover Part 2 (switching parts directly while hovering)
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === part2, `Hover switch to ${part2}`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: part2
            });
            state = await updatePromise;
            assert(state.hoveredPart === part2, `${model}: Hover switched to second landmark "${part2}"`);

            // D. Unhover (clearing hover state)
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === null, "Clear hover");
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: null
            });
            state = await updatePromise;
            assert(state.hoveredPart === null, `${model}: Hover cleared (hoveredPart: null) without stale badge`);
        }

        console.log("\n===============================================================================");
        console.log("SECTION 2: Model Switching and Stale Label Prevention");
        console.log("===============================================================================");

        // Teacher hovers an anatomical part on Digestive
        console.log("\n🔄 Testing model switch while hover label is active...");
        let updatePromise = waitForStudentUpdate(d => d.model === "Digestive" && d.hoveredPart === "Stomach (Gastric Reservoir)", "Hover Stomach on Digestive");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Digestive",
            hoveredPart: "Stomach (Gastric Reservoir)"
        });
        let state = await updatePromise;
        assert(state.hoveredPart === "Stomach (Gastric Reservoir)", "Teacher active hover on Digestive Stomach");

        // Teacher switches to Brain - hover must be cleared to null
        updatePromise = waitForStudentUpdate(d => d.model === "Brain" && d.hoveredPart === null, "Switch model with null hoveredPart");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            hoveredPart: null,
            activePart: null
        });
        state = await updatePromise;
        assert(state.model === "Brain" && state.hoveredPart === null, "Model switched to Brain and previous hoveredPart successfully reset to null");

        console.log("\n===============================================================================");
        console.log("SECTION 3: Room Isolation Verification (No Cross-Room Leakage)");
        console.log("===============================================================================");

        let isolatedLeakDetected = false;
        const isolatedLeakHandler = (data) => {
            if (data.hoveredPart === "Frontal Lobe (Left)") {
                isolatedLeakDetected = true;
            }
        };
        isolatedStudentSocket.on("student-spatial-update", isolatedLeakHandler);

        // Teacher in med-101 hovers Frontal Lobe (Left)
        updatePromise = waitForStudentUpdate(d => d.hoveredPart === "Frontal Lobe (Left)", "Hover Frontal Lobe in med-101");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            hoveredPart: "Frontal Lobe (Left)"
        });
        state = await updatePromise;
        assert(state.hoveredPart === "Frontal Lobe (Left)", "med-101 student received hover update");

        // Wait 600ms to guarantee no events leaked to isolatedStudentSocket in med-999
        await new Promise(r => setTimeout(r, 600));
        isolatedStudentSocket.off("student-spatial-update", isolatedLeakHandler);
        assert(!isolatedLeakDetected, "Room isolation verified: Student in room med-999 did NOT receive med-101 teacher hover event");

        console.log("\n===============================================================================");
        console.log("SECTION 4: Teacher Authority (Student Cannot Emit Control Updates)");
        console.log("===============================================================================");

        // In the application design, student AnatomyCanvas does not pass onHoverPart (isStudentView: true).
        // Let's verify student socket in teacher-spatial-control does not overwrite room state.
        let studentUnauthorizedControlReceived = false;
        const teacherUpdateMonitor = (data) => {
            if (data.hoveredPart === "Unauthorized Hack") {
                studentUnauthorizedControlReceived = true;
            }
        };
        studentSocket.on("student-spatial-update", teacherUpdateMonitor);

        studentSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            hoveredPart: "Unauthorized Hack"
        });

        await new Promise(r => setTimeout(r, 400));
        studentSocket.off("student-spatial-update", teacherUpdateMonitor);
        assert(!studentUnauthorizedControlReceived, "Students cannot trigger spatial updates for themselves or other peers");

        console.log("\n===============================================================================");
        console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED (100% SUCCESS)`);
        console.log("===============================================================================\n");

    } catch (err) {
        console.error("\n💥 Test suite failed with error:", err.message);
        process.exitCode = 1;
    } finally {
        if (teacherSocket) teacherSocket.disconnect();
        if (studentSocket) studentSocket.disconnect();
        if (isolatedTeacherSocket) isolatedTeacherSocket.disconnect();
        if (isolatedStudentSocket) isolatedStudentSocket.disconnect();
        console.log("🧹 All test sockets disconnected cleanly.");
    }
}

runHoverSyncTestSuite();
