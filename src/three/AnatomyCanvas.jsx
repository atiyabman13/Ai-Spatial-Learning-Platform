import React, { useState, useRef, useEffect, Suspense, Component, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import toast from "react-hot-toast";

// Import all 3D Anatomical & Scientific Mesh Models
import HeartModel from "./models/HeartModel";
import PlantCellModel from "./models/PlantCellModel";
import DCMotorModel from "./models/DCMotorModel";
import SolarSystemModel from "./models/SolarSystemModel";
import AtomModel from "./models/AtomModel";
import BrainModel from "./models/BrainModel";
import SkeletonModel from "./models/SkeletonModel";
import EyeModel from "./models/EyeModel";
import DNAModel from "./models/DNAModel";
import RespiratoryModel from "./models/RespiratoryModel";
import DigestiveModel from "./models/DigestiveModel";
import MitosisModel from "./models/MitosisModel";
import ModelAutoFramer from "./components/ModelAutoFramer";

import {
    FaRedoAlt,
    FaCompressArrowsAlt,
    FaEye,
    FaVrCardboard,
    FaCut,
    FaExpandAlt,
    FaLightbulb,
    FaTag,
    FaExpand,
    FaCompress,
    FaCube
} from "react-icons/fa";

/**
 * Modern 3D Canvas Loader fallback
 */
function CanvasModelLoader() {
    return (
        <Html center distanceFactor={10}>
            <div style={{
                color: "#00ffcc",
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "0.85rem",
                fontWeight: "600",
                background: "rgba(15, 23, 42, 0.92)",
                padding: "10px 20px",
                borderRadius: "20px",
                border: "1px solid rgba(0, 255, 204, 0.4)",
                boxShadow: "0 4px 25px rgba(0, 255, 204, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                whiteSpace: "nowrap"
            }}>
                <div style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "2px solid #00ffcc",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite"
                }} />
                Loading 3D Spatial Geometry...
            </div>
        </Html>
    );
}

/**
 * Robust in-canvas Error Boundary for 3D model asset loading
 */
class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.warn("CanvasErrorBoundary caught 3D model error:", error);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

/**
 * Fallback 3D Model when asset is missing, unsupported, or has loading errors
 */
function Fallback3DModel({ modelName = "Anatomy Model", isError = false, onRetry }) {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
        }
    });

    return (
        <group ref={meshRef} position={[0, 0, 0]}>
            <mesh>
                <octahedronGeometry args={[1.4, 2]} />
                <meshStandardMaterial
                    color={isError ? "#f43f5e" : "#06b6d4"}
                    wireframe={true}
                    emissive={isError ? "#f43f5e" : "#06b6d4"}
                    emissiveIntensity={0.4}
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.9, 24, 24]} />
                <meshStandardMaterial
                    color={isError ? "#f43f5e" : "#10b981"}
                    transparent
                    opacity={0.35}
                    roughness={0.2}
                />
            </mesh>
            <Html center distanceFactor={8}>
                <div style={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: `1px solid ${isError ? "rgba(244, 63, 94, 0.5)" : "rgba(6, 182, 212, 0.4)"}`,
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "700",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaCube style={{ color: isError ? "#f43f5e" : "#06b6d4" }} />
                        {isError ? `3D Asset Notice: ${modelName}` : `${modelName} Stage Visualizer`}
                    </div>
                    {isError && (
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "normal" }}>
                            3D asset loading error or fallback mode
                        </div>
                    )}
                    {onRetry && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRetry();
                            }}
                            style={{
                                marginTop: "4px",
                                background: "rgba(16, 185, 129, 0.2)",
                                border: "1px solid #10b981",
                                color: "#10b981",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                fontSize: "11px",
                                cursor: "pointer",
                                fontWeight: "700"
                            }}
                        >
                            🔄 Retry Loading Model
                        </button>
                    )}
                </div>
            </Html>
        </group>
    );
}

/**
 * Camera Lerp Controller for smooth automated AI Teacher cue transitions
 */
function CameraLerpController({ cameraPos, cameraTarget, isActionCueActive, controlsRef }) {
    useFrame((state) => {
        if (!isActionCueActive) return;
        if (cameraPos && cameraPos.length === 3) {
            state.camera.position.lerp(new THREE.Vector3(...cameraPos), 0.08);
        }
        if (cameraTarget && cameraTarget.length === 3) {
            const targetVec = new THREE.Vector3(...cameraTarget);
            state.camera.lookAt(targetVec);
            if (controlsRef && controlsRef.current) {
                controlsRef.current.target.lerp(targetVec, 0.08);
                controlsRef.current.update();
            }
        }
    });
    return null;
}

/**
 * Canonical 3D Model Anatomical Landmark Catalog for Display Name Resolution
 */
const MODEL_STRUCTURE_CATALOG = {
    Heart: [
        { id: "aorta", name: "Aorta & Aortic Arch" },
        { id: "pulmonary", name: "Pulmonary Artery & Trunk" },
        { id: "venacava", name: "Superior Vena Cava" },
        { id: "atrium_l", name: "Left Atrium" },
        { id: "atrium_r", name: "Right Atrium" },
        { id: "ventricle_l", name: "Left Ventricle" },
        { id: "ventricle_r", name: "Right Ventricle" },
        { id: "valves", name: "Atrioventricular (AV) Valves" }
    ],
    PlantCell: [
        { id: "cell_wall", name: "Cell Wall & Membrane" },
        { id: "wall", name: "Cell Wall & Membrane" },
        { id: "membrane", name: "Cell Wall & Membrane" },
        { id: "nucleus", name: "Nucleus & Chromatin" },
        { id: "vacuole", name: "Large Central Vacuole" },
        { id: "chloroplast", name: "Chloroplasts (Photosynthesis)" },
        { id: "chloroplast_2", name: "Chloroplast (Thylakoids)" },
        { id: "mitochondria", name: "Mitochondria (Powerhouse)" },
        { id: "cytoplasm", name: "Cytosol & Endoplasmic Reticulum" }
    ],
    Eye: [
        { id: "cornea", name: "Cornea & Anterior Chamber" },
        { id: "iris", name: "Iris & Pupil" },
        { id: "lens", name: "Crystalline Lens" },
        { id: "sclera", name: "Sclera (Outer Coat)" },
        { id: "retina", name: "Retina & Macula" },
        { id: "optic-nerve", name: "Optic Nerve (CN II)" }
    ],
    Respiratory: [
        { id: "trachea", name: "Trachea (Windpipe)" },
        { id: "bronchus", name: "Bronchial Bifurcation (Carina)" },
        { id: "bronchi", name: "Bronchial Bifurcation (Carina)" },
        { id: "lung_r", name: "Right Lung (Pulmo Dexter)" },
        { id: "lung-r", name: "Right Lung (Pulmo Dexter)" },
        { id: "lung_l", name: "Left Lung (Pulmo Sinister)" },
        { id: "lung-l", name: "Left Lung (Pulmo Sinister)" },
        { id: "base", name: "Base of Lung (Basis Pulmonis)" },
        { id: "diaphragm", name: "Base of Lung (Basis Pulmonis)" },
        { id: "larynx", name: "Trachea (Windpipe)" }
    ],
    Digestive: [
        { id: "esophagus", name: "Esophagus & Cardia" },
        { id: "stomach", name: "Stomach (Gastric Reservoir)" },
        { id: "liver", name: "Liver (Hepar - Gland)" },
        { id: "duodenum", name: "Duodenum (C-Loop of Small Intestine)" },
        { id: "small_intestine", name: "Small Intestine (Ileum)" },
        { id: "colon", name: "Large Intestine (Colon)" },
        { id: "small-intestine", name: "Small Intestine (Ileum)" },
        { id: "large-intestine", name: "Large Intestine (Colon)" },
        { id: "gallbladder", name: "Gallbladder" },
        { id: "pancreas", name: "Duodenum (C-Loop of Small Intestine)" }
    ],
    DNA: [
        { id: "backbone-5", name: "Sugar-Phosphate Backbone (5' to 3')" },
        { id: "backbone", name: "Sugar-Phosphate Backbone (5' to 3')" },
        { id: "major-groove", name: "Major Groove" },
        { id: "at-pair", name: "Adenine = Thymine Base Pair" },
        { id: "gc-pair", name: "Guanine ≡ Cytosine Base Pair" },
        { id: "minor-groove", name: "Minor Groove" },
        { id: "h-bonds", name: "Hydrogen Bonding Central Axis" },
        { id: "adenine", name: "Adenine = Thymine Base Pair" },
        { id: "thymine", name: "Adenine = Thymine Base Pair" },
        { id: "guanine", name: "Guanine ≡ Cytosine Base Pair" },
        { id: "cytosine", name: "Guanine ≡ Cytosine Base Pair" },
        { id: "basepair", name: "Adenine = Thymine Base Pair" }
    ],
    SolarSystem: [
        { id: "sun", name: "Sun (Solar Fusion Core)" },
        { id: "mercury", name: "Mercury" },
        { id: "venus", name: "Venus (Runaway Greenhouse)" },
        { id: "earth", name: "Earth & Biosphere" },
        { id: "mars", name: "Mars (Red Planet)" },
        { id: "jupiter", name: "Jupiter (Gas Giant & Red Spot)" },
        { id: "saturn", name: "Saturn & Planetary Rings" },
        { id: "uranus", name: "Uranus" },
        { id: "neptune", name: "Neptune" }
    ],
    Skeleton: [
        { id: "skull", name: "Skull" },
        { id: "cervical-spine", name: "Cervical Spine" },
        { id: "right-clavicle", name: "Right Clavicle" },
        { id: "left-clavicle", name: "Left Clavicle" },
        { id: "ribcage", name: "Ribcage" },
        { id: "sternum-ribcage", name: "Ribcage" },
        { id: "lumbar-spine", name: "Lumbar Spine" },
        { id: "pelvis", name: "Pelvis" },
        { id: "right-humerus", name: "Right Humerus" },
        { id: "left-humerus", name: "Left Humerus" },
        { id: "right-forearm", name: "Right Forearm" },
        { id: "left-forearm", name: "Left Forearm" },
        { id: "thoracic-spine", name: "Thoracic Spine" },
        { id: "right-femur", name: "Right Femur" },
        { id: "left-femur", name: "Left Femur" },
        { id: "right-patella", name: "Right Patella" },
        { id: "left-patella", name: "Left Patella" },
        { id: "right-tibia", name: "Right Tibia & Fibula" },
        { id: "right-tibia-fibula", name: "Right Tibia & Fibula" },
        { id: "left-tibia", name: "Left Tibia & Fibula" },
        { id: "left-tibia-fibula", name: "Left Tibia & Fibula" }
    ],
    Brain: [
        { id: "frontal-left", name: "Frontal Lobe (Left)" },
        { id: "frontal-right", name: "Frontal Lobe (Right)" },
        { id: "frontal", name: "Frontal Lobe (Left)" },
        { id: "parietal-left", name: "Parietal Lobe (Left)" },
        { id: "parietal-right", name: "Parietal Lobe (Right)" },
        { id: "parietal", name: "Parietal Lobe (Left)" },
        { id: "temporal-left", name: "Temporal Lobe (Left)" },
        { id: "temporal-right", name: "Temporal Lobe (Right)" },
        { id: "temporal", name: "Temporal Lobe (Left)" },
        { id: "occipital", name: "Occipital Lobe" },
        { id: "cerebellum", name: "Cerebellum" },
        { id: "brainstem", name: "Brainstem & Pons" }
    ],
    Mitosis: [
        { id: "membrane", name: "Cell Membrane & Cleavage Furrow" },
        { id: "centrosomes", name: "Centrosomes & Asters (Poles)" },
        { id: "spindles", name: "Mitotic Spindle Microtubules" },
        { id: "chromatids", name: "Sister Chromatids (Separating)" },
        { id: "cytokinesis", name: "Cell Membrane & Cleavage Furrow" },
        { id: "interphase", name: "Cell Membrane & Cleavage Furrow" },
        { id: "prophase", name: "Mitotic Spindle Microtubules" },
        { id: "metaphase", name: "Mitotic Spindle Microtubules" },
        { id: "anaphase", name: "Sister Chromatids (Separating)" },
        { id: "telophase", name: "Cell Membrane & Cleavage Furrow" }
    ],
    DCMotor: [
        { id: "stator_n", name: "Stator Permanent Magnet (North Pole)" },
        { id: "stator_s", name: "Stator Permanent Magnet (South Pole)" },
        { id: "stator", name: "Stator Permanent Magnet (North Pole)" },
        { id: "armature", name: "Armature Coil & Copper Windings" },
        { id: "rotor", name: "Armature Coil & Copper Windings" },
        { id: "commutator", name: "Split-Ring Commutator" },
        { id: "brushes", name: "Carbon Brushes & Terminals" },
        { id: "shaft", name: "Central Drive Shaft & Bearings" },
        { id: "field_lines", name: "Magnetic B-Field Flux" }
    ],
    Atom: [
        { id: "nucleus", name: "Nucleus (6 Protons + 6 Neutrons)" },
        { id: "k_shell", name: "Inner K-Shell (n=1, 2 Electrons)" },
        { id: "k-shell", name: "Inner K-Shell (n=1, 2 Electrons)" },
        { id: "l_shell", name: "Middle L-Shell (n=2, 4 Electrons)" },
        { id: "l-shell", name: "Middle L-Shell (n=2, 4 Electrons)" },
        { id: "m_shell", name: "Outer Valency M-Shell (n=3 Level)" },
        { id: "m-shell", name: "Outer Valency M-Shell (n=3 Level)" }
    ]
};

function normalizeLandmarkString(str) {
    if (!str) return "";
    return String(str)
        .trim()
        .toLowerCase()
        .replace(/[\u2010-\u2015\u2212]/g, "-") // normalize any dash/minus to standard ASCII hyphen
        .replace(/\s+/g, " ");
}

function resolveDisplayName(modelName, partIdOrName) {
    if (!partIdOrName || partIdOrName === "null" || partIdOrName === "undefined") return null;
    const raw = String(partIdOrName).trim();
    if (!raw || raw === "null" || raw === "undefined") return null;
    const list = MODEL_STRUCTURE_CATALOG[modelName] || [];
    const low = normalizeLandmarkString(raw);

    // Exact match on normalized ID or normalized name
    const exact = list.find(item => {
        const itemId = normalizeLandmarkString(item.id);
        const itemName = normalizeLandmarkString(item.name);
        return itemId === low || itemName === low;
    });
    if (exact) return exact.name;

    // Substring match
    const found = list.find(item => {
        const itemId = normalizeLandmarkString(item.id);
        const itemName = normalizeLandmarkString(item.name);
        return (
            low.includes(itemId) ||
            itemName.includes(low)
        );
    });
    return found ? found.name : raw;
}

export default function AnatomyCanvas({
    activeModel = "Heart",
    onModelChange,
    selectedPart = null,
    onSelectPart,
    partDetail = null,
    actionCue = null,
    showToolbar = true,
    showModelSelector = true,
    isBroadcasting = false,
    onBroadcastControl,
    isStudentView = false,
    remoteState = null
}) {
    const [model, setModel] = useState(activeModel);
    const [explode, setExplode] = useState(0);
    const [slice, setSlice] = useState(false);
    const [pulsing, setPulsing] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [activePartState, setActivePartState] = useState(
        selectedPart && selectedPart !== "null" && selectedPart !== "undefined"
            ? (resolveDisplayName(activeModel, selectedPart) || selectedPart)
            : null
    );
    const [hoveredPartState, setHoveredPartState] = useState(null);
    const [autoRotate, setAutoRotate] = useState(true);
    const [arMode, setArMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    const canExplode = model !== "Heart";
    const canSlice = ["Heart", "Eye", "Respiratory", "Digestive", "Mitosis"].includes(model);

    // Camera target override state from action cues
    const [cameraPos, setCameraPos] = useState([0, 0, 4.5]);
    const [cameraTarget, setCameraTarget] = useState([0, 0, 0]);

    // Model-specific fitted camera view cache
    const fittedViewsRef = useRef({});

    const wrapperRef = useRef();
    const controlsRef = useRef();
    const hoverClearTimeoutRef = useRef(null);
    const lastAppliedRemoteCamRef = useRef({ pos: null, target: null });
    const hoveredPartRef = useRef(hoveredPartState);

    useEffect(() => {
        hoveredPartRef.current = hoveredPartState;
    }, [hoveredPartState]);

    // Synchronized auto-rotation pause state: pauses during valid anatomical part hover or active inspection
    const isHoverActive = Boolean(
        hoveredPartState &&
        hoveredPartState !== "null" &&
        hoveredPartState !== "undefined" &&
        String(hoveredPartState).trim() !== ""
    );
    const isActiveSelected = Boolean(
        activePartState &&
        activePartState !== "null" &&
        activePartState !== "undefined" &&
        String(activePartState).trim() !== ""
    );
    const isPartInspected = isHoverActive || isActiveSelected;
    const effectiveAutoRotate = autoRotate && !isPartInspected;

    // Direct synchronization of OrbitControls auto-rotation & inertia damping reset
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotate = effectiveAutoRotate;
            if (isPartInspected && controlsRef.current.sphericalDelta) {
                // Instantly zero out spherical delta so rotation stops immediately without inertia drift or camera jumps
                controlsRef.current.sphericalDelta.set(0, 0, 0);
            }
        }
    }, [effectiveAutoRotate, isPartInspected]);

    // Component unmount cleanup for hover timer
    useEffect(() => {
        return () => {
            if (hoverClearTimeoutRef.current) {
                clearTimeout(hoverClearTimeoutRef.current);
                hoverClearTimeoutRef.current = null;
            }
        };
    }, []);

    // Callback when ModelAutoFramer determines the model's fitted default camera and target
    const handleModelFramed = useCallback(({ modelKey, cameraPosition, cameraTarget: cTarget, distance }) => {
        fittedViewsRef.current[modelKey] = {
            cameraPosition: [...cameraPosition],
            cameraTarget: [...cTarget],
            distance
        };
        // If this is the active model and no action cue is overriding, keep cameraPos in sync
        if (modelKey === model && (!actionCue || !actionCue.action || actionCue.action.isReset)) {
            setCameraPos([...cameraPosition]);
            setCameraTarget([...cTarget]);
        }
    }, [model, actionCue]);

    // Sync active model prop changes only when the incoming prop actually changes
    const prevActiveModelRef = useRef(activeModel);
    useEffect(() => {
        if (activeModel && activeModel !== prevActiveModelRef.current) {
            prevActiveModelRef.current = activeModel;
            setModel(activeModel);
            setActivePartState(null);
            setHoveredPartState(null);
            setExplode(0);
            setSlice(false);
            const savedFit = fittedViewsRef.current[activeModel];
            if (savedFit) {
                setCameraPos(savedFit.cameraPosition);
                setCameraTarget(savedFit.cameraTarget);
            }
        }
    }, [activeModel]);

    // Sync selected part prop changes
    useEffect(() => {
        if (selectedPart !== undefined) {
            if (!selectedPart || selectedPart === "null" || selectedPart === "undefined") {
                setActivePartState(null);
            } else {
                const pName = typeof selectedPart === "object" && selectedPart !== null
                    ? (selectedPart.name || selectedPart.id)
                    : selectedPart;
                if (!pName || pName === "null" || pName === "undefined") {
                    setActivePartState(null);
                } else {
                    setActivePartState(resolveDisplayName(model, pName) || pName);
                }
            }
        }
    }, [selectedPart, model]);

    // React to synchronized AI Teacher Action Cues
    useEffect(() => {
        if (!actionCue || !actionCue.action) return;

        const { targetMesh, cameraPosition, cameraTarget: cTarget, zoom, explode: cueExplode, slice: cueSlice, isReset } = actionCue.action;

        if (targetMesh) {
            setActivePartState(targetMesh);
        }

        // If the cue is a reset command, use the model's fitted view rather than hardcoded coordinates
        if (isReset) {
            const savedFit = fittedViewsRef.current[model];
            if (savedFit) {
                setCameraPos(savedFit.cameraPosition);
                setCameraTarget(savedFit.cameraTarget);
            } else {
                setCameraPos([0, 0, 4.5]);
                setCameraTarget([0, 0, 0]);
            }
            if (controlsRef.current) {
                controlsRef.current.reset();
            }
        } else {
            if (cameraPosition) {
                setCameraPos(cameraPosition);
            }
            if (cTarget) {
                setCameraTarget(cTarget);
            }
        }

        if (cueExplode !== undefined) {
            setExplode(cueExplode);
        }
        if (cueSlice !== undefined) {
            setSlice(cueSlice);
        }
        if (zoom && zoom > 1.3) {
            setAutoRotate(false);
        }
    }, [actionCue, model]);

    // Helper to broadcast complete spatial state to student viewports
    const broadcastControl = useCallback((data = {}) => {
        if (!isBroadcasting || !onBroadcastControl) return;

        let currentCamPos = cameraPos;
        let currentCamTarget = cameraTarget;
        if (controlsRef.current) {
            const cam = controlsRef.current.object;
            const tgt = controlsRef.current.target;
            if (cam) currentCamPos = [cam.position.x, cam.position.y, cam.position.z];
            if (tgt) currentCamTarget = [tgt.x, tgt.y, tgt.z];
        }

        const currentHovered = data.hoveredPart !== undefined ? data.hoveredPart : hoveredPartRef.current;

        onBroadcastControl({
            model,
            wireframe,
            showLabels,
            explode,
            slice,
            activePart: activePartState,
            hoveredPart: currentHovered,
            autoRotate,
            cameraPosition: currentCamPos,
            cameraTarget: currentCamTarget,
            ...data
        });
    }, [isBroadcasting, onBroadcastControl, model, wireframe, showLabels, explode, slice, activePartState, hoveredPartState, autoRotate, cameraPos, cameraTarget]);

    // React to synchronized teacher spatial broadcast in student view
    useEffect(() => {
        if (!isStudentView || !remoteState) return;

        // Model change synchronization with clean reset of incompatible state
        if (remoteState.model && remoteState.model !== model) {
            setModel(remoteState.model);
            const sanitizedActive = (remoteState.activePart && remoteState.activePart !== "null" && remoteState.activePart !== "undefined")
                ? (resolveDisplayName(remoteState.model, remoteState.activePart) || remoteState.activePart)
                : null;
            setActivePartState(sanitizedActive);

            const sanitizedHovered = (remoteState.hoveredPart && remoteState.hoveredPart !== "null" && remoteState.hoveredPart !== "undefined")
                ? (resolveDisplayName(remoteState.model, remoteState.hoveredPart) || remoteState.hoveredPart)
                : null;
            setHoveredPartState(sanitizedHovered);

            setExplode(remoteState.explode !== undefined ? remoteState.explode : 0);
            setSlice(remoteState.slice !== undefined ? remoteState.slice : false);
            if (remoteState.wireframe !== undefined) setWireframe(Boolean(remoteState.wireframe));
            if (remoteState.showLabels !== undefined) setShowLabels(Boolean(remoteState.showLabels));

            const savedFit = fittedViewsRef.current[remoteState.model];
            if (savedFit) {
                setCameraPos([...savedFit.cameraPosition]);
                setCameraTarget([...savedFit.cameraTarget]);
                if (controlsRef.current) {
                    if (controlsRef.current.object) {
                        controlsRef.current.object.position.set(...savedFit.cameraPosition);
                    }
                    controlsRef.current.target.set(...savedFit.cameraTarget);
                    controlsRef.current.update();
                }
            }
            return;
        }

        if (remoteState.activePart !== undefined) {
            if (!remoteState.activePart || remoteState.activePart === "null" || remoteState.activePart === "undefined") {
                setActivePartState(null);
            } else {
                setActivePartState(resolveDisplayName(model, remoteState.activePart) || remoteState.activePart);
            }
        }

        if (remoteState.hoveredPart !== undefined) {
            const nextHovered = (!remoteState.hoveredPart || remoteState.hoveredPart === "null" || remoteState.hoveredPart === "undefined")
                ? null
                : (resolveDisplayName(model, remoteState.hoveredPart) || remoteState.hoveredPart);
            setHoveredPartState((prev) => (prev !== nextHovered ? nextHovered : prev));
        }

        if (remoteState.explode !== undefined) {
            setExplode(remoteState.explode);
        }

        if (remoteState.slice !== undefined) {
            setSlice(remoteState.slice);
        }

        if (remoteState.wireframe !== undefined) {
            setWireframe(Boolean(remoteState.wireframe));
        }

        if (remoteState.showLabels !== undefined) {
            setShowLabels(Boolean(remoteState.showLabels));
        }

        if (remoteState.autoRotate !== undefined) {
            setAutoRotate(Boolean(remoteState.autoRotate));
        }

        if (remoteState.cameraPosition && Array.isArray(remoteState.cameraPosition)) {
            const lastPos = lastAppliedRemoteCamRef.current.pos;
            const newPos = remoteState.cameraPosition;
            const posChanged = !lastPos || Math.hypot(newPos[0] - lastPos[0], newPos[1] - lastPos[1], newPos[2] - lastPos[2]) > 0.08;
            if (posChanged) {
                lastAppliedRemoteCamRef.current.pos = [...newPos];
                setCameraPos([...newPos]);
                if (controlsRef.current && controlsRef.current.object) {
                    controlsRef.current.object.position.set(...newPos);
                    controlsRef.current.update();
                }
            }
        }

        if (remoteState.cameraTarget && Array.isArray(remoteState.cameraTarget)) {
            const lastTarget = lastAppliedRemoteCamRef.current.target;
            const newTarget = remoteState.cameraTarget;
            const targetChanged = !lastTarget || Math.hypot(newTarget[0] - lastTarget[0], newTarget[1] - lastTarget[1], newTarget[2] - lastTarget[2]) > 0.08;
            if (targetChanged) {
                lastAppliedRemoteCamRef.current.target = [...newTarget];
                setCameraTarget([...newTarget]);
                if (controlsRef.current) {
                    controlsRef.current.target.set(...newTarget);
                    controlsRef.current.update();
                }
            }
        }
    }, [remoteState, isStudentView, model]);

    const handleModelSelect = (newModel) => {
        if (hoverClearTimeoutRef.current) {
            clearTimeout(hoverClearTimeoutRef.current);
            hoverClearTimeoutRef.current = null;
        }
        setModel(newModel);
        setActivePartState(null);
        setHoveredPartState(null);
        setExplode(0);
        setSlice(false);
        const savedFit = fittedViewsRef.current[newModel];
        let newCamPos = [0, 0, 4.5];
        let newCamTarget = [0, 0, 0];
        if (savedFit) {
            newCamPos = [...savedFit.cameraPosition];
            newCamTarget = [...savedFit.cameraTarget];
            setCameraPos(newCamPos);
            setCameraTarget(newCamTarget);
            if (controlsRef.current) {
                if (controlsRef.current.object) {
                    controlsRef.current.object.position.set(...newCamPos);
                }
                controlsRef.current.target.set(...newCamTarget);
                controlsRef.current.update();
            }
        }
        if (onModelChange) onModelChange(newModel);

        broadcastControl({
            model: newModel,
            activePart: null,
            hoveredPart: null,
            explode: 0,
            slice: false,
            wireframe,
            showLabels,
            autoRotate,
            cameraPosition: newCamPos,
            cameraTarget: newCamTarget
        });
    };

    const handlePartClick = (part) => {
        if (!part) {
            setActivePartState(null);
            if (onSelectPart) onSelectPart(null);
            broadcastControl({ activePart: null });
            return;
        }
        const rawName = typeof part === "object" && part !== null ? (part.name || part.id) : String(part);
        if (!rawName || rawName === "null" || rawName === "undefined" || rawName.trim() === "") {
            setActivePartState(null);
            if (onSelectPart) onSelectPart(null);
            broadcastControl({ activePart: null });
            return;
        }
        const resolvedName = resolveDisplayName(model, rawName) || rawName;
        setActivePartState(resolvedName);
        if (onSelectPart) onSelectPart(resolvedName);

        broadcastControl({
            activePart: resolvedName
        });
    };

    const handlePartHover = useCallback((part) => {
        if (hoverClearTimeoutRef.current) {
            clearTimeout(hoverClearTimeoutRef.current);
            hoverClearTimeoutRef.current = null;
        }

        if (!part) {
            // Debounce clearing hover state so moving directly between adjacent parts doesn't flicker/resume rotation
            hoverClearTimeoutRef.current = setTimeout(() => {
                hoveredPartRef.current = null;
                setHoveredPartState(null);
                broadcastControl({ hoveredPart: null });
                hoverClearTimeoutRef.current = null;
            }, 300);
            return;
        }

        const rawName = typeof part === "object" && part !== null ? (part.name || part.id) : String(part);
        if (!rawName || rawName === "null" || rawName === "undefined" || rawName.trim() === "") {
            hoverClearTimeoutRef.current = setTimeout(() => {
                hoveredPartRef.current = null;
                setHoveredPartState(null);
                broadcastControl({ hoveredPart: null });
                hoverClearTimeoutRef.current = null;
            }, 300);
            return;
        }

        const resolvedName = resolveDisplayName(model, rawName) || rawName;
        // Immediately set hover state and pause rotation without delay
        hoveredPartRef.current = resolvedName;
        setHoveredPartState(resolvedName);
        broadcastControl({ hoveredPart: resolvedName });
    }, [broadcastControl, model]);

    const toggleArMode = () => {
        if (!arMode) {
            setArMode(true);
            toast.success("👓 WebXR / Spatial AR Mode active! Wear VR headset or scan QR.", { icon: "🥽", duration: 3500 });
        } else {
            setArMode(false);
            toast("Exited AR Mode", { icon: "🖥️" });
        }
    };

    const toggleFullscreen = () => {
        if (!wrapperRef.current) return;
        if (!document.fullscreenElement) {
            wrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
        }
    };

    const resetView = () => {
        if (hoverClearTimeoutRef.current) {
            clearTimeout(hoverClearTimeoutRef.current);
            hoverClearTimeoutRef.current = null;
        }
        setExplode(0);
        setSlice(false);
        setWireframe(false);
        setShowLabels(false);
        setAutoRotate(true);
        setActivePartState(null);
        setHoveredPartState(null);

        const savedFit = fittedViewsRef.current[model];
        let resetCamPos = [0, 0, 4.5];
        let resetCamTarget = [0, 0, 0];

        if (savedFit) {
            resetCamPos = [...savedFit.cameraPosition];
            resetCamTarget = [...savedFit.cameraTarget];
            setCameraPos(resetCamPos);
            setCameraTarget(resetCamTarget);
            if (controlsRef.current) {
                if (controlsRef.current.object) {
                    controlsRef.current.object.position.set(...resetCamPos);
                }
                controlsRef.current.target.set(...resetCamTarget);
                controlsRef.current.update();
                if (typeof controlsRef.current.saveState === "function") {
                    controlsRef.current.saveState();
                }
            }
        } else {
            setCameraPos(resetCamPos);
            setCameraTarget(resetCamTarget);
            if (controlsRef.current) {
                if (controlsRef.current.object) {
                    controlsRef.current.object.position.set(0, 0, 4.5);
                }
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
            }
        }
        toast.success("3D stage camera and perspective reset", { icon: "🔄" });

        broadcastControl({
            explode: 0,
            slice: false,
            wireframe: false,
            showLabels: false,
            activePart: null,
            hoveredPart: null,
            cameraPosition: resetCamPos,
            cameraTarget: resetCamTarget
        });
    };

    return (
        <div
            ref={wrapperRef}
            className="canvas-wrapper"
            onPointerLeave={() => {
                if (!isStudentView && hoveredPartState) {
                    handlePartHover(null);
                }
            }}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                minHeight: "520px",
                borderRadius: isFullscreen ? "0" : "20px",
                overflow: "hidden"
            }}
        >
            {/* Top Toolbar Controls */}
            {showToolbar && (
                <div className="canvas-toolbar" style={{ flexWrap: "wrap", gap: "10px", zIndex: 10 }}>
                    {/* 3D Model Quick Selector if enabled */}
                    {showModelSelector && (
                        <div className="toolbar-group model-selector-group">
                            {[
                                { id: "Heart", label: "🫀 Heart" },
                                { id: "PlantCell", label: "🌿 Cell" },
                                { id: "Respiratory", label: "🫁 Lungs" },
                                { id: "Digestive", label: "🥗 Digestive" },
                                { id: "Brain", label: "🧠 Brain" },
                                { id: "Eye", label: "👁️ Eye" },
                                { id: "Skeleton", label: "🦴 Skeleton" },
                                { id: "DNA", label: "🧬 DNA" },
                                { id: "Mitosis", label: "➗ Mitosis" },
                                { id: "DCMotor", label: "⚡ Motor" },
                                { id: "SolarSystem", label: "🪐 Solar" },
                                { id: "Atom", label: "⚛️ Atom" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    className={`tool-btn ${model === item.id ? "active" : ""}`}
                                    onClick={() => handleModelSelect(item.id)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 3D Visual Effects Toolbar */}
                    <div className="toolbar-group visual-effects-group">
                        <button
                            className={`tool-btn ${autoRotate ? "active" : ""}`}
                            onClick={() => {
                                const next = !autoRotate;
                                setAutoRotate(next);
                                broadcastControl({ autoRotate: next });
                            }}
                            title="360° Auto Orbit Rotation"
                        >
                            <FaRedoAlt className={autoRotate ? "spin-slow" : ""} /> 360° Orbit
                        </button>

                        {canExplode && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "0.8rem" }}>
                                <FaCompressArrowsAlt /> Explode:
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={explode}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setExplode(val);
                                        broadcastControl({ explode: val });
                                    }}
                                    style={{ width: "70px" }}
                                />
                            </div>
                        )}

                        {canSlice && (
                            <button
                                className={`tool-btn ${slice ? "active" : ""}`}
                                onClick={() => {
                                    const newSlice = !slice;
                                    setSlice(newSlice);
                                    broadcastControl({ slice: newSlice });
                                }}
                                title="Cross-Section Cutaway Slice View"
                            >
                                <FaCut /> Cross-Section
                            </button>
                        )}

                        <button
                            className={`tool-btn ${showLabels ? "active" : ""}`}
                            onClick={() => {
                                const newShowLabels = !showLabels;
                                setShowLabels(newShowLabels);
                                broadcastControl({ showLabels: newShowLabels });
                            }}
                            title="Show / Hide 3D Anatomical Labels"
                        >
                            <FaTag /> {showLabels ? "Labels On" : "Labels Off"}
                        </button>

                        <button
                            className={`tool-btn ${wireframe ? "active" : ""}`}
                            onClick={() => {
                                const newWireframe = !wireframe;
                                setWireframe(newWireframe);
                                broadcastControl({ wireframe: newWireframe });
                            }}
                            title="Toggle Holographic Wireframe"
                        >
                            <FaEye /> Wireframe
                        </button>

                        <button
                            className="tool-btn"
                            onClick={resetView}
                            title="Reset 3D Stage Camera & Explosion"
                        >
                            <FaExpandAlt /> Reset
                        </button>

                        <button
                            className="tool-btn"
                            onClick={toggleFullscreen}
                            title="Toggle Fullscreen 3D View"
                        >
                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>

                        <button
                            className={`tool-btn ${arMode ? "active" : ""}`}
                            onClick={toggleArMode}
                            title="Toggle WebXR AR Spatial Mode"
                        >
                            <FaVrCardboard /> {arMode ? "AR Active" : "Spatial AR"}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Three.js R3F Canvas */}
            <Canvas
                shadows
                camera={{ position: cameraPos, fov: 45 }}
                gl={{ localClippingEnabled: true }}
                onPointerMissed={() => {
                    if (!isStudentView && hoveredPartState) {
                        handlePartHover(null);
                    }
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle at center, #1e293b 0%, #090d16 100%)"
                }}
            >
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00ffcc" />
                <pointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />

                <CameraLerpController
                    cameraPos={cameraPos}
                    cameraTarget={cameraTarget}
                    controlsRef={controlsRef}
                    isActionCueActive={Boolean(
                        actionCue && actionCue.action && (actionCue.action.cameraPosition || actionCue.action.cameraTarget)
                    )}
                />

                {/* Render Selected 3D Model Component with Automatic Viewport Framing */}
                <Suspense fallback={<CanvasModelLoader />}>
                    <CanvasErrorBoundary
                        key={`${model}-${retryKey}`}
                        fallback={
                            <Fallback3DModel
                                modelName={model}
                                isError={true}
                                onRetry={() => setRetryKey(k => k + 1)}
                            />
                        }
                    >
                        <ModelAutoFramer
                            modelKey={model}
                            controlsRef={controlsRef}
                            actionCueActive={Boolean(actionCue && actionCue.action && (actionCue.action.cameraPosition || actionCue.action.cameraTarget))}
                            padding={model === "SolarSystem" ? 1.08 : 1.12}
                            onModelFramed={handleModelFramed}
                        >
                            <group position={[0, 0, 0]}>
                                {model === "Heart" && (
                                    <HeartModel
                                        explode={explode}
                                        slice={slice}
                                        pulsing={pulsing}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "PlantCell" && (
                                    <PlantCellModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Respiratory" && (
                                    <RespiratoryModel
                                        explode={explode}
                                        slice={slice}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Digestive" && (
                                    <DigestiveModel
                                        explode={explode}
                                        slice={slice}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Mitosis" && (
                                    <MitosisModel
                                        explode={explode}
                                        slice={slice}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "DNA" && (
                                    <DNAModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Brain" && (
                                    <BrainModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Skeleton" && (
                                    <SkeletonModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Eye" && (
                                    <EyeModel
                                        explode={explode}
                                        slice={slice}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "DCMotor" && (
                                    <DCMotorModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "SolarSystem" && (
                                    <SolarSystemModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}
                                {model === "Atom" && (
                                    <AtomModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={activePartState}
                                        onSelectPart={handlePartClick}
                                        hoveredPart={hoveredPartState}
                                        onHoverPart={isStudentView ? undefined : handlePartHover}
                                        showLabels={showLabels}
                                    />
                                )}

                                {/* Graceful fallback if unknown or unconfigured 3D model */}
                                {![
                                    "Heart", "PlantCell", "Respiratory", "Digestive", "Mitosis",
                                    "DNA", "Brain", "Skeleton", "Eye", "DCMotor", "SolarSystem", "Atom"
                                ].includes(model) && (
                                        <Fallback3DModel modelName={model} />
                                    )}
                            </group>
                        </ModelAutoFramer>
                    </CanvasErrorBoundary>
                </Suspense>

                <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2} far={4} />

                <OrbitControls
                    ref={controlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={effectiveAutoRotate}
                    autoRotateSpeed={1.5}
                    onEnd={() => {
                        if (isBroadcasting && controlsRef.current) {
                            const cam = controlsRef.current.object;
                            const tgt = controlsRef.current.target;
                            if (cam && tgt) {
                                broadcastControl({
                                    cameraPosition: [cam.position.x, cam.position.y, cam.position.z],
                                    cameraTarget: [tgt.x, tgt.y, tgt.z]
                                });
                            }
                        }
                    }}
                />
            </Canvas>

            {/* Top-Center Synchronized 2D Inspection Badge (Authoritative Canonical Label for Both Portals) */}
            {isHoverActive && (
                <div
                    className="synchronized-inspection-badge animate-fade-in"
                    style={{
                        position: "absolute",
                        top: showToolbar ? "72px" : "18px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        pointerEvents: "none",
                        zIndex: 25,
                        background: "rgba(10, 15, 30, 0.88)",
                        border: "1px solid rgba(0, 255, 204, 0.65)",
                        boxShadow: "0 4px 20px rgba(0, 255, 204, 0.25), 0 0 12px rgba(0, 0, 0, 0.7)",
                        backdropFilter: "blur(14px)",
                        borderRadius: "30px",
                        padding: "8px 22px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "#ffffff",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        whiteSpace: "nowrap"
                    }}
                >
                    <span style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#00ffcc",
                        boxShadow: "0 0 8px #00ffcc"
                    }} />
                    <span style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#94a3b8",
                        fontWeight: "700"
                    }}>
                        Inspecting:
                    </span>
                    <span style={{
                        fontSize: "0.92rem",
                        fontWeight: "700",
                        color: "#00ffcc",
                        letterSpacing: "0.02em"
                    }}>
                        {resolveDisplayName(model, hoveredPartState) || hoveredPartState}
                    </span>
                </div>
            )}

            {/* Active Part Info Overlay Badge */}
            {activePartState && activePartState !== "null" && activePartState !== "undefined" && String(activePartState).trim() !== "" && (
                <div
                    className="info-overlay animate-fade-in"
                    style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        pointerEvents: "auto",
                        background: "rgba(10, 15, 30, 0.92)",
                        border: "1px solid rgba(0, 255, 204, 0.35)",
                        borderRadius: "14px",
                        padding: "10px 16px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(14px)",
                        maxWidth: "320px",
                        zIndex: 5
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, fontSize: "0.95rem", color: "#00ffcc" }}>
                            <FaLightbulb /> {resolveDisplayName(model, activePartState) || activePartState}
                        </h4>
                        <button
                            onClick={() => {
                                setActivePartState(null);
                                if (onSelectPart) onSelectPart(null);
                                broadcastControl({ activePart: null });
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#94a3b8",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                padding: "2px"
                            }}
                            title="Dismiss highlight"
                        >
                            ✕
                        </button>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "4px", marginBottom: 0, lineHeight: "1.4" }}>
                        {typeof partDetail === "object" && partDetail !== null
                            ? (partDetail.description || partDetail.role || partDetail.definition || "Selected 3D Anatomical Structure. Camera framing & highlight shader active.")
                            : (typeof partDetail === "string" && partDetail ? partDetail : "Selected 3D Anatomical Structure. Camera framing & highlight shader active.")}
                    </p>
                </div>
            )}
        </div>
    );
}
