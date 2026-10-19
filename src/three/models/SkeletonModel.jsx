import { useRef, useMemo, useEffect, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Anatomical 3D Human Skeleton Component
 * 
 * Model Attribution:
 * Derived from Z-Anatomy Open-Source Project & gym-muscle contributors.
 * Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
 * https://creativecommons.org/licenses/by-sa/4.0/
 */

// Helper to map 3D bone mesh names to clean educational names
function getFriendlyBoneName(rawName) {
    if (!rawName) return "Skeletal Bone";
    const low = rawName.toLowerCase();
    if (low.includes("humerus.r")) return "Right Humerus";
    if (low.includes("humerus.l")) return "Left Humerus";
    if (low.includes("radius.r") || low.includes("ulna.r")) return "Right Forearm";
    if (low.includes("radius.l") || low.includes("ulna.l")) return "Left Forearm";
    if (low.includes("femur.r")) return "Right Femur";
    if (low.includes("femur.l")) return "Left Femur";
    if (low.includes("patella.r")) return "Right Patella";
    if (low.includes("patella.l")) return "Left Patella";
    if (low.includes("tibia.r") || low.includes("fibula.r")) return "Right Tibia & Fibula";
    if (low.includes("tibia.l") || low.includes("fibula.l")) return "Left Tibia & Fibula";
    if (low.includes("clavicle.r")) return "Right Clavicle";
    if (low.includes("clavicle.l")) return "Left Clavicle";
    if (low.includes("scapula.r")) return "Right Scapula";
    if (low.includes("scapula.l")) return "Left Scapula";
    if (low.includes("hip bone") || low.includes("pelvis") || low.includes("sacrum") || low.includes("coccyx") || low.includes("ilium") || low.includes("ischium") || low.includes("pubis")) return "Pelvis";
    if (low.includes("sternum") || low.includes("rib") || low.includes("manubrium") || low.includes("xiphoid") || low.includes("thoracic skeleton")) return "Ribcage";
    if (low.includes("cervical") || low.includes("atlas") || low.includes("axis") || (low.includes("vertebra c") && !low.includes("coccyx"))) return "Cervical Spine";
    if (low.includes("lumbar") || low.includes("vertebra l")) return "Lumbar Spine";
    if (low.includes("thoracic") || low.includes("vertebra t")) return "Thoracic Spine";
    if (low.includes("cranium") || low.includes("frontal") || low.includes("parietal") || low.includes("occipital") || low.includes("temporal") || low.includes("sphenoid") || low.includes("ethmoid") || low.includes("mandible") || low.includes("maxilla") || low.includes("zygomatic") || low.includes("nasal")) return "Skull";
    return rawName;
}

export default function SkeletonModel({
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
    const [hoveredLandmark, setHoveredLandmark] = useState(null);

    // Load genuine anatomical human skeleton GLB asset with local Draco decoder
    const { scene } = useGLTF("/models/skeleton.glb", "/draco/");

    // Compute canonical 3.2-unit normalization scale and centering offset
    const { clonedScene, canonicalScale, canonicalOffset } = useMemo(() => {
        const cloned = scene.clone(true);
        cloned.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scale = 3.2 / maxDim;
        const offset = [-center.x * scale, -center.y * scale, -center.z * scale];

        cloned.userData.canonicalScale = scale;
        cloned.userData.canonicalOffset = offset;
        return { clonedScene: cloned, canonicalScale: scale, canonicalOffset: offset };
    }, [scene]);

    // Anatomical landmarks precisely mapped onto verified skeletal bone geometry bounds
    // Anatomical standard orientation: Subject's Right is viewer's left (-X), Subject's Left is viewer's right (+X).
    // Anterior (front) is +Z, Posterior (back) is -Z, Superior (head) is +Y, Inferior (feet) is -Y.
    const landmarks = useMemo(() => [
        {
            id: "skull",
            name: "Skull",
            groupName: "Cranium",
            pos: [0, 1.49, 0.12],
            explodeOffset: [0, 0.40, 0],
            meshMatch: ["cranium", "skull", "frontal", "parietal", "occipital", "sphenoid", "ethmoid", "temporal", "mandible", "maxilla", "zygomatic", "nasal"],
            desc: "Protective neurocranium and facial viscerocranium enclosing the brain"
        },
        {
            id: "cervical-spine",
            name: "Cervical Spine",
            groupName: "Vertebral",
            pos: [0, 1.20, -0.02],
            explodeOffset: [0, 0, 0],
            meshMatch: ["cervical", "atlas", "axis", "vertebra c"],
            desc: "C1–C7 vertebrae supporting the cranium and enabling head rotation"
        },
        {
            id: "right-clavicle",
            name: "Right Clavicle",
            groupName: "upper limb",
            pos: [-0.16, 1.04, 0.055],
            explodeOffset: [-0.35, 0, 0],
            meshMatch: ["clavicle.r"],
            desc: "Right S-shaped strut bone connecting sternum to scapula (pectoral girdle)"
        },
        {
            id: "left-clavicle",
            name: "Left Clavicle",
            groupName: "upper limb",
            pos: [0.16, 1.04, 0.055],
            explodeOffset: [0.35, 0, 0],
            meshMatch: ["clavicle.l"],
            desc: "Left S-shaped strut bone connecting sternum to scapula (pectoral girdle)"
        },
        {
            id: "ribcage",
            name: "Ribcage",
            groupName: "Thoracic",
            pos: [0, 0.88, 0.24],
            explodeOffset: [0, 0, 0.35],
            meshMatch: ["sternum", "rib", "manubrium", "xiphoid", "thoracic skeleton"],
            desc: "12 pairs of ribs and sternum protecting heart and lungs"
        },
        {
            id: "lumbar-spine",
            name: "Lumbar Spine",
            groupName: "Vertebral",
            pos: [0, 0.355, 0.005],
            explodeOffset: [0, 0, 0],
            meshMatch: ["lumbar", "vertebra l"],
            desc: "Heavy-duty weight-bearing L1–L5 vertebrae supporting trunk load"
        },
        {
            id: "pelvis",
            name: "Pelvis",
            groupName: "lower limb",
            pos: [0, 0.05, 0.07],
            explodeOffset: [0, -0.25, 0],
            meshMatch: ["hip bone", "ilium", "ischium", "pubis", "sacrum", "coccyx", "pelvis"],
            desc: "Bony basin connecting vertebral column to lower extremities"
        },
        {
            id: "right-humerus",
            name: "Right Humerus",
            groupName: "upper limb",
            pos: [-0.37, 0.73, -0.035],
            explodeOffset: [-0.35, 0, 0],
            meshMatch: ["humerus.r", "humerus_r"],
            desc: "Right upper extremity brachium articulating at glenohumeral joint"
        },
        {
            id: "left-humerus",
            name: "Left Humerus",
            groupName: "upper limb",
            pos: [0.37, 0.73, -0.035],
            explodeOffset: [0.35, 0, 0],
            meshMatch: ["humerus.l", "humerus_l"],
            desc: "Left upper extremity brachium articulating at glenohumeral joint"
        },
        {
            id: "right-forearm",
            name: "Right Forearm",
            groupName: "upper limb",
            pos: [-0.46, 0.23, 0.015],
            explodeOffset: [-0.35, 0, 0],
            meshMatch: ["radius.r", "ulna.r"],
            desc: "Right antebrachium bones (Radius and Ulna)"
        },
        {
            id: "left-forearm",
            name: "Left Forearm",
            groupName: "upper limb",
            pos: [0.46, 0.23, 0.015],
            explodeOffset: [0.35, 0, 0],
            meshMatch: ["radius.l", "ulna.l"],
            desc: "Left antebrachium bones (Radius and Ulna)"
        },
        {
            id: "right-femur",
            name: "Right Femur",
            groupName: "lower limb",
            pos: [-0.17, -0.38, 0.002],
            explodeOffset: [-0.15, -0.30, 0],
            meshMatch: ["femur.r", "femur_r"],
            desc: "Right thigh bone: longest, strongest bone supporting body locomotion"
        },
        {
            id: "left-femur",
            name: "Left Femur",
            groupName: "lower limb",
            pos: [0.17, -0.38, 0.002],
            explodeOffset: [0.15, -0.30, 0],
            meshMatch: ["femur.l", "femur_l"],
            desc: "Left thigh bone: longest, strongest bone supporting body locomotion"
        },
        {
            id: "right-patella",
            name: "Right Patella",
            groupName: "lower limb",
            pos: [-0.16, -0.78, 0.002],
            explodeOffset: [-0.15, -0.30, 0],
            meshMatch: ["patella.r"],
            desc: "Right sesamoid kneecap shielding the anterior knee joint"
        },
        {
            id: "left-patella",
            name: "Left Patella",
            groupName: "lower limb",
            pos: [0.16, -0.78, 0.002],
            explodeOffset: [0.15, -0.30, 0],
            meshMatch: ["patella.l"],
            desc: "Left sesamoid kneecap shielding the anterior knee joint"
        },
        {
            id: "right-tibia",
            name: "Right Tibia & Fibula",
            groupName: "lower limb",
            pos: [-0.14, -1.14, -0.024],
            explodeOffset: [-0.15, -0.30, 0],
            meshMatch: ["tibia.r", "fibula.r"],
            desc: "Right weight-bearing shin bone transmitting load to ankle"
        },
        {
            id: "left-tibia",
            name: "Left Tibia & Fibula",
            groupName: "lower limb",
            pos: [0.14, -1.14, -0.024],
            explodeOffset: [0.15, -0.30, 0],
            meshMatch: ["tibia.l", "fibula.l"],
            desc: "Left weight-bearing shin bone transmitting load to ankle"
        }
    ], []);

    // Configure realistic bone PBR materials and wireframe
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                if (child.material) {
                    child.material = child.material.clone();
                    child.material.wireframe = wireframe;
                    child.material.roughness = 0.45;
                    child.material.metalness = 0.08;
                    child.material.color = new THREE.Color("#f1f5f9");
                }
            }
        });
    }, [clonedScene, wireframe]);

    // Handle explosion separation of anatomical groups without corrupting original positions or double-shifting children
    useEffect(() => {
        if (!clonedScene) return;

        const scale = canonicalScale || 0.018865;

        clonedScene.traverse((child) => {
            if (!child.name) return;

            // Cache pristine original position once
            if (!child.userData.originalPos) {
                child.userData.originalPos = child.position.clone();
            }

            const orig = child.userData.originalPos;
            const low = child.name.toLowerCase();

            // Always reset to baseline before applying current explode factor
            child.position.copy(orig);

            if (explode > 0) {
                // Top-level head groups: Cranium, Extracranial bones (Mandible), Nasal cartilages
                if (low === "cranium.g" || low === "extracranial bones of head.g" || low === "nasal cartilages.g") {
                    child.position.y = orig.y + (explode * 0.40) / scale;
                }
                // Top-level thoracic skeleton group: encapsulates ribs and sternum without multi-hop double offsets
                else if (low === "thoracic skeleton.g") {
                    child.position.z = orig.z + (explode * 0.35) / scale;
                }
                // Pelvis coxal hip bones
                else if (low === "hip bone.r" || low === "hip bone.l") {
                    child.position.y = orig.y - (explode * 0.25) / scale;
                }
                // Right upper limb: Clavicle, Scapula, Humerus, Radius, Ulna, and right hand bones
                else if (
                    low.includes("humerus.r") || low.includes("radius.r") || low.includes("ulna.r") ||
                    low.includes("clavicle.r") || low.includes("scapula.r") || low.includes("hand.r") ||
                    (low.endsWith(".r") && (low.includes("metacarpal") || low.includes("capitate") || low.includes("hamate") || low.includes("lunate") || low.includes("pisiform") || low.includes("scaphoid") || low.includes("trapezium") || low.includes("trapezoid") || low.includes("triquetrum")))
                ) {
                    child.position.x = orig.x - (explode * 0.35) / scale;
                }
                // Left upper limb: Clavicle, Scapula, Humerus, Radius, Ulna, and left hand bones
                else if (
                    low.includes("humerus.l") || low.includes("radius.l") || low.includes("ulna.l") ||
                    low.includes("clavicle.l") || low.includes("scapula.l") || low.includes("hand.l") ||
                    (low.endsWith(".l") && (low.includes("metacarpal") || low.includes("capitate") || low.includes("hamate") || low.includes("lunate") || low.includes("pisiform") || low.includes("scaphoid") || low.includes("trapezium") || low.includes("trapezoid") || low.includes("triquetrum")))
                ) {
                    child.position.x = orig.x + (explode * 0.35) / scale;
                }
                // Right lower limb: Femur, Patella, Tibia, Fibula, and right foot bones
                else if (
                    low.includes("femur.r") || low.includes("patella.r") || low.includes("tibia.r") ||
                    low.includes("fibula.r") || low.includes("foot.r") ||
                    (low.endsWith(".r") && (low.includes("metatarsal") || low.includes("talus") || low.includes("calcaneus") || low.includes("navicular") || low.includes("cuboid") || low.includes("cuneiform")))
                ) {
                    child.position.x = orig.x - (explode * 0.15) / scale;
                    child.position.y = orig.y - (explode * 0.30) / scale;
                }
                // Left lower limb: Femur, Patella, Tibia, Fibula, and left foot bones
                else if (
                    low.includes("femur.l") || low.includes("patella.l") || low.includes("tibia.l") ||
                    low.includes("fibula.l") || low.includes("foot.l") ||
                    (low.endsWith(".l") && (low.includes("metatarsal") || low.includes("talus") || low.includes("calcaneus") || low.includes("navicular") || low.includes("cuboid") || low.includes("cuneiform")))
                ) {
                    child.position.x = orig.x + (explode * 0.15) / scale;
                    child.position.y = orig.y - (explode * 0.30) / scale;
                }
            }
        });
    }, [clonedScene, explode, canonicalScale]);

    // Handle activePart highlighting with full anatomical mesh matching
    useEffect(() => {
        if (!clonedScene) return;

        const activeLower = (activePart || "").toLowerCase();

        // Find active landmark if any
        const matchedLm = landmarks.find(lm =>
            activeLower && (
                activeLower === lm.id ||
                activeLower === lm.name.toLowerCase() ||
                activeLower.includes(lm.id) ||
                lm.name.toLowerCase().includes(activeLower) ||
                activeLower.includes(lm.name.toLowerCase()) ||
                (lm.meshMatch && lm.meshMatch.some(m => activeLower === m || activeLower.includes(m)))
            )
        );

        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.wireframe = Boolean(wireframe);

                let match = false;
                if (activeLower) {
                    const meshName = (child.name || "").toLowerCase();
                    const parentName = (child.parent?.name || "").toLowerCase();

                    if (matchedLm && matchedLm.meshMatch) {
                        match = matchedLm.meshMatch.some(m =>
                            meshName.includes(m) || parentName.includes(m)
                        );
                    }

                    if (!match) {
                        match = meshName.includes(activeLower) || parentName.includes(activeLower);
                    }
                }

                if (match) {
                    child.material.emissive = new THREE.Color("#00ffcc");
                    child.material.emissiveIntensity = 0.75;
                    child.material.color = new THREE.Color("#00ffcc");
                } else {
                    child.material.emissive = new THREE.Color("#000000");
                    child.material.emissiveIntensity = 0;
                    child.material.color = new THREE.Color("#f1f5f9");
                }
                child.material.needsUpdate = true;
            }
        });
    }, [clonedScene, activePart, landmarks, wireframe]);

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
            {/* Authentic anatomical human skeleton mesh wrapped in canonical centering group */}
            <group position={canonicalOffset} scale={canonicalScale}>
                <primitive
                    ref={modelRef}
                    object={clonedScene}
                    onClick={(e) => {
                        e.stopPropagation();
                        const rawName = e.object.name || e.object.parent?.name || "Skeletal Bone";
                        const friendly = getFriendlyBoneName(rawName);
                        onSelectPart && onSelectPart(friendly);
                    }}
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
                        (lm.id === "right-tibia" && (t.includes("right-tibia") || t.includes("right tibia") || t.includes("right-tibia-fibula") || t.includes("tibia.r") || t.includes("fibula.r"))) ||
                        (lm.id === "left-tibia" && (t.includes("left-tibia") || t.includes("left tibia") || t.includes("left-tibia-fibula") || t.includes("tibia.l") || t.includes("fibula.l"))) ||
                        (lm.meshMatch && lm.meshMatch.some(m => t === m || t.includes(m) || m.includes(t))) ||
                        (lm.id === "ribcage" && (t.includes("rib") || t.includes("sternum"))) ||
                        (lm.id === "skull" && (t.includes("cranium") || t.includes("skull"))) ||
                        (lm.id === "pelvis" && (t.includes("pelvis") || t.includes("hip")))
                    );
                };
                const isSelected = isMatching(activePart);
                const isHovered = hoveredLandmark === lm.id || Boolean(hoveredPart && isMatching(hoveredPart));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);

                // Position pin & label exactly with group explosion offsets
                const badgePos = [
                    lm.pos[0] + (lm.explodeOffset ? lm.explodeOffset[0] * explode : 0),
                    lm.pos[1] + (lm.explodeOffset ? lm.explodeOffset[1] * explode : 0),
                    lm.pos[2] + (lm.explodeOffset ? lm.explodeOffset[2] * explode : 0)
                ];

                return (
                    <group key={lm.id} position={badgePos}>
                        {/* 3D Pin Anchor Sphere */}
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
                                setHoveredLandmark(lm.id);
                                onHoverPart && onHoverPart(lm.name);
                            }}
                            onPointerOut={() => {
                                setHoveredLandmark(null);
                                onHoverPart && onHoverPart(null);
                            }}
                        >
                            <sphereGeometry args={[0.038, 16, 16]} />
                            <meshStandardMaterial
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : (lm.color || "#0284c7"))}
                                emissive={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : (lm.color || "#0369a1"))}
                                emissiveIntensity={isSelected ? 1.1 : (isHovered ? 0.8 : 0.35)}
                                roughness={0.3}
                                metalness={0.6}
                            />
                        </mesh>

                        {/* Outer pulsing ring for selected bone */}
                        {isSelected && (
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <ringGeometry args={[0.055, 0.075, 32]} />
                                <meshBasicMaterial color="#00ffcc" side={THREE.DoubleSide} transparent opacity={0.85} />
                            </mesh>
                        )}

                        {/* Compact Hover / Selection Tooltip */}
                        {showTooltip && (
                            <Html distanceFactor={8} position={[0, 0.07, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
                                <div
                                    style={{
                                        background: isSelected
                                            ? "rgba(0, 255, 204, 0.95)"
                                            : "rgba(10, 15, 30, 0.92)",
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

// Preload genuine skeleton asset with Draco decoder for instant rendering
useGLTF.preload("/models/skeleton.glb", "/draco/");
