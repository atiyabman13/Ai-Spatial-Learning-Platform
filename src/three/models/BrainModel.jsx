import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic Anatomical 3D Human Brain Component
 * 
 * Model Attribution:
 * "Human Brain Atlas (Gross Anatomy & Subsystems)" derived from Z-Anatomy contributors
 * and BodyParts3D / DBCLS (The Database Center for Life Science).
 * Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
 * https://creativecommons.org/licenses/by-sa/4.0/
 */
export default function BrainModel({
    explode = 0,
    wireframe = false,
    activePart = null,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const groupRef = useRef();
    const modelRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Load genuine anatomical human brain GLB asset with local Draco decompression
    const { scene } = useGLTF("/models/brain.glb", "/draco/");

    // Clone and normalize brain scene to canonical dimensions centered at origin [0,0,0]
    // The vagus and accessory nerves extend far down inferiorly; exclude them from center calculation
    // so the cerebrum, cerebellum, and brainstem are centered exactly at origin.
    const { clonedScene, canonicalOffset, canonicalScale } = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3();

        cloned.traverse((child) => {
            if (child.isMesh) {
                const name = (child.name || "").toLowerCase();
                if (!name.includes("vagus") && !name.includes("accessory")) {
                    box.expandByObject(child);
                }
            }
        });

        if (box.isEmpty()) box.setFromObject(cloned);

        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const targetSize = 2.2;
        const scale = targetSize / maxDim;

        return {
            clonedScene: cloned,
            canonicalOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
            canonicalScale: scale
        };
    }, [scene]);

    // Anatomical landmarks mapped onto the realistic 3D brain surface with staggered label offsets
    // In this asset, +X is Anatomical Left and -X is Anatomical Right
    const landmarks = useMemo(() => [
        {
            id: "frontal-left",
            name: "Frontal Lobe (Left)",
            region: "Frontal",
            color: "#8b5cf6",
            pos: [0.38, 0.45, 0.46],
            labelOffset: [0.10, 0.12, 0],
            desc: "Executive function, motor control, decision making & speech"
        },
        {
            id: "frontal-right",
            name: "Frontal Lobe (Right)",
            region: "Frontal",
            color: "#a855f7",
            pos: [-0.38, 0.45, 0.46],
            labelOffset: [-0.10, 0.12, 0],
            desc: "Creativity, spatial reasoning & emotional regulation"
        },
        {
            id: "parietal-left",
            name: "Parietal Lobe (Left)",
            region: "Parietal",
            color: "#06b6d4",
            pos: [0.42, 0.60, -0.18],
            labelOffset: [0.10, 0.14, 0],
            desc: "Somatosensory cortex, tactile sensing & language processing"
        },
        {
            id: "parietal-right",
            name: "Parietal Lobe (Right)",
            region: "Parietal",
            color: "#0891b2",
            pos: [-0.42, 0.60, -0.18],
            labelOffset: [-0.10, 0.14, 0],
            desc: "Spatial awareness, proprioception & sensory integration"
        },
        {
            id: "temporal-left",
            name: "Temporal Lobe (Left)",
            region: "Temporal",
            color: "#3b82f6",
            pos: [0.58, 0.08, 0.10],
            labelOffset: [0.14, 0.04, 0],
            desc: "Auditory processing, memory formation & Wernicke's area"
        },
        {
            id: "temporal-right",
            name: "Temporal Lobe (Right)",
            region: "Temporal",
            color: "#2563eb",
            pos: [-0.58, 0.08, 0.10],
            labelOffset: [-0.14, 0.04, 0],
            desc: "Visual memory, facial recognition & auditory perception"
        },
        {
            id: "occipital",
            name: "Occipital Lobe",
            region: "Occipital",
            color: "#ec4899",
            pos: [0, 0.22, -0.75],
            labelOffset: [0, 0.12, -0.06],
            desc: "Primary visual cortex (V1), retinotopic processing & visual input"
        },
        {
            id: "cerebellum",
            name: "Cerebellum",
            region: "Cerebellum",
            color: "#10b981",
            pos: [0, -0.25, -0.55],
            labelOffset: [0, -0.12, -0.04],
            desc: "Motor coordination, balance, procedural memory & fine movement"
        },
        {
            id: "brainstem",
            name: "Brainstem & Pons",
            region: "Brainstem",
            color: "#f59e0b",
            pos: [0, -0.55, -0.05],
            labelOffset: [0, -0.14, 0.04],
            desc: "Autonomic respiration, heart rate regulation & cranial nerve routing"
        }
    ], []);

    // Check if an anatomical structure matches activePart or hoveredPart
    const isStructureMatching = (target, partId, structureName = "") => {
        if (!target) return false;
        const targetLower = String(target).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const idLower = String(partId).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const nameLower = String(structureName).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();

        if (targetLower === idLower || targetLower.includes(idLower) || idLower.includes(targetLower)) return true;
        if (nameLower && (targetLower.includes(nameLower) || nameLower.includes(targetLower))) return true;

        if (idLower.includes("frontal") && targetLower.includes("frontal")) return true;
        if (idLower.includes("parietal") && targetLower.includes("parietal")) return true;
        if (idLower.includes("temporal") && targetLower.includes("temporal")) return true;
        if (idLower.includes("occipital") && targetLower.includes("occipital")) return true;
        if (idLower.includes("cerebell") && (targetLower.includes("cerebell") || targetLower.includes("balance"))) return true;
        if ((idLower.includes("brainstem") || idLower.includes("pons") || idLower.includes("medulla")) &&
            (targetLower.includes("brainstem") || targetLower.includes("pons") || targetLower.includes("medulla"))) return true;

        return false;
    };

    // Configure PBR materials, natural cortex textures, shadows, and wireframe
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material = child.material.clone();
                    child.material.wireframe = wireframe;

                    const meshName = (child.name || "").toLowerCase();
                    const extras = child.userData?.extras || child.userData;
                    const label = (extras?.bx_label || meshName).toLowerCase();
                    const cat = (extras?.bx_cat || "").toLowerCase();

                    // Check if mesh belongs to active structure
                    let highlighted = false;
                    for (const lm of landmarks) {
                        if (isStructureMatching(activePart, lm.id, lm.name)) {
                            if (label.includes(lm.region.toLowerCase()) ||
                                meshName.includes(lm.region.toLowerCase()) ||
                                cat.includes(lm.region.toLowerCase()) ||
                                (lm.region === "Brainstem" && (cat === "brainstem" || label.includes("pons") || label.includes("medulla")))) {
                                highlighted = true;
                                break;
                            }
                        }
                    }

                    if (highlighted) {
                        child.material.emissive = new THREE.Color("#00ffcc");
                        child.material.emissiveIntensity = 0.55;
                    } else {
                        // Natural anatomical PBR cortex shading
                        child.material.emissive = new THREE.Color("#000000");
                        child.material.emissiveIntensity = 0;
                        child.material.roughness = 0.42;
                        child.material.metalness = 0.08;
                    }

                    child.material.needsUpdate = true;
                }
            }
        });
    }, [clonedScene, wireframe, activePart, landmarks]);

    // Handle interactive mesh clicking
    const handleMeshClick = (e) => {
        e.stopPropagation();
        const mesh = e.object;
        const meshName = mesh.name || "";
        const extras = mesh.userData?.extras || mesh.userData;
        const label = extras?.bx_label || meshName || "Brain Structure";

        // Find matching landmark
        const matched = landmarks.find(lm =>
            label.toLowerCase().includes(lm.region.toLowerCase()) ||
            meshName.toLowerCase().includes(lm.region.toLowerCase())
        );

        if (onSelectPart) {
            onSelectPart(matched ? matched.name : label);
        }
    };

    // Dynamic anatomical explode separation along hemispheres and axis
    useFrame(() => {
        if (!clonedScene || !modelRef.current) return;

        if (explode > 0) {
            clonedScene.traverse((child) => {
                if (child.isMesh) {
                    const name = (child.name || "").toLowerCase();
                    const side = (child.userData?.extras?.bx_side || "").toLowerCase();
                    const cat = (child.userData?.extras?.bx_cat || "").toLowerCase();

                    // In this asset, +X is Left hemisphere
                    if (side === "left" || name.endsWith(".l") || name.includes(".l.") || name.includes("left")) {
                        child.position.x = explode * 0.025;
                    }
                    // -X is Right hemisphere
                    else if (side === "right" || name.endsWith(".r") || name.includes(".r.") || name.includes("right")) {
                        child.position.x = -explode * 0.025;
                    }
                    // Cerebellum separates downward-backward
                    else if (cat === "cerebellum" || name.includes("cerebell")) {
                        child.position.z = -explode * 0.035;
                        child.position.y = -explode * 0.015;
                    }
                    // Brainstem descends
                    else if (cat === "brainstem" || name.includes("stem") || name.includes("pons") || name.includes("medulla")) {
                        child.position.y = -explode * 0.03;
                    }
                }
            });
        } else {
            // Reset local offsets when explode is 0
            clonedScene.traverse((child) => {
                if (child.isMesh && (child.position.x !== 0 || child.position.y !== 0 || child.position.z !== 0)) {
                    child.position.set(0, 0, 0);
                }
            });
        }
    });

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
            {/* Realistic 3D Brain Mesh Centered Deterministically at Origin */}
            <group
                ref={modelRef}
                position={canonicalOffset}
                scale={canonicalScale}
            >
                <primitive
                    object={clonedScene}
                    onClick={handleMeshClick}
                />
            </group>

            {/* Anatomical Landmark 3D Pins: Subtle clickable spheres with compact hover/selection tooltip */}
            {landmarks.map((part) => {
                const isSelected = isStructureMatching(activePart, part.id, part.name);
                const isHovered = hoveredId === part.id || Boolean(hoveredPart && isStructureMatching(hoveredPart, part.id, part.name));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 1.5;
                const explodedPos = [
                    part.pos[0] * (1 + offsetFactor),
                    part.pos[1] * (1 + offsetFactor * 0.6),
                    part.pos[2] * (1 + offsetFactor)
                ];

                return (
                    <group key={part.id}>
                        {/* Connecting visual ray line when exploded */}
                        {explode > 0.08 && (
                            <Line
                                points={[part.pos, explodedPos]}
                                color={isSelected ? "#00ffcc" : part.color}
                                lineWidth={1.5}
                                transparent
                                opacity={0.6}
                                dashed
                                dashScale={10}
                                dashSize={0.1}
                                gapSize={0.05}
                            />
                        )}

                        {/* Interactive 3D Marker Pin */}
                        <group position={explodedPos}>
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
                                    roughness={0.2}
                                    metalness={0.8}
                                />
                            </mesh>

                            {/* Outer pulsing ring for selected structure */}
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
        </group>
    );
}

// Prefetch 3D brain model and local Draco decoder for instant loading
useGLTF.preload("/models/brain.glb", "/draco/");
