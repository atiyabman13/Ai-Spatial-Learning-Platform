import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic 3D Mitosis & Cell Division (Anaphase/Cytokinesis) Component
 * 
 * Features:
 * - Dividing eukaryotic cell membrane with deep central cleavage furrow
 * - Dual centrosomes with radiating aster microtubules at opposing poles
 * - Kinetochore mitotic spindle fibers aligning along spindle axis
 * - Realistic condensed X-shaped sister chromatids aligned at the equatorial plate
 * - Dynamic Anaphase: increasing explode pulls chromatids apart toward opposite poles
 * - Coronal cross-section clipping support
 */
export default function MitosisModel({
    explode = 0,
    slice = false,
    wireframe = false,
    activePart,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const groupRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Gentle cellular drift animation (pauses when a mitotic structure is hovered or active/inspected)
    useFrame((state, delta) => {
        if (groupRef.current && !hoveredId && !hoveredPart && !activePart) {
            groupRef.current.rotation.y += delta * 0.25;
        }
    });

    // Coronal clipping plane for cross-section internal inspection
    const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.1), []);

    // 4 Pairs of Sister Chromatids (X-shaped duplicated chromosomes)
    const chromatids = useMemo(() => [
        { id: "chr1", y: 0.65, rotZ: 0.15 },
        { id: "chr2", y: 0.22, rotZ: -0.1 },
        { id: "chr3", y: -0.22, rotZ: 0.12 },
        { id: "chr4", y: -0.65, rotZ: -0.18 }
    ], []);

    const structures = useMemo(() => [
        { id: "membrane", name: "Cell Membrane & Cleavage Furrow", pos: [0, 1.35, 0], desc: "Contractile ring of actin and myosin filaments pinching the cell into two daughter cells" },
        { id: "centrosomes", name: "Centrosomes & Asters (Poles)", pos: [-1.45, 0, 0], desc: "Microtubule-organizing centers at opposite poles anchoring the mitotic apparatus" },
        { id: "spindles", name: "Mitotic Spindle Microtubules", pos: [0, 0.75, 0.35], desc: "Kinetochore fibers exerting mechanical tension to separate duplicated sister chromatids" },
        { id: "chromatids", name: "Sister Chromatids (Separating)", pos: [0, 0, 0.45], desc: "Identical chromosome copies pulled toward opposite poles during anaphase" }
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
            (idLower === "membrane" && (lower.includes("membrane") || lower.includes("cleavage") || lower.includes("cytokinesis"))) ||
            (idLower === "centrosomes" && (lower.includes("centrosome") || lower.includes("aster") || lower.includes("pole"))) ||
            (idLower === "spindles" && (lower.includes("spindle") || lower.includes("microtubule"))) ||
            (idLower === "chromatids" && (lower.includes("chromatid") || lower.includes("chromosome") || lower.includes("anaphase")))
        );
    };

    const isSelected = (id, name) => isStructureMatching(activePart, id, name);

    return (
        <group
            ref={groupRef}
            position={[0, 0, 0]}
            onPointerMissed={(e) => {
                if (e.type === "click") {
                    onSelectPart && onSelectPart(null);
                }
            }}
        >
            {/* 1. Dividing Cell Membrane (Two Overlapping Lobes forming Cleavage Furrow) */}
            <group
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart && onSelectPart("Cell Membrane & Cleavage Furrow");
                }}
            >
                {/* Left Daughter Lobe */}
                <mesh position={[-0.55 - explode * 0.3, 0, 0]} scale={[0.95, 1.15, 1.05]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial
                        color={isSelected("membrane", "Membrane") ? "#00ffcc" : "#10b981"}
                        wireframe={wireframe}
                        transparent
                        opacity={slice ? 0.35 : 0.65}
                        roughness={0.25}
                        transmission={0.4}
                        clippingPlanes={slice ? [clippingPlane] : null}
                        emissive={isSelected("membrane", "Membrane") ? "#00ffcc" : "#059669"}
                        emissiveIntensity={isSelected("membrane", "Membrane") ? 0.6 : 0.15}
                    />
                </mesh>

                {/* Right Daughter Lobe */}
                <mesh position={[0.55 + explode * 0.3, 0, 0]} scale={[0.95, 1.15, 1.05]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial
                        color={isSelected("membrane", "Membrane") ? "#00ffcc" : "#10b981"}
                        wireframe={wireframe}
                        transparent
                        opacity={slice ? 0.35 : 0.65}
                        roughness={0.25}
                        transmission={0.4}
                        clippingPlanes={slice ? [clippingPlane] : null}
                        emissive={isSelected("membrane", "Membrane") ? "#00ffcc" : "#059669"}
                        emissiveIntensity={isSelected("membrane", "Membrane") ? 0.6 : 0.15}
                    />
                </mesh>

                {/* Central Contractile Ring Furrow Indentation Ring */}
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.82, 0.08, 16, 48]} />
                    <meshStandardMaterial color="#059669" roughness={0.3} wireframe={wireframe} />
                </mesh>
            </group>

            {/* 2. Centrosomes & Asters at Opposing Poles */}
            <group
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart && onSelectPart("Centrosomes & Asters (Poles)");
                }}
            >
                {/* Left Pole Centrosome */}
                <group position={[-1.35 - explode * 0.45, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.18, 24, 24]} />
                        <meshStandardMaterial
                            color={isSelected("centrosomes", "Centrosome") ? "#00ffcc" : "#06b6d4"}
                            wireframe={wireframe}
                            emissive={isSelected("centrosomes", "Centrosome") ? "#00ffcc" : "#0891b2"}
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                    {/* Astral Rays */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        return (
                            <mesh key={i} position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]} rotation={[0, 0, angle]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
                                <meshBasicMaterial color="#38bdf8" />
                            </mesh>
                        );
                    })}
                </group>

                {/* Right Pole Centrosome */}
                <group position={[1.35 + explode * 0.45, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.18, 24, 24]} />
                        <meshStandardMaterial
                            color={isSelected("centrosomes", "Centrosome") ? "#00ffcc" : "#06b6d4"}
                            wireframe={wireframe}
                            emissive={isSelected("centrosomes", "Centrosome") ? "#00ffcc" : "#0891b2"}
                            emissiveIntensity={0.8}
                        />
                    </mesh>
                    {/* Astral Rays */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        return (
                            <mesh key={i} position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]} rotation={[0, 0, angle]}>
                                <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
                                <meshBasicMaterial color="#38bdf8" />
                            </mesh>
                        );
                    })}
                </group>
            </group>

            {/* 3. Mitotic Spindle Microtubule Fibers */}
            <group position={[0, 0, 0]}>
                {chromatids.map((chr, i) => {
                    const leftPoleX = -1.35 - explode * 0.45;
                    const rightPoleX = 1.35 + explode * 0.45;
                    const chrLeftX = -0.15 - explode * 0.55;
                    const chrRightX = 0.15 + explode * 0.55;

                    return (
                        <group key={i}>
                            {/* Left spindle fiber from pole to left chromatid */}
                            <mesh position={[(leftPoleX + chrLeftX) / 2, chr.y / 2, 0]}>
                                <cylinderGeometry args={[0.015, 0.015, Math.abs(chrLeftX - leftPoleX), 8]} />
                                <meshBasicMaterial color="#818cf8" transparent opacity={0.65} />
                            </mesh>
                            {/* Right spindle fiber from pole to right chromatid */}
                            <mesh position={[(rightPoleX + chrRightX) / 2, chr.y / 2, 0]}>
                                <cylinderGeometry args={[0.015, 0.015, Math.abs(rightPoleX - chrRightX), 8]} />
                                <meshBasicMaterial color="#818cf8" transparent opacity={0.65} />
                            </mesh>
                        </group>
                    );
                })}
            </group>

            {/* 4. Sister Chromatids (4 Chromosome Pairs Pulling Apart in Anaphase) */}
            <group
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart && onSelectPart("Sister Chromatids (Separating)");
                }}
            >
                {chromatids.map((chr, i) => {
                    const anaphaseDistance = 0.18 + explode * 0.55;
                    const isChromActive = isSelected("chromatids", "Chromatid");

                    return (
                        <group key={chr.id} position={[0, chr.y, 0]} rotation={[0, 0, chr.rotZ]}>
                            {/* Left Chromatid Arm V-Shape */}
                            <group position={[-anaphaseDistance, 0, 0]}>
                                <mesh rotation={[0, 0, 0.45]}>
                                    <capsuleGeometry args={[0.065, 0.42, 16, 16]} />
                                    <meshStandardMaterial
                                        color={isChromActive ? "#00ffcc" : "#f43f5e"}
                                        roughness={0.3}
                                        metalness={0.2}
                                        emissive={isChromActive ? "#00ffcc" : "#e11d48"}
                                        emissiveIntensity={isChromActive ? 0.9 : 0.3}
                                    />
                                </mesh>
                                <mesh rotation={[0, 0, -0.45]}>
                                    <capsuleGeometry args={[0.065, 0.42, 16, 16]} />
                                    <meshStandardMaterial
                                        color={isChromActive ? "#00ffcc" : "#f43f5e"}
                                        roughness={0.3}
                                        metalness={0.2}
                                        emissive={isChromActive ? "#00ffcc" : "#e11d48"}
                                        emissiveIntensity={isChromActive ? 0.9 : 0.3}
                                    />
                                </mesh>
                                {/* Kinetochore Centromere Node */}
                                <mesh position={[-0.08, 0, 0]}>
                                    <sphereGeometry args={[0.06, 12, 12]} />
                                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
                                </mesh>
                            </group>

                            {/* Right Chromatid Arm V-Shape */}
                            <group position={[anaphaseDistance, 0, 0]}>
                                <mesh rotation={[0, 0, 0.45]}>
                                    <capsuleGeometry args={[0.065, 0.42, 16, 16]} />
                                    <meshStandardMaterial
                                        color={isChromActive ? "#00ffcc" : "#f43f5e"}
                                        roughness={0.3}
                                        metalness={0.2}
                                        emissive={isChromActive ? "#00ffcc" : "#e11d48"}
                                        emissiveIntensity={isChromActive ? 0.9 : 0.3}
                                    />
                                </mesh>
                                <mesh rotation={[0, 0, -0.45]}>
                                    <capsuleGeometry args={[0.065, 0.42, 16, 16]} />
                                    <meshStandardMaterial
                                        color={isChromActive ? "#00ffcc" : "#f43f5e"}
                                        roughness={0.3}
                                        metalness={0.2}
                                        emissive={isChromActive ? "#00ffcc" : "#e11d48"}
                                        emissiveIntensity={isChromActive ? 0.9 : 0.3}
                                    />
                                </mesh>
                                {/* Kinetochore Centromere Node */}
                                <mesh position={[0.08, 0, 0]}>
                                    <sphereGeometry args={[0.06, 12, 12]} />
                                    <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
                                </mesh>
                            </group>
                        </group>
                    );
                })}
            </group>

            {/* Landmark Pins: Subtle clickable spheres with compact hover/selection tooltip */}
            {structures.map((st) => {
                const isStActive = isStructureMatching(activePart, st.id, st.name);
                const isHovered = hoveredId === st.id || Boolean(hoveredPart && isStructureMatching(hoveredPart, st.id, st.name));
                const showTooltip = isStActive || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.6;
                const landmarkPos = [
                    st.pos[0] * (1 + (st.pos[0] !== 0 ? offsetFactor : 0)),
                    st.pos[1] + (st.pos[1] > 0 ? offsetFactor * 0.3 : 0),
                    st.pos[2] + offsetFactor * 0.4
                ];

                return (
                    <group key={st.id} position={landmarkPos}>
                        <mesh
                            userData={{ isPin: true }}
                            name={`pin_${st.id}`}
                            scale={isStActive ? 1.25 : (isHovered ? 1.15 : 1)}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPart && onSelectPart(st.name);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredId(st.id);
                                onHoverPart && onHoverPart(st.name);
                            }}
                            onPointerOut={() => {
                                setHoveredId(null);
                                onHoverPart && onHoverPart(null);
                            }}
                        >
                            <sphereGeometry args={[0.038, 16, 16]} />
                            <meshStandardMaterial
                                color={isStActive ? "#00ffcc" : (isHovered ? "#38bdf8" : "#06b6d4")}
                                emissive={isStActive ? "#00ffcc" : (isHovered ? "#0284c7" : "#0284c7")}
                                emissiveIntensity={isStActive ? 1.1 : (isHovered ? 0.8 : 0.35)}
                                roughness={0.25}
                                metalness={0.7}
                            />
                        </mesh>

                        {/* Outer pulsing ring for selected structure */}
                        {isStActive && (
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
                                        background: isStActive ? "rgba(0, 255, 204, 0.95)" : "rgba(10, 15, 30, 0.92)",
                                        color: isStActive ? "#0a0d14" : "#f1f5f9",
                                        padding: "2px 7px",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        whiteSpace: "nowrap",
                                        boxShadow: isStActive
                                            ? "0 0 10px rgba(0, 255, 204, 0.6)"
                                            : "0 2px 6px rgba(0,0,0,0.6)",
                                        border: `1px solid ${isStActive ? "#00ffcc" : "rgba(255,255,255,0.22)"}`,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                        transition: "opacity 0.15s ease, transform 0.15s ease",
                                        transform: isStActive ? "scale(1.06)" : "scale(1)"
                                    }}
                                >
                                    {st.name}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}
