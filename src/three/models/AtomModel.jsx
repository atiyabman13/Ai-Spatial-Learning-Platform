import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic 3D Bohr Model of the Atom & Quantum Shells Component
 * 
 * Features:
 * - Subatomic dense nucleus cluster composed of distinct 3D Protons and Neutrons
 * - Quantized electron energy shells (K-shell n=1, L-shell n=2, M-shell n=3)
 * - Orbiting electrons revolving at speeds inversely proportional to radius
 * - Explode mode expands shell orbital distances for clear subatomic inspection
 */
export default function AtomModel({
    explode = 0,
    wireframe = false,
    activePart,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const kGroupRef = useRef();
    const lGroupRef = useRef();
    const mGroupRef = useRef();
    const nucleusGroupRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Orbital electron motion (pauses when an electron or nucleon is hovered or active/inspected)
    useFrame((state, delta) => {
        if (!hoveredId && !hoveredPart && !activePart) {
            if (kGroupRef.current) kGroupRef.current.rotation.z += delta * 3.2;
            if (lGroupRef.current) lGroupRef.current.rotation.z += delta * 2.2;
            if (mGroupRef.current) mGroupRef.current.rotation.z += delta * 1.5;

            if (nucleusGroupRef.current) {
                nucleusGroupRef.current.rotation.y += delta * 0.3;
            }
        }
    });

    // Nucleus cluster nucleons (Carbon-12: 6 Protons + 6 Neutrons)
    const nucleons = useMemo(() => [
        // 6 Protons (Red)
        { id: "p1", type: "proton", pos: [0.18, 0.16, 0.14], color: "#ef4444" },
        { id: "p2", type: "proton", pos: [-0.18, -0.16, 0.14], color: "#ef4444" },
        { id: "p3", type: "proton", pos: [0.18, -0.16, -0.14], color: "#ef4444" },
        { id: "p4", type: "proton", pos: [-0.18, 0.16, -0.14], color: "#ef4444" },
        { id: "p5", type: "proton", pos: [0.26, 0, 0], color: "#ef4444" },
        { id: "p6", type: "proton", pos: [-0.26, 0, 0], color: "#ef4444" },
        // 6 Neutrons (Cyan/Blue)
        { id: "n1", type: "neutron", pos: [0, 0.24, 0.14], color: "#38bdf8" },
        { id: "n2", type: "neutron", pos: [0, -0.24, -0.14], color: "#38bdf8" },
        { id: "n3", type: "neutron", pos: [0.14, 0, 0.24], color: "#38bdf8" },
        { id: "n4", type: "neutron", pos: [-0.14, 0, -0.24], color: "#38bdf8" },
        { id: "n5", type: "neutron", pos: [0, 0, 0.28], color: "#38bdf8" },
        { id: "n6", type: "neutron", pos: [0, 0, -0.28], color: "#38bdf8" }
    ], []);

    // Energy Shells configuration
    const shells = useMemo(() => [
        {
            id: "k_shell",
            name: "Inner K-Shell (n=1, 2 Electrons)",
            radius: 1.55,
            electrons: 2,
            color: "#38bdf8",
            ref: kGroupRef,
            tilt: [0, 0, 0],
            desc: "Innermost lowest energy level with principal quantum number n=1 (capacity 2e⁻)"
        },
        {
            id: "l_shell",
            name: "Middle L-Shell (n=2, 4 Electrons)",
            radius: 2.65,
            electrons: 4,
            color: "#a855f7",
            ref: lGroupRef,
            tilt: [Math.PI / 3, 0, 0],
            desc: "Second energy level with principal quantum number n=2 containing 2s & 2p orbitals"
        },
        {
            id: "m_shell",
            name: "Outer Valency M-Shell (n=3 Level)",
            radius: 3.75,
            electrons: 2,
            color: "#10b981",
            ref: mGroupRef,
            tilt: [-Math.PI / 3, Math.PI / 4, 0],
            desc: "Outermost valency shell dictating chemical bonding behavior and oxidation state"
        }
    ], []);

    const isStructureMatching = (target, id, name) => {
        if (!target) return false;
        const lower = String(target).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const idLower = String(id).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const nameLower = String(name).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        return (
            lower === idLower ||
            lower === nameLower ||
            lower.includes(idLower) ||
            lower.includes(nameLower) ||
            nameLower.includes(lower) ||
            (idLower === "nucleus" && (lower.includes("nucleus") || lower.includes("proton") || lower.includes("neutron"))) ||
            (idLower.includes("k_") && (lower.includes("k-") || lower.includes("k_") || lower.includes("k-shell") || lower.includes("k shell"))) ||
            (idLower.includes("l_") && (lower.includes("l-") || lower.includes("l_") || lower.includes("l-shell") || lower.includes("l shell"))) ||
            (idLower.includes("m_") && (lower.includes("m-") || lower.includes("m_") || lower.includes("m-shell") || lower.includes("m shell")))
        );
    };

    const isSelected = (id, name) => isStructureMatching(activePart, id, name);

    const isNucleusActive = isStructureMatching(activePart, "nucleus", "Nucleus");
    const isNucleusHovered = hoveredId === "nucleus" || Boolean(hoveredPart && isStructureMatching(hoveredPart, "nucleus", "Nucleus"));
    const showNucleusTooltip = isNucleusActive || isNucleusHovered || (showLabels && explode > 0.2);

    return (
        <group
            position={[0, 0, 0]}
            onPointerMissed={(e) => {
                if (e.type === "click") {
                    onSelectPart && onSelectPart(null);
                }
            }}
        >
            {/* 1. Dense Subatomic Nucleus Cluster */}
            <group
                ref={nucleusGroupRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart && onSelectPart("Nucleus (6 Protons + 6 Neutrons)");
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredId("nucleus");
                    onHoverPart && onHoverPart("Nucleus (6 Protons + 6 Neutrons)");
                }}
                onPointerOut={() => {
                    setHoveredId(null);
                    onHoverPart && onHoverPart(null);
                }}
            >
                {nucleons.map((nucleon) => {
                    const isNucleusActive = isSelected("nucleus", "Nucleus");
                    const offsetFactor = explode * 0.8;
                    const pos = [
                        nucleon.pos[0] * (1 + offsetFactor),
                        nucleon.pos[1] * (1 + offsetFactor),
                        nucleon.pos[2] * (1 + offsetFactor)
                    ];

                    return (
                        <mesh key={nucleon.id} position={pos}>
                            <sphereGeometry args={[0.13, 24, 24]} />
                            <meshStandardMaterial
                                color={isNucleusActive ? "#00ffcc" : nucleon.color}
                                roughness={0.2}
                                metalness={0.4}
                                wireframe={wireframe}
                                emissive={isNucleusActive ? "#00ffcc" : nucleon.color}
                                emissiveIntensity={isNucleusActive ? 0.9 : 0.3}
                            />
                        </mesh>
                    );
                })}

                {/* Nucleus Compact Hover / Selection Tooltip */}
                {showNucleusTooltip && (
                    <Html distanceFactor={8} position={[0, 0.65 + explode * 0.4, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
                        <div
                            style={{
                                background: isNucleusActive ? "rgba(0, 255, 204, 0.95)" : "rgba(10, 15, 30, 0.92)",
                                color: isNucleusActive ? "#0a0d14" : "#f1f5f9",
                                padding: "2px 7px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                boxShadow: isNucleusActive
                                    ? "0 0 10px rgba(0, 255, 204, 0.6)"
                                    : "0 2px 6px rgba(0,0,0,0.6)",
                                border: `1px solid ${isNucleusActive ? "#00ffcc" : "rgba(255,255,255,0.22)"}`,
                                pointerEvents: "none",
                                userSelect: "none",
                                transition: "opacity 0.15s ease, transform 0.15s ease",
                                transform: isNucleusActive ? "scale(1.06)" : "scale(1)"
                            }}
                        >
                            Nucleus (6 Protons + 6 Neutrons)
                        </div>
                    </Html>
                )}
            </group>

            {/* 2. Quantized Electron Energy Shells & Orbiting Electrons */}
            {shells.map((shell) => {
                const isShellActive = isStructureMatching(activePart, shell.id, shell.name);
                const isHovered = hoveredId === shell.id || Boolean(hoveredPart && isStructureMatching(hoveredPart, shell.id, shell.name));
                const showTooltip = isShellActive || isHovered || (showLabels && explode > 0.2);
                const orbitRadius = shell.radius * (1 + explode * 0.4);

                return (
                    <group key={shell.id} rotation={shell.tilt}>
                        {/* Orbital Track Ring */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPart && onSelectPart(shell.name);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredId(shell.id);
                                onHoverPart && onHoverPart(shell.name);
                            }}
                            onPointerOut={() => {
                                setHoveredId(null);
                                onHoverPart && onHoverPart(null);
                            }}
                        >
                            <torusGeometry args={[orbitRadius, 0.02, 16, 80]} />
                            <meshStandardMaterial
                                color={isShellActive ? "#00ffcc" : (isHovered ? "#38bdf8" : shell.color)}
                                wireframe={wireframe}
                                emissive={isShellActive ? "#00ffcc" : (isHovered ? "#0284c7" : shell.color)}
                                emissiveIntensity={isShellActive ? 0.9 : (isHovered ? 0.7 : 0.4)}
                            />
                        </mesh>

                        {/* Orbiting Electrons Group */}
                        <group ref={shell.ref}>
                            {Array.from({ length: shell.electrons }).map((_, i) => {
                                const angle = (i / shell.electrons) * Math.PI * 2;
                                const ex = Math.cos(angle) * orbitRadius;
                                const ey = Math.sin(angle) * orbitRadius;

                                return (
                                    <mesh key={i} position={[ex, ey, 0]}>
                                        <sphereGeometry args={[0.09, 16, 16]} />
                                        <meshStandardMaterial
                                            color="#00ffcc"
                                            emissive="#00ffcc"
                                            emissiveIntensity={1.2}
                                            roughness={0.1}
                                        />
                                    </mesh>
                                );
                            })}
                        </group>

                        {/* Shell Compact Hover / Selection Tooltip */}
                        {showTooltip && (
                            <Html distanceFactor={8} position={[0, orbitRadius + 0.35, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
                                <div
                                    style={{
                                        background: isShellActive ? "rgba(0, 255, 204, 0.95)" : "rgba(10, 15, 30, 0.92)",
                                        color: isShellActive ? "#0a0d14" : "#f1f5f9",
                                        padding: "2px 7px",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        whiteSpace: "nowrap",
                                        boxShadow: isShellActive
                                            ? "0 0 10px rgba(0, 255, 204, 0.6)"
                                            : "0 2px 6px rgba(0,0,0,0.6)",
                                        border: `1px solid ${isShellActive ? "#00ffcc" : "rgba(255,255,255,0.22)"}`,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                        transition: "opacity 0.15s ease, transform 0.15s ease",
                                        transform: isShellActive ? "scale(1.06)" : "scale(1)"
                                    }}
                                >
                                    {shell.name}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}
