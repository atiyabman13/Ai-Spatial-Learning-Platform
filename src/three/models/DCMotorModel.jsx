import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic 3D Direct Current (DC) Electric Motor Component
 * 
 * Demonstrates:
 * - Stator curved permanent magnets establishing uniform horizontal magnetic field (B-field)
 * - Armature core with dense multi-turn copper windings
 * - Dual-segment split-ring copper commutator with dielectric insulation gap
 * - Carbon brush blocks with tension springs and power lead cables
 * - Steel drive shaft and ball bearing housings
 * - Live rotation obeying Fleming's Left-Hand Rule
 */
export default function DCMotorModel({
    explode = 0,
    wireframe = false,
    activePart,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const rotorRef = useRef();
    const commutatorRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Continuous rotation of the armature and commutator (pauses when a motor component is hovered or active/inspected)
    useFrame((state, delta) => {
        if (rotorRef.current && !hoveredId && !hoveredPart && !activePart) {
            rotorRef.current.rotation.z += delta * 3.5;
        }
    });

    // Landmarks and educational parts
    const parts = useMemo(() => [
        { id: "stator_n", name: "Stator Permanent Magnet (North Pole)", color: "#ef4444", pos: [-1.6, 0, 0], desc: "Fixed permanent magnet with inward curved pole shoe directing B-field across rotor" },
        { id: "stator_s", name: "Stator Permanent Magnet (South Pole)", color: "#3b82f6", pos: [1.6, 0, 0], desc: "Fixed South magnet completing magnetic circuit with uniform flux density" },
        { id: "armature", name: "Armature Coil & Copper Windings", color: "#f59e0b", pos: [0, 0, 0], desc: "Multiple turns of insulated copper wire on laminated soft iron core experiencing Lorentz torque" },
        { id: "commutator", name: "Split-Ring Commutator", color: "#ec4899", pos: [0, 0, 1.0], desc: "Reverses current polarity every 180° rotation to ensure unidirectional continuous torque" },
        { id: "brushes", name: "Carbon Brushes & Terminals", color: "#10b981", pos: [0, 0.48, 1.0], desc: "Conductive carbon blocks mounted on spring holders maintaining sliding electrical contact" },
        { id: "shaft", name: "Central Drive Shaft & Bearings", color: "#94a3b8", pos: [0, 0, 0], desc: "Hardened steel shaft transmitting mechanical work to external load" },
        { id: "field_lines", name: "Magnetic B-Field Flux", color: "#00ffcc", pos: [0, 0, 0], desc: "Uniform horizontal magnetic induction vector pointing North ➔ South" }
    ], []);

    const isPartMatching = (target, id, name) => {
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
            (idLower.includes("stator") && (lower.includes("stator") || lower.includes("magnet"))) ||
            (idLower === "armature" && (lower.includes("armature") || lower.includes("rotor") || lower.includes("coil") || lower.includes("winding"))) ||
            (idLower === "commutator" && lower.includes("commutator")) ||
            (idLower === "brushes" && (lower.includes("brush") || lower.includes("carbon"))) ||
            (idLower === "shaft" && lower.includes("shaft")) ||
            (idLower === "field_lines" && (lower.includes("flux") || lower.includes("field")))
        );
    };

    const isPartSelected = (id, name) => isPartMatching(activePart, id, name);

    return (
        <group
            position={[0, 0, 0]}
            onPointerMissed={(e) => {
                if (e.type === "click") {
                    onSelectPart && onSelectPart(null);
                }
            }}
        >
            {/* 1. Stator Magnet (North - Red) with Curved Pole Shoe */}
            <group position={[-1.35 - explode * 1.2, 0, 0]}>
                <mesh
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectPart && onSelectPart("Stator Permanent Magnet (North Pole)");
                    }}
                >
                    <boxGeometry args={[0.65, 1.5, 1.6]} />
                    <meshStandardMaterial
                        color={isPartSelected("stator_n", "North") ? "#00ffcc" : "#ef4444"}
                        wireframe={wireframe}
                        roughness={0.3}
                        metalness={0.6}
                        emissive={isPartSelected("stator_n", "North") ? "#00ffcc" : "#991b1b"}
                        emissiveIntensity={isPartSelected("stator_n", "North") ? 0.8 : 0.2}
                    />
                </mesh>
                {/* Curved Pole Face */}
                <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.75, 0.75, 0.15, 32, 1, false, -Math.PI / 3, (2 * Math.PI) / 3]} />
                    <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.2} side={THREE.DoubleSide} wireframe={wireframe} />
                </mesh>
            </group>

            {/* 2. Stator Magnet (South - Blue) with Curved Pole Shoe */}
            <group position={[1.35 + explode * 1.2, 0, 0]}>
                <mesh
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectPart && onSelectPart("Stator Permanent Magnet (South Pole)");
                    }}
                >
                    <boxGeometry args={[0.65, 1.5, 1.6]} />
                    <meshStandardMaterial
                        color={isPartSelected("stator_s", "South") ? "#00ffcc" : "#3b82f6"}
                        wireframe={wireframe}
                        roughness={0.3}
                        metalness={0.6}
                        emissive={isPartSelected("stator_s", "South") ? "#00ffcc" : "#1e40af"}
                        emissiveIntensity={isPartSelected("stator_s", "South") ? 0.8 : 0.2}
                    />
                </mesh>
                {/* Curved Pole Face */}
                <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <cylinderGeometry args={[0.75, 0.75, 0.15, 32, 1, false, -Math.PI / 3, (2 * Math.PI) / 3]} />
                    <meshStandardMaterial color="#2563eb" metalness={0.7} roughness={0.2} side={THREE.DoubleSide} wireframe={wireframe} />
                </mesh>
            </group>

            {/* 3. Rotating Rotor Assembly (Shaft, Armature Windings, and Commutator) */}
            <group ref={rotorRef}>
                {/* Central Steel Drive Shaft */}
                <mesh
                    rotation={[Math.PI / 2, 0, 0]}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectPart && onSelectPart("Central Drive Shaft & Bearings");
                    }}
                >
                    <cylinderGeometry args={[0.1, 0.1, 3.2, 24]} />
                    <meshStandardMaterial
                        color={isPartSelected("shaft", "Shaft") ? "#00ffcc" : "#94a3b8"}
                        wireframe={wireframe}
                        roughness={0.2}
                        metalness={0.9}
                    />
                </mesh>

                {/* Armature Laminated Core & Copper Coils */}
                <group position={[0, 0, 0]}>
                    {/* Rotor Laminated Core */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.55, 0.55, 1.2, 24]} />
                        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} wireframe={wireframe} />
                    </mesh>

                    {/* Copper Coil Windings Loops */}
                    {[0, Math.PI / 3, (2 * Math.PI) / 3].map((rotAngle, idx) => (
                        <group key={idx} rotation={[0, 0, rotAngle]}>
                            {/* Top & Bottom Copper bundles */}
                            <mesh position={[0, 0.55, 0]}>
                                <boxGeometry args={[0.4, 0.22, 1.15]} />
                                <meshStandardMaterial
                                    color={isPartSelected("armature", "Armature") ? "#00ffcc" : "#f59e0b"}
                                    roughness={0.25}
                                    metalness={0.8}
                                    wireframe={wireframe}
                                    emissive={isPartSelected("armature", "Armature") ? "#00ffcc" : "#b45309"}
                                    emissiveIntensity={isPartSelected("armature", "Armature") ? 0.8 : 0.3}
                                />
                            </mesh>
                            <mesh position={[0, -0.55, 0]}>
                                <boxGeometry args={[0.4, 0.22, 1.15]} />
                                <meshStandardMaterial
                                    color={isPartSelected("armature", "Armature") ? "#00ffcc" : "#f59e0b"}
                                    roughness={0.25}
                                    metalness={0.8}
                                    wireframe={wireframe}
                                    emissive={isPartSelected("armature", "Armature") ? "#00ffcc" : "#b45309"}
                                    emissiveIntensity={isPartSelected("armature", "Armature") ? 0.8 : 0.3}
                                />
                            </mesh>
                        </group>
                    ))}
                </group>

                {/* Split-Ring Commutator Segments */}
                <group ref={commutatorRef} position={[0, 0, 0.95 + explode * 0.5]}>
                    {/* Segment 1 */}
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.3, 0.3, 0.35, 24, 1, false, 0.15, Math.PI - 0.3]} />
                        <meshStandardMaterial
                            color={isPartSelected("commutator", "Commutator") ? "#00ffcc" : "#f97316"}
                            roughness={0.2}
                            metalness={0.85}
                            side={THREE.DoubleSide}
                            wireframe={wireframe}
                            emissive={isPartSelected("commutator", "Commutator") ? "#00ffcc" : "#c2410c"}
                            emissiveIntensity={isPartSelected("commutator", "Commutator") ? 0.8 : 0.25}
                        />
                    </mesh>
                    {/* Segment 2 */}
                    <mesh rotation={[Math.PI / 2, 0, Math.PI]}>
                        <cylinderGeometry args={[0.3, 0.3, 0.35, 24, 1, false, 0.15, Math.PI - 0.3]} />
                        <meshStandardMaterial
                            color={isPartSelected("commutator", "Commutator") ? "#00ffcc" : "#f97316"}
                            roughness={0.2}
                            metalness={0.85}
                            side={THREE.DoubleSide}
                            wireframe={wireframe}
                            emissive={isPartSelected("commutator", "Commutator") ? "#00ffcc" : "#c2410c"}
                            emissiveIntensity={isPartSelected("commutator", "Commutator") ? 0.8 : 0.25}
                        />
                    </mesh>
                </group>
            </group>

            {/* 4. Carbon Brushes & Mounting Holders (Stationary) */}
            <group position={[0, 0, 0.95]}>
                {/* Upper Brush */}
                <group position={[0, 0.42 + explode * 0.6, 0]}>
                    <mesh
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectPart && onSelectPart("Carbon Brushes & Terminals");
                        }}
                    >
                        <boxGeometry args={[0.18, 0.24, 0.25]} />
                        <meshStandardMaterial
                            color={isPartSelected("brushes", "Brush") ? "#00ffcc" : "#1e293b"}
                            roughness={0.6}
                            metalness={0.4}
                            wireframe={wireframe}
                        />
                    </mesh>
                    {/* Terminal lead cable */}
                    <mesh position={[0, 0.22, 0]}>
                        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
                        <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.5} />
                    </mesh>
                </group>

                {/* Lower Brush */}
                <group position={[0, -0.42 - explode * 0.6, 0]}>
                    <mesh
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectPart && onSelectPart("Carbon Brushes & Terminals");
                        }}
                    >
                        <boxGeometry args={[0.18, 0.24, 0.25]} />
                        <meshStandardMaterial
                            color={isPartSelected("brushes", "Brush") ? "#00ffcc" : "#1e293b"}
                            roughness={0.6}
                            metalness={0.4}
                            wireframe={wireframe}
                        />
                    </mesh>
                    {/* Terminal lead cable */}
                    <mesh position={[0, -0.22, 0]}>
                        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
                        <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* 5. Magnetic B-Field Vector Lines */}
            <group position={[0, 0, 0]}>
                {[-0.3, 0, 0.3].map((yOffset, i) => (
                    <mesh key={i} position={[0, yOffset, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.015, 0.015, 2.2, 12]} />
                        <meshBasicMaterial color="#00ffcc" transparent opacity={0.6} />
                    </mesh>
                ))}
            </group>

            {/* Landmark Pins: Subtle clickable spheres with compact hover/selection tooltip */}
            {parts.map((part) => {
                const isSelected = isPartMatching(activePart, part.id, part.name);
                const isHovered = hoveredId === part.id || Boolean(hoveredPart && isPartMatching(hoveredPart, part.id, part.name));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.6;
                const landmarkPos = [
                    part.pos[0] * (1 + (part.pos[0] !== 0 ? offsetFactor : 0)),
                    part.pos[1] + (part.pos[1] !== 0 ? (part.pos[1] > 0 ? offsetFactor : -offsetFactor) : 0),
                    part.pos[2] + (part.pos[2] > 0 ? offsetFactor : 0)
                ];

                return (
                    <group key={part.id} position={landmarkPos}>
                        <mesh
                            userData={{ isPin: true }}
                            name={`pin_${part.id}`}
                            scale={isSelected ? 1.25 : (isHovered ? 1.15 : 1)}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPart && onSelectPart(part.name);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredId(part.id);
                                onHoverPart && onHoverPart(part.name);
                            }}
                            onPointerOut={() => {
                                setHoveredId(null);
                                onHoverPart && onHoverPart(null);
                            }}
                        >
                            <sphereGeometry args={[0.038, 16, 16]} />
                            <meshStandardMaterial
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : part.color)}
                                emissive={isSelected ? "#00ffcc" : (isHovered ? "#0284c7" : part.color)}
                                emissiveIntensity={isSelected ? 1.1 : (isHovered ? 0.8 : 0.35)}
                                roughness={0.25}
                                metalness={0.7}
                            />
                        </mesh>

                        {/* Outer pulsing ring for selected structure */}
                        {isSelected && (
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <ringGeometry args={[0.060, 0.080, 32]} />
                                <meshBasicMaterial color="#00ffcc" side={THREE.DoubleSide} transparent opacity={0.85} />
                            </mesh>
                        )}

                        {/* Compact Hover / Selection Tooltip */}
                        {showTooltip && (
                            <Html distanceFactor={8} position={[0, 0.08, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
                                <div
                                    style={{
                                        background: isSelected ? "rgba(0, 255, 204, 0.95)" : "rgba(10, 15, 30, 0.92)",
                                        color: isSelected ? "#0a0d14" : "#f1f5f9",
                                        padding: "2px 7px",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        whiteSpace: "nowrap",
                                        boxShadow: isSelected
                                            ? "0 0 10px rgba(0, 255, 204, 0.6)"
                                            : "0 2px 6px rgba(0,0,0,0.6)",
                                        border: `1px solid ${isSelected ? "#00ffcc" : "rgba(255,255,255,0.22)"}`,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                        transition: "opacity 0.15s ease, transform 0.15s ease",
                                        transform: isSelected ? "scale(1.06)" : "scale(1)"
                                    }}
                                >
                                    {part.name}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}
