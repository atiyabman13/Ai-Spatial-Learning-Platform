import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * High-Fidelity 3D B-DNA Double Helix Component
 * 
 * Model Attribution:
 * Derived from open educational molecular biology structural assets with Draco compression.
 */
export default function DNAModel({
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

    // Load authentic 3D DNA double helix GLB asset with local Draco decompression
    const { scene } = useGLTF("/models/dna.glb", "/draco/");

    // Clone and compute normalization transform to canonical space centered at [0,0,0]
    const { clonedScene, canonicalOffset, canonicalScale } = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 2.8 / maxDim;

        return {
            clonedScene: cloned,
            canonicalOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
            canonicalScale: scale
        };
    }, [scene]);

    // Continuous graceful vertical helical rotation (pauses when a part is hovered or active/inspected)
    useFrame((state, delta) => {
        if (groupRef.current && !hoveredId && !hoveredPart && !activePart) {
            groupRef.current.rotation.y += delta * 0.45;
        }
    });

    // Anatomical/molecular landmark annotations with staggered badge offsets
    const landmarks = useMemo(() => [
        { id: "backbone-5", name: "Sugar-Phosphate Backbone (5' to 3')", pos: [0.75, 1.15, 0.25], labelOffset: [0.10, 0.12, 0], desc: "Deoxyribose and phosphate phosphodiester covalently linked chain" },
        { id: "major-groove", name: "Major Groove", pos: [0.1, 0.55, 0.85], labelOffset: [0.10, 0.08, 0.06], desc: "Wider spiral indentation exposing sequence-specific base pairs to regulatory proteins" },
        { id: "at-pair", name: "Adenine = Thymine Base Pair", pos: [-0.35, 0.15, 0.35], labelOffset: [-0.10, 0.08, 0], desc: "Purine-pyrimidine complementary pair held by 2 hydrogen bonds" },
        { id: "gc-pair", name: "Guanine ≡ Cytosine Base Pair", pos: [0.35, -0.35, -0.25], labelOffset: [0.10, -0.08, 0], desc: "Purine-pyrimidine complementary pair held by 3 hydrogen bonds" },
        { id: "minor-groove", name: "Minor Groove", pos: [-0.65, -0.75, 0.15], labelOffset: [-0.10, -0.08, 0], desc: "Narrow spiral groove where backbones are closer together" },
        { id: "h-bonds", name: "Hydrogen Bonding Central Axis", pos: [0, -1.15, 0], labelOffset: [0, -0.14, 0], desc: "Non-covalent stabilizing forces maintaining antiparallel helical stability" }
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

    // Handle activePart highlighting
    useEffect(() => {
        if (!clonedScene) return;

        const activeLower = (activePart || "").toLowerCase();

        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                let isSelected = false;
                if (activeLower) {
                    const name = (child.name || "").toLowerCase();
                    isSelected = name.includes(activeLower) ||
                        (activeLower.includes("backbone") && name.includes("backbone")) ||
                        (activeLower.includes("base") && name.includes("base")) ||
                        (activeLower.includes("dna"));
                }

                if (isSelected) {
                    child.material.emissive = new THREE.Color("#00ffcc");
                    child.material.emissiveIntensity = 0.8;
                } else {
                    child.material.emissive = new THREE.Color("#000000");
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }, [clonedScene, activePart]);

    // Handle surface clicking to select nearest DNA molecular region
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
            {/* Authentic 3D DNA Double Helix Mesh Centered Deterministically at Origin */}
            <group position={canonicalOffset} scale={canonicalScale}>
                <primitive
                    ref={modelRef}
                    object={clonedScene}
                    onClick={handleModelClick}
                />
            </group>

            {/* Molecular Landmark Pins: Subtle clickable spheres with compact hover/selection tooltip */}
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
                        (lm.id === "backbone-5" && (t.includes("backbone") || t.includes("phosphate") || t.includes("sugar"))) ||
                        (lm.id === "at-pair" && (t.includes("adenine") || t.includes("thymine") || t.includes("base pair") || t.includes("basepair"))) ||
                        (lm.id === "gc-pair" && (t.includes("guanine") || t.includes("cytosine"))) ||
                        (lm.id === "major-groove" && t.includes("major")) ||
                        (lm.id === "minor-groove" && t.includes("minor")) ||
                        (lm.id === "h-bonds" && (t.includes("hydrogen") || t.includes("bond")))
                    );
                };
                const isSelected = isMatching(activePart);
                const isHovered = hoveredId === lm.id || Boolean(hoveredPart && isMatching(hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.7;
                const landmarkPos = [
                    lm.pos[0] * (1 + offsetFactor),
                    lm.pos[1],
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
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : "#a855f7")}
                                emissive={isSelected ? "#00ffcc" : (isHovered ? "#0284c7" : "#7c3aed")}
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

// Preload DNA GLB asset with Draco
useGLTF.preload("/models/dna.glb", "/draco/");
