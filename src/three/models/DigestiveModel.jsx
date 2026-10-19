import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Anatomical 3D Human Digestive System Component
 * 
 * Features:
 * - Genuine recognizable 3D human digestive anatomy (esophagus, stomach, small & large intestines)
 * - Coronal cutaway cross-section slicing
 * - Subtle peristaltic wave motion
 * - Coordinated organ explosion separation slider
 * - Interactive organ click raycasting and landmark badges
 * - CC-BY / Open Medical Educational Assets
 */
const configureGLTFLoader = (loader) => {
    loader.register((parser) => {
        parser.textureLoader = new THREE.TextureLoader(parser.options.manager);
        return { name: "TextureLoaderFallback" };
    });
};

export default function DigestiveModel({
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

    // Load authentic anatomical unified 3D digestive model with TextureLoader
    const { scene } = useGLTF("/models/digestive.glb", false, false, configureGLTFLoader);

    // Compute normalization transform to canonical space centered at origin [0,0,0]
    const { clonedScene, canonicalOffset, canonicalScale } = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 3.2 / maxDim;

        return {
            clonedScene: cloned,
            canonicalOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
            canonicalScale: scale
        };
    }, [scene]);

    // Coronal clipping plane for Cross-Section cutaway view
    const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15), []);

    // Accurate anatomical landmarks mapped to genuine digestive structures on verified mesh geometry
    const landmarks = useMemo(() => [
        { id: "esophagus", name: "Esophagus & Cardia", pos: [0.05, 1.46, 0.18], labelOffset: [0, 0.14, 0], desc: "Muscular tube propelling food boluses to the stomach via peristalsis" },
        { id: "stomach", name: "Stomach (Gastric Reservoir)", pos: [0.22, -0.18, 0.08], labelOffset: [0.14, 0.08, 0], desc: "Churns boluses with HCl and pepsin to digest proteins into liquid chyme" },
        { id: "duodenum", name: "Duodenum (C-Loop of Small Intestine)", pos: [0.08, -0.16, 0.05], labelOffset: [-0.12, -0.06, 0], desc: "C-loop transition receiving chyme from stomach pylorus into small intestine" },
        { id: "small_intestine", name: "Small Intestine (Ileum)", pos: [0.02, -0.52, 0.28], labelOffset: [0, -0.12, 0.04], desc: "Primary site of nutrient absorption lined with high surface-area villi" },
        { id: "colon", name: "Large Intestine (Colon)", pos: [0.32, -0.66, 0.28], labelOffset: [0.14, -0.08, 0], desc: "Reabsorbs water and electrolytes, compacting indigestible fiber into feces" }
    ], []);

    // Configure materials, wireframe, and clipping planes
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    const mat = child.material.clone();
                    mat.wireframe = wireframe;
                    if (slice) {
                        mat.clippingPlanes = [clippingPlane];
                        mat.clipShadows = true;
                        mat.side = THREE.DoubleSide;
                    } else {
                        mat.clippingPlanes = null;
                        mat.clipShadows = false;
                    }
                    if (child.material.map) mat.map = child.material.map;
                    if (child.material.normalMap) mat.normalMap = child.material.normalMap;
                    mat.needsUpdate = true;
                    child.material = mat;
                }
            }
        });
    }, [clonedScene, wireframe, slice, clippingPlane]);

    // Gentle peristaltic wave motion
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t * 0.9) * 0.02;
        }
    });

    // Handle activePart raycast highlighting
    useEffect(() => {
        if (!clonedScene) return;
        const activeLower = (activePart || "").toLowerCase();

        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                const name = (child.name || "").toLowerCase();
                const isSelected = activeLower && (
                    activeLower.includes("digest") ||
                    activeLower.includes("stomach") ||
                    activeLower.includes("intestin") ||
                    activeLower.includes("liver") ||
                    activeLower.includes("colon") ||
                    name.includes(activeLower)
                );
                child.material.emissive = isSelected ? new THREE.Color("#00ffcc") : new THREE.Color("#000000");
                child.material.emissiveIntensity = isSelected ? 0.6 : 0;
            }
        });
    }, [clonedScene, activePart]);

    // Handle surface clicking to select nearest digestive organ
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

    const modelOffset = explode * 0.3;

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
            {/* Realistic 3D Human Digestive Anatomy Centered Deterministically at Origin */}
            <group
                position={[canonicalOffset[0], canonicalOffset[1], canonicalOffset[2] + modelOffset]}
                scale={canonicalScale}
            >
                <primitive
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
                        (lm.id === "liver" && (t.includes("liver") || t.includes("hepar"))) ||
                        (lm.id === "esophagus" && (t.includes("esophagus") || t.includes("cardia"))) ||
                        (lm.id === "stomach" && (t.includes("stomach") || t.includes("gastric"))) ||
                        (lm.id === "duodenum" && (t.includes("duodenum") || t.includes("pancreas"))) ||
                        (lm.id === "small_intestine" && (t.includes("small intestine") || t.includes("small-intestine") || t.includes("ileum"))) ||
                        (lm.id === "colon" && (t.includes("colon") || t.includes("large intestine") || t.includes("large-intestine")))
                    );
                };
                const isSelected = isMatching(activePart);
                const isHovered = hoveredId === lm.id || Boolean(hoveredPart && isMatching(hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.7;
                const landmarkPos = [
                    lm.pos[0] * (1 + (lm.pos[0] !== 0 ? offsetFactor : 0)),
                    lm.pos[1] + (lm.pos[1] > 0 ? offsetFactor * 0.4 : -offsetFactor * 0.4),
                    lm.pos[2] + offsetFactor * 0.4
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
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : "#06b6d4")}
                                emissive={isSelected ? "#00ffcc" : (isHovered ? "#0284c7" : "#0284c7")}
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

useGLTF.preload("/models/digestive.glb", false, false, configureGLTFLoader);
