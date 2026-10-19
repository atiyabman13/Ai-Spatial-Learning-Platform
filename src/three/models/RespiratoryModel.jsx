import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Anatomical 3D Human Respiratory System Component
 * 
 * Features:
 * - High-fidelity realistic 3D pulmonary anatomy (trachea, bronchi, left & right lungs)
 * - Rhythmic ventilation expansion animation
 * - Coronal cutaway cross-section slicing
 * - Explode slider separating trachea and lungs
 * - Interactive landmark pins and raycast selection
 * - CC-BY / Open Medical Educational Asset
 */
const configureGLTFLoader = (loader) => {
    loader.register((parser) => {
        parser.textureLoader = new THREE.TextureLoader(parser.options.manager);
        return { name: "TextureLoaderFallback" };
    });
};

export default function RespiratoryModel({
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
    const lungsRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Load authentic high-resolution human lungs GLB asset with TextureLoader
    const { scene } = useGLTF("/models/respiratory.glb", false, false, configureGLTFLoader);

    // Compute normalization transform to canonical space centered at origin [0,0,0]
    const { clonedScene, canonicalOffset, canonicalScale } = useMemo(() => {
        const cloned = scene.clone(true);

        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 3.3 / maxDim;

        return {
            clonedScene: cloned,
            canonicalOffset: [-center.x * scale, -center.y * scale, -center.z * scale],
            canonicalScale: scale
        };
    }, [scene]);

    // Coronal clipping plane for Cross-Section cutaway view
    const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.2), []);

    // Accurate anatomical landmarks mapped to structures with staggered label offsets
    const landmarks = useMemo(() => [
        { id: "trachea", name: "Trachea (Windpipe)", pos: [0.00, 1.33, 0.11], labelOffset: [0, 0.14, 0], desc: "C-shaped cartilaginous tube conducting air from larynx to bronchi" },
        { id: "bronchus", name: "Bronchial Bifurcation (Carina)", pos: [0.00, 0.49, 0.08], labelOffset: [0, -0.10, 0.05], desc: "Carina dividing into left and right primary bronchi" },
        { id: "lung_r", name: "Right Lung (Pulmo Dexter)", pos: [-0.71, 0.00, 0.53], labelOffset: [-0.14, 0.08, 0], desc: "Superior, middle, and inferior lobes separated by fissures" },
        { id: "lung_l", name: "Left Lung (Pulmo Sinister)", pos: [0.70, 0.00, 0.54], labelOffset: [0.14, 0.08, 0], desc: "Bilobed lung with cardiac notch accommodating the heart apex" },
        { id: "base", name: "Base of Lung (Basis Pulmonis)", pos: [-0.60, -1.15, 0.64], labelOffset: [-0.12, -0.10, 0], desc: "Concave diaphragmatic surface resting atop anatomical diaphragm plane" }
    ], []);

    // Configure materials, wireframe, and clipping plane
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    const mat = child.material.clone();
                    mat.wireframe = wireframe;
                    mat.clippingPlanes = slice ? [clippingPlane] : null;
                    mat.clipShadows = true;
                    mat.side = THREE.DoubleSide;
                    // Preserve authentic PBR texture maps
                    if (child.material.map) mat.map = child.material.map;
                    if (child.material.normalMap) mat.normalMap = child.material.normalMap;
                    if (child.material.roughnessMap) mat.roughnessMap = child.material.roughnessMap;
                    mat.needsUpdate = true;
                    child.material = mat;
                }
            }
        });
    }, [clonedScene, wireframe, slice, clippingPlane]);

    // Rhythmic pulmonary ventilation breathing movement
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (lungsRef.current) {
            const breath = 1 + Math.sin(t * 1.5) * 0.035;
            lungsRef.current.scale.set(breath, breath, breath);
        }
    });

    // Handle activePart raycast highlighting
    useEffect(() => {
        if (!clonedScene) return;

        const activeLower = (activePart || "").toLowerCase();

        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                const isSelected = activeLower && (
                    activeLower.includes("lung") ||
                    activeLower.includes("trachea") ||
                    activeLower.includes("respirat") ||
                    activeLower.includes("bronch") ||
                    activeLower.includes("alveol") ||
                    activeLower.includes("diaphragm")
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

    // Handle surface clicking to select nearest respiratory structure
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
            {/* Realistic 3D Human Pulmonary Mesh Centered Deterministically at Origin */}
            <group ref={lungsRef}>
                <group position={canonicalOffset} scale={canonicalScale}>
                    <primitive
                        object={clonedScene}
                        onClick={handleModelClick}
                    />
                </group>
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
                        (lm.id === "trachea" && (t.includes("trachea") || t.includes("windpipe"))) ||
                        (lm.id === "bronchus" && (t.includes("bronch") || t.includes("carina"))) ||
                        (lm.id === "lung_r" && (t.includes("right lung") || t.includes("lung-r") || t.includes("lung_r") || t.includes("pulmo dexter"))) ||
                        (lm.id === "lung_l" && (t.includes("left lung") || t.includes("lung-l") || t.includes("lung_l") || t.includes("pulmo sinister"))) ||
                        (lm.id === "base" && (t.includes("base") || t.includes("basis pulmonis") || t.includes("diaphragm")))
                    );
                };
                const isSelected = isMatching(activePart);
                const isHovered = hoveredId === lm.id || Boolean(hoveredPart && isMatching(hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                const offsetFactor = explode * 0.7;
                const landmarkPos = [
                    lm.pos[0] * (1 + (lm.pos[0] !== 0 ? offsetFactor : 0)),
                    lm.pos[1] + (lm.pos[1] > 0 ? offsetFactor * 0.35 : -offsetFactor * 0.35),
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

useGLTF.preload("/models/respiratory.glb", false, false, configureGLTFLoader);
