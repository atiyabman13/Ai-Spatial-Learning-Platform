export const curriculumChapters = [
    {
        id: "bio-heart-101",
        title: "Human Cardiovascular System & Heart Anatomy",
        subject: "Biology",
        category: "Anatomy",
        modelName: "Heart",
        description: "Explore the 4-chambered human heart, systemic blood circulation, and valve mechanisms.",
        overviewText: `The human heart is a four-chambered muscular organ about the size of a closed fist. It acts as the double pump of the cardiovascular system:
1. The Right Side pumps deoxygenated blood arriving from the body into the pulmonary arteries to the lungs for gas exchange.
2. The Left Side receives oxygenated blood from the lungs and pumps it under high pressure via the Aorta to all systemic tissues and brain cells.

The thick muscular wall of the left ventricle generates high systolic arterial pressure. Atrioventricular (mitral and tricuspid) valves ensure strictly unidirectional blood flow, preventing regurgitation.`,
        partsHierarchy: [
            { id: "aorta", name: "Aorta & Aortic Arch", color: "#f43f5e", detail: "Main systemic artery that distributes oxygenated blood from the left ventricle to the body." },
            { id: "pulmonary", name: "Pulmonary Artery", color: "#38bdf8", detail: "Carries deoxygenated blood from the right ventricle into lungs for oxygen loading." },
            { id: "venacava", name: "Superior Vena Cava", color: "#2563eb", detail: "Large vein returning deoxygenated systemic venous blood from upper body to right atrium." },
            { id: "atrium_l", name: "Left Atrium", color: "#c084fc", detail: "Receives oxygenated blood returning from lungs via pulmonary veins." },
            { id: "atrium_r", name: "Right Atrium", color: "#fbbf24", detail: "Receives systemic venous blood from vena cava and pumps it into right ventricle." },
            { id: "ventricle_l", name: "Left Ventricle", color: "#e11d48", detail: "Thick muscular chamber pumping oxygenated blood into aorta at high systolic pressure." },
            { id: "ventricle_r", name: "Right Ventricle", color: "#f59e0b", detail: "Pumps deoxygenated blood through pulmonary valve into pulmonary circulation." },
            { id: "valves", name: "Atrioventricular Valves", color: "#10b981", detail: "Flap-like structures that prevent backflow of blood between chambers." }
        ],
        scriptCues: [
            {
                step: 1,
                title: "Introduction to the Human Heart",
                speech: "Welcome students! Today we are studying the human heart. Notice its four distinct chambers and major vascular trunks. The heart beats over one hundred thousand times every day.",
                action: {
                    targetMesh: "heart",
                    highlightColor: "#00ffcc",
                    cameraPosition: [0, 0.5, 4.5],
                    cameraTarget: [0, 0, 0],
                    animation: "pulse",
                    zoom: 1.0,
                    explode: 0,
                    slice: false
                }
            },
            {
                step: 2,
                title: "Left Ventricle & High-Pressure Pumping",
                speech: "Notice the left ventricle located at the apex of the heart. It has thick myocardium walls because it must pump oxygen-rich blood through the entire body.",
                action: {
                    targetMesh: "ventricle_l",
                    highlightColor: "#e11d48",
                    cameraPosition: [-1.2, -0.2, 2.2],
                    cameraTarget: [-0.38, -0.35, 0],
                    animation: "pulse",
                    zoom: 1.6,
                    explode: 0.1,
                    slice: false
                }
            },
            {
                step: 3,
                title: "The Aorta & Systemic Distribution",
                speech: "Now look up at the prominent red vessel curving overhead: the Aorta. Blood ejected from the left ventricle enters the aorta to feed oxygen to every cell, organ, and brain tissue.",
                action: {
                    targetMesh: "aorta",
                    highlightColor: "#f43f5e",
                    cameraPosition: [0.2, 1.8, 2.2],
                    cameraTarget: [0, 1.25, 0],
                    animation: "pulse",
                    zoom: 1.5,
                    explode: 0.15,
                    slice: false
                }
            },
            {
                step: 4,
                title: "Right Atrium & Venous Blood Return",
                speech: "On the opposite side lies the right atrium and superior vena cava. These blue-hued channels collect deoxygenated blood returning from systemic body veins.",
                action: {
                    targetMesh: "venacava",
                    highlightColor: "#2563eb",
                    cameraPosition: [1.2, 1.0, 2.2],
                    cameraTarget: [0.35, 0.45, -0.1],
                    animation: "pulse",
                    zoom: 1.4,
                    explode: 0.25,
                    slice: false
                }
            },
            {
                step: 5,
                title: "Atrioventricular Valves & Unidirectional Flow",
                speech: "Inside the central junction, notice the atrioventricular valves. As the ventricles contract, these valve cusps snap shut, preventing blood from flowing backwards into the atria.",
                action: {
                    targetMesh: "valves",
                    highlightColor: "#10b981",
                    cameraPosition: [0, 0.4, 2.0],
                    cameraTarget: [0, 0.05, 0.15],
                    animation: "pulse",
                    zoom: 1.8,
                    explode: 0.4,
                    slice: true
                }
            }
        ]
    },
    {
        id: "bio-plant-102",
        title: "Plant Cell Structure & Organelles",
        subject: "Biology",
        category: "Cellular Biology",
        modelName: "PlantCell",
        description: "Study eukaryotic plant cells, cell wall cellulose matrix, chloroplasts, and photosynthesis organelles.",
        overviewText: `Eukaryotic plant cells differ from animal cells by possessing a rigid Cell Wall composed of cellulose, a Large Central Vacuole for turgor pressure management, and Chloroplasts containing chlorophyll for solar photosynthesis.

The Nucleus houses genetic DNA code, while Mitochondria generate cellular ATP energy via aerobic respiration.`,
        partsHierarchy: [
            { id: "cell_wall", name: "Cell Wall & Membrane", color: "#10b981", detail: "Rigid outer layer composed of cellulose that maintains cell shape and structural protection." },
            { id: "nucleus", name: "Nucleus & Nucleolus", color: "#ec4899", detail: "Control center containing DNA chromosomes and directing protein synthesis." },
            { id: "vacuole", name: "Large Central Vacuole", color: "#38bdf8", detail: "Fluid-filled sac maintaining turgor pressure against the cell wall." },
            { id: "chloroplast", name: "Chloroplasts (Grana & Stroma)", color: "#22c55e", detail: "Site of photosynthesis where sunlight converts CO2 and water into glucose." },
            { id: "mitochondria", name: "Mitochondria", color: "#f59e0b", detail: "Powerhouse of the cell synthesizing ATP via cellular respiration." }
        ],
        scriptCues: [
            {
                step: 1,
                title: "Plant Cell Overview",
                speech: "Observe this microscopic 3D plant cell model. Unlike animal cells, plant cells possess a rectangular rigid shape thanks to their cellulose cell wall.",
                action: {
                    targetMesh: "plant_cell",
                    highlightColor: "#00ffcc",
                    cameraPosition: [0, 1.0, 4.5],
                    cameraTarget: [0, 0, 0],
                    animation: "float",
                    zoom: 1.0,
                    explode: 0
                }
            },
            {
                step: 2,
                title: "Cell Wall & Membrane Shield",
                speech: "The outer green framework is the Cell Wall. It provides mechanical support and prevents the plant cell from bursting under high internal water pressure.",
                action: {
                    targetMesh: "cell_wall",
                    highlightColor: "#10b981",
                    cameraPosition: [0, 1.5, 3.2],
                    cameraTarget: [0, 0, 0],
                    animation: "pulse",
                    zoom: 1.3,
                    explode: 0.2
                }
            },
            {
                step: 3,
                title: "Chloroplasts & Solar Energy Capture",
                speech: "Notice these bright green oval organelles: Chloroplasts! They house chlorophyll pigments that absorb sunlight photons to synthesize sugars via photosynthesis.",
                action: {
                    targetMesh: "chloroplast",
                    highlightColor: "#22c55e",
                    cameraPosition: [-1.2, -0.6, 2.0],
                    cameraTarget: [-0.6, -0.4, 0.3],
                    animation: "pulse",
                    zoom: 1.7,
                    explode: 0.35
                }
            },
            {
                step: 4,
                title: "Nucleus DNA Command Center",
                speech: "At the center-left sits the spherical pink Nucleus. It stores genomic DNA sequences and commands cellular growth and cell division.",
                action: {
                    targetMesh: "nucleus",
                    highlightColor: "#ec4899",
                    cameraPosition: [-0.8, 0.4, 2.0],
                    cameraTarget: [-0.4, 0.2, 0],
                    animation: "pulse",
                    zoom: 1.6,
                    explode: 0.4
                }
            }
        ]
    },
    {
        id: "phy-motor-201",
        title: "Direct Current (DC) Electric Motor",
        subject: "Physics",
        category: "Electromagnetism",
        modelName: "DCMotor",
        description: "Understand Fleming's Left-Hand Rule, magnetic field interaction, split-ring commutator action, and rotational torque generation.",
        overviewText: `A DC Electric Motor converts direct current electrical energy into mechanical rotational work using magnetic field forces:
1. Stator Permanent Magnets create a magnetic field (B-field) directed from North pole to South pole.
2. Direct Current passing through the Armature Coil experiences Lorentz magnetic force (F = I L x B).
3. The Split-Ring Commutator reverses current direction every half-rotation (180°), ensuring continuous unidirectional torque rotation.`,
        partsHierarchy: [
            { id: "stator_n", name: "Stator Permanent Magnet (North)", color: "#ef4444", detail: "Fixed North magnetic pole generating magnetic flux lines across the rotor." },
            { id: "stator_s", name: "Stator Permanent Magnet (South)", color: "#3b82f6", detail: "Fixed South magnetic pole completing magnetic field loop." },
            { id: "armature", name: "Armature Coil Windings", color: "#f59e0b", detail: "Conducting copper loop that experiences magnetic torque when current flows." },
            { id: "commutator", name: "Split-Ring Commutator", color: "#ec4899", detail: "Reverses electric current polarity every half turn to sustain continuous rotation." },
            { id: "brushes", name: "Carbon Brushes", color: "#10b981", detail: "Sliding electrical contacts feeding DC voltage from external supply into rotating commutator." }
        ],
        scriptCues: [
            {
                step: 1,
                title: "DC Motor Principles & Electromagnetic Force",
                speech: "Welcome to Physics! Here is a 3D direct current electric motor. It transforms electrical energy into continuous rotational mechanical motion.",
                action: {
                    targetMesh: "dc_motor",
                    highlightColor: "#00ffcc",
                    cameraPosition: [0, 1.2, 4.2],
                    cameraTarget: [0, 0, 0],
                    animation: "spin",
                    zoom: 1.0,
                    explode: 0
                }
            },
            {
                step: 2,
                title: "Stator Magnets & Magnetic Field",
                speech: "Notice the red North pole and blue South pole magnets. They establish a uniform horizontal magnetic field across the central armature zone.",
                action: {
                    targetMesh: "stator_n",
                    highlightColor: "#ef4444",
                    cameraPosition: [-1.8, 0.5, 2.5],
                    cameraTarget: [0, 0, 0],
                    animation: "pulse",
                    zoom: 1.4,
                    explode: 0.25
                }
            },
            {
                step: 3,
                title: "Armature Coil & Rotational Torque",
                speech: "In the center, copper wire loop forms the Armature. When current flows through the loop, magnetic forces push one side upwards and the opposite side downwards according to Fleming's Left-Hand Rule.",
                action: {
                    targetMesh: "armature",
                    highlightColor: "#f59e0b",
                    cameraPosition: [0, 0.8, 2.2],
                    cameraTarget: [0, 0, 0],
                    animation: "spin",
                    zoom: 1.6,
                    explode: 0.3
                }
            },
            {
                step: 4,
                title: "Split-Ring Commutator Magic",
                speech: "Observe the pink split ring at the front: the Commutator! As the coil rotates past vertical, the split ring switches contact brushes, reversing current flow so torque continues in the same direction!",
                action: {
                    targetMesh: "commutator",
                    highlightColor: "#ec4899",
                    cameraPosition: [0.5, 0.5, 2.0],
                    cameraTarget: [0, 0, 0.75],
                    animation: "pulse",
                    zoom: 1.8,
                    explode: 0.4
                }
            }
        ]
    },
    {
        id: "chem-atom-301",
        title: "Bohr Model of the Atom & Electron Shells",
        subject: "Chemistry",
        category: "Atomic Physics",
        modelName: "Atom",
        description: "Discover atomic structure, subatomic protons & neutrons, electron energy quantization, and valency shells.",
        overviewText: `According to Niels Bohr's atomic model:
1. The dense central Nucleus contains positively charged Protons and uncharged Neutrons, binding nearly all atomic mass.
2. Negative Electrons revolve around the nucleus in quantized discrete Energy Shells (K, L, M shells).
3. The outermost M-shell dictates chemical valency and bonding behavior.`,
        partsHierarchy: [
            { id: "nucleus", name: "Central Nucleus Cluster", color: "#ef4444", detail: "Contains tightly bound protons and neutrons held together by strong nuclear force." },
            { id: "k_shell", name: "K-Shell (n=1 Level)", color: "#38bdf8", detail: "Innermost lowest energy electron shell holding up to 2 electrons." },
            { id: "l_shell", name: "L-Shell (n=2 Level)", color: "#a855f7", detail: "Second electron energy shell with capacity for 8 electrons." },
            { id: "m_shell", name: "Valency M-Shell (n=3 Level)", color: "#10b981", detail: "Outermost electron shell dictating chemical reactivity and bonding valence." }
        ],
        scriptCues: [
            {
                step: 1,
                title: "Atomic Structure & Quantized Orbits",
                speech: "Welcome to Chemistry! This interactive 3D model represents a Carbon atom with a central nucleus and orbiting electron energy shells.",
                action: {
                    targetMesh: "atom",
                    highlightColor: "#00ffcc",
                    cameraPosition: [0, 1.5, 5.2],
                    cameraTarget: [0, 0, 0],
                    animation: "orbit",
                    zoom: 1.0,
                    explode: 0
                }
            },
            {
                step: 2,
                title: "The Atomic Nucleus",
                speech: "Zooming into the center, we see the dense Nucleus containing 6 red Protons and 6 Neutrons bound by the strong nuclear force.",
                action: {
                    targetMesh: "nucleus",
                    highlightColor: "#ef4444",
                    cameraPosition: [0, 0.3, 2.2],
                    cameraTarget: [0, 0, 0],
                    animation: "pulse",
                    zoom: 1.8,
                    explode: 0.1
                }
            },
            {
                step: 3,
                title: "Electron Energy Shells & Valency",
                speech: "Surrounding the nucleus are cyan, purple, and emerald electron orbital rings. Electrons jump between these quantized shells when absorbing or emitting photons.",
                action: {
                    targetMesh: "k_shell",
                    highlightColor: "#38bdf8",
                    cameraPosition: [0, 2.0, 4.0],
                    cameraTarget: [0, 0, 0],
                    animation: "orbit",
                    zoom: 1.4,
                    explode: 0.3
                }
            }
        ]
    },
    {
        id: "phy-solar-202",
        title: "Solar System & Planetary Orbits",
        subject: "Physics",
        category: "Astronomy",
        modelName: "SolarSystem",
        description: "Study Kepler's laws of planetary motion, gravitational attraction, sun solar fusion core, and gas giants.",
        overviewText: `The Solar System consists of our central star, the Sun, and eight planets revolving in elliptical Keplerian orbits bound by universal gravitation (F = G M m / r²).`,
        partsHierarchy: [
            { id: "sun", name: "Sun (Solar Core)", color: "#f59e0b", detail: "Central yellow dwarf star converting hydrogen into helium via nuclear fusion." },
            { id: "earth", name: "Earth & Moon System", color: "#3b82f6", detail: "Third planet from the sun supporting liquid water oceans and life." },
            { id: "mars", name: "Mars (Red Planet)", color: "#ef4444", detail: "Terrestrial planet rich in iron oxide rust minerals." },
            { id: "jupiter", name: "Jupiter (Gas Giant)", color: "#eab308", detail: "Largest planet in the solar system with Great Red Spot storm." },
            { id: "saturn", name: "Saturn & Planetary Rings", color: "#fef08a", detail: "Gas giant famed for extensive ice particle planetary ring system." }
        ],
        scriptCues: [
            {
                step: 1,
                title: "Solar System & Orbital Harmony",
                speech: "Observe our Solar System! The Sun's intense gravitational pull governs the orbital velocity of all surrounding planets.",
                action: {
                    targetMesh: "sun",
                    highlightColor: "#f59e0b",
                    cameraPosition: [0, 4.5, 7.5],
                    cameraTarget: [0, 0, 0],
                    animation: "orbit",
                    zoom: 1.0,
                    explode: 0
                }
            },
            {
                step: 2,
                title: "Earth & The Habitable Zone",
                speech: "Here is Earth, located inside the Goldilocks habitable zone where temperatures allow liquid water to cover seventy percent of the surface.",
                action: {
                    targetMesh: "earth",
                    highlightColor: "#3b82f6",
                    cameraPosition: [3.2, 0.8, 2.5],
                    cameraTarget: [2.9, 0, 0],
                    animation: "orbit",
                    zoom: 1.7,
                    explode: 0.2
                }
            }
        ]
    }
];
