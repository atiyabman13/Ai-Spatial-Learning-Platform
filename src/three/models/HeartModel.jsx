import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Anatomical 3D Human Heart Component
 * 
 * Features:
 * - Genuine recognizable 3D human heart geometry with PBR materials
 * - Small subtle anatomical marker points
 * - Compact hover tooltip revealing structure name on mouseover
 * - Persistent selected badge and cyan highlight on click
 * - Coronal cutaway cross-section slicing
 * - Biological heartbeat contraction pulse
 * - Explode callout separation
 */
export default function HeartModel({
    explode = 0,
    slice = false,
    pulsing = true,
    wireframe = false,
    activePart,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const groupRef = useRef();
    const modelRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Load genuine anatomical human heart GLB asset
    const { scene } = useGLTF("/models/heart.glb");

    // Clone scene to avoid shared state mutations across multiple instances
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    // Coronal clipping plane for Cross-Section cutaway view revealing internal cardiac chambers
    const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15), []);

    // Anatomical landmarks mapped onto the genuine 3D heart surface
    const parts = useMemo(() => [
        { id: "aorta", name: "Aorta & Aortic Arch", color: "#f43f5e", pos: [0.05, 0.95, 0.1] },
        { id: "pulmonary", name: "Pulmonary Artery & Trunk", color: "#38bdf8", pos: [0.32, 0.65, 0.28] },
        { id: "venacava", name: "Superior Vena Cava", color: "#2563eb", pos: [-0.45, 0.85, -0.05] },
        { id: "atrium_l", name: "Left Atrium", color: "#c084fc", pos: [-0.38, 0.35, -0.25] },
        { id: "atrium_r", name: "Right Atrium", color: "#fbbf24", pos: [0.42, 0.35, -0.05] },
        { id: "ventricle_l", name: "Left Ventricle", color: "#e11d48", pos: [-0.35, -0.45, 0.2] },
        { id: "ventricle_r", name: "Right Ventricle", color: "#f59e0b", pos: [0.28, -0.35, 0.3] },
        { id: "valves", name: "Atrioventricular (AV) Valves", color: "#10b981", pos: [0.02, 0.05, 0.35] }
    ], []);

    // Configure PBR materials, wireframe mode, and clipping plane
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material = child.material.clone();
                    child.material.wireframe = wireframe;
                    child.material.clippingPlanes = slice ? [clippingPlane] : null;
                    child.material.clipShadows = true;
                    // DoubleSide ensures interior cavity walls are rendered when sliced
                    child.material.side = slice ? THREE.DoubleSide : THREE.FrontSide;
                    child.material.needsUpdate = true;
                }
            }
        });
    }, [clonedScene, wireframe, slice, clippingPlane]);

    // Realistic biological heartbeat pulse (systole & diastole contraction cycle)
    useFrame((state) => {
        if (groupRef.current && pulsing) {
            const t = (state.clock.getElapsedTime() * 1.25) % 1; // ~75 bpm
            let beat = 0;
            if (t < 0.14) {
                // Primary ventricular systole ("lub")
                beat = Math.sin((t / 0.14) * Math.PI) * 0.045;
            } else if (t >= 0.18 && t < 0.31) {
                // Secondary semilunar valve rebound ("dub")
                beat = Math.sin(((t - 0.18) / 0.13) * Math.PI) * 0.03;
            }
            const s = 1 + beat;
            groupRef.current.scale.set(s, s, s);
        }
    });

    const isPartMatching = (part, target) => {
        if (!target) return false;
        const targetLower = String(target).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const partNameLower = String(part.name).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const partIdLower = String(part.id).toLowerCase();
        return (
            targetLower === partIdLower ||
            targetLower === partNameLower ||
            targetLower.includes(partIdLower) ||
            targetLower.includes(partNameLower) ||
            partNameLower.includes(targetLower) ||
            (part.id === "ventricle_l" && targetLower.includes("left ventricle")) ||
            (part.id === "ventricle_r" && targetLower.includes("right ventricle")) ||
            (part.id === "atrium_l" && targetLower.includes("left atrium")) ||
            (part.id === "atrium_r" && targetLower.includes("right atrium")) ||
            (part.id === "aorta" && targetLower.includes("aorta")) ||
            (part.id === "pulmonary" && targetLower.includes("pulmonary")) ||
            (part.id === "venacava" && (targetLower.includes("vena cava") || targetLower.includes("venacava"))) ||
            (part.id === "valves" && (targetLower.includes("valve") || targetLower.includes("valves")))
        );
    };

    return (
        <group
            position={[0, 0, 0]}
            onPointerMissed={(e) => {
                if (e.type === "click") {
                    onSelectPart && onSelectPart(null);
                }
            }}
        >
            {/* Pulsing Container for the 3D Heart Mesh */}
            <group ref={groupRef} position={[0, 0, 0]}>
                <primitive
                    ref={modelRef}
                    object={clonedScene}
                    scale={[1, 1, 1]}
                    position={[0, 0, 0]}
                />
            </group>

            {/* Small Subtle Anatomical Marker Points with Compact Hover Tooltip */}
            {parts.map((part) => {
                const isSelected = isPartMatching(part, activePart);
                const isHovered = hoveredId === part.id || Boolean(hoveredPart && isPartMatching(part, hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 1.6;
                const explodedPos = [
                    part.pos[0] * (1 + offsetFactor),
                    part.pos[1] * (1 + offsetFactor * 0.75),
                    part.pos[2] * (1 + offsetFactor)
                ];

                return (
                    <group key={part.id}>
                        {/* Connecting visual ray when exploded */}
                        {explode > 0.08 && (
                            <Line
                                points={[part.pos, explodedPos]}
                                color={isSelected ? "#00ffcc" : part.color}
                                lineWidth={1.5}
                                transparent
                                opacity={0.65}
                                dashed
                                dashScale={10}
                                dashSize={0.1}
                                gapSize={0.05}
                            />
                        )}

                        {/* Interactive Small Marker Point */}
                        <group position={explodedPos}>
                            <mesh
                                userData={{ isPin: true }}
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
                                    emissiveIntensity={isSelected ? 1.2 : (isHovered ? 0.8 : 0.4)}
                                    roughness={0.25}
                                    metalness={0.7}
                                />
                            </mesh>

                            {/* Outer pulsing ring for selected part */}
                            {isSelected && (
                                <mesh rotation={[Math.PI / 2, 0, 0]}>
                                    <ringGeometry args={[0.065, 0.085, 32]} />
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
                    </group>
                );
            })}

            {/* Model Attribution Badge */}
            <Html position={[0, -1.85, 0]} center distanceFactor={11}>
                <div style={{
                    background: "rgba(15, 23, 42, 0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    padding: "3px 10px",
                    fontSize: "10px",
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    pointerEvents: "auto"
                }}>
                    3D Model: <span style={{ color: "#e2e8f0" }}>Realistic Human Heart</span> by <a href="https://sketchfab.com/neshallads" target="_blank" rel="noreferrer" style={{ color: "#38bdf8", textDecoration: "none" }}>neshallads</a> (CC-BY 4.0)
                </div>
            </Html>
        </group>
    );
}

// Preload the GLB model asset for instantaneous rendering
useGLTF.preload("/models/heart.glb");
