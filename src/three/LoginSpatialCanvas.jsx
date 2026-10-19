import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles, ContactShadows } from "@react-three/drei";
import HeartModel from "./models/HeartModel";
import BrainModel from "./models/BrainModel";
import SkeletonModel from "./models/SkeletonModel";
import EyeModel from "./models/EyeModel";
import ModelAutoFramer from "./components/ModelAutoFramer";
import { FaSync, FaEye, FaCube, FaMagic, FaSlidersH, FaTag } from "react-icons/fa";

function RotatingGroup({ children, speed = 0.6, autoRotate = true }) {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current && autoRotate) {
            groupRef.current.rotation.y += delta * speed * 0.5;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

function SpatialParticleGrid({ color = "#06b6d4" }) {
    const ringRef = useRef();

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={ringRef}>
            <Sparkles count={120} scale={8} size={2.5} speed={0.4} color={color} opacity={0.6} />
        </group>
    );
}

export default function LoginSpatialCanvas({ role = "student", activeModel, onModelSelect }) {
    const [currentModel, setCurrentModel] = useState(activeModel || (role === "teacher" ? "Brain" : "Eye"));
    const [wireframe, setWireframe] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [explode, setExplode] = useState(0.15);
    const [autoRotate, setAutoRotate] = useState(true);
    const [selectedPart, setSelectedPart] = useState(null);

    const controlsRef = useRef();
    const fittedViewsRef = useRef({});

    useEffect(() => {
        if (!activeModel) {
            const defaultM = role === "teacher" ? "Brain" : "Eye";
            setCurrentModel(defaultM);
        }
    }, [role, activeModel]);

    const themeColor = role === "teacher" ? "#06b6d4" : "#a855f7";

    const handleModelFramed = (fit) => {
        if (fit) {
            fittedViewsRef.current[fit.modelKey] = fit;
        }
    };

    const handleModelChange = (m) => {
        setCurrentModel(m);
        setSelectedPart(null);
        const savedFit = fittedViewsRef.current[m];
        if (savedFit && controlsRef.current) {
            controlsRef.current.target.set(...savedFit.cameraTarget);
            controlsRef.current.object.position.set(...savedFit.cameraPosition);
            controlsRef.current.update();
        }
        if (onModelSelect) onModelSelect(m);
    };

    const handleSelectPart = (part) => {
        if (!part) {
            setSelectedPart(null);
        } else if (typeof part === "string") {
            setSelectedPart({ id: part, name: part });
        } else {
            setSelectedPart(part);
        }
    };

    const handleReset = () => {
        setWireframe(false);
        setShowLabels(false);
        setExplode(0);
        setSelectedPart(null);
        const savedFit = fittedViewsRef.current[currentModel];
        if (savedFit && controlsRef.current) {
            controlsRef.current.target.set(...savedFit.cameraTarget);
            controlsRef.current.object.position.set(...savedFit.cameraPosition);
            controlsRef.current.update();
            controlsRef.current.reset();
        } else if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    const partDisplayName = selectedPart
        ? (typeof selectedPart === "string" ? selectedPart : selectedPart.name || selectedPart.id || "Submesh Region")
        : `Interactive 3D ${currentModel}`;

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "450px", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.9) 0%, rgba(6, 9, 17, 0.98) 100%)" }}>
            
            {/* Top Spatial Toolbar */}
            <div style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                right: "16px",
                zIndex: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
            }}>
                <div style={{
                    display: "flex",
                    gap: "6px",
                    background: "rgba(10, 15, 30, 0.75)",
                    backdropFilter: "blur(12px)",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}>
                    {[
                        { id: "Brain", label: "🧠 Brain" },
                        { id: "Eye", label: "👁️ Eye" },
                        { id: "Heart", label: "🫀 Heart" },
                        { id: "Skeleton", label: "🦴 Skeleton" }
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => handleModelChange(m.id)}
                            style={{
                                background: currentModel === m.id
                                    ? role === "teacher"
                                        ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                                        : "linear-gradient(135deg, #a855f7, #6366f1)"
                                    : "transparent",
                                color: currentModel === m.id ? "#ffffff" : "var(--text-secondary)",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                fontSize: "0.78rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: "flex",
                    gap: "6px",
                    background: "rgba(10, 15, 30, 0.75)",
                    backdropFilter: "blur(12px)",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}>
                    <button
                        onClick={() => setWireframe(!wireframe)}
                        style={{
                            background: wireframe ? themeColor : "transparent",
                            color: wireframe ? "#fff" : "var(--text-secondary)",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                        }}
                    >
                        <FaEye /> {wireframe ? "Wireframe ON" : "Solid"}
                    </button>

                    <button
                        onClick={() => setShowLabels(!showLabels)}
                        style={{
                            background: showLabels ? themeColor : "transparent",
                            color: showLabels ? "#fff" : "var(--text-secondary)",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                        }}
                        title="Toggle 3D Anatomical Labels"
                    >
                        <FaTag /> {showLabels ? "Labels ON" : "Labels OFF"}
                    </button>

                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        style={{
                            background: autoRotate ? "rgba(255,255,255,0.12)" : "transparent",
                            color: autoRotate ? themeColor : "var(--text-secondary)",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                        }}
                    >
                        <FaCube /> {autoRotate ? "Orbiting" : "Paused"}
                    </button>

                    <button
                        onClick={handleReset}
                        style={{
                            background: "transparent",
                            color: "var(--text-secondary)",
                            border: "none",
                            padding: "6px 8px",
                            borderRadius: "8px",
                            fontSize: "0.78rem",
                            cursor: "pointer"
                        }}
                    >
                        <FaSync />
                    </button>
                </div>
            </div>

            {/* Selected Component Overlay */}
            <div style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                zIndex: 20,
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(12px)",
                padding: "10px 16px",
                borderRadius: "14px",
                border: `1px solid ${themeColor}40`,
                maxWidth: "280px"
            }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: themeColor, display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaMagic /> {partDisplayName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {selectedPart
                        ? `Anatomical region active. Drag scene to orbit 360°.`
                        : `Click components to inspect internal spatial structures.`}
                </div>
            </div>

            {/* Three.js Canvas */}
            <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
                <color attach="background" args={["#060911"]} />
                <ambientLight intensity={0.9} />
                <directionalLight position={[8, 10, 5]} intensity={1.6} />
                <directionalLight position={[-8, -10, -5]} intensity={0.6} color={themeColor} />
                <pointLight position={[0, 4, 2]} intensity={1} color={themeColor} />

                <SpatialParticleGrid color={themeColor} />

                <Suspense fallback={null}>
                    <ModelAutoFramer
                        modelKey={currentModel}
                        controlsRef={controlsRef}
                        padding={1.38}
                        offsetY={-0.15}
                        onModelFramed={handleModelFramed}
                    >
                        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.12}>
                            <RotatingGroup autoRotate={autoRotate} speed={0.5}>
                                {currentModel === "Brain" && (
                                    <BrainModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={selectedPart?.id}
                                        onSelectPart={handleSelectPart}
                                        showLabels={showLabels}
                                    />
                                )}
                                {currentModel === "Heart" && (
                                    <HeartModel
                                        explode={explode}
                                        pulsing={true}
                                        wireframe={wireframe}
                                        activePart={selectedPart?.id}
                                        onSelectPart={handleSelectPart}
                                        showLabels={showLabels}
                                    />
                                )}
                                {currentModel === "Skeleton" && (
                                    <SkeletonModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={selectedPart?.id}
                                        onSelectPart={handleSelectPart}
                                        showLabels={showLabels}
                                    />
                                )}
                                {currentModel === "Eye" && (
                                    <EyeModel
                                        explode={explode}
                                        wireframe={wireframe}
                                        activePart={selectedPart?.id}
                                        onSelectPart={handleSelectPart}
                                        showLabels={showLabels}
                                    />
                                )}
                            </RotatingGroup>
                        </Float>
                    </ModelAutoFramer>
                </Suspense>

                <ContactShadows position={[0, -1.8, 0]} opacity={0.5} scale={8} blur={1.5} far={4} color={themeColor} />
                <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
        </div>
    );
}
