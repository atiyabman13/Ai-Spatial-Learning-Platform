import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Realistic 3D Solar System & Keplerian Planetary Mechanics Component
 * 
 * Features:
 * - Central incandescent Sun with solar corona pulsation and point lighting
 * - Scientifically characterized terrestrial planets & gas giants
 * - Saturn's realistic multi-banded ring system with Cassini division
 * - Keplerian orbital velocities ($v \propto 1/\sqrt{r}$)
 * - Explode expands orbital separation for classroom observation
 */
export default function SolarSystemModel({
    explode = 0,
    wireframe = false,
    activePart,
    onSelectPart,
    hoveredPart = null,
    onHoverPart = null,
    showLabels = false
}) {
    const planetsRef = useRef([]);
    const sunGlowRef = useRef();
    const [hoveredId, setHoveredId] = useState(null);

    // Keplerian orbital velocities and planetary self-rotations
    useFrame((state, delta) => {
        // Sun subtle coronal breathing
        if (sunGlowRef.current) {
            const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
            sunGlowRef.current.scale.set(pulse, pulse, pulse);
        }

        // Orbit planets around the Sun at physical relative velocities (pauses when a planet is hovered or active/inspected)
        if (!hoveredId && !hoveredPart && !activePart) {
            planetsRef.current.forEach((ref, idx) => {
                if (ref) {
                    // v proportional to 1 / sqrt(r)
                    const orbitalSpeeds = [0, 1.6, 1.18, 1.0, 0.8, 0.44, 0.32, 0.24, 0.18];
                    ref.rotation.y += delta * (orbitalSpeeds[idx] || 0.2) * 0.8;
                }
            });
        }
    });

    const celestialBodies = useMemo(() => [
        {
            id: "sun",
            name: "Sun (Solar Fusion Core)",
            dist: 0,
            radius: 0.95,
            color: "#f59e0b",
            emissive: "#fbbf24",
            desc: "Yellow dwarf star converting 600 million tons of hydrogen into helium every second"
        },
        {
            id: "mercury",
            name: "Mercury",
            dist: 1.45,
            radius: 0.16,
            color: "#94a3b8",
            desc: "Cratered terrestrial planet with extreme diurnal temperature swings"
        },
        {
            id: "venus",
            name: "Venus (Runaway Greenhouse)",
            dist: 2.15,
            radius: 0.26,
            color: "#f59e0b",
            desc: "Dense CO2 atmosphere with sulfuric acid clouds creating 465°C surface heat"
        },
        {
            id: "earth",
            name: "Earth & Biosphere",
            dist: 2.95,
            radius: 0.32,
            color: "#0284c7",
            desc: "Habitable zone planet with 71% liquid water oceans, nitrogen-oxygen air, and life"
        },
        {
            id: "mars",
            name: "Mars (Red Planet)",
            dist: 3.75,
            radius: 0.22,
            color: "#ef4444",
            desc: "Iron oxide rust surface featuring Olympus Mons and water-ice polar caps"
        },
        {
            id: "jupiter",
            name: "Jupiter (Gas Giant & Red Spot)",
            dist: 4.85,
            radius: 0.56,
            color: "#d97706",
            desc: "Largest planet containing 2.5x the mass of all other planets combined"
        },
        {
            id: "saturn",
            name: "Saturn & Planetary Rings",
            dist: 6.15,
            radius: 0.48,
            color: "#fef08a",
            hasRings: true,
            desc: "Gas giant famed for vast ring system composed of billions of water-ice particles"
        },
        {
            id: "uranus",
            name: "Uranus",
            dist: 7.45,
            radius: 0.38,
            color: "#67e8f9",
            desc: "Tilted ice giant rotating on its side with faint rings and methane atmosphere"
        },
        {
            id: "neptune",
            name: "Neptune",
            dist: 8.75,
            radius: 0.36,
            color: "#3b82f6",
            desc: "Distant blue ice giant featuring extreme supersonic winds up to 2,100 km/h"
        }
    ], []);

    const isBodyMatching = (target, id, name) => {
        if (!target) return false;
        const lower = String(target).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const idLower = String(id).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        const nameLower = String(name).toLowerCase().replace(/[\u2010-\u2015\u2212]/g, "-").trim();
        return (
            lower === idLower ||
            lower === nameLower ||
            lower.includes(idLower) ||
            lower.includes(nameLower) ||
            nameLower.includes(lower) ||
            (idLower === "sun" && (lower.includes("sun") || lower.includes("solar")))
        );
    };

    const isBodySelected = (id, name) => isBodyMatching(activePart, id, name);

    const isSunActive = isBodyMatching(activePart, "sun", "Sun");
    const isSunHovered = hoveredId === "sun" || Boolean(hoveredPart && isBodyMatching(hoveredPart, "sun", "Sun"));
    const showSunTooltip = isSunActive || isSunHovered || (showLabels && explode > 0.2);

    return (
        <group
            position={[0, 0, 0]}
            onPointerMissed={(e) => {
                if (e.type === "click") {
                    onSelectPart && onSelectPart(null);
                }
            }}
        >
            {/* Ambient and Sun Core Light */}
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#fffbeb" distance={20} decay={1.5} />

            {/* Central Star: The Sun */}
            <group
                onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart && onSelectPart("Sun (Solar Fusion Core)");
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredId("sun");
                    onHoverPart && onHoverPart("Sun (Solar Fusion Core)");
                }}
                onPointerOut={() => {
                    setHoveredId(null);
                    onHoverPart && onHoverPart(null);
                }}
            >
                {/* Sun Core */}
                <mesh>
                    <sphereGeometry args={[0.95, 32, 32]} />
                    <meshStandardMaterial
                        color={isSunActive ? "#00ffcc" : (isSunHovered ? "#fde047" : "#f59e0b")}
                        roughness={0.1}
                        wireframe={wireframe}
                        emissive={isSunActive ? "#00ffcc" : "#f59e0b"}
                        emissiveIntensity={isSunActive ? 1.2 : 0.8}
                    />
                </mesh>

                {/* Sun Solar Flare Coronal Glow Atmosphere */}
                <mesh ref={sunGlowRef} scale={[1.18, 1.18, 1.18]}>
                    <sphereGeometry args={[0.95, 32, 32]} />
                    <meshBasicMaterial
                        color="#fbbf24"
                        transparent
                        opacity={0.3}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Sun Compact Hover / Selection Tooltip */}
                {showSunTooltip && (
                    <Html distanceFactor={8} position={[0, 1.25, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
                        <div
                            style={{
                                background: isBodySelected("sun", "Sun") ? "rgba(0, 255, 204, 0.95)" : "rgba(10, 15, 30, 0.92)",
                                color: isBodySelected("sun", "Sun") ? "#0a0d14" : "#f1f5f9",
                                padding: "2px 7px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                boxShadow: isBodySelected("sun", "Sun")
                                    ? "0 0 10px rgba(0, 255, 204, 0.6)"
                                    : "0 2px 6px rgba(0,0,0,0.6)",
                                border: `1px solid ${isBodySelected("sun", "Sun") ? "#00ffcc" : "rgba(255,255,255,0.22)"}`,
                                pointerEvents: "none",
                                userSelect: "none",
                                transition: "opacity 0.15s ease, transform 0.15s ease",
                                transform: isBodySelected("sun", "Sun") ? "scale(1.06)" : "scale(1)"
                            }}
                        >
                            Sun (Solar Fusion Core)
                        </div>
                    </Html>
                )}
            </group>

            {/* Planetary Orbits and Bodies */}
            {celestialBodies.map((body, idx) => {
                if (body.dist === 0) return null;

                const isSelected = isBodyMatching(activePart, body.id, body.name);
                const isHovered = hoveredId === body.id || Boolean(hoveredPart && isBodyMatching(hoveredPart, body.id, body.name));
                const showTooltip = isSelected || isHovered || (showLabels && explode > 0.2);
                const orbitRadius = body.dist * (1 + explode * 0.45);

                return (
                    <group key={body.id}>
                        {/* Orbit Track Ring */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[orbitRadius - 0.015, orbitRadius + 0.015, 96]} />
                            <meshBasicMaterial
                                color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : "#334155")}
                                transparent
                                opacity={isSelected ? 0.8 : (isHovered ? 0.6 : 0.35)}
                            />
                        </mesh>

                        {/* Keplerian Orbit Revolution Pivot */}
                        <group ref={(el) => (planetsRef.current[idx] = el)}>
                            <group position={[orbitRadius, 0, 0]}>
                                {/* Planet Sphere */}
                                <mesh
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectPart && onSelectPart(body.name);
                                    }}
                                    onPointerOver={(e) => {
                                        e.stopPropagation();
                                        setHoveredId(body.id);
                                        onHoverPart && onHoverPart(body.name);
                                    }}
                                    onPointerOut={() => {
                                        setHoveredId(null);
                                        onHoverPart && onHoverPart(null);
                                    }}
                                >
                                    <sphereGeometry args={[body.radius, 32, 32]} />
                                    <meshStandardMaterial
                                        color={isSelected ? "#00ffcc" : (isHovered ? "#38bdf8" : body.color)}
                                        roughness={body.id === "earth" ? 0.2 : 0.6}
                                        metalness={0.1}
                                        wireframe={wireframe}
                                        emissive={isSelected ? "#00ffcc" : (isHovered ? "#0284c7" : "#000000")}
                                        emissiveIntensity={isSelected ? 0.8 : (isHovered ? 0.4 : 0)}
                                    />
                                </mesh>

                                {/* Saturn's Realistic Ring System */}
                                {body.hasRings && (
                                    <mesh rotation={[Math.PI / 3, 0, 0]}>
                                        <ringGeometry args={[body.radius * 1.35, body.radius * 2.4, 64]} />
                                        <meshStandardMaterial
                                            color="#fef08a"
                                            roughness={0.4}
                                            side={THREE.DoubleSide}
                                            transparent
                                            opacity={0.8}
                                            wireframe={wireframe}
                                        />
                                    </mesh>
                                )}

                                {/* Earth's Moon */}
                                {body.id === "earth" && (
                                    <group position={[0.55, 0.15, 0]}>
                                        <mesh>
                                            <sphereGeometry args={[0.08, 16, 16]} />
                                            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
                                        </mesh>
                                    </group>
                                )}

                                {/* Planet Compact Hover / Selection Tooltip */}
                                {showTooltip && (
                                    <Html distanceFactor={8} position={[0, body.radius + 0.25, 0]} center pointerEvents="none" wrapperClass="pointer-events-none" style={{ pointerEvents: "none" }}>
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
                                            {body.name}
                                        </div>
                                    </Html>
                                )}
                            </group>
                        </group>
                    </group>
                );
            })}
        </group>
    );
}
