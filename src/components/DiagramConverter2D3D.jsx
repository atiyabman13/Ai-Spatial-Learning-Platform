import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import AnatomyCanvas from "../three/AnatomyCanvas";
import GeneratedGLBViewer from "./GeneratedGLBViewer";
import { analyzeDiagramImage } from "../services/geminiService";
import { API_URL, getApiUrl } from "../config/api";

import {
    FaCloudUploadAlt,
    FaMagic,
    FaCube,
    FaImage,
    FaTag,
    FaCheckCircle,
    FaSpinner,
    FaEye,
    FaLayerGroup,
    FaExchangeAlt,
    FaProjectDiagram,
    FaDownload,
    FaLightbulb,
    FaTimes,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheck,
    FaCrosshairs,
    FaBan,
    FaMicrochip,
    FaInfoCircle,
    FaFileAlt
} from "react-icons/fa";

/**
 * SAMPLE CURATED EDUCATIONAL PRESETS (Textbook Reference Only)
 */
const SAMPLE_DIAGRAMS = [
    {
        id: "heart_preset",
        name: "Human Heart Textbook Diagram",
        domain: "Biology (Cardiovascular)",
        url: "/presets/heart_diagram.svg",
        simKey: "heart"
    },
    {
        id: "cell_preset",
        name: "Plant Cell Organelles Diagram",
        domain: "Biology (Cytology)",
        url: "/presets/plant_cell_diagram.svg",
        simKey: "cell"
    },
    {
        id: "lungs_preset",
        name: "Human Respiratory System",
        domain: "Biology (Pulmonology)",
        url: "/presets/respiratory_diagram.svg",
        simKey: "lungs"
    },
    {
        id: "digestive_preset",
        name: "Human Digestive System",
        domain: "Biology (Gastroenterology)",
        url: "/presets/digestive_diagram.svg",
        simKey: "digestive"
    },
    {
        id: "brain_preset",
        name: "Brain Cerebral Lobes Diagram",
        domain: "Biology (Neuroanatomy)",
        url: "/presets/brain_diagram.svg",
        simKey: "brain"
    },
    {
        id: "eye_preset",
        name: "Human Eye Optics Diagram",
        domain: "Biology (Sensory Optics)",
        url: "/presets/eye_diagram.svg",
        simKey: "eye"
    },
    {
        id: "skeleton_preset",
        name: "Spinal Column & Skeletal Diagram",
        domain: "Biology (Skeletal System)",
        url: "/presets/skeleton_diagram.svg",
        simKey: "skeleton"
    },
    {
        id: "dna_preset",
        name: "DNA Double Helix Structure",
        domain: "Biology (Genetics)",
        url: "/presets/dna_diagram.svg",
        simKey: "dna"
    },
    {
        id: "mitosis_preset",
        name: "Mitosis Cell Division Phases",
        domain: "Biology (Cell Division)",
        url: "/presets/mitosis_diagram.svg",
        simKey: "mitosis"
    },
    {
        id: "motor_preset",
        name: "DC Electric Motor Schematic",
        domain: "Physics (Electromagnetism)",
        url: "/presets/dc_motor_diagram.svg",
        simKey: "motor"
    },
    {
        id: "atom_preset",
        name: "Bohr Model Atomic Shells",
        domain: "Chemistry (Atomic Structure)",
        url: "/presets/atom_diagram.svg",
        simKey: "atom"
    },
    {
        id: "solar_preset",
        name: "Solar System Planetary Orbits",
        domain: "Physics (Astronomy)",
        url: "/presets/solar_system_diagram.svg",
        simKey: "solar"
    }
];

export default function DiagramConverter2D3D() {
    // Mode: 'custom_reconstruction' (genuine upload pipeline) or 'curated_presets' (textbook reference)
    const [activeMode, setActiveMode] = useState("custom_reconstruction");

    // Upload & Image State
    const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [imageDimensions, setImageDimensions] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // 3D Reconstruction Pipeline State
    const [conversionProgress, setConversionProgress] = useState(0);
    const [conversionStage, setConversionStage] = useState(null); // 'uploading' | 'analyzing' | 'extracting_labels' | 'generating_geometry' | 'completed' | 'error'
    const [activeJobId, setActiveJobId] = useState(null);
    const [reconstructedModel, setReconstructedModel] = useState(null);
    const [reconstructionError, setReconstructionError] = useState(null);
    const [leftViewMode, setLeftViewMode] = useState("original"); // 'original' | 'mask'

    // Labels & Semantic Annotation State
    const [labelsList, setLabelsList] = useState([]);
    const [activeLabelId, setActiveLabelId] = useState(null);
    const [isPinningMode, setIsPinningMode] = useState(false);
    const [editingLabelId, setEditingLabelId] = useState(null);
    const [newLabelText, setNewLabelText] = useState("");

    // Hardware & Pipeline Information Data
    const [hardwareData, setHardwareData] = useState(null);

    // Presets Mode State (Curated reference shortcut)
    const [activePreset, setActivePreset] = useState(SAMPLE_DIAGRAMS[0]);
    const [presetAnalysis, setPresetAnalysis] = useState(null);
    const [isPresetAnalyzing, setIsPresetAnalyzing] = useState(false);

    const fileInputRef = useRef();

    // Fetch local hardware capabilities on mount
    useEffect(() => {
        fetch(`${API_URL}/api/convert3d/hardware`)
            .then(res => res.json())
            .then(data => setHardwareData(data))
            .catch(() => {});
    }, []);

    /**
     * RESET STATE ON NEW UPLOAD (Requirement 2.A)
     * Completely resets all previous image, detection, label, and model state
     */
    const resetConversionState = useCallback(() => {
        setUploadedImageSrc(null);
        setUploadedFile(null);
        setImageDimensions(null);
        setConversionProgress(0);
        setConversionStage(null);
        setActiveJobId(null);
        setReconstructedModel(null);
        setReconstructionError(null);
        setLeftViewMode("original");
        setLabelsList([]);
        setActiveLabelId(null);
        setIsPinningMode(false);
        setEditingLabelId(null);
    }, []);

    /**
     * HANDLE FILE SELECTION & VALIDATION (Requirement 2.A)
     * Validates MIME type, file size <= 15MB, and image dimensions
     */
    const handleFileSelect = (file) => {
        if (!file) return;

        // Supported file types
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            toast.error("Unsupported format. Please upload a PNG, JPG, JPEG, or WEBP image.");
            return;
        }

        // File size check: 15MB
        const MAX_SIZE = 15 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error("File is too large. Maximum supported image size is 15MB.");
            return;
        }

        // Reset all previous state immediately on new upload
        resetConversionState();
        setActiveMode("custom_reconstruction");

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const img = new Image();
            img.onload = () => {
                if (img.width < 64 || img.height < 64) {
                    toast.error("Image dimensions too small (minimum 64x64 pixels).");
                    return;
                }
                setImageDimensions({ width: img.width, height: img.height });
                setUploadedImageSrc(dataUrl);
                setUploadedFile(file);
                // Trigger real 3D volumetric conversion
                start3DReconstruction(file);
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    /**
     * CANCEL RUNNING RECONSTRUCTION
     */
    const handleCancelReconstruction = async () => {
        if (activeJobId) {
            try {
                await fetch(`${API_URL}/api/convert3d/cancel/${activeJobId}`, { method: "POST" });
                toast("Conversion cancelled by user", { icon: "🛑" });
            } catch (_) {}
        }
        setConversionStage("cancelled");
        setConversionProgress(0);
        setActiveJobId(null);
    };

    /**
     * START 3D RECONSTRUCTION PIPELINE (Requirement 2.B, 2.C)
     */
    const start3DReconstruction = async (file) => {
        setConversionStage("uploading");
        setConversionProgress(15);
        setReconstructionError(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("resolution", "120");
        formData.append("depthScale", "0.55");

        try {
            // Stage 2: Analyzing Subject & Saliency
            setTimeout(() => {
                setConversionStage("analyzing");
                setConversionProgress(35);
            }, 300);

            // Stage 3: Extracting OCR Labels & Contours
            setTimeout(() => {
                setConversionStage("extracting_labels");
                setConversionProgress(55);
            }, 800);

            // Stage 4: Synthesizing 3D Volumetric Mesh
            setTimeout(() => {
                setConversionStage("generating_geometry");
                setConversionProgress(80);
            }, 1400);

            const res = await fetch(`${API_URL}/api/convert3d/reconstruct`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server returned error status ${res.status}`);
            }

            const data = await res.json();
            setActiveJobId(data.jobId);

            // Stage 5: Compiling Watertight GLB
            setConversionStage("compiling_glb");
            setConversionProgress(95);

            setTimeout(() => {
                setReconstructedModel({
                    ...data,
                    fullModelUrl: getApiUrl(data.modelUrl),
                    fullMaskUrl: data.maskUrl ? getApiUrl(data.maskUrl) : null,
                    fullDownloadUrl: getApiUrl(data.downloadUrl)
                });
                setLabelsList(data.detectedLabels || []);
                setConversionStage("completed");
                setConversionProgress(100);
                toast.success("Subject isolated & genuine 3D model generated!", { icon: "✂️" });
            }, 400);

        } catch (err) {
            console.error("Reconstruction error:", err);
            setConversionStage("error");
            setReconstructionError(err.message || "Failed to generate 3D model.");
            toast.error(err.message || "Reconstruction failed. Please retry.");
        }
    };

    /**
     * MANUAL LABEL & MESH ASSIGNMENT INTERFACE (Requirement 4)
     */
    const handleVerifyLabel = (id) => {
        setLabelsList(prev => prev.map(l => l.id === id ? { ...l, status: "verified" } : l));
        toast.success("Label confirmed & verified on 3D geometry", { icon: "✓" });
    };

    const handleDeleteLabel = (id) => {
        setLabelsList(prev => prev.filter(l => l.id !== id));
        if (activeLabelId === id) setActiveLabelId(null);
        toast("Label removed", { icon: "🗑️" });
    };

    const handleStartEdit = (lbl) => {
        setEditingLabelId(lbl.id);
        setNewLabelText(lbl.text);
    };

    const handleSaveEdit = (id) => {
        if (!newLabelText.trim()) return;
        setLabelsList(prev => prev.map(l => l.id === id ? { ...l, text: newLabelText.trim(), status: "manual" } : l));
        setEditingLabelId(null);
        toast.success("Label updated", { icon: "✏️" });
    };

    const handleAddNewLabel = () => {
        const newId = `label_custom_${Date.now()}`;
        const newLbl = {
            id: newId,
            text: "New Component",
            confidence: 100,
            bbox: [50, 50, 150, 150],
            position3D: [0, 0, 0.35],
            status: "manual",
            source: "user_created"
        };
        setLabelsList(prev => [...prev, newLbl]);
        setActiveLabelId(newId);
        setIsPinningMode(true);
        toast("Click on 3D model surface to place new pin!", { icon: "📍" });
    };

    const handleMeshPointSelected = (intersectPoint) => {
        if (!activeLabelId) {
            toast("Select a label first to reposition its pin.", { icon: "ℹ️" });
            return;
        }

        const pointArray = [
            Number(intersectPoint.x.toFixed(3)),
            Number(intersectPoint.y.toFixed(3)),
            Number((intersectPoint.z + 0.08).toFixed(3))
        ];

        setLabelsList(prev => prev.map(l => l.id === activeLabelId ? { ...l, position3D: pointArray, status: "manual" } : l));
        setIsPinningMode(false);
        toast.success(`Pin repositioned on 3D mesh surface!`, { icon: "📌" });
    };

    /**
     * CURATED PRESET SELECTION SHORTCUT
     */
    const handleSelectCuratedPreset = async (preset) => {
        setActiveMode("curated_presets");
        setActivePreset(preset);
        setIsPresetAnalyzing(true);
        try {
            const res = await analyzeDiagramImage(preset.url, preset.simKey);
            setPresetAnalysis(res);
        } catch (_) {}
        finally {
            setIsPresetAnalyzing(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Header & Pipeline Mode Switcher */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h2 style={{ fontSize: "1.75rem", fontFamily: "var(--font-display)", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
                        <FaMagic style={{ color: "var(--accent-cyan)" }} /> 2D Image ➔ Genuine 3D Model Converter
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px" }}>
                        Upload arbitrary 2D photographs, textbook diagrams, or schematics. The offline volumetric engine synthesizes real 3D geometry (.glb) matching your uploaded subject.
                    </p>
                </div>

                {/* 3-Tab Segmented Navigation */}
                <div style={{ display: "flex", background: "rgba(15, 23, 42, 0.8)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "4px", gap: "4px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => { setActiveMode("custom_reconstruction"); }}
                        style={{
                            background: activeMode === "custom_reconstruction" ? "var(--accent-cyan)" : "transparent",
                            color: activeMode === "custom_reconstruction" ? "#0a0d14" : "var(--text-secondary)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "0.82rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease"
                        }}
                    >
                        🧬 Custom 3D Reconstruction
                    </button>
                    <button
                        onClick={() => { setActiveMode("curated_presets"); if (!presetAnalysis) handleSelectCuratedPreset(activePreset); }}
                        style={{
                            background: activeMode === "curated_presets" ? "var(--accent-purple)" : "transparent",
                            color: activeMode === "curated_presets" ? "#ffffff" : "var(--text-secondary)",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "0.82rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease"
                        }}
                    >
                        📚 Curated Educational Presets
                    </button>
                    <button
                        onClick={() => { setActiveMode("hardware_status"); }}
                        style={{
                            background: activeMode === "hardware_status" ? "rgba(6, 182, 212, 0.2)" : "transparent",
                            color: activeMode === "hardware_status" ? "var(--accent-cyan)" : "var(--text-secondary)",
                            border: activeMode === "hardware_status" ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                            borderRadius: "8px",
                            padding: "8px 14px",
                            fontSize: "0.82rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <FaMicrochip /> Hardware & Offline Status
                    </button>
                </div>
            </div>

            {/* PRIMARY MODE: CUSTOM ARBITRARY 2D IMAGE RECONSTRUCTION */}
            {activeMode === "custom_reconstruction" && (
                <>
                    {/* Upload Card */}
                    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                                <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <FaCloudUploadAlt style={{ color: "var(--accent-cyan)" }} /> Step 1: Upload Any 2D Image
                                </h3>
                                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                                    Supports PNG, JPG, JPEG, WEBP (Max 15MB). Generates custom 3D mesh geometry (.glb) derived from the uploaded image.
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                style={{ display: "none" }}
                            />

                            {conversionStage && conversionStage !== "completed" && conversionStage !== "error" && (
                                <button
                                    onClick={handleCancelReconstruction}
                                    style={{
                                        background: "rgba(239, 68, 68, 0.2)",
                                        border: "1px solid #ef4444",
                                        color: "#ef4444",
                                        borderRadius: "10px",
                                        padding: "8px 14px",
                                        fontSize: "0.82rem",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    <FaBan /> Cancel Conversion
                                </button>
                            )}
                        </div>

                        {/* Interactive Drop Area */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleFileSelect(e.dataTransfer.files[0]);
                                }
                            }}
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            style={{
                                border: isDragging ? "2px dashed var(--accent-cyan)" : "2px dashed rgba(255, 255, 255, 0.15)",
                                background: isDragging ? "rgba(6, 182, 212, 0.1)" : "rgba(15, 23, 42, 0.5)",
                                borderRadius: "12px",
                                padding: "26px 20px",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <FaCloudUploadAlt style={{ fontSize: "2.4rem", color: "var(--accent-cyan)", opacity: 0.9 }} />
                            <div>
                                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#ffffff" }}>
                                    {uploadedFile ? uploadedFile.name : "Drag & drop your 2D image here, or browse files"}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                                    Supported formats: PNG, JPG, JPEG, WEBP (Max 15MB, minimum 64×64 px)
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-primary"
                                style={{ borderRadius: "8px", padding: "6px 16px", fontSize: "0.82rem", pointerEvents: "none" }}
                            >
                                <FaCloudUploadAlt /> Choose 2D Image File
                            </button>
                        </div>

                        {/* Progress Tracker Bar */}
                        {conversionStage && conversionStage !== "completed" && (
                            <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "14px 18px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "0.82rem" }}>
                                    <span style={{ color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700" }}>
                                        <FaSpinner className="spin" />
                                        {conversionStage === "uploading" && "Uploading & Validating 2D Image..."}
                                        {conversionStage === "analyzing" && "Analyzing Subject Structure & Foreground Saliency..."}
                                        {conversionStage === "extracting_labels" && "Running Offline OCR & Detecting Component Contours..."}
                                        {conversionStage === "generating_geometry" && "Synthesizing 3D Volumetric Mesh & Depth Profile..."}
                                        {conversionStage === "compiling_glb" && "Compiling glTF 2.0 Watertight Binary (.glb)..."}
                                    </span>
                                    <span style={{ color: "var(--text-muted)" }}>{conversionProgress}%</span>
                                </div>
                                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                                    <div
                                        style={{
                                            width: `${conversionProgress}%`,
                                            height: "100%",
                                            background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))",
                                            transition: "width 0.3s ease"
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {conversionStage === "error" && (
                            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: "12px", padding: "12px 16px", color: "#f87171", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>❌ {reconstructionError}</span>
                                <button
                                    onClick={() => uploadedFile && start3DReconstruction(uploadedFile)}
                                    style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", cursor: "pointer" }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Scientific Reconstruction Accuracy & Single-Image Limitation Notice */}
                    <div style={{
                        background: "rgba(15, 23, 42, 0.75)",
                        border: "1px solid rgba(56, 189, 248, 0.25)",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)"
                    }}>
                        <span style={{ fontSize: "1.2rem" }}>🔬</span>
                        <div>
                            <strong style={{ color: "#38bdf8" }}>Single-View Reconstruction Limitation Notice:</strong> A single 2D view cannot capture occluded rear geometry or true internal cavities. The offline engine synthesizes a continuous volumetric depth-hull and posterior closure derived mathematically from foreground saliency. For scientific diagrams, verify or adjust component mappings using the correspondence console below.
                        </div>
                    </div>

                    {/* DUAL CANVAS WORKSPACE */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        {/* LEFT PANEL: EXACT UPLOADED 2D IMAGE WITH OCR HOTSPOTS */}
                        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "clamp(520px, 68vh, 720px)", position: "relative" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <h4 style={{ fontSize: "1rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaImage /> {leftViewMode === "mask" ? "Isolated Subject Silhouette" : "Original Uploaded 2D Image"}
                                    </h4>
                                    {reconstructedModel?.fullMaskUrl && (
                                        <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2px" }}>
                                            <button
                                                onClick={() => setLeftViewMode("original")}
                                                style={{
                                                    background: leftViewMode === "original" ? "var(--accent-cyan)" : "transparent",
                                                    color: leftViewMode === "original" ? "#000" : "var(--text-secondary)",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "2px 8px",
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Original
                                            </button>
                                            <button
                                                onClick={() => setLeftViewMode("mask")}
                                                style={{
                                                    background: leftViewMode === "mask" ? "var(--accent-cyan)" : "transparent",
                                                    color: leftViewMode === "mask" ? "#000" : "var(--text-secondary)",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "2px 8px",
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Subject Mask
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    {reconstructedModel?.segmentation && (
                                        <span style={{ fontSize: "0.72rem", color: "#10b981", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "6px" }}>
                                            ✂️ {100 - (reconstructedModel.segmentation.foregroundCoveragePct || 100)}% Background Removed
                                        </span>
                                    )}
                                    {reconstructedModel?.classification && (
                                        <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "6px" }}>
                                            {reconstructedModel.classification.subjectType}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ flex: 1, position: "relative", borderRadius: "12px", overflow: "hidden", background: "#090d16", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {uploadedImageSrc ? (
                                    <>
                                        <img
                                            src={leftViewMode === "mask" && reconstructedModel?.fullMaskUrl ? reconstructedModel.fullMaskUrl : uploadedImageSrc}
                                            alt="Uploaded 2D Source"
                                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        />

                                        {/* 2D Interactive Bounding Callouts */}
                                        {imageDimensions && labelsList.map((lbl) => {
                                            const isSelected = activeLabelId === lbl.id;
                                            const bbox = lbl.bbox || [20, 20, 80, 80];
                                            const left = (bbox[0] / imageDimensions.width) * 100;
                                            const top = (bbox[1] / imageDimensions.height) * 100;
                                            const width = ((bbox[2] - bbox[0]) / imageDimensions.width) * 100;
                                            const height = ((bbox[3] - bbox[1]) / imageDimensions.height) * 100;

                                            return (
                                                <div
                                                    key={lbl.id}
                                                    onClick={() => setActiveLabelId(lbl.id)}
                                                    style={{
                                                        position: "absolute",
                                                        left: `${Math.max(2, Math.min(left, 90))}%`,
                                                        top: `${Math.max(2, Math.min(top, 90))}%`,
                                                        width: `${Math.max(6, Math.min(width, 40))}%`,
                                                        height: `${Math.max(4, Math.min(height, 30))}%`,
                                                        border: isSelected ? "2px solid #00ffcc" : "1.5px dashed rgba(6, 182, 212, 0.7)",
                                                        background: isSelected ? "rgba(0, 255, 204, 0.15)" : "rgba(6, 182, 212, 0.08)",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        zIndex: 10,
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    <span style={{ position: "absolute", top: "-18px", left: "0", background: isSelected ? "#00ffcc" : "rgba(15, 23, 42, 0.85)", color: isSelected ? "#000" : "#fff", padding: "1px 6px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap" }}>
                                                        {lbl.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                                        <FaCloudUploadAlt style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.3 }} />
                                        <p style={{ fontSize: "0.9rem" }}>No image uploaded yet.</p>
                                        <p style={{ fontSize: "0.78rem", marginTop: "4px" }}>Click "Choose 2D Image File" above to generate a custom 3D model.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT PANEL: GENUINE RECONSTRUCTED 3D GLB MODEL */}
                        <div className="glass-card" style={{ display: "flex", flexDirection: "column", height: "clamp(520px, 68vh, 720px)", position: "relative" }}>
                            {reconstructedModel ? (
                                <GeneratedGLBViewer
                                    modelUrl={reconstructedModel.fullModelUrl}
                                    downloadUrl={reconstructedModel.fullDownloadUrl}
                                    labels={labelsList}
                                    activeLabelId={activeLabelId}
                                    onSelectLabel={(id) => setActiveLabelId(id)}
                                    onMeshPointSelected={handleMeshPointSelected}
                                    isPinningMode={isPinningMode}
                                    modelMetadata={reconstructedModel}
                                />
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                                    <FaCube style={{ fontSize: "3.5rem", marginBottom: "16px", opacity: 0.25 }} />
                                    <h4 style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                                        3D Volumetric Model Viewport
                                    </h4>
                                    <p style={{ fontSize: "0.85rem", maxWidth: "340px", lineHeight: "1.5" }}>
                                        Upload an image on the left. The local offline engine will reconstruct genuine 3D geometry and render the resulting .glb model here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MANUAL LABEL & MESH CORRESPONDENCE ASSIGNMENT CONSOLE (Requirement 4) */}
                    {reconstructedModel && (
                        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaTag /> Component Labels & 3D Spatial Mesh Alignment
                                    </h3>
                                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                                        Confirm or correct component correspondence. Labels are flagged as Unverified until validated.
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={handleAddNewLabel}
                                        className="btn-secondary"
                                        style={{ borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px" }}
                                    >
                                        <FaPlus /> Add New Component
                                    </button>
                                </div>
                            </div>

                            {/* Labels Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                                {labelsList.map((lbl) => {
                                    const isSelected = activeLabelId === lbl.id;
                                    const isVerified = lbl.status === "verified";
                                    const isEditing = editingLabelId === lbl.id;

                                    return (
                                        <div
                                            key={lbl.id}
                                            onClick={() => setActiveLabelId(lbl.id)}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: "12px",
                                                background: isSelected ? "rgba(6, 182, 212, 0.15)" : "rgba(255, 255, 255, 0.03)",
                                                border: isSelected ? "1.5px solid var(--accent-cyan)" : "1px solid var(--border-glass)",
                                                cursor: "pointer",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                {isEditing ? (
                                                    <div style={{ display: "flex", gap: "6px", flex: 1, marginRight: "8px" }}>
                                                        <input
                                                            type="text"
                                                            value={newLabelText}
                                                            onChange={(e) => setNewLabelText(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{ background: "#0f172a", border: "1px solid var(--accent-cyan)", color: "#fff", padding: "2px 8px", borderRadius: "6px", fontSize: "0.82rem", width: "100%" }}
                                                        />
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleSaveEdit(lbl.id); }}
                                                            style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", padding: "2px 8px", cursor: "pointer" }}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <h4 style={{ fontSize: "0.88rem", color: isSelected ? "var(--accent-cyan)" : "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                                                        📌 {lbl.text}
                                                    </h4>
                                                )}

                                                <span
                                                    style={{
                                                        fontSize: "0.68rem",
                                                        padding: "2px 8px",
                                                        borderRadius: "6px",
                                                        background: isVerified ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.15)",
                                                        color: isVerified ? "#10b981" : "#f59e0b",
                                                        border: `1px solid ${isVerified ? "#10b981" : "#f59e0b"}`
                                                    }}
                                                >
                                                    {isVerified ? "✓ Verified" : "⚠️ Unverified"}
                                                </span>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "var(--text-muted)" }}>
                                                <span>Source: {lbl.source === "ocr" ? "OCR Text" : lbl.source === "geometric_contour" ? "Image Contour" : "User Added"}</span>
                                                <span>3D: [{lbl.position3D?.map(n => n.toFixed(2)).join(", ")}]</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                                                {!isVerified && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleVerifyLabel(lbl.id); }}
                                                        style={{ flex: 1, background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer", fontWeight: "700" }}
                                                    >
                                                        Confirm Alignment
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveLabelId(lbl.id);
                                                        setIsPinningMode(true);
                                                        toast("Click anywhere on the 3D model surface to re-anchor this pin!", { icon: "📍" });
                                                    }}
                                                    style={{ flex: 1, background: "rgba(6, 182, 212, 0.15)", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer" }}
                                                >
                                                    <FaCrosshairs /> Reposition on 3D
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStartEdit(lbl); }}
                                                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-glass)", color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer" }}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteLabel(lbl.id); }}
                                                    style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer" }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* SECONDARY MODE: CURATED EDUCATIONAL PRESETS (Textbook Reference Only) */}
            {activeMode === "curated_presets" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.05rem", fontFamily: "var(--font-display)", color: "var(--accent-purple)", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaLightbulb /> Curated Syllabus Presets (Reference Models)
                            </h3>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {SAMPLE_DIAGRAMS.length} Standard Syllabus Reference Models Available
                            </span>
                        </div>

                        {/* Preset Chips */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                            {SAMPLE_DIAGRAMS.map((preset) => {
                                const isSelected = activePreset?.id === preset.id;
                                return (
                                    <div
                                        key={preset.id}
                                        onClick={() => handleSelectCuratedPreset(preset)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "8px 12px",
                                            borderRadius: "10px",
                                            background: isSelected ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.03)",
                                            border: isSelected ? "1.5px solid var(--accent-purple)" : "1px solid var(--border-glass)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <img
                                            src={preset.url}
                                            alt={preset.name}
                                            loading="eager"
                                            style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h4 style={{ fontSize: "0.82rem", color: "#ffffff", marginBottom: "2px" }}>{preset.name}</h4>
                                            <span style={{ fontSize: "0.7rem", color: "var(--accent-cyan)" }}>{preset.domain}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dual Stage for Preset Reference */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <div className="glass-card" style={{ height: "clamp(500px, 65vh, 680px)", display: "flex", flexDirection: "column" }}>
                            <h4 style={{ fontSize: "0.95rem", color: "var(--accent-cyan)", marginBottom: "10px" }}>
                                📖 2D Textbook Diagram
                            </h4>
                            <div style={{ flex: 1, borderRadius: "10px", overflow: "hidden", background: "#090d16", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                    src={activePreset?.url || SAMPLE_DIAGRAMS[0].url}
                                    alt={activePreset?.name || "Textbook Diagram"}
                                    loading="eager"
                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                />
                            </div>
                        </div>

                        <div className="glass-card" style={{ height: "clamp(500px, 65vh, 680px)", display: "flex", flexDirection: "column" }}>
                            <h4 style={{ fontSize: "0.95rem", color: "var(--accent-purple)", marginBottom: "10px" }}>
                                🧬 Interactive 3D Educational Asset ({presetAnalysis?.recommended3DModel || "Model"})
                            </h4>
                            <div style={{ flex: 1, borderRadius: "10px", overflow: "hidden" }}>
                                <AnatomyCanvas
                                    activeModel={presetAnalysis?.recommended3DModel || "Heart"}
                                    showModelSelector={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* THIRD MODE: HARDWARE & OFFLINE ARCHITECTURE STATUS */}
            {activeMode === "hardware_status" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="glass-card" style={{ padding: "24px", borderLeft: "4px solid var(--accent-cyan)", display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                            <h3 style={{ color: "var(--accent-cyan)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.15rem", fontFamily: "var(--font-display)" }}>
                                <FaMicrochip /> Host Hardware & Local 3D Generation Architecture
                            </h3>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "8px" }}>
                                Engine: {hardwareData ? "Connected" : "Detecting..."}
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Host GPU</div>
                                <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                    {hardwareData?.gpuDevice || "Intel Iris Xe Graphics"}
                                </div>
                            </div>

                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>CUDA Acceleration</div>
                                <div style={{ color: hardwareData?.cudaAvailable ? "#10b981" : "#f59e0b", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                    {hardwareData?.cudaAvailable ? "Enabled" : "Unavailable (Non-NVIDIA)"}
                                </div>
                            </div>

                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Reconstruction Engine</div>
                                <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                    Offline Volumetric Bilateral Mesh Synthesis
                                </div>
                            </div>

                            <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Export Format</div>
                                <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                    glTF 2.0 Binary (.glb)
                                </div>
                            </div>

                            {hardwareData?.operatingSystem && (
                                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Operating System</div>
                                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                        {hardwareData.operatingSystem}
                                    </div>
                                </div>
                            )}

                            {hardwareData?.totalMemory && (
                                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "14px 16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                                    <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>System Memory</div>
                                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.92rem", marginTop: "4px" }}>
                                        {hardwareData.totalMemory}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{
                            background: "rgba(15, 23, 42, 0.8)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "10px",
                            padding: "16px",
                            fontSize: "0.82rem",
                            color: "var(--text-secondary)",
                            lineHeight: "1.6"
                        }}>
                            <strong style={{ color: "var(--accent-cyan)" }}>💡 Offline Architecture Notice:</strong>
                            <p style={{ marginTop: "6px" }}>
                                Deep-learning generative diffusion models (TripoSR, InstantMesh, Shap-E) require discrete NVIDIA CUDA GPUs with ≥8GB dedicated VRAM. When running on systems without discrete CUDA hardware, the platform executes a native CPU-optimized geometric volumetric reconstruction algorithm with zero cloud API keys, privacy-preserving local execution, and watertight .glb export.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
