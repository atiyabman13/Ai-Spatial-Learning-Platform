import { useRef, useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
    FaRedoAlt,
    FaEye,
    FaExpandAlt,
    FaExpand,
    FaCompress,
    FaDownload,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCube,
    FaCrosshairs
} from "react-icons/fa";

/**
 * Centered and normalized GLB model primitive
 */
function ReconstructedModelPrimitive({
    modelUrl,
    wireframe,
    onMeshClick,
    isPinningMode
}) {
    const { scene } = useGLTF(modelUrl);
    const modelRef = useRef();

    // Clone and normalize model bounds so it is centered and properly sized in viewport
    const clonedScene = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const targetScale = 2.8 / maxDim;

        cloned.scale.setScalar(targetScale);
        cloned.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);
        return cloned;
    }, [scene]);

    // Apply wireframe toggle
    useEffect(() => {
        if (!clonedScene) return;
        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.wireframe = wireframe;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [clonedScene, wireframe]);

    return (
        <primitive
            ref={modelRef}
            object={clonedScene}
            onClick={(e) => {
                if (isPinningMode && onMeshClick) {
                    e.stopPropagation();
                    onMeshClick(e.point);
                }
            }}
        />
    );
}

/**
 * 3D Floating Spatial Label Pins
 */
function SpatialLabelPins({ labels, activeLabelId, onSelectLabel, isPinningMode }) {
    return (
        <group>
            {labels.map((lbl) => {
                const pos = lbl.position3D || [0, 0, 0.35];
                const isSelected = activeLabelId === lbl.id;
                const isVerified = lbl.status === "verified";

                let pinColor = "#06b6d4"; // Cyan auto
                if (isVerified) pinColor = "#10b981"; // Emerald verified
                else if (lbl.status === "manual") pinColor = "#a855f7"; // Purple manual

                return (
                    <group key={lbl.id} position={pos}>
                        {/* 3D Glowing Sphere Anchor */}
                        <mesh onClick={(e) => { e.stopPropagation(); onSelectLabel(lbl.id); }}>
                            <sphereGeometry args={[0.07, 16, 16]} />
                            <meshStandardMaterial
                                color={pinColor}
                                emissive={pinColor}
                                emissiveIntensity={isSelected ? 1.0 : 0.5}
                            />
                        </mesh>

                        {/* Interactive HTML Tag */}
                        <Html distanceFactor={7} position={[0, 0.16, 0]}>
                            <div
                                onClick={(e) => { e.stopPropagation(); onSelectLabel(lbl.id); }}
                                style={{
                                    background: isSelected ? "rgba(6, 182, 212, 0.95)" : "rgba(15, 23, 42, 0.88)",
                                    color: isSelected ? "#0a0d14" : "#ffffff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                    whiteSpace: "nowrap",
                                    border: `1.5px solid ${isSelected ? "#00ffcc" : pinColor}`,
                                    boxShadow: `0 0 14px ${isSelected ? "#00ffcc" : "rgba(0,0,0,0.6)"}`,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    transform: isSelected ? "scale(1.08)" : "scale(1)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>{isVerified ? "✓" : "📌"}</span>
                                <span>{lbl.text}</span>
                            </div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

/**
 * Full Interactive Viewer Container for Generated 3D GLB Models
 */
export default function GeneratedGLBViewer({
    modelUrl,
    downloadUrl,
    labels = [],
    activeLabelId = null,
    onSelectLabel,
    onMeshPointSelected,
    isPinningMode = false,
    modelMetadata = null
}) {
    const [wireframe, setWireframe] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef();
    const controlsRef = useRef();

    const resetCamera = useCallback(() => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
        setAutoRotate(false);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                background: "radial-gradient(circle at center, #1e293b 0%, #090d16 100%)",
                borderRadius: isFullscreen ? "0" : "16px",
                overflow: "hidden",
                position: "relative"
            }}
        >
            {/* Top Viewer Controls Toolbar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    padding: "10px 14px",
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid var(--border-glass)",
                    zIndex: 20
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FaCube /> Generated 3D Model
                    </span>
                    {modelMetadata && (
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "6px" }}>
                            {modelMetadata.vertexCount?.toLocaleString()} Vertices • {modelMetadata.triangleCount?.toLocaleString()} Triangles
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isPinningMode && (
                        <span style={{ fontSize: "0.74rem", color: "#fbbf24", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.4)", padding: "3px 8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <FaCrosshairs /> Click on 3D Model to Re-Pin
                        </span>
                    )}

                    <button
                        className={`tool-btn ${autoRotate ? "active" : ""}`}
                        onClick={() => setAutoRotate(!autoRotate)}
                        title="360° Orbit Rotation"
                        style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                    >
                        <FaRedoAlt className={autoRotate ? "spin-slow" : ""} /> {autoRotate ? "Spin On" : "Spin Off"}
                    </button>

                    <button
                        className={`tool-btn ${wireframe ? "active" : ""}`}
                        onClick={() => setWireframe(!wireframe)}
                        title="Toggle Holographic Wireframe"
                        style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                    >
                        <FaEye /> Wireframe
                    </button>

                    <button
                        className="tool-btn"
                        onClick={resetCamera}
                        title="Reset 3D Camera"
                        style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                    >
                        <FaExpandAlt /> Reset
                    </button>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download
                            className="btn-emerald"
                            style={{ padding: "5px 10px", fontSize: "0.75rem", borderRadius: "8px", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}
                            title="Download standard glTF 2.0 Binary (.glb) model"
                        >
                            <FaDownload /> Download GLB
                        </a>
                    )}

                    <button
                        className="tool-btn"
                        onClick={toggleFullscreen}
                        title="Fullscreen Toggle"
                        style={{ padding: "5px 10px", fontSize: "0.75rem" }}
                    >
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>

            {/* Main Three.js R3F Canvas */}
            <div style={{ flex: 1, width: "100%", position: "relative" }}>
                <Canvas
                    camera={{ position: [0, 0, 4.2], fov: 45 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[6, 8, 6]} intensity={1.5} />
                    <directionalLight position={[-6, -4, -6]} intensity={0.8} color="#06b6d4" />
                    <pointLight position={[0, 0, 4]} intensity={0.9} />

                    <Suspense
                        fallback={
                            <Html center>
                                <div style={{ color: "#00ffcc", background: "rgba(15, 23, 42, 0.9)", padding: "10px 16px", borderRadius: "12px", border: "1px solid #00ffcc", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", whiteSpace: "nowrap" }}>
                                    <div className="spin" style={{ width: "12px", height: "12px", border: "2px solid #00ffcc", borderTopColor: "transparent", borderRadius: "50%" }} />
                                    Loading Reconstructed GLB Model...
                                </div>
                            </Html>
                        }
                    >
                        <ReconstructedModelPrimitive
                            key={modelUrl}
                            modelUrl={modelUrl}
                            wireframe={wireframe}
                            isPinningMode={isPinningMode}
                            onMeshClick={onMeshPointSelected}
                        />

                        <SpatialLabelPins
                            labels={labels}
                            activeLabelId={activeLabelId}
                            onSelectLabel={onSelectLabel}
                            isPinningMode={isPinningMode}
                        />
                    </Suspense>

                    <OrbitControls
                        ref={controlsRef}
                        autoRotate={autoRotate}
                        autoRotateSpeed={1.5}
                        enableDamping={true}
                        dampingFactor={0.08}
                    />
                </Canvas>
            </div>

            {/* Bottom Inferred Depth Notice Banner */}
            <div
                style={{
                    padding: "6px 14px",
                    background: "rgba(15, 23, 42, 0.9)",
                    borderTop: "1px solid var(--border-glass)",
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px"
                }}
            >
                <span>
                    💡 <strong>Single-View 3D Geometry:</strong> Bilateral depth profile is mathematically synthesized from contour boundaries, gradient normals, and luminance.
                </span>
                <span style={{ color: "var(--accent-cyan)" }}>
                    Watertight Manifold Mesh (.glb)
                </span>
            </div>
        </div>
    );
}
