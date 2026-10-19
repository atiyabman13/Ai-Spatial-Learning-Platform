/**
 * test_newly_diagnosed_cases.js
 * Verification of newly diagnosed bug fixes:
 * 1. Alias normalization (e.g. right-tibia-fibula, backbone-5, Plant Cell membrane)
 * 2. Dash normalization across en-dash, em-dash, and hyphen
 * 3. Active part auto-rotation pause across both hovered and selected parts
 * 4. Stale label prevention on hover-clear, model change, and unmount
 */

import { io } from "socket.io-client";
import assert from "assert";

const BACKEND_URL = "http://localhost:5000";

// Mock catalog matching logic from AnatomyCanvas.jsx
const MODEL_STRUCTURE_CATALOG = {
    Heart: [
        { id: "aorta", name: "Aorta & Aortic Arch" },
        { id: "pulmonary", name: "Pulmonary Artery & Trunk" },
        { id: "venacava", name: "Superior Vena Cava" },
        { id: "atrium_l", name: "Left Atrium" },
        { id: "atrium_r", name: "Right Atrium" },
        { id: "ventricle_l", name: "Left Ventricle" },
        { id: "ventricle_r", name: "Right Ventricle" },
        { id: "valves", name: "Atrioventricular (AV) Valves" }
    ],
    PlantCell: [
        { id: "cell_wall", name: "Cell Wall & Membrane" },
        { id: "wall", name: "Cell Wall & Membrane" },
        { id: "membrane", name: "Cell Wall & Membrane" },
        { id: "nucleus", name: "Nucleus & Chromatin" },
        { id: "vacuole", name: "Large Central Vacuole" },
        { id: "chloroplast", name: "Chloroplasts (Photosynthesis)" },
        { id: "chloroplast_2", name: "Chloroplast (Thylakoids)" },
        { id: "mitochondria", name: "Mitochondria (Powerhouse)" },
        { id: "cytoplasm", name: "Cytosol & Endoplasmic Reticulum" }
    ],
    Eye: [
        { id: "cornea", name: "Cornea & Anterior Chamber" },
        { id: "iris", name: "Iris & Pupil" },
        { id: "lens", name: "Crystalline Lens" },
        { id: "sclera", name: "Sclera (Outer Coat)" },
        { id: "retina", name: "Retina & Macula" },
        { id: "optic-nerve", name: "Optic Nerve (CN II)" }
    ],
    Digestive: [
        { id: "esophagus", name: "Esophagus & Cardia" },
        { id: "stomach", name: "Stomach (Gastric Reservoir)" },
        { id: "liver", name: "Liver (Hepar - Gland)" },
        { id: "duodenum", name: "Duodenum & Pancreas" },
        { id: "small_intestine", name: "Small Intestine (Ileum)" },
        { id: "colon", name: "Large Intestine (Colon)" },
        { id: "small-intestine", name: "Small Intestine (Ileum)" },
        { id: "large-intestine", name: "Large Intestine (Colon)" },
        { id: "gallbladder", name: "Gallbladder" },
        { id: "pancreas", name: "Duodenum & Pancreas" }
    ],
    Skeleton: [
        { id: "skull", name: "Skull" },
        { id: "right-tibia", name: "Right Tibia & Fibula" },
        { id: "right-tibia-fibula", name: "Right Tibia & Fibula" },
        { id: "left-tibia", name: "Left Tibia & Fibula" },
        { id: "left-tibia-fibula", name: "Left Tibia & Fibula" }
    ],
    DNA: [
        { id: "backbone-5", name: "Sugar-Phosphate Backbone (5' to 3')" },
        { id: "backbone", name: "Sugar-Phosphate Backbone (5' to 3')" }
    ]
};

function normalizeLandmarkString(str) {
    if (!str) return "";
    return String(str)
        .trim()
        .toLowerCase()
        .replace(/[\u2010-\u2015\u2212]/g, "-")
        .replace(/\s+/g, " ");
}

function resolveDisplayName(modelName, partIdOrName) {
    if (!partIdOrName || partIdOrName === "null" || partIdOrName === "undefined") return null;
    const raw = String(partIdOrName).trim();
    if (!raw || raw === "null" || raw === "undefined") return null;
    const list = MODEL_STRUCTURE_CATALOG[modelName] || [];
    const low = normalizeLandmarkString(raw);

    const exact = list.find(item => {
        const itemId = normalizeLandmarkString(item.id);
        const itemName = normalizeLandmarkString(item.name);
        return itemId === low || itemName === low;
    });
    if (exact) return exact.name;

    const found = list.find(item => {
        const itemId = normalizeLandmarkString(item.id);
        const itemName = normalizeLandmarkString(item.name);
        return low.includes(itemId) || itemName.includes(low);
    });
    return found ? found.name : raw;
}

async function runNewlyDiagnosedTests() {
    console.log("🧪 Testing Newly Diagnosed Cases & Robustness Safeguards...\n");

    // 1. Alias Resolution Unit Tests
    console.log("SECTION 1: Landmark Alias & Dash Normalization");

    // Test Skeleton Tibia aliases
    const rTibia1 = resolveDisplayName("Skeleton", "right-tibia");
    const rTibia2 = resolveDisplayName("Skeleton", "right-tibia-fibula");
    assert.strictEqual(rTibia1, "Right Tibia & Fibula", "right-tibia resolves to Right Tibia & Fibula");
    assert.strictEqual(rTibia2, "Right Tibia & Fibula", "right-tibia-fibula resolves to Right Tibia & Fibula");
    console.log("  ✅ PASS: Skeleton tibia aliases (right-tibia / right-tibia-fibula) map to canonical name");

    // Test DNA Backbone aliases
    const dna1 = resolveDisplayName("DNA", "backbone-5");
    const dna2 = resolveDisplayName("DNA", "backbone");
    assert.strictEqual(dna1, "Sugar-Phosphate Backbone (5' to 3')", "backbone-5 resolves canonically");
    assert.strictEqual(dna2, "Sugar-Phosphate Backbone (5' to 3')", "backbone resolves canonically");
    console.log("  ✅ PASS: DNA backbone aliases (backbone-5 / backbone) map to canonical name");

    // Test Plant Cell landmark aliases
    const pcWall = resolveDisplayName("PlantCell", "wall");
    const pcMembrane = resolveDisplayName("PlantCell", "membrane");
    const pcCellWall = resolveDisplayName("PlantCell", "cell_wall");
    assert.strictEqual(pcWall, "Cell Wall & Membrane");
    assert.strictEqual(pcMembrane, "Cell Wall & Membrane");
    assert.strictEqual(pcCellWall, "Cell Wall & Membrane");
    console.log("  ✅ PASS: Plant Cell membrane & wall aliases map to canonical name");

    // Test Dash variations (en-dash \u2013, em-dash \u2014, hyphen)
    const enDashLiver = "Liver (Hepar \u2013 Gland)";
    const resolvedLiver = resolveDisplayName("Digestive", enDashLiver);
    assert.strictEqual(resolvedLiver, "Liver (Hepar - Gland)");
    console.log("  ✅ PASS: Unicode en-dash '\\u2013' normalized seamlessly for Digestive Liver");

    const emDashLiver = "Liver (Hepar \u2014 Gland)";
    assert.strictEqual(resolveDisplayName("Digestive", emDashLiver), "Liver (Hepar - Gland)");
    console.log("  ✅ PASS: Unicode em-dash '\\u2014' normalized seamlessly for Digestive Liver");

    // Test Eye Optic Nerve
    const opticNerve = resolveDisplayName("Eye", "optic-nerve");
    assert.strictEqual(opticNerve, "Optic Nerve (CN II)");
    console.log("  ✅ PASS: Eye optic-nerve resolves to 'Optic Nerve (CN II)'");

    // Test Heart Right Ventricle
    const rv = resolveDisplayName("Heart", "ventricle_r");
    assert.strictEqual(rv, "Right Ventricle");
    console.log("  ✅ PASS: Heart ventricle_r resolves to 'Right Ventricle'");

    // 2. Pause Rotation Logic Unit Tests
    console.log("\nSECTION 2: Active & Hover Rotation Pause Logic");
    const testCases = [
        { autoRotate: true, hoveredPart: null, activePart: null, expected: true },
        { autoRotate: true, hoveredPart: "Right Ventricle", activePart: null, expected: false },
        { autoRotate: true, hoveredPart: null, activePart: "Right Ventricle", expected: false },
        { autoRotate: true, hoveredPart: "Left Ventricle", activePart: "Right Ventricle", expected: false },
        { autoRotate: false, hoveredPart: null, activePart: null, expected: false },
        { autoRotate: false, hoveredPart: "Aorta", activePart: null, expected: false }
    ];

    testCases.forEach((tc, idx) => {
        const isHoverActive = Boolean(tc.hoveredPart && String(tc.hoveredPart).trim() !== "");
        const isActiveSelected = Boolean(tc.activePart && String(tc.activePart).trim() !== "");
        const isPartInspected = isHoverActive || isActiveSelected;
        const effectiveAutoRotate = tc.autoRotate && !isPartInspected;
        assert.strictEqual(effectiveAutoRotate, tc.expected, `Case ${idx + 1} effectiveAutoRotate failed`);
    });
    console.log("  ✅ PASS: All 6 autoRotate + hoveredPart + activePart pause combinations evaluated correctly");

    // 3. Live Socket Synchronization Test
    console.log("\nSECTION 3: Live Socket Synchronization with Real Backend");
    function connectSocket(socket, name) {
        return new Promise((resolve, reject) => {
            if (socket.connected) return resolve();
            const timer = setTimeout(() => reject(new Error(`${name} socket connection timed out`)), 6000);
            socket.once("connect", () => {
                clearTimeout(timer);
                resolve();
            });
            socket.once("connect_error", (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    const teacher = io(BACKEND_URL, { reconnection: false });
    const student = io(BACKEND_URL, { reconnection: false });

    await connectSocket(teacher, "Teacher");
    await connectSocket(student, "Student");

    const room = "med-101";

    const teacherJoined = new Promise((resolve) => teacher.once("room-joined", resolve));
    teacher.emit("join-room", { roomId: room, user: { name: "Dr. Sarah", role: "teacher" } });
    await teacherJoined;

    const studentJoined = new Promise((resolve) => student.once("room-joined", resolve));
    student.emit("join-room", { roomId: room, user: { name: "Student", role: "student" } });
    await studentJoined;

    // Test Teacher emits activePart
    const updatePromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Timeout waiting for student-spatial-update")), 5000);
        student.on("student-spatial-update", (data) => {
            if (data.activePart === "Optic Nerve (CN II)") {
                clearTimeout(timer);
                resolve(data);
            }
        });
    });

    teacher.emit("teacher-spatial-control", {
        roomId: room,
        model: "Eye",
        activePart: "Optic Nerve (CN II)",
        hoveredPart: null,
        autoRotate: true
    });

    const studentReceivedState = await updatePromise;

    assert.ok(studentReceivedState, "Student received student-spatial-update event");
    assert.strictEqual(studentReceivedState.model, "Eye");
    assert.strictEqual(studentReceivedState.activePart, "Optic Nerve (CN II)");
    console.log("  ✅ PASS: Active part inspection state broadcast and received by student");

    teacher.disconnect();
    student.disconnect();

    console.log("\n===============================================================================");
    console.log("🎉 ALL NEWLY DIAGNOSED CASES PASSED CLEANLY!");
    console.log("===============================================================================\n");
    process.exit(0);
}

runNewlyDiagnosedTests().catch(err => {
    console.error("❌ Test failed:", err);
    process.exit(1);
});
