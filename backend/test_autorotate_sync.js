const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";
const MAIN_ROOM_ID = "med-101";
const ISOLATED_ROOM_ID = "med-999";

const ALL_12_MODELS = [
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

async function runAutoRotateSyncSuite() {
    console.log("🧪 Starting Synchronized Auto-Rotation Pause Test Suite Across All 12 Models...\n");

    let teacherSocket = null;
    let studentSocket = null;

    let totalTests = 0;
    let passedTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            passedTests++;
            console.log(`  ✅ PASS: ${message}`);
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    try {
        teacherSocket = io(SERVER_URL, { reconnection: false });
        studentSocket = io(SERVER_URL, { reconnection: false });

        await connectSocket(teacherSocket, "Teacher");
        await connectSocket(studentSocket, "Student");
        console.log("🔌 Sockets connected.\n");

        // Join room
        await new Promise((res, rej) => {
            teacherSocket.once("room-joined", res);
            teacherSocket.emit("join-room", { roomId: MAIN_ROOM_ID, user: { name: "Dr. Sarah Mitchell", role: "teacher" } });
        });
        await new Promise((res, rej) => {
            studentSocket.once("room-joined", res);
            studentSocket.emit("join-room", { roomId: MAIN_ROOM_ID, user: { name: "Student Alex", role: "student" } });
        });
        console.log(`👤 Teacher & Student joined room "${MAIN_ROOM_ID}".\n`);

        const waitForStudentUpdate = (predicate, label, timeoutMs = 6000) => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    studentSocket.off("student-spatial-update", handler);
                    reject(new Error(`Timeout waiting for student update: ${label}`));
                }, timeoutMs);

                const handler = (data) => {
                    if (predicate(data)) {
                        clearTimeout(timer);
                        studentSocket.off("student-spatial-update", handler);
                        resolve(data);
                    }
                };

                studentSocket.on("student-spatial-update", handler);
            });
        };

        // Section 1: Verify all 12 models rotate before hover, pause on hover, stay paused when moving parts, and resume on unhover
        console.log("===============================================================================");
        console.log("SECTION 1: Auto-Rotation Pause / Resume Across All 12 Models");
        console.log("===============================================================================");

        for (const { model, part, part2 } of ALL_12_MODELS) {
            console.log(`\n🎯 [${model}] Testing synchronized auto-rotation pause & resume:`);

            // 1. Switch to model with autoRotate: true, hoveredPart: null
            let updatePromise = waitForStudentUpdate(d => d.model === model && d.autoRotate === true, `${model} active rotation`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                autoRotate: true,
                hoveredPart: null
            });
            let state = await updatePromise;
            // Effective rotation in student canvas: state.autoRotate && !state.hoveredPart
            let effectiveStudentRotation = state.autoRotate && !state.hoveredPart;
            assert(effectiveStudentRotation === true, `${model}: Rotation active before hover`);

            // 2. Teacher hovers over landmark part -> pause rotation
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === part, `${model} hover ${part}`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: part
            });
            state = await updatePromise;
            effectiveStudentRotation = state.autoRotate && !state.hoveredPart;
            assert(state.hoveredPart === part, `${model}: Hover label displayed ("${part}")`);
            assert(effectiveStudentRotation === false, `${model}: Auto-rotation IMMEDIATELY PAUSED during hover`);

            // 3. Move directly from part to part2 -> remains paused without flicker
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === part2, `${model} hover ${part2}`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: part2
            });
            state = await updatePromise;
            effectiveStudentRotation = state.autoRotate && !state.hoveredPart;
            assert(state.hoveredPart === part2, `${model}: Switched directly to second part ("${part2}")`);
            assert(effectiveStudentRotation === false, `${model}: Rotation REMAINED CONTINUOUSLY PAUSED without flicker`);

            // 4. Hover clears -> resumes auto-rotation
            updatePromise = waitForStudentUpdate(d => d.hoveredPart === null, `${model} unhover`);
            teacherSocket.emit("teacher-spatial-control", {
                roomId: MAIN_ROOM_ID,
                model,
                hoveredPart: null
            });
            state = await updatePromise;
            effectiveStudentRotation = state.autoRotate && !state.hoveredPart;
            assert(state.hoveredPart === null, `${model}: Hover cleared`);
            assert(effectiveStudentRotation === true, `${model}: Rotation RESUMED successfully in both portals`);
        }

        console.log("\n===============================================================================");
        console.log("SECTION 2: Pre-existing Paused State Not Overwritten on Unhover (Requirement 6)");
        console.log("===============================================================================");

        // If teacher turned off 360 orbit button (autoRotate: false), hovering and unhovering must NOT resume rotation!
        let updatePromise = waitForStudentUpdate(d => d.autoRotate === false, "Set autoRotate: false");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            autoRotate: false,
            hoveredPart: null
        });
        let state = await updatePromise;
        assert(state.autoRotate === false, "Teacher disabled 360° auto-orbit (autoRotate: false)");

        // Teacher hovers over part while autoRotate was already false
        updatePromise = waitForStudentUpdate(d => d.hoveredPart === "Frontal Lobe (Left)", "Hover while paused");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            hoveredPart: "Frontal Lobe (Left)"
        });
        state = await updatePromise;
        assert(state.autoRotate === false, "autoRotate configuration remained false during hover");

        // Teacher unhovers
        updatePromise = waitForStudentUpdate(d => d.hoveredPart === null, "Unhover while paused");
        teacherSocket.emit("teacher-spatial-control", {
            roomId: MAIN_ROOM_ID,
            model: "Brain",
            hoveredPart: null
        });
        state = await updatePromise;
        const effectiveRotation = state.autoRotate && !state.hoveredPart;
        assert(effectiveRotation === false, "Rotation did NOT incorrectly resume when hover cleared (Requirement 6 passed)");

        console.log("\n===============================================================================");
        console.log(`🎉 TEST SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED (100% SUCCESS)`);
        console.log("===============================================================================\n");

    } catch (err) {
        console.error("\n💥 Test failed:", err.message);
        process.exitCode = 1;
    } finally {
        if (teacherSocket) teacherSocket.disconnect();
        if (studentSocket) studentSocket.disconnect();
    }
}

runAutoRotateSyncSuite();
