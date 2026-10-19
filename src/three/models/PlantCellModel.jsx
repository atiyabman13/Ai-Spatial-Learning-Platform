import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Authentic 3D Plant Cell Anatomical Model
 * 
 * Features:
 * - High-fidelity realistic eukaryotic plant cell architecture
 * - Distinct organelle sub-structures (Cell wall, chloroplasts, central vacuole, nucleus, mitochondria)
 * - Radial explode separation
 * - Interactive landmark selection and raycasting
 * - CC-BY / Open Educational Asset
 */
export default function PlantCellModel({
    explode = 0,
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

    // Load genuine anatomical plant cell GLB asset with local Draco decompression
    const { scene } = useGLTF("/models/plant_cell.glb", "/draco/");

    // Clone and normalize plant cell scene to canonical dimensions centered at origin [0,0,0]
    const { clonedScene, canonicalOffset, canonicalScale } = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 2.6 / maxDim;

        return {
            clonedScene: cloned,
            canonicalOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
            canonicalScale: scale
        };
    }, [scene]);

    // Anatomical landmarks mapped onto authentic plant cell organelle positions with staggered offsets
    const landmarks = useMemo(() => [
        { id: "cell_wall", name: "Cell Wall & Membrane", pos: [0, 1.25, 0], labelOffset: [0, 0.14, 0], desc: "Rigid outer cellulose matrix providing turgor pressure resistance" },
        { id: "nucleus", name: "Nucleus & Chromatin", pos: [-0.45, 0.25, 0.35], labelOffset: [-0.12, 0.10, 0], desc: "Houses DNA chromosomes and directs transcription and ribosome assembly" },
        { id: "vacuole", name: "Large Central Vacuole", pos: [0.35, -0.15, -0.15], labelOffset: [0.12, -0.08, 0], desc: "Tonoplast-bound organelle maintaining intracellular hydrostatic turgor" },
        { id: "chloroplast", name: "Chloroplasts (Photosynthesis)", pos: [-0.65, -0.45, 0.45], labelOffset: [-0.14, -0.08, 0], desc: "Double-membrane plastids housing chlorophyll pigments for light reactions" },
        { id: "chloroplast_2", name: "Chloroplast (Thylakoids)", pos: [0.65, 0.55, -0.35], labelOffset: [0.14, 0.08, 0], desc: "Stroma and grana thylakoid stacks where ATP & NADPH are synthesized" },
        { id: "mitochondria", name: "Mitochondria (Powerhouse)", pos: [0.45, 0.65, 0.45], labelOffset: [0.12, 0.12, 0], desc: "Site of the Krebs cycle and oxidative phosphorylation producing ATP" },
        { id: "cytoplasm", name: "Cytosol & Endoplasmic Reticulum", pos: [-0.15, -0.65, -0.35], labelOffset: [0, -0.14, 0], desc: "Intracellular fluid and rough/smooth ER synthesis networks" }
    ], []);

    // Configure PBR materials and wireframe
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material = child.material.clone();
                    child.material.wireframe = wireframe;
                }
            }
        });
    }, [clonedScene, wireframe]);

    // Handle activePart raycast highlighting
    useEffect(() => {
        if (!clonedScene) return;

        const activeLower = (activePart || "").toLowerCase();

        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                const name = (child.name || "").toLowerCase();
                const isSelected = activeLower && (
                    activeLower.includes("cell") ||
                    activeLower.includes("chloroplast") ||
                    activeLower.includes("nucleus") ||
                    activeLower.includes("vacuole") ||
                    activeLower.includes("mitochondria") ||
                    name.includes(activeLower)
                );

                if (isSelected) {
                    child.material.emissive = new THREE.Color("#00ffcc");
                    child.material.emissiveIntensity = 0.55;
                } else {
                    child.material.emissive = new THREE.Color("#000000");
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }, [clonedScene, activePart]);

    // Gentle floating rotation (pauses when an organelle is hovered or active/inspected)
    useFrame((state, delta) => {
        if (groupRef.current && !hoveredId && !hoveredPart && !activePart) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    // Handle surface clicking to select nearest organelle
    const handleModelClick = (e) => {
        e.stopPropagation();
        const pt = e.point;
        let closest = landmarks[0];
        let minDist = Infinity;
        landmarks.forEach((lm) => {
            const d = pt.distanceTo(new THREE.Vector3(...lm.pos));
            if (d < minDist) {
                minDist = d;
                closest = lm;
            }
        });
        if (onSelectPart && closest) {
            onSelectPart(closest.name);
        }
    };

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
            {/* Authentic 3D Plant Cell GLB Mesh Centered Deterministically at Origin */}
            <group position={canonicalOffset} scale={canonicalScale}>
                <primitive
                    ref={modelRef}
                    object={clonedScene}
                    onClick={handleModelClick}
                />
            </group>

            {/* Anatomical Landmark Pins: Subtle clickable spheres with compact hover/selection tooltip */}
            {landmarks.map((lm) => {
                const isMatching = (target) => {
                    if (!target) return false;
                    const t = String(target).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
                    const id = lm.id.toLowerCase();
                    const name = lm.name.toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
                    return (
                        t === id ||
                        t === name ||
                        t.includes(id) ||
                        t.includes(name) ||
                        name.includes(t) ||
                        (lm.id === "cell_wall" && (t.includes("wall") || t.includes("membrane"))) ||
                        (lm.id === "nucleus" && t.includes("nucleus")) ||
                        (lm.id === "vacuole" && t.includes("vacuole")) ||
                        (lm.id.includes("chloroplast") && t.includes("chloroplast")) ||
                        (lm.id === "mitochondria" && t.includes("mitochondri")) ||
                        (lm.id === "cytoplasm" && (t.includes("cytoplasm") || t.includes("cytosol")))
                    );
                };
                const isSelected = isMatching(activePart);
                const isHovered = hoveredId === lm.id || Boolean(hoveredPart && isMatching(hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.6;
                const landmarkPos = [
                    lm.pos[0] * (1 + offsetFactor),
                    lm.pos[1] * (1 + offsetFactor),
                    lm.pos[2] * (1 + offsetFactor)
                ];

                return (
                    <group key={lm.id} position={landmarkPos}>
                        {/* Interactive 3D Marker Pin */}
                        <mesh
                            userData={{ isPin: true }}
                            name={`pin_${lm.id}`}
                            scale={isSelected ? 1.25 : (isHovered ? 1.15 : 1)}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPart && onSelectPart(lm.name);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHoveredId(lm.id);
                                onHoverPart && onHoverPart(lm.name);
                            }}
                            onPointerOut={() => {
                                setHoveredId(null);
                                onHoverPart && onHoverPart(null);
                            }}
                        >
                            <sphereGeometry args={[0.038, 16, 16]} />
                            <meshStandardMaterial
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : "#10b981")}
                                emissive={isSelected ? "#00ffcc" : (isHovered ? "#0284c7" : "#059669")}
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
                                    {lm.name}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}

// Preload plant cell GLB asset with Draco
useGLTF.preload("/models/plant_cell.glb", "/draco/");
