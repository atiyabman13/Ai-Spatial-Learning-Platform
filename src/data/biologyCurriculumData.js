/**
 * Biology Curriculum Data for Classes 6–12
 * 
 * Curriculum Basis:
 * General secondary & higher-secondary school biology progression (Classes 6–12).
 * Note: Designed as an educational foundation; refer to specific national/state
 * boards (CBSE, ICSE, State Boards, NGSS) for formal examination specifications.
 * 
 * Medical & Scientific Disclaimer:
 * Educational learning material only. Not intended for clinical or diagnostic medical use.
 */

export const BIOLOGY_MODULES = [
    {
        id: "module-1",
        number: 1,
        title: "Human Anatomy and Physiology",
        description: "Gross structural organization of the human body, circulatory chambers, neural pathways, sensory organs, and the skeletal framework.",
        icon: "🫀",
        badgeColor: "#f43f5e",
        gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.05))",
        borderColor: "rgba(244, 63, 94, 0.35)",
        recommendedGrades: "Classes 7–12",
        topicsCount: 6
    },
    {
        id: "module-2",
        number: 2,
        title: "Cell Biology",
        description: "The fundamental unit of life, eukaryotic plant and animal cells, organelle ultrastructure, membrane transport, and cell division.",
        icon: "🔬",
        badgeColor: "#10b981",
        gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))",
        borderColor: "rgba(16, 185, 129, 0.35)",
        recommendedGrades: "Classes 6–11",
        topicsCount: 5
    },
    {
        id: "module-3",
        number: 3,
        title: "Genetics and DNA",
        description: "Molecular genetics, double helix structure, Mendelian inheritance, chromosomal theory, and protein synthesis.",
        icon: "🧬",
        badgeColor: "#8b5cf6",
        gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.05))",
        borderColor: "rgba(139, 92, 246, 0.35)",
        recommendedGrades: "Classes 8–12",
        topicsCount: 4
    },
    {
        id: "module-4",
        number: 4,
        title: "Human Physiology",
        description: "Systemic coordination, alveolar gas exchange, enzymatic nutrient absorption, cardiovascular hemodynamics, and endocrine homeostasis.",
        icon: "⚡",
        badgeColor: "#06b6d4",
        gradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 116, 144, 0.05))",
        borderColor: "rgba(6, 182, 212, 0.35)",
        recommendedGrades: "Classes 8–12",
        topicsCount: 5
    },
    {
        id: "module-5",
        number: 5,
        title: "Botany",
        description: "Plant morphology, xylem/phloem vascular conduction, photosynthetic photon capture in chloroplasts, and angiosperm reproduction.",
        icon: "🌿",
        badgeColor: "#22c55e",
        gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.05))",
        borderColor: "rgba(34, 197, 94, 0.35)",
        recommendedGrades: "Classes 6–11",
        topicsCount: 6
    }
];

export const BIOLOGY_CHAPTERS = [
    // -------------------------------------------------------------
    // MODULE 1: HUMAN ANATOMY AND PHYSIOLOGY
    // -------------------------------------------------------------
    {
        id: "bio-heart-circ",
        moduleId: "module-1",
        moduleName: "Human Anatomy and Physiology",
        title: "Heart and Cardiovascular Circulation",
        gradeRange: "Classes 7–11",
        targetGrades: [7, 8, 9, 10, 11],
        estimatedTime: "18 mins",
        modelName: "Heart",
        interactive3D: true,
        summaryIcon: "🫀",
        overview: "The human heart is a hollow muscular double pump that beats over 100,000 times a day to propel oxygen-rich blood through systemic arteries and deoxygenated blood to the lungs.",
        learningObjectives: [
            "Identify the 4 internal cardiac chambers: right atrium, right ventricle, left atrium, and left ventricle.",
            "Trace the pulmonary and systemic double circulatory pathways.",
            "Explain how atrioventricular (tricuspid, mitral) and semilunar valves maintain unidirectional forward flow.",
            "Understand the intrinsic pacemaker rhythmicity generated at the Sinoatrial (SA) node."
        ],
        explanation: `### 1. Structural Architecture of the 4 Cardiac Chambers
The mammalian heart is divided into four distinct chambers:
- **Right Atrium (RA)**: Receives low-oxygen venous blood returning from the upper body through the Superior Vena Cava (SVC) and lower body via the Inferior Vena Cava (IVC).
- **Right Ventricle (RV)**: Pumps blood through the pulmonary valve into the pulmonary trunk heading toward the left and right lungs.
- **Left Atrium (LA)**: Receives newly oxygenated blood arriving from pulmonary capillaries via four pulmonary veins.
- **Left Ventricle (LV)**: Possesses a significantly thicker myocardium wall (about 3 times thicker than the RV) because it must overcome systemic vascular resistance to distribute blood throughout the body via the Aorta (~120 mmHg systolic pressure).

### 2. Dual Circuit Blood Flow
Human circulation is a **Double Circulation** system:
1. **Pulmonary Circuit**: Right Ventricle $\\rightarrow$ Pulmonary Arteries $\\rightarrow$ Alveolar Capillaries (Oxygenation & $CO_2$ unloading) $\\rightarrow$ Pulmonary Veins $\\rightarrow$ Left Atrium.
2. **Systemic Circuit**: Left Ventricle $\\rightarrow$ Aorta $\\rightarrow$ Systemic Arteries & Capillaries (Tissue Oxygen delivery) $\\rightarrow$ Vena Cava $\\rightarrow$ Right Atrium.

### 3. Valvular Mechanics
Cardiac valves ensure that blood moves strictly forwards without regurgitation:
- **Tricuspid & Bicuspid (Mitral) Valves**: Positioned between atria and ventricles, anchored by *chordae tendineae* to papillary muscles.
- **Aortic & Pulmonary Semilunar Valves**: Pocket-like cusps that catch back-surging blood during ventricular diastole, snapping shut with the familiar 'dub' heart sound.`,
        terms: [
            { term: "Myocardium", definition: "The thick middle muscular layer of the heart wall responsible for pumping contractions." },
            { term: "Aorta", definition: "The largest systemic artery in the human body, originating directly from the left ventricle." },
            { term: "Systole", definition: "The phase of the cardiac cycle when the ventricles contract and eject blood into arteries." },
            { term: "Diastole", definition: "The phase of cardiac muscle relaxation during which the chambers refill with blood." },
            { term: "Sinoatrial (SA) Node", definition: "The natural cardiac pacemaker located near the superior vena cava entrance that sets resting rhythm (~72 bpm)." }
        ],
        summary: [
            "The heart consists of two receiving atria and two muscular pumping ventricles.",
            "The left ventricle is the thickest chamber due to systemic high-pressure demands.",
            "Double circulation prevents the mixing of oxygenated and deoxygenated blood.",
            "Valves enforce unidirectional flow and produce the classical 'lub-dub' heart sounds."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Venous Blood Return",
                "concept": "Systemic Deoxygenated Inflow",
                "targetStructure": "venacava",
                "explanation": "Deoxygenated blood returning from the upper body (head, arms) enters through the Superior Vena Cava, while lower-body blood enters via the Inferior Vena Cava into the right atrium.",
                "cameraPos": [
                        -0.6,
                        1.2,
                        3.2
                ],
                "slice": false,
                "explode": 0
        },
        {
                "step": 2,
                "title": "Right Atrium & Ventricle",
                "concept": "Pulmonary Inflow Chamber",
                "targetStructure": "ventricle_r",
                "explanation": "Venous blood passes from the thin-walled right atrium through the tricuspid valve into the right ventricle, preparing for ejection into the pulmonary circulation.",
                "cameraPos": [
                        0.6,
                        -0.2,
                        3.2
                ],
                "slice": true,
                "explode": 0
        },
        {
                "step": 3,
                "title": "Pulmonary Artery to Lungs",
                "concept": "Oxygenation Pathway",
                "targetStructure": "pulmonary",
                "explanation": "During ventricular systole, blood is pumped through the pulmonary semilunar valve into the pulmonary trunk, branching into left and right pulmonary arteries heading to the lungs.",
                "cameraPos": [
                        0.4,
                        0.9,
                        3
                ],
                "slice": false,
                "explode": 0
        },
        {
                "step": 4,
                "title": "Left Ventricle & Myocardium",
                "concept": "High-Pressure Systemic Pump",
                "targetStructure": "ventricle_l",
                "explanation": "Newly oxygenated blood arrives via pulmonary veins into the left atrium and enters the left ventricle. Its muscular myocardium wall is 3x thicker to overcome systemic arterial resistance.",
                "cameraPos": [
                        -0.7,
                        -0.6,
                        2.8
                ],
                "slice": true,
                "explode": 0
        },
        {
                "step": 5,
                "title": "Systemic Aorta Distribution",
                "concept": "Whole-Body Perfusion",
                "targetStructure": "aorta",
                "explanation": "With systolic force (~120 mmHg), the left ventricle expels oxygen-rich blood into the ascending Aorta, branching to the coronary arteries, carotid arteries, and systemic circulation.",
                "cameraPos": [
                        0.1,
                        1.4,
                        3.2
                ],
                "slice": false,
                "explode": 0
        }
],
        reviewQuestions: [
            {
                question: "Which heart chamber pumps oxygen-rich blood into the systemic aorta?",
                options: ["Right Atrium", "Right Ventricle", "Left Ventricle", "Left Atrium"],
                correctIndex: 2,
                explanation: "The Left Ventricle has the thickest muscular wall to pump oxygenated blood throughout the body via the aorta."
            },
            {
                question: "Blood returning to the right atrium from the upper body travels through which vessel?",
                options: ["Pulmonary Vein", "Superior Vena Cava", "Aorta", "Carotid Artery"],
                correctIndex: 1,
                explanation: "The Superior Vena Cava collects deoxygenated venous blood from the head, neck, and upper limbs into the right atrium."
            },
            {
                question: "What produces the first ('lub') heart sound?",
                options: ["Opening of the aorta", "Closure of atrioventricular (mitral and tricuspid) valves", "Relaxation of the ventricles", "Blood rushing into lungs"],
                correctIndex: 1,
                explanation: "The first heart sound (S1 or 'lub') is produced by the simultaneous closure of the AV valves at the start of ventricular systole."
            },
            {
                question: "Why is human circulation called 'double circulation'?",
                options: ["Blood passes through the heart twice in one complete circuit", "The heart has two valves", "Blood travels through two veins only", "Ventricles contract twice per minute"],
                correctIndex: 0,
                explanation: "Blood flows through the heart twice: once through the pulmonary circuit to the lungs, and once through the systemic circuit to the body."
            },
            {
                question: "What is the primary function of the Sinoatrial (SA) Node?",
                options: ["Filter metabolic waste", "Initiate electrical action potentials as the natural pacemaker", "Prevent backflow of arterial blood", "Digest blood proteins"],
                correctIndex: 1,
                explanation: "The SA Node acts as the physiological pacemaker, generating spontaneous electrical depolarizations that trigger heartbeats."
            }
        ],
        references: [
            "NCERT Class 10 Biology — Life Processes (Circulation in Human Beings)",
            "Guyton and Hall Textbook of Medical Physiology (14th Ed.), Cardiac Muscle and Dynamics"
        ]
    },
    {
        id: "bio-brain-nervous",
        moduleId: "module-1",
        moduleName: "Human Anatomy and Physiology",
        title: "Brain & Central Nervous System",
        gradeRange: "Classes 8–12",
        targetGrades: [8, 9, 10, 11, 12],
        estimatedTime: "20 mins",
        modelName: "Brain",
        interactive3D: true,
        summaryIcon: "🧠",
        overview: "The human brain contains roughly 86 billion neurons interconnected by trillions of synapses, controlling voluntary motor actions, sensory perception, and cognition.",
        learningObjectives: [
            "Differentiate between the Cerebrum, Cerebellum, and Brainstem.",
            "Identify the functional lobes of the cerebral cortex: Frontal, Parietal, Temporal, and Occipital.",
            "Understand reflex arcs and synaptic action potential transmission.",
            "Explain autonomic regulation of vital functions (heart rate, respiration) in the medulla oblongata."
        ],
        explanation: `### 1. Major Anatomical Divisions
The central nervous system (CNS) consists of the brain and spinal cord protected by meninges and cerebrospinal fluid (CSF):
- **Forebrain (Cerebrum)**: The largest part, divided into left and right hemispheres joined by the *corpus callosum*. It governs conscious thought, memory, reasoning, and speech.
- **Midbrain**: Relays auditory and visual reflexes and coordinates rapid eye and head tracking.
- **Hindbrain (Cerebellum & Brainstem)**:
  - *Cerebellum* ('little brain'): Modulates muscle tone, precise motor coordination, posture, and balance.
  - *Pons & Medulla Oblongata*: Houses autonomous centers regulating cardiovascular heart rate, respiratory rhythm, vomiting, and swallowing.

### 2. The Four Cerebral Lobes
- **Frontal Lobe**: Prefrontal executive planning, decision making, voluntary motor initiation (primary motor cortex), and motor speech (Broca's area).
- **Parietal Lobe**: Somatosensory processing (touch, pressure, temperature, pain, and spatial orientation).
- **Temporal Lobe**: Auditory perception, speech comprehension (Wernicke's area), and memory consolidation (hippocampus).
- **Occipital Lobe**: Visual cortex processing shape, color, motion, and retinal signal reconstruction.`,
        terms: [
            { term: "Neuron", definition: "Specialized excitable cell that transmits electrical impulses via dendrites, axon, and synaptic terminals." },
            { term: "Synapse", definition: "Microscopic functional junction where an action potential triggers neurotransmitter release to stimulate an adjacent cell." },
            { term: "Cerebellum", definition: "Hindbrain structure located beneath the occipital lobes responsible for motor balance and coordinated movement." },
            { term: "Medulla Oblongata", definition: "Lower brainstem segment regulating involuntary autonomic functions such as breathing and cardiac rate." }
        ],
        summary: [
            "The brain is divided into Cerebrum, Cerebellum, and Brainstem.",
            "The cerebral cortex contains Frontal, Parietal, Temporal, and Occipital functional lobes.",
            "The cerebellum orchestrates fine balance and movement synchronization.",
            "Vital autonomic survival reflexes are managed in the medulla oblongata."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Frontal Lobe & Motor Cortex",
                "concept": "Executive Decisions & Voluntary Motion",
                "targetStructure": "frontal-left",
                "explanation": "The frontal lobes govern conscious cognitive functions, future planning, executive decisions, emotional regulation, and voluntary motor output via the primary motor strip.",
                "cameraPos": [
                        0,
                        0.8,
                        3.4
                ],
                "explode": 0.15
        },
        {
                "step": 2,
                "title": "Parietal Lobe Somatosensation",
                "concept": "Sensory Integration & Touch",
                "targetStructure": "parietal-left",
                "explanation": "The parietal cortex interprets touch, temperature, pressure, pain, and proprioception (body spatial orientation), mapping sensory signals onto the somatic homunculus.",
                "cameraPos": [
                        -0.8,
                        0.8,
                        2.8
                ],
                "explode": 0.2
        },
        {
                "step": 3,
                "title": "Temporal Lobe & Memory",
                "concept": "Auditory Processing & Hippocampus",
                "targetStructure": "temporal-left",
                "explanation": "Located along lateral cerebral hemispheres, temporal lobes decode auditory pitch, speech comprehension (Wernicke's area), and coordinate long-term memory formation.",
                "cameraPos": [
                        -1.4,
                        0.1,
                        2.6
                ],
                "explode": 0.2
        },
        {
                "step": 4,
                "title": "Occipital Lobe Vision Center",
                "concept": "Retinal Image Reconstruction",
                "targetStructure": "occipital",
                "explanation": "Positioned at the posterior cranial pole, the visual cortex in the occipital lobe processes color, motion, depth, and spatial forms received from the optic nerves.",
                "cameraPos": [
                        0,
                        0.4,
                        -3.2
                ],
                "explode": 0.25
        },
        {
                "step": 5,
                "title": "Cerebellum & Brainstem",
                "concept": "Motor Balance & Autonomic Rhythms",
                "targetStructure": "cerebellum",
                "explanation": "The cerebellum coordinates fine-motor precision and balance, while the brainstem (medulla oblongata) maintains involuntary cardiovascular and respiratory survival reflexes.",
                "cameraPos": [
                        0,
                        -1,
                        -2.8
                ],
                "explode": 0.3
        }
],
        reviewQuestions: [
            {
                question: "Which lobe of the cerebral cortex is primarily dedicated to vision?",
                options: ["Frontal Lobe", "Parietal Lobe", "Occipital Lobe", "Temporal Lobe"],
                correctIndex: 2,
                explanation: "The Occipital Lobe at the posterior pole of the brain houses the primary visual cortex."
            },
            {
                question: "A person has difficulty balancing while walking on a tightrope. Which brain area coordinates this balance?",
                options: ["Cerebellum", "Hypothalamus", "Occipital Lobe", "Corpus Callosum"],
                correctIndex: 0,
                explanation: "The Cerebellum coordinates muscle tone, posture, and motor balance."
            },
            {
                question: "Which brainstem structure regulates involuntary breathing and heart rate?",
                options: ["Frontal Lobe", "Medulla Oblongata", "Thalamus", "Temporal Lobe"],
                correctIndex: 1,
                explanation: "The Medulla Oblongata contains autonomous cardiovascular and respiratory rhythm centers."
            },
            {
                question: "What structure connects the left and right cerebral hemispheres?",
                options: ["Brainstem", "Corpus Callosum", "Spinal Cord", "Optic Chiasm"],
                correctIndex: 1,
                explanation: "The Corpus Callosum is a thick C-shaped band of nerve fibers connecting both cerebral hemispheres."
            },
            {
                question: "Which lobe contains the motor cortex and coordinates voluntary decision making?",
                options: ["Temporal", "Frontal", "Parietal", "Occipital"],
                correctIndex: 1,
                explanation: "The Frontal Lobe manages executive reasoning, personality, and voluntary motor planning."
            }
        ],
        references: [
            "NCERT Class 10 Biology — Control and Coordination",
            "Kandel et al., Principles of Neural Science (6th Ed.)"
        ]
    },
    {
        id: "bio-eye-vision",
        moduleId: "module-1",
        moduleName: "Human Anatomy and Physiology",
        title: "Eye and Optical Vision",
        gradeRange: "Classes 7–10",
        targetGrades: [7, 8, 9, 10],
        estimatedTime: "15 mins",
        modelName: "Eye",
        interactive3D: true,
        summaryIcon: "👁️",
        overview: "The human eye functions like an organic biological camera, focusing refracted light through the cornea and lens onto photoreceptor cells on the retina.",
        learningObjectives: [
            "Trace the optical path of light through cornea, aqueous humor, pupil, lens, and vitreous humor.",
            "Understand accommodation of the crystalline lens via ciliary muscles.",
            "Compare Rods (scotopic night vision) and Cones (photopic color vision).",
            "Explain common refractive defects: Myopia and Hypermetropia."
        ],
        explanation: `### 1. Optical Components of the Eye
- **Cornea**: Clear, curved anterior window providing ~70% of total light refraction.
- **Iris & Pupil**: The pigmented iris controls the diameter of the pupil aperture to regulate illumination entering the eye.
- **Crystalline Biconvex Lens**: Adjusts focal length via ciliary muscle contraction (accommodation) to focus objects at varying distances onto the retina.
- **Vitreous Body**: Gel-like transparent mass maintaining intraocular spherical shape.

### 2. The Retina: Biological Photodetector
The sensory layer lining the interior posterior globe contains millions of photoreceptors:
- **Rods (~120 million)**: Extremely sensitive to dim light; govern black-and-white night vision (scotopic).
- **Cones (~6 million)**: Concentrated at the central *fovea centralis*; provide high-acuity color vision across red, green, and blue wavelengths.
- **Optic Nerve**: Bundles retinal ganglion cell axons sending electrochemical signals to the visual cortex.`,
        terms: [
            { term: "Retina", definition: "The light-sensitive inner coat of the eye housing rod and cone photoreceptors." },
            { term: "Cornea", definition: "The transparent front surface of the eye responsible for the initial refraction of light." },
            { term: "Accommodation", definition: "The ability of the ciliary muscles to alter lens curvature to focus on near vs distant objects." },
            { term: "Fovea", definition: "A tiny central pit in the retina with the densest concentration of cones, responsible for sharpest visual acuity." }
        ],
        summary: [
            "The cornea and lens refract incoming light rays onto the retina.",
            "Pupil diameter changes dynamically to modulate light intake.",
            "Rods detect low light and motion; cones enable color vision in bright light.",
            "Visual impulses travel along the optic nerve to the occipital lobe."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Cornea & Anterior Refraction",
                "concept": "Primary Optical Interface",
                "targetStructure": "cornea",
                "explanation": "The clear, domed cornea provides roughly 70% of the eye's total optical focusing power as light enters from the external environment.",
                "cameraPos": [
                        0,
                        0,
                        3.2
                ],
                "explode": 0.15
        },
        {
                "step": 2,
                "title": "Iris & Pupillary Aperture",
                "concept": "Illumination Regulation",
                "targetStructure": "iris",
                "explanation": "Smooth sphincter and dilator muscles within the pigmented iris contract or expand the pupil to regulate the precise amount of light entering the inner eye.",
                "cameraPos": [
                        0,
                        0,
                        2.6
                ],
                "explode": 0.2
        },
        {
                "step": 3,
                "title": "Crystalline Lens Accommodation",
                "concept": "Dynamic Focal Tuning",
                "targetStructure": "lens",
                "explanation": "Suspended by zonular fibers attached to ciliary muscles, the flexible biconvex crystalline lens changes curvature (accommodation) to sharply focus near vs far objects.",
                "cameraPos": [
                        0,
                        0,
                        2.2
                ],
                "explode": 0.3
        },
        {
                "step": 4,
                "title": "Retina & Photoreceptors",
                "concept": "Phototransduction",
                "targetStructure": "retina",
                "explanation": "The photosensitive posterior inner layer contains ~120 million dim-light rods and ~6 million high-acuity color cones that convert photons into electrical neural impulses.",
                "cameraPos": [
                        0.6,
                        0.4,
                        1.8
                ],
                "explode": 0.45
        },
        {
                "step": 5,
                "title": "Optic Nerve Transmission",
                "concept": "CNS Signal Conduction",
                "targetStructure": "optic-nerve",
                "explanation": "Axons from retinal ganglion cells converge at the optic disc to form the optic nerve, transmitting visual information across the optic chiasm to the occipital cortex.",
                "cameraPos": [
                        0,
                        0,
                        -3.2
                ],
                "explode": 0.5
        }
],
        reviewQuestions: [
            {
                question: "Which photoreceptor cell type is responsible for color vision in bright light?",
                options: ["Rods", "Cones", "Ganglion cells", "Ciliary bodies"],
                correctIndex: 1,
                explanation: "Cones provide sharp color perception under photopic (bright light) conditions."
            },
            {
                question: "What happens to the ciliary muscles when viewing a nearby object?",
                options: ["They contract, making the lens thicker and more convex", "They relax, making the lens thin", "They detach from the lens", "They change the pupil color"],
                correctIndex: 0,
                explanation: "During accommodation for near vision, ciliary muscles contract, relaxing suspensory ligaments so the elastic lens bulges thicker."
            },
            {
                question: "Where is visual acuity sharpest on the retina?",
                options: ["Optic disc (blind spot)", "Fovea centralis", "Cornea", "Sclera"],
                correctIndex: 1,
                explanation: "The fovea centralis contains the highest density of cone cells without overlying nerve layers, maximizing resolution."
            },
            {
                question: "Why is there a blind spot in each human eye?",
                options: ["It lacks blood supply", "It is where the optic nerve exits and has no photoreceptor rods or cones", "The lens cannot focus light there", "It is damaged by sunlight"],
                correctIndex: 1,
                explanation: "The optic disc contains no rods or cones because nerve fibers exit the globe toward the brain."
            },
            {
                question: "What is the primary role of the pigmented Iris?",
                options: ["Focus light rays", "Control pupil size to regulate light entering the eye", "Detect color wavelengths", "Produce aqueous humor"],
                correctIndex: 1,
                explanation: "The iris acts like an optical diaphragm, constricting or dilating the pupil in response to ambient lighting."
            }
        ],
        references: [
            "NCERT Class 10 Physics & Biology — The Human Eye and the Colourful World",
            "Adler's Physiology of the Eye (Clinical Application)"
        ]
    },
    {
        id: "bio-skeleton-joints",
        moduleId: "module-1",
        moduleName: "Human Anatomy and Physiology",
        title: "Skeleton, Bones and Articular Joints",
        gradeRange: "Classes 6–9",
        targetGrades: [6, 7, 8, 9],
        estimatedTime: "15 mins",
        modelName: "Skeleton",
        interactive3D: true,
        summaryIcon: "🦴",
        overview: "The human skeletal system comprises 206 bones in adults, providing structural support, internal organ protection, red blood cell hematopoiesis, and mineral storage.",
        learningObjectives: [
            "Differentiate between the Axial Skeleton and Appendicular Skeleton.",
            "Classify joint types: Synovial (Ball-and-socket, Hinge, Pivot) vs Fibrous sutures.",
            "Understand bone composition: Calcium phosphate mineral matrix and collagen fibers.",
            "Describe the roles of ligaments (bone-to-bone) and tendons (muscle-to-bone)."
        ],
        explanation: `### 1. Axial vs Appendicular Framework
The 206 adult bones form two major functional divisions:
- **Axial Skeleton (80 bones)**: Forms the central longitudinal axis protecting vital organs:
  - *Cranium & Facial Bones*: Encase and shield the fragile brain.
  - *Vertebral Column (33 vertebrae)*: Protects the spinal cord and absorbs walking shock.
  - *Thoracic Rib Cage (12 pairs)*: Shields heart and lungs while expanding during respiration.
- **Appendicular Skeleton (126 bones)**: Enables locomotion and manipulation:
  - *Pectoral Girdle & Upper Limbs*: Clavicle, Scapula, Humerus, Radius, Ulna, Carpals, Phalanges.
  - *Pelvic Girdle & Lower Limbs*: Coxal bones, Femur (longest and strongest bone), Patella, Tibia, Fibula, Tarsals.

### 2. Articular Joints
- **Ball-and-Socket Joint**: Permits omnidirectional rotational movement (Shoulder and Hip joints).
- **Hinge Joint**: Permits unidirectional back-and-forth movement like a door hinge (Elbow and Knee).
- **Pivot Joint**: Permits cylindrical axial rotation (Atlas and Axis vertebrae at neck base).
- **Fixed/Suture Joints**: Immovable fibrous joints locking cranial skull bones.`,
        terms: [
            { term: "Femur", definition: "The thigh bone, which is the longest, heaviest, and strongest bone in the human body." },
            { term: "Ligament", definition: "Tough fibrous connective tissue band that connects bone to bone across a joint." },
            { term: "Tendon", definition: "Inelastic cord of strong collagenous tissue connecting muscle to bone." },
            { term: "Synovial Fluid", definition: "Viscous lubricating fluid secreted inside joint cavities to reduce frictional wear." }
        ],
        summary: [
            "The adult human skeleton comprises 206 bones divided into axial and appendicular systems.",
            "The axial skeleton protects central organs; the appendicular facilitates movement.",
            "Synovial joints provide frictionless motion lubricated by synovial fluid.",
            "Ligaments join bone to bone; tendons anchor muscle to bone."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Cranium & Axial Shield",
                "concept": "Brain Protection & Facial Scaffold",
                "targetStructure": "skull",
                "explanation": "The 8 fused cranial bones form a rigid protective vault for the brain, joined by immovable fibrous sutures.",
                "cameraPos": [
                        0,
                        1.5,
                        3.2
                ],
                "explode": 0.15
        },
        {
                "step": 2,
                "title": "Vertebral Column & Neck",
                "concept": "Axial Support & Spinal Canal",
                "targetStructure": "cervical-spine",
                "explanation": "Stacked cervical, thoracic, and lumbar vertebrae with fibrocartilaginous discs distribute body weight while shielding the central spinal cord.",
                "cameraPos": [
                        0,
                        0.8,
                        2.6
                ],
                "explode": 0.2
        },
        {
                "step": 3,
                "title": "Thoracic Ribcage & Sternum",
                "concept": "Cardiorespiratory Shielding",
                "targetStructure": "ribcage",
                "explanation": "12 pairs of curved ribs attach posteriorly to thoracic vertebrae and anteriorly to the sternum, expanding during breathing and guarding the heart and lungs.",
                "cameraPos": [
                        0,
                        0.1,
                        2.8
                ],
                "explode": 0.25
        },
        {
                "step": 4,
                "title": "Pelvic Girdle",
                "concept": "Weight Transmission",
                "targetStructure": "pelvis",
                "explanation": "A sturdy bony basin formed by fused ilium, ischium, and pubis bones that anchors lower limbs and transmits weight to the legs.",
                "cameraPos": [
                        0,
                        -0.8,
                        2.8
                ],
                "explode": 0.2
        },
        {
                "step": 5,
                "title": "Appendicular Limbs & Joints",
                "concept": "Locomotion & Synovial Mobility",
                "targetStructure": "left-femur",
                "explanation": "The femur is the body's strongest long bone, articulating at the hip via a multidirectional ball-and-socket joint and at the knee via a hinge joint.",
                "cameraPos": [
                        -0.6,
                        -1.5,
                        2.6
                ],
                "explode": 0.3
        }
],
        reviewQuestions: [
            {
                question: "What is the longest and strongest bone in the human skeleton?",
                options: ["Tibia", "Humerus", "Femur", "Radius"],
                correctIndex: 2,
                explanation: "The Femur (thigh bone) is the longest, heaviest, and strongest bone in the human body."
            },
            {
                question: "What type of joint is present in the human shoulder and hip?",
                options: ["Hinge joint", "Ball-and-socket joint", "Fixed suture joint", "Gliding joint"],
                correctIndex: 1,
                explanation: "Ball-and-socket joints allow 360-degree rotational mobility in multiple planes."
            },
            {
                question: "Which tissue connects bone to bone across an articular joint?",
                options: ["Tendon", "Ligament", "Cartilage alone", "Adipose tissue"],
                correctIndex: 1,
                explanation: "Ligaments connect bone to bone; tendons connect muscles to bones."
            },
            {
                question: "How many pairs of ribs make up the human rib cage?",
                options: ["10 pairs", "12 pairs", "14 pairs", "8 pairs"],
                correctIndex: 1,
                explanation: "The human thoracic cage contains 12 pairs of ribs (true, false, and floating ribs)."
            },
            {
                question: "Which of the following is an immovable (fixed) fibrous joint?",
                options: ["Knee joint", "Cranial skull sutures", "Elbow joint", "Ankle joint"],
                correctIndex: 1,
                explanation: "Cranial sutures between skull bones are fibrous, immovable joints designed for maximum brain protection."
            }
        ],
        references: [
            "NCERT Class 6 Science — Body Movements",
            "NCERT Class 11 Biology — Locomotion and Movement"
        ]
    },

    // -------------------------------------------------------------
    // MODULE 2: CELL BIOLOGY
    // -------------------------------------------------------------
    {
        id: "bio-cell-structure",
        moduleId: "module-2",
        moduleName: "Cell Biology",
        title: "Plant & Animal Cells: Organelle Ultrastructure",
        gradeRange: "Classes 6–10",
        targetGrades: [6, 7, 8, 9, 10],
        estimatedTime: "18 mins",
        modelName: "PlantCell",
        interactive3D: true,
        summaryIcon: "🌿",
        overview: "All living organisms are composed of microscopic units called cells. Eukaryotic plant and animal cells share common metabolic organelles while retaining specialized structural adaptations.",
        learningObjectives: [
            "Distinguish between prokaryotic and eukaryotic cellular compartmentalization.",
            "Compare plant vs animal cells (cell wall, central vacuole, and plastids).",
            "Explain the functions of the Nucleus, Mitochondria, Endoplasmic Reticulum, and Golgi apparatus.",
            "Understand selective permeability in the fluid mosaic cell membrane."
        ],
        explanation: `### 1. Cellular Compartmentalization
All eukaryotic cells contain membrane-bound organelles suspended in cytoplasm:
- **Plasma Membrane**: Phospholipid bilayer with embedded proteins controlling selective transport into and out of the cell.
- **Nucleus**: The command center bounded by a double nuclear envelope with pores, housing chromatin DNA and the nucleolus (ribosome assembly).
- **Mitochondria**: 'Powerhouses of the cell' where aerobic cellular respiration generates adenosine triphosphate (ATP) molecules across folded inner cristae.
- **Endoplasmic Reticulum (ER)**:
  - *Rough ER*: Studded with ribosomes; synthesizes and folds transmembrane and secretory proteins.
  - *Smooth ER*: Lacks ribosomes; synthesizes lipids and detoxifies metabolic byproducts.
- **Golgi Apparatus**: Flattened cisternae that modify, sort, and package proteins into secretory vesicles.

### 2. Plant Cell vs Animal Cell Distinctions
- **Cell Wall**: Plants possess a rigid outer cellulose wall preventing osmotic lysis and maintaining vertical turgor pressure. Animal cells lack a cell wall.
- **Large Central Vacuole**: Plant cells contain a single prominent vacuole storing water, ions, and waste; animal cells have smaller, transient vacuoles.
- **Chloroplasts**: Plant cells carry green chloroplasts filled with chlorophyll pigments for solar photosynthesis; animal cells do not.`,
        terms: [
            { term: "ATP", definition: "Adenosine Triphosphate, the universal chemical energy currency of cellular metabolism." },
            { term: "Chloroplast", definition: "Double-membraned plant organelle containing thylakoids where photosynthesis occurs." },
            { term: "Mitochondria", definition: "Organelle that executes the citric acid cycle and oxidative phosphorylation to produce ATP." },
            { term: "Turgor Pressure", definition: "Internal hydrostatic pressure pushing the plant cell membrane against its rigid cell wall." }
        ],
        summary: [
            "Cells are the structural and functional building blocks of all living organisms.",
            "The nucleus safeguards genetic DNA and directs cellular protein synthesis.",
            "Plant cells are distinguished by a rigid cellulose wall, central vacuole, and chloroplasts.",
            "Mitochondria convert glucose into cellular ATP energy via aerobic respiration."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Cell Wall & Plasma Membrane",
                "concept": "Structural Rigidity & Permeability",
                "targetStructure": "cell_wall",
                "explanation": "The outer cellulose cell wall resists osmotic lysis and provides mechanical turgor support, while the inner lipid bilayer regulates selective ion transport.",
                "cameraPos": [
                        0,
                        0,
                        3.6
                ],
                "explode": 0.1
        },
        {
                "step": 2,
                "title": "Nucleus & Genetic Program",
                "concept": "Transcriptional Control Center",
                "targetStructure": "nucleus",
                "explanation": "Enclosed by a double membrane with nuclear pores, the nucleus houses linear chromosomal DNA and coordinates cellular division, growth, and protein synthesis.",
                "cameraPos": [
                        -0.6,
                        0.4,
                        2.8
                ],
                "explode": 0.25
        },
        {
                "step": 3,
                "title": "Large Central Vacuole",
                "concept": "Hydrostatic Turgor & Storage",
                "targetStructure": "vacuole",
                "explanation": "Occupies up to 90% of mature plant cell volume, storing water, enzymes, and pigments while generating internal hydrostatic pressure against the wall.",
                "cameraPos": [
                        0.6,
                        -0.2,
                        2.8
                ],
                "explode": 0.25
        },
        {
                "step": 4,
                "title": "Chloroplasts (Photosynthesis)",
                "concept": "Solar Energy Transduction",
                "targetStructure": "chloroplast",
                "explanation": "Double-membrane plastids containing green chlorophyll pigment arranged in thylakoid stacks (grana) where light reactions synthesize ATP and glucose.",
                "cameraPos": [
                        -0.8,
                        -0.6,
                        2.6
                ],
                "explode": 0.35
        },
        {
                "step": 5,
                "title": "Mitochondria (Cellular Powerhouse)",
                "concept": "Aerobic Respiration & ATP",
                "targetStructure": "mitochondria",
                "explanation": "Mitochondria break down carbohydrates via the Krebs cycle and oxidative phosphorylation across cristae to generate cellular ATP energy.",
                "cameraPos": [
                        0.4,
                        0.8,
                        2.6
                ],
                "explode": 0.35
        }
],
        reviewQuestions: [
            {
                question: "Which organelle is universally referred to as the 'powerhouse of the cell'?",
                options: ["Ribosome", "Mitochondrion", "Golgi body", "Vacuole"],
                correctIndex: 1,
                explanation: "Mitochondria produce the majority of cellular energy in the form of ATP molecules."
            },
            {
                question: "Which structure is present in plant cells but absent in animal cells?",
                options: ["Cell Membrane", "Cellulose Cell Wall", "Mitochondria", "Nucleus"],
                correctIndex: 1,
                explanation: "Animal cells have a flexible plasma membrane but lack a rigid cellulose cell wall."
            },
            {
                question: "What is the primary function of the green Chloroplasts in plant cells?",
                options: ["Cellular respiration", "Photosynthesis to synthesize glucose", "Protein synthesis", "Lipid digestion"],
                correctIndex: 1,
                explanation: "Chloroplasts contain chlorophyll that absorbs sunlight to drive the photosynthetic conversion of CO2 and water into glucose."
            },
            {
                question: "Where in the cell are ribosomal subunits and chromatin DNA located?",
                options: ["Lysosome", "Nucleus", "Vacuole", "Centrosome"],
                correctIndex: 1,
                explanation: "The Nucleus houses genetic DNA and the nucleolus where ribosome assembly begins."
            },
            {
                question: "What organelle is studded with ribosomes and folds secretory proteins?",
                options: ["Smooth Endoplasmic Reticulum", "Rough Endoplasmic Reticulum", "Mitochondria", "Cell Wall"],
                correctIndex: 1,
                explanation: "The Rough Endoplasmic Reticulum (RER) is coated with protein-synthesizing ribosomes."
            }
        ],
        references: [
            "NCERT Class 9 Science — Chapter 5: The Fundamental Unit of Life",
            "Campbell Biology (12th Ed.), Unit 2: The Cell"
        ]
    },
    {
        id: "bio-cell-division",
        moduleId: "module-2",
        moduleName: "Cell Biology",
        title: "Cell Division: Mitosis vs Meiosis",
        gradeRange: "Classes 8–11",
        targetGrades: [8, 9, 10, 11],
        estimatedTime: "16 mins",
        modelName: "Mitosis",
        interactive3D: false,
        summaryIcon: "➗",
        overview: "Growth, tissue repair, and sexual reproduction rely on strictly regulated nuclear cell division cycles: equational Mitosis and reductional Meiosis.",
        learningObjectives: [
            "Understand the phases of Mitosis: Prophase, Metaphase, Anaphase, and Telophase.",
            "Compare diploid somatic cells (2n) with haploid gametes (n).",
            "Explain how Meiosis produces genetic diversity via crossing over (chiasmata).",
            "Recognize the consequences of unregulated cell division (cancer)."
        ],
        explanation: `### 1. Mitosis: Equational Division for Growth
In somatic body cells, mitosis duplicates one diploid (2n) mother cell into two genetically identical diploid daughter cells:
1. **Prophase**: Chromatin condenses into visible sister chromatids; nuclear envelope breaks down; mitotic spindle begins to form.
2. **Metaphase**: Chromosomes align along the central equatorial *metaphase plate*, anchored by kinetochore spindle microtubules.
3. **Anaphase**: Centromeres cleave; sister chromatids are pulled apart toward opposite cellular poles.
4. **Telophase & Cytokinesis**: Nuclear membranes reassemble around two distinct daughter nuclei; cleavage furrow (animals) or cell plate (plants) pinches cytoplasm.

### 2. Meiosis: Reductional Division for Reproduction
Occurs in specialized germline cells to produce haploid (n) sperm and egg gametes:
- **Meiosis I**: Homologous chromosome pairs undergo **crossing over** during prophase I, swapping alleles to generate genetic variation, then separate.
- **Meiosis II**: Sister chromatids separate, resulting in **4 non-identical haploid gametes**.`,
        terms: [
            { term: "Mitosis", definition: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus." },
            { term: "Meiosis", definition: "A two-step reductional cell division in sexually reproducing organisms producing four genetically diverse haploid daughter cells." },
            { term: "Diploid (2n)", definition: "A cell containing two complete sets of chromosomes, one from each biological parent." },
            { term: "Haploid (n)", definition: "A cell carrying a single set of unpaired chromosomes, characteristic of mature sperm and egg cells." }
        ],
        summary: [
            "Mitosis yields 2 genetically identical diploid daughter cells for body growth and repair.",
            "Meiosis produces 4 genetically unique haploid gametes for sexual reproduction.",
            "Crossing over during prophase I of meiosis introduces genetic variation in offspring.",
            "Failure to regulate cell division checkpoints can result in uncontrolled tumor growth."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Prophase: Chromatin Condensation",
                "concept": "Visible Chromosome Assembly",
                "targetStructure": "chromatids",
                "explanation": "Chromatin threads condense into visible X-shaped sister chromatids joined at central centromeres; the nucleolus disappears and the mitotic spindle forms.",
                "cameraPos": [
                        0,
                        0,
                        3.4
                ],
                "explode": 0.1
        },
        {
                "step": 2,
                "title": "Centrosomes & Aster Poles",
                "concept": "Spindle Organization",
                "targetStructure": "centrosomes",
                "explanation": "Dual centrosomes migrate to opposing cellular poles, polymerizing tubulin into radial aster microtubules that anchor the mechanical spindle apparatus.",
                "cameraPos": [
                        0,
                        1.4,
                        3.2
                ],
                "explode": 0.2
        },
        {
                "step": 3,
                "title": "Metaphase: Equatorial Alignment",
                "concept": "Metaphase Plate Balance",
                "targetStructure": "spindles",
                "explanation": "Kinetochore microtubules attach to chromatid centromeres, tugging them until all chromosomes align precisely along the cellular equator (metaphase plate).",
                "cameraPos": [
                        0,
                        0,
                        3
                ],
                "explode": 0.25
        },
        {
                "step": 4,
                "title": "Anaphase: Chromatid Segregation",
                "concept": "Equational Disjunction",
                "targetStructure": "chromatids",
                "explanation": "Centromeres divide and kinetochore fibers rapidly depolymerize, pulling identical daughter chromosomes toward opposite centrosome poles.",
                "cameraPos": [
                        0,
                        0,
                        3.2
                ],
                "explode": 0.55
        },
        {
                "step": 5,
                "title": "Telophase & Cytokinesis",
                "concept": "Cleavage Furrow Division",
                "targetStructure": "membrane",
                "explanation": "A contractile ring of actin microfilaments pinches the plasma membrane along the cleavage furrow, partitioning the cytoplasm into two identical diploid daughter cells.",
                "cameraPos": [
                        0,
                        0,
                        3.5
                ],
                "explode": 0.7
        }
],
        reviewQuestions: [
            {
                question: "How many daughter cells are produced at the end of complete Meiosis?",
                options: ["2 identical diploid cells", "4 diverse haploid cells", "1 large egg cell", "8 somatic cells"],
                correctIndex: 1,
                explanation: "Meiosis entails two consecutive division rounds yielding 4 non-identical haploid (n) cells."
            },
            {
                question: "During which mitotic phase do sister chromatids pull apart toward opposite poles?",
                options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
                correctIndex: 2,
                explanation: "During Anaphase, centromeres split and sister chromatids separate to opposite spindle poles."
            },
            {
                question: "Why is crossing over in Meiosis I biologically significant?",
                options: ["It destroys mutated DNA", "It creates novel genetic combinations among offspring", "It doubles the chromosome number", "It stops cell division"],
                correctIndex: 1,
                explanation: "Crossing over exchanges homologous genetic segments, generating genetic diversity."
            },
            {
                question: "In plant cells, cytokinesis occurs through the formation of what structure?",
                options: ["Cleavage furrow", "Cell plate", "Centrosome", "Nuclear pore"],
                correctIndex: 1,
                explanation: "Plant cells build a central cell plate from Golgi vesicles because the rigid wall cannot pinch inward."
            },
            {
                question: "If a human skin cell with 46 chromosomes divides by mitosis, how many chromosomes will each daughter cell possess?",
                options: ["23", "46", "92", "12"],
                correctIndex: 1,
                explanation: "Mitosis is an equational division; each daughter cell receives an identical diploid complement of 46 chromosomes."
            }
        ],
        references: [
            "NCERT Class 11 Biology — Cell Cycle and Cell Division",
            "Alberts et al., Molecular Biology of the Cell (6th Ed.)"
        ]
    },

    // -------------------------------------------------------------
    // MODULE 3: GENETICS AND DNA
    // -------------------------------------------------------------
    {
        id: "bio-dna-genetics",
        moduleId: "module-3",
        moduleName: "Genetics and DNA",
        title: "DNA Double Helix, Genes & Inheritance",
        gradeRange: "Classes 8–12",
        targetGrades: [8, 9, 10, 11, 12],
        estimatedTime: "22 mins",
        modelName: "DNA",
        interactive3D: true,
        summaryIcon: "🧬",
        overview: "Deoxyribonucleic acid (DNA) is the biological hereditary blueprint of life, formed of an antiparallel double helix encoding genetic instructions in four nitrogenous bases.",
        learningObjectives: [
            "Describe the Watson-Crick double helix model and complementary base pairing rules (A-T, G-C).",
            "Understand the flow of genetic information: The Central Dogma (DNA -> RNA -> Protein).",
            "Apply Gregor Mendel's Laws of Segregation and Independent Assortment using Punnett squares.",
            "Distinguish between dominant and recessive alleles, genotypes, and phenotypes."
        ],
        explanation: `### 1. The Structure of DNA
In 1953, James Watson and Francis Crick elucidated the double helical model:
- **Sugar-Phosphate Backbone**: Composed of alternating deoxyribose sugar and phosphate groups linked by phosphodiester bonds running antiparallel ($5' \\rightarrow 3'$ and $3' \\rightarrow 5'$).
- **Nitrogenous Base Rungs**:
  - **Adenine (A)** pairs exclusively with **Thymine (T)** via 2 hydrogen bonds.
  - **Guanine (G)** pairs exclusively with **Cytosine (C)** via 3 hydrogen bonds.
- This complementary geometry ensures that each strand serves as an exact template for semi-conservative replication.

### 2. Mendelian Inheritance Principles
Gregor Mendel conducted experiments on garden pea plants (*Pisum sativum*):
- **Law of Segregation**: Each organism carries two alleles for every gene, which segregate into separate gametes during meiosis.
- **Law of Independent Assortment**: Alleles for different traits sort independently during gamete formation.
- **Genotype vs Phenotype**: The genotype represents the internal genetic makeup (e.g., $Tt$ or $TT$); the phenotype is the observable physical characteristic (e.g., tall plant).`,
        terms: [
            { term: "Nucleotide", definition: "The basic monomer unit of DNA composed of a 5-carbon deoxyribose sugar, a phosphate group, and a nitrogenous base." },
            { term: "Allele", definition: "One of two or more alternative versions of a gene occupying the same locus on homologous chromosomes." },
            { term: "Phenotype", definition: "The observable physical or physiological traits of an organism resulting from genotype and environment." },
            { term: "Central Dogma", definition: "The primary molecular pathway: DNA transcription to mRNA followed by ribosomal translation into proteins." }
        ],
        summary: [
            "DNA is an antiparallel double helix stabilized by complementary hydrogen bonds: A-T and G-C.",
            "Genes are discrete DNA sequences that code for functional polypeptide proteins.",
            "Mendel established that traits are inherited through particulate dominant and recessive alleles.",
            "DNA semi-conservative replication enables exact genetic inheritance across cell generations."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Antiparallel Helical Backbones",
                "concept": "Structural Scaffold",
                "targetStructure": "backbone",
                "explanation": "Twin helical ribbons composed of alternating deoxyribose sugars and phosphate groups linked by phosphodiester bonds run in opposite directions (5' to 3' and 3' to 5').",
                "cameraPos": [
                        0,
                        0,
                        3.6
                ],
                "explode": 0
        },
        {
                "step": 2,
                "title": "Adenine-Thymine (A-T) Base Pair",
                "concept": "Dual Hydrogen Bonding",
                "targetStructure": "Adenine",
                "explanation": "Purine Adenine strictly binds Pyrimidine Thymine via two specific hydrogen bonds (A = T), preserving exact distance across the helical axis.",
                "cameraPos": [
                        0,
                        0.4,
                        2.8
                ],
                "explode": 0.15
        },
        {
                "step": 3,
                "title": "Guanine-Cytosine (G-C) Base Pair",
                "concept": "Triple Hydrogen Bonding Stability",
                "targetStructure": "Guanine",
                "explanation": "Purine Guanine pairs strictly with Pyrimidine Cytosine stabilized by three hydrogen bonds (G ≡ C), providing high thermodynamic stability.",
                "cameraPos": [
                        0,
                        -0.4,
                        2.8
                ],
                "explode": 0.15
        },
        {
                "step": 4,
                "title": "Major & Minor Grooves",
                "concept": "Protein-DNA Recognition",
                "targetStructure": "backbone",
                "explanation": "The helical twist creates deep major grooves and shallow minor grooves where regulatory transcription factors read the base sequence without unwinding the helix.",
                "cameraPos": [
                        0,
                        0,
                        3
                ],
                "explode": 0.2
        },
        {
                "step": 5,
                "title": "Strand Separation & Replication",
                "concept": "Semi-Conservative Duplication",
                "targetStructure": "denature",
                "explanation": "During DNA replication, helicase unzips the hydrogen bonds between base pairs, allowing DNA polymerase to synthesize complementary daughter strands.",
                "cameraPos": [
                        0,
                        0,
                        3.8
                ],
                "explode": 0.65
        }
],
        reviewQuestions: [
            {
                question: "According to Chargaff's rules of DNA base pairing, what base always pairs with Adenine?",
                options: ["Guanine", "Cytosine", "Thymine", "Uracil (in DNA)"],
                correctIndex: 2,
                explanation: "In DNA, Adenine (A) always pairs with Thymine (T) via two hydrogen bonds."
            },
            {
                question: "How many hydrogen bonds connect a Guanine-Cytosine (G-C) base pair?",
                options: ["1", "2", "3", "4"],
                correctIndex: 2,
                explanation: "Guanine and Cytosine form 3 hydrogen bonds, making G-C rich DNA regions thermally more stable."
            },
            {
                question: "If a homozygous tall pea plant (TT) is crossed with a dwarf plant (tt), what is the phenotype of all F1 offspring?",
                options: ["All dwarf", "All tall", "Half tall, half dwarf", "Three quarters dwarf"],
                correctIndex: 1,
                explanation: "Since the tall allele (T) is dominant over dwarf (t), all F1 plants with genotype Tt appear tall."
            },
            {
                question: "What term describes the complete genetic makeup of an organism, as opposed to its physical appearance?",
                options: ["Phenotype", "Genotype", "Chromosome", "Karyotype"],
                correctIndex: 1,
                explanation: "Genotype refers to the specific alleles carried by an organism, while phenotype refers to the physical trait."
            },
            {
                question: "What is the process called when genetic information on DNA is copied into messenger RNA?",
                options: ["Translation", "Transcription", "Replication", "Mutation"],
                correctIndex: 1,
                explanation: "Transcription is the synthesis of complementary RNA from a DNA template directed by RNA polymerase."
            }
        ],
        references: [
            "NCERT Class 10 Biology — Heredity and Evolution",
            "NCERT Class 12 Biology — Molecular Basis of Inheritance",
            "Watson, J.D. & Crick, F.H.C. (1953). Molecular Structure of Nucleic Acids, Nature."
        ]
    },

    // -------------------------------------------------------------
    // MODULE 4: HUMAN PHYSIOLOGY
    // -------------------------------------------------------------
    {
        id: "bio-respiration-gas",
        moduleId: "module-4",
        moduleName: "Human Physiology",
        title: "Respiration and Alveolar Gas Exchange",
        gradeRange: "Classes 7–11",
        targetGrades: [7, 8, 9, 10, 11],
        estimatedTime: "17 mins",
        modelName: "Respiratory",
        interactive3D: true,
        summaryIcon: "🫁",
        overview: "Human respiration bridges external air ventilation through the trachea and bronchial tree with micro-capillary gas diffusion across alveolar membranes.",
        learningObjectives: [
            "Trace the respiratory tract from nasal cavities to the alveoli.",
            "Explain the diaphragm mechanics during inhalation (negative pressure ventilation) and exhalation.",
            "Understand partial pressure gradients driving $O_2$ loading and $CO_2$ unloading in blood capillaries.",
            "Describe the oxygen-carrying role of hemoglobin in red blood cells."
        ],
        explanation: `### 1. Ventilation Mechanics
Ventilation relies on pressure changes in the sealed thoracic cavity:
- **Inhalation**: The diaphragm contracts and flattens downwards, while external intercostal muscles elevate ribs. This expands thoracic volume, dropping alveolar pressure below atmospheric level ($-1$ to $-3$ mmHg), drawing air into lungs.
- **Exhalation**: In quiet breathing, the diaphragm relaxes, dome-springing upward as lung tissue elastically recoils, pushing air outward.

### 2. Alveolar Gas Exchange
The human lungs feature ~300 million microscopic alveoli with an aggregate surface area exceeding 70 square meters:
- The respiratory membrane is extremely thin ($<0.5\\ \\mu\\text{m}$), consisting of simple squamous alveolar epithelium and capillary endothelium.
- Gases diffuse according to Fick's law driven by partial pressure differences:
  - Oxygen: High $P_{O_2}$ in alveolar air ($\\sim 104\\text{ mmHg}$) $\\rightarrow$ binds to hemoglobin in capillary blood ($\\sim 40\\text{ mmHg}$).
  - Carbon Dioxide: Elevated $P_{CO_2}$ in deoxygenated blood ($\\sim 45\\text{ mmHg}$) $\\rightarrow$ diffuses into alveolar lumen ($\\sim 40\\text{ mmHg}$) for expiration.`,
        terms: [
            { term: "Alveoli", definition: "Tiny air sacs at the terminal ends of bronchioles where pulmonary gas diffusion takes place." },
            { term: "Hemoglobin", definition: "Iron-containing conjugated protein inside erythrocytes capable of binding four oxygen molecules." },
            { term: "Diaphragm", definition: "The dome-shaped primary muscular sheet separating the thoracic and abdominal cavities." },
            { term: "Tidal Volume", definition: "The volume of air inhaled or exhaled with each normal resting breath (~500 mL in adults)." }
        ],
        summary: [
            "Inhalation is active: diaphragm contraction creates negative pressure that draws air in.",
            "Alveoli provide massive surface area for rapid passive diffusion of oxygen and carbon dioxide.",
            "Oxygen binds to iron-rich hemoglobin forming oxyhemoglobin for systemic transport.",
            "Carbon dioxide is transported predominantly as dissolved bicarbonate ions in blood plasma."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Trachea & Cartilaginous Rings",
                "concept": "Patent Airway Conduction",
                "targetStructure": "trachea",
                "explanation": "C-shaped rings of hyaline cartilage prevent tracheal collapse during negative intrathoracic pressures as air travels from the larynx toward the lungs.",
                "cameraPos": [
                        0,
                        1.2,
                        3.2
                ],
                "slice": false,
                "explode": 0
        },
        {
                "step": 2,
                "title": "Bronchial Tree Bifurcation",
                "concept": "Airway Distribution",
                "targetStructure": "bronchi",
                "explanation": "The primary bifurcation divides the trachea into left and right primary bronchi, which subdivide into secondary, tertiary, and terminal conducting bronchioles.",
                "cameraPos": [
                        0,
                        0.4,
                        3
                ],
                "slice": false,
                "explode": 0.15
        },
        {
                "step": 3,
                "title": "Right & Left Pulmonary Lobes",
                "concept": "Anatomical Asymmetry",
                "targetStructure": "right_lung",
                "explanation": "The right lung possesses three lobes (superior, middle, inferior), while the left lung has two lobes and a cardiac notch to accommodate the apex of the heart.",
                "cameraPos": [
                        -0.6,
                        0.2,
                        3.2
                ],
                "slice": true,
                "explode": 0.2
        },
        {
                "step": 4,
                "title": "Alveoli Microscopic Gas Exchange",
                "concept": "Diffusion Across Thin Membranes",
                "targetStructure": "alveoli",
                "explanation": "Over 300 million micro-alveoli surrounded by dense capillary beds provide 70 m² of surface area for passive O2 uptake and CO2 clearance.",
                "cameraPos": [
                        0.6,
                        -0.2,
                        2.6
                ],
                "slice": true,
                "explode": 0.35
        },
        {
                "step": 5,
                "title": "Diaphragm Muscle Dome",
                "concept": "Negative Pressure Ventilation",
                "targetStructure": "diaphragm",
                "explanation": "During inhalation, the dome-shaped diaphragm contracts and moves downward, expanding thoracic volume, dropping alveolar pressure, and drawing air in.",
                "cameraPos": [
                        0,
                        -1.4,
                        3.2
                ],
                "slice": false,
                "explode": 0.4
        }
],
        reviewQuestions: [
            {
                question: "What is the primary site of gas exchange in the human respiratory system?",
                options: ["Trachea", "Alveoli", "Bronchi", "Larynx"],
                correctIndex: 1,
                explanation: "Alveoli have thin single-cell walls enveloped by capillaries to facilitate rapid gas diffusion."
            },
            {
                question: "During active inhalation, what action does the diaphragm muscle perform?",
                options: ["It relaxes and arches upward", "It contracts and moves downward", "It stays completely still", "It compresses the lungs"],
                correctIndex: 1,
                explanation: "Contraction of the diaphragm flattens it downward, enlarging the thoracic cavity and pulling air inward."
            },
            {
                question: "Which blood component carries over 98% of oxygen to body tissues?",
                options: ["Hemoglobin in red blood cells", "White blood cells", "Dissolved in plasma alone", "Platelets"],
                correctIndex: 0,
                explanation: "Hemoglobin molecules within erythrocytes bind oxygen reversibly to form oxyhemoglobin."
            },
            {
                question: "What gas diffuses out of the pulmonary capillary blood into the alveoli to be exhaled?",
                options: ["Oxygen", "Carbon monoxide", "Carbon dioxide", "Nitrogen"],
                correctIndex: 2,
                explanation: "Carbon dioxide diffuses down its partial pressure gradient from systemic venous blood into alveolar air."
            },
            {
                question: "What prevents the trachea (windpipe) from collapsing during changes in air pressure?",
                options: ["Cartilaginous C-shaped rings", "Thick bone plates", "High blood pressure", "Mucus alone"],
                correctIndex: 0,
                explanation: "C-shaped rings of hyaline cartilage keep the trachea continuously open."
            }
        ],
        references: [
            "NCERT Class 10 Biology — Respiration",
            "West's Respiratory Physiology: The Essentials (11th Ed.)"
        ]
    },
    {
        id: "bio-digestion-nutrition",
        moduleId: "module-4",
        moduleName: "Human Physiology",
        title: "Digestion, Nutrient Absorption & Metabolism",
        gradeRange: "Classes 7–10",
        targetGrades: [7, 8, 9, 10],
        estimatedTime: "17 mins",
        modelName: "Digestive",
        interactive3D: true,
        summaryIcon: "🥗",
        overview: "The human gastrointestinal tract breaks down complex macromolecules into absorbable monosaccharides, amino acids, and fatty acids through mechanical and enzymatic action.",
        learningObjectives: [
            "Trace food transit along the alimentary canal: mouth, esophagus, stomach, small intestine, and large intestine.",
            "Identify key digestive enzymes: salivary amylase, pepsin, trypsin, and pancreatic lipase.",
            "Understand bile production in the liver and emulsification of dietary lipids.",
            "Explain how intestinal microvilli maximize nutrient absorption surface area."
        ],
        explanation: `### 1. Stages of the Digestive Tract
- **Mouth (Oral Cavity)**: Teeth masticate food into a bolus; saliva contains *salivary amylase* initiating starch hydrolysis.
- **Stomach**: Strong peristaltic churning mixes food with acidic gastric juice (pH 1.5–2.0, produced by parietal cells) containing *pepsin* to denature proteins into peptides.
- **Small Intestine (Duodenum, Jejunum, Ileum)**: Primary site of chemical digestion and nutrient absorption:
  - *Bile (from Liver/Gallbladder)*: Emulsifies hydrophobic fats into micro-droplets.
  - *Pancreatic Enzymes*: Amylase, Trypsin, and Lipase break down carbohydrates, proteins, and fats into simple units.
- **Large Intestine (Colon)**: Reabsorbs water and electrolytes, condensing indigestible residue into feces.

### 2. Microvilli & Absorption Efficiency
The mucosal lining of the small intestine is folded into circular folds (*plicae circulares*), finger-like **villi**, and brush-border **microvilli**, expanding the surface area for absorption to ~30 square meters.`,
        terms: [
            { term: "Peristalsis", definition: "Involuntary rhythmic wave-like contractions of smooth muscle along the digestive tract pushing food forward." },
            { term: "Villi", definition: "Microscopic finger-like projections along the intestinal lining that maximize nutrient absorption." },
            { term: "Bile", definition: "Alkaline fluid produced by hepatocytes in the liver that emulsifies dietary lipids." },
            { term: "Enzyme", definition: "Biological protein catalyst that accelerates biochemical digestion reactions without being consumed." }
        ],
        summary: [
            "Digestion breaks polymers (starches, proteins, lipids) into monomers for cellular absorption.",
            "The stomach uses gastric hydrochloric acid and pepsin to start protein digestion.",
            "Pancreatic enzymes and liver bile complete macromolecule breakdown in the small intestine.",
            "Intestinal villi massively increase internal surface area for efficient nutrient entry into blood."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Esophagus & Peristalsis",
                "concept": "Food Bolus Transport",
                "targetStructure": "esophagus",
                "explanation": "The esophagus conducts masticated food from the pharynx to the stomach through coordinated involuntary waves of smooth muscle contraction (peristalsis).",
                "cameraPos": [
                        0,
                        1.4,
                        3.2
                ],
                "slice": false,
                "explode": 0
        },
        {
                "step": 2,
                "title": "Stomach: Acid & Pepsin Churning",
                "concept": "Protein Denaturation & Chyme",
                "targetStructure": "stomach",
                "explanation": "Parietal cells secrete HCl (pH 1.5–2.0) that activates pepsinogen into pepsin, breaking protein chains while muscular walls mechanically churn food into chyme.",
                "cameraPos": [
                        0.3,
                        0.7,
                        2.8
                ],
                "slice": true,
                "explode": 0.2
        },
        {
                "step": 3,
                "title": "Liver & Gallbladder: Bile Synthesis",
                "concept": "Lipid Emulsification",
                "targetStructure": "liver",
                "explanation": "The liver produces alkaline bile salts, stored in the gallbladder, which emulsify large fat globules into micro-droplets in the duodenum for lipase digestion.",
                "cameraPos": [
                        -0.6,
                        0.8,
                        2.8
                ],
                "slice": false,
                "explode": 0.25
        },
        {
                "step": 4,
                "title": "Pancreas: Exocrine Enzymes",
                "concept": "Complete Chemical Breakdown",
                "targetStructure": "pancreas",
                "explanation": "The pancreas secretes bicarbonate to neutralize stomach acid along with pancreatic amylase, trypsin, and lipase into the small intestine.",
                "cameraPos": [
                        0.1,
                        0.3,
                        2.6
                ],
                "slice": true,
                "explode": 0.3
        },
        {
                "step": 5,
                "title": "Small Intestine & Absorptive Villi",
                "concept": "Nutrient Uptake",
                "targetStructure": "small_intestine",
                "explanation": "Millions of finger-like villi and microvilli expand internal surface area to absorb glucose, amino acids, vitamins, and fatty acids into mesenteric capillaries and lacteals.",
                "cameraPos": [
                        0,
                        -0.4,
                        3
                ],
                "slice": false,
                "explode": 0.35
        }
],
        reviewQuestions: [
            {
                question: "Which organ synthesizes Bile to aid in the digestion of dietary fats?",
                options: ["Pancreas", "Gallbladder", "Liver", "Stomach"],
                correctIndex: 2,
                explanation: "The Liver synthesizes bile; the gallbladder concentrates and stores it until needed."
            },
            {
                question: "Where does the majority of nutrient absorption take place in the human digestive system?",
                options: ["Stomach", "Small Intestine", "Large Intestine", "Esophagus"],
                correctIndex: 1,
                explanation: "The Small Intestine, with its thousands of villi and microvilli, is the primary site of nutrient absorption."
            },
            {
                question: "What enzyme present in human saliva starts the chemical digestion of starch?",
                options: ["Pepsin", "Salivary Amylase", "Lipase", "Trypsin"],
                correctIndex: 1,
                explanation: "Salivary Amylase begins breaking complex starch into simpler disaccharides right in the oral cavity."
            },
            {
                question: "Why is gastric juice in the stomach strongly acidic (pH 1.5–2.0)?",
                options: ["To digest cellulose", "To activate pepsinogen into pepsin and destroy ingested microbes", "To absorb water", "To neutralize bile"],
                correctIndex: 1,
                explanation: "Hydrochloric acid creates the acidic environment required for pepsin activity and kills foreign bacteria."
            },
            {
                question: "What is the primary role of the Large Intestine (Colon)?",
                options: ["Digest proteins", "Absorb remaining water and electrolytes", "Produce insulin", "Break down lipids"],
                correctIndex: 1,
                explanation: "The Large Intestine absorbs water and mineral salts, compacting remaining matter into solid waste."
            }
        ],
        references: [
            "NCERT Class 10 Biology — Life Processes (Nutrition)",
            "NCERT Class 11 Biology — Digestion and Absorption"
        ]
    },

    // -------------------------------------------------------------
    // MODULE 5: BOTANY
    // -------------------------------------------------------------
    {
        id: "bio-photosynthesis-plant",
        moduleId: "module-5",
        moduleName: "Botany",
        title: "Photosynthesis: Light Reactions & Calvin Cycle",
        gradeRange: "Classes 7–11",
        targetGrades: [7, 8, 9, 10, 11],
        estimatedTime: "20 mins",
        modelName: "PlantCell",
        interactive3D: true,
        summaryIcon: "☀️",
        overview: "Photosynthesis is the foundational photochemical process by which autotrophic plants capture solar radiation to synthesize organic glucose from inorganic carbon dioxide and water.",
        learningObjectives: [
            "Write and interpret the balanced chemical equation of photosynthesis: $6CO_2 + 6H_2O \\rightarrow C_6H_{12}O_6 + 6O_2$.",
            "Differentiate between Light-Dependent Reactions (thylakoid grana) and the Light-Independent Calvin Cycle (stroma).",
            "Explain photolysis of water and how oxygen gas is released as a vital byproduct.",
            "Understand stomatal regulation and the role of guard cells in gas exchange."
        ],
        explanation: `### 1. The Global Biochemical Equation
Photosynthesis converts solar electromagnetic photons into stable chemical bond energy:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light + Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

### 2. Two Synchronized Stages Inside Chloroplasts
1. **Light-Dependent Reactions (Thylakoids & Grana)**:
   - Chlorophyll $a$ and accessory pigments absorb blue and red photons, exciting electrons in Photosystems II and I.
   - **Photolysis of Water**: $2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2\\uparrow$. Oxygen is released into the atmosphere!
   - Electron transport drives ATP and NADPH synthesis across the thylakoid membrane.
2. **Light-Independent Reactions (Calvin Cycle in Stroma)**:
   - Driven by the enzyme **RuBisCO**, atmospheric $CO_2$ is fixed onto ribulose 1,5-bisphosphate.
   - ATP and NADPH energy fuels reduction into glyceraldehyde-3-phosphate (G3P), which condenses into glucose and starch.

### 3. Stomatal Transpiration
Carbon dioxide enters leaves through microscopic pores called **Stomata**, flanked by kidney-shaped **Guard Cells**. When water flows into guard cells, they become turgid, bowing open to allow $CO_2$ influx.`,
        terms: [
            { term: "Chlorophyll", definition: "The primary photosynthetic green pigment found in thylakoid membranes that absorbs solar wavelengths." },
            { term: "Thylakoid", definition: "Membrane-bound disc inside chloroplasts where light-dependent photosynthetic reactions take place." },
            { term: "Stoma (pl. Stomata)", definition: "Microscopic pore in plant epidermis flanked by guard cells facilitating gas exchange and transpiration." },
            { term: "RuBisCO", definition: "Ribulose-1,5-bisphosphate carboxylase-oxygenase, the essential carbon-fixing enzyme of the Calvin cycle." }
        ],
        summary: [
            "Photosynthesis converts solar energy, carbon dioxide, and water into chemical glucose and oxygen gas.",
            "Light reactions occur in thylakoids; the carbon-fixing Calvin cycle occurs in the stroma.",
            "Water photolysis is the source of all oxygen released into Earth's atmosphere by plants.",
            "Guard cells regulate stomatal opening to balance carbon dioxide absorption and water loss."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Plant Cell & Chloroplast Distribution",
                "concept": "Solar Harvesting Architecture",
                "targetStructure": "cell_wall",
                "explanation": "Mesophyll plant cells position chloroplasts along outer cell membranes to maximize light photon absorption during changing daylight angles.",
                "cameraPos": [
                        0,
                        0,
                        3.6
                ],
                "explode": 0.1
        },
        {
                "step": 2,
                "title": "Chloroplasts (Photosynthesis Site)",
                "concept": "Light-Dependent Photolysis",
                "targetStructure": "chloroplast",
                "explanation": "Chlorophyll a and accessory pigments in thylakoid membranes absorb blue and red photons, exciting electrons and splitting water into protons, electrons, and O2 gas.",
                "cameraPos": [
                        -0.8,
                        -0.5,
                        2.6
                ],
                "explode": 0.3
        },
        {
                "step": 3,
                "title": "Thylakoid Grana & ATP Generation",
                "concept": "Photophosphorylation",
                "targetStructure": "chloroplast_2",
                "explanation": "Protons pumped into thylakoid lumens generate an electrochemical gradient driving ATP synthase to yield ATP and NADPH energy carriers.",
                "cameraPos": [
                        0.8,
                        0.5,
                        2.6
                ],
                "explode": 0.35
        },
        {
                "step": 4,
                "title": "Stroma Matrix & Calvin Cycle",
                "concept": "Enzymatic Carbon Fixation",
                "targetStructure": "cytoplasm",
                "explanation": "Within the liquid stroma surrounding thylakoids, the enzyme RuBisCO fixes atmospheric CO2 into 3-PGA, subsequently reduced using ATP/NADPH into glucose.",
                "cameraPos": [
                        0,
                        0,
                        3
                ],
                "explode": 0.2
        },
        {
                "step": 5,
                "title": "Central Vacuole & Osmotic Support",
                "concept": "Stomatal Guard Cell Turgor",
                "targetStructure": "vacuole",
                "explanation": "High vacuolar osmotic pressure in leaf guard cells opens stomata to permit continuous CO2 entry while regulating transpiration moisture loss.",
                "cameraPos": [
                        0.5,
                        -0.2,
                        2.8
                ],
                "explode": 0.25
        }
],
        reviewQuestions: [
            {
                question: "What is the source of the oxygen gas released during photosynthesis?",
                options: ["Carbon dioxide ($CO_2$)", "Water molecules ($H_2O$)", "Glucose", "Soil nitrates"],
                correctIndex: 1,
                explanation: "Photolysis (light splitting) of water molecules in Photosystem II yields protons, electrons, and oxygen gas."
            },
            {
                question: "In which sub-compartment of the chloroplast does the carbon-fixing Calvin Cycle occur?",
                options: ["Thylakoid lumen", "Stroma (fluid matrix)", "Outer membrane", "Stomatal guard cell"],
                correctIndex: 1,
                explanation: "The enzymatic, light-independent Calvin Cycle occurs within the stroma surrounding the thylakoids."
            },
            {
                question: "Which cells control the opening and closing of leaf stomata?",
                options: ["Parenchyma cells", "Guard cells", "Xylem vessels", "Phloem sieve tubes"],
                correctIndex: 1,
                explanation: "Turgor-driven swelling or shrinking of pair guard cells opens or closes the stomatal aperture."
            },
            {
                question: "Which photosynthetic pigment primarily absorbs blue and red wavelengths of sunlight?",
                options: ["Carotene", "Anthocyanin", "Chlorophyll a", "Xanthophyll"],
                correctIndex: 2,
                explanation: "Chlorophyll a absorbs blue and red light while reflecting green light, giving leaves their color."
            },
            {
                question: "What high-energy products generated in light reactions are consumed by the Calvin Cycle?",
                options: ["Glucose and oxygen", "ATP and NADPH", "Water and carbon dioxide", "Lipids and cellulose"],
                correctIndex: 1,
                explanation: "Light reactions generate ATP and NADPH, which supply energy to reduce CO2 into sugar in the Calvin Cycle."
            }
        ],
        references: [
            "NCERT Class 10 Science — Chapter 6: Life Processes (Photosynthesis)",
            "NCERT Class 11 Biology — Photosynthesis in Higher Plants",
            "Taiz & Zeiger, Plant Physiology and Development (6th Ed.)"
        ]
    },
    {
        id: "bio-plant-transport",
        moduleId: "module-5",
        moduleName: "Botany",
        title: "Plant Vascular Transport: Xylem & Phloem",
        gradeRange: "Classes 6–10",
        targetGrades: [6, 7, 8, 9, 10],
        estimatedTime: "15 mins",
        modelName: "PlantCell",
        interactive3D: true,
        summaryIcon: "🌱",
        overview: "Vascular plants rely on two distinct long-distance conduits: Xylem for unidirectional ascent of water and minerals, and Phloem for bidirectional translocation of photoassimilates.",
        learningObjectives: [
            "Contrast the structures and transport directions of Xylem vs Phloem.",
            "Explain the Transpiration Pull theory (Cohesion-Tension mechanism).",
            "Describe phloem translocation of sucrose according to Munch's Pressure-Flow hypothesis.",
            "Understand the role of root hairs in mineral osmosis."
        ],
        explanation: `### 1. Xylem: Ascent of Sap
- **Structure**: Hollow, non-living tubular elements (Tracheids and Vessels) reinforced with thick lignified secondary walls.
- **Direction**: Strictly **unidirectional** from soil roots upward to stems and leaves.
- **Mechanism (Cohesion-Tension Theory)**:
  - *Transpiration*: Water evaporates from mesophyll cells out of stomata.
  - *Cohesion*: Hydrogen bonds between adjacent water molecules create an unbroken tensile water column.
  - *Adhesion*: Water molecules adhere to hydrophilic cellulose and xylem vessel walls.
  - Together, this generates negative capillary tension pulling water up from roots across tens of meters.

### 2. Phloem: Translocation of Organic Nutrients
- **Structure**: Living cells consisting of Sieve Tube Elements with perforated end plates and nucleated **Companion Cells**.
- **Direction**: **Bidirectional** (source to sink): from leaves (source) to roots, buds, and developing fruits (sinks).
- **Mechanism**: Active proton-sucrose symport creates an osmotic gradient, drawing water in and generating bulk hydrostatic pressure flow.`,
        terms: [
            { term: "Xylem", definition: "Vascular tissue in plants that conducts water and dissolved nutrients upward from the roots." },
            { term: "Phloem", definition: "Vascular tissue that conducts synthesized sugars and metabolic products downward and upward from leaves." },
            { term: "Transpiration", definition: "The loss of water vapor from aerial plant surfaces, predominantly through stomatal pores in leaves." },
            { term: "Companion Cell", definition: "Metabolically active phloem cell that regulates physiological transport in adjacent sieve tube elements." }
        ],
        summary: [
            "Xylem conducts water and inorganic minerals unidirectionally from roots to leaves.",
            "Transpiration pull and water cohesion-adhesion drive the ascent of sap through xylem vessels.",
            "Phloem translocates synthesized sugars bidirectionally from photosynthetic sources to metabolic sinks.",
            "Sieve tube elements work in tandem with metabolically supportive companion cells."
        ],
        guidedSteps: [
        {
                "step": 1,
                "title": "Root Hair Osmosis & Absorption",
                "concept": "Water Potential Gradient",
                "targetStructure": "cell_wall",
                "explanation": "Microscopic epidermal root hairs provide massive contact area with soil moisture, taking up water and mineral ions via osmosis and active transport.",
                "cameraPos": [
                        0,
                        0,
                        3.4
                ],
                "explode": 0.1
        },
        {
                "step": 2,
                "title": "Xylem Conduction & Transpiration Pull",
                "concept": "Cohesion-Tension Mechanism",
                "targetStructure": "cytoplasm",
                "explanation": "Water evaporates from leaf stomata, generating negative hydrostatic tension that pulls an unbroken column of water up through hollow lignified xylem vessels.",
                "cameraPos": [
                        -0.2,
                        -0.4,
                        2.8
                ],
                "explode": 0.25
        },
        {
                "step": 3,
                "title": "Phloem Translocation",
                "concept": "Pressure-Flow Source-to-Sink",
                "targetStructure": "cell_wall",
                "explanation": "Living sieve tubes actively load sucrose from leaf mesophyll sources, generating hydrostatic pressure that drives sap bidirectionally toward roots and fruit sinks.",
                "cameraPos": [
                        0,
                        0,
                        3.2
                ],
                "explode": 0.2
        },
        {
                "step": 4,
                "title": "Central Vacuole Turgor Pressure",
                "concept": "Hydrostatic Plant Rigidity",
                "targetStructure": "vacuole",
                "explanation": "Turgor pressure inside plant cell vacuoles presses cytoplasm firmly against cell walls, maintaining non-woody stem rigidity and preventing plant wilting.",
                "cameraPos": [
                        0.5,
                        -0.2,
                        2.8
                ],
                "explode": 0.25
        },
        {
                "step": 5,
                "title": "Stomatal Transpiration Stream",
                "concept": "Evaporative Cooling & Mass Flow",
                "targetStructure": "nucleus",
                "explanation": "Over 95% of water absorbed by roots transpires through leaf stomata, providing evaporative cooling and driving the continuous upward vascular stream.",
                "cameraPos": [
                        -0.5,
                        0.3,
                        2.8
                ],
                "explode": 0.3
        }
],
        reviewQuestions: [
            {
                question: "Which plant vascular tissue transports water and minerals upward from roots?",
                options: ["Phloem", "Xylem", "Cortex", "Epidermis"],
                correctIndex: 1,
                explanation: "Xylem vessels form continuous hollow tubes that transport water and soil minerals upward."
            },
            {
                question: "What physical force enables tall trees to pull water hundreds of feet up to their highest leaves?",
                options: ["Gravitational push", "Transpiration pull coupled with water cohesion", "Animal respiration", "Active muscle pumping"],
                correctIndex: 1,
                explanation: "Evaporation of water through stomata creates negative pressure tension (transpiration pull) supported by water cohesion."
            },
            {
                question: "In which direction can organic nutrients (sucrose) travel through the Phloem?",
                options: ["Upward only", "Downward only", "Bidirectionally (source to sink)", "Radially only"],
                correctIndex: 2,
                explanation: "Phloem transport is bidirectional, moving sugars wherever metabolic sinks require energy (roots, fruits, shoot tips)."
            },
            {
                question: "Which cells provide metabolic support to the nucleus-free sieve tube elements of phloem?",
                options: ["Root hair cells", "Guard cells", "Companion cells", "Tracheids"],
                correctIndex: 2,
                explanation: "Companion cells carry nuclei and organelles, regulating loading and unloading in sieve tubes."
            },
            {
                question: "What adaptation of root hairs maximizes water absorption from soil?",
                options: ["Massive aggregate surface area and thin walls", "Thick waterproof cuticle", "Dead hollow vessels", "High chlorophyll count"],
                correctIndex: 0,
                explanation: "Root hairs are microscopic epidermal extensions providing enormous surface area for water osmosis."
            }
        ],
        references: [
            "NCERT Class 10 Science — Transportation in Plants",
            "NCERT Class 11 Biology — Transport in Plants"
        ]
    }
];

// -------------------------------------------------------------
// Schema Normalization: Bidirectional aliases for maximum resilience
// -------------------------------------------------------------
BIOLOGY_CHAPTERS.forEach(ch => {
    // quiz <-> reviewQuestions
    if (!ch.quiz && ch.reviewQuestions) ch.quiz = ch.reviewQuestions;
    if (!ch.reviewQuestions && ch.quiz) ch.reviewQuestions = ch.quiz;
    if (!ch.quiz) ch.quiz = [];

    // glossary <-> terms
    if (!ch.glossary && ch.terms) ch.glossary = ch.terms;
    if (!ch.terms && ch.glossary) ch.terms = ch.glossary;
    if (!ch.glossary) ch.glossary = [];

    // readTime <-> estimatedTime
    if (!ch.readTime && ch.estimatedTime) ch.readTime = ch.estimatedTime;
    if (!ch.estimatedTime && ch.readTime) ch.estimatedTime = ch.readTime;
    if (!ch.readTime) ch.readTime = "15 mins";

    // difficulty badge
    if (!ch.difficulty) {
        if (ch.targetGrades && ch.targetGrades.includes(12)) ch.difficulty = "Advanced";
        else if (ch.targetGrades && ch.targetGrades.includes(9)) ch.difficulty = "Intermediate";
        else ch.difficulty = "Introductory";
    }

    // overview / summary
    if (!ch.overview && typeof ch.summary === "string") ch.overview = ch.summary;
    if (!ch.overview && Array.isArray(ch.summary) && ch.summary.length > 0) ch.overview = ch.summary[0];
    if (!ch.summary && ch.overview) ch.summary = [ch.overview];

    // sections parsed from explanation if sections not defined
    if (!ch.sections && ch.explanation) {
        const rawSections = ch.explanation.split(/###\s+/).filter(Boolean);
        ch.sections = rawSections.map(sec => {
            const lines = sec.trim().split("\n");
            const heading = lines[0].replace(/^\d+\.\s*/, "").trim();
            const bodyLines = lines.slice(1);
            const bullets = [];
            const textLines = [];
            bodyLines.forEach(l => {
                const trimmed = l.trim();
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                    bullets.push(trimmed.slice(2));
                } else if (trimmed) {
                    textLines.push(trimmed);
                }
            });
            return {
                heading,
                content: textLines.join(" "),
                bulletPoints: bullets
            };
        });
    }
    if (!ch.sections) ch.sections = [];
    if (!ch.guidedSteps) ch.guidedSteps = [];
});

/**
 * Filter chapters by Grade (Class 6 to 12)
 */
export function getChaptersByGrade(grade) {
    if (!grade || grade === "all") return BIOLOGY_CHAPTERS;
    const gradeNum = parseInt(grade, 10);
    return BIOLOGY_CHAPTERS.filter(ch => ch.targetGrades.includes(gradeNum));
}

/**
 * Filter chapters by Module ID (module-1 to module-5)
 */
export function getChaptersByModule(moduleId) {
    if (!moduleId || moduleId === "all") return BIOLOGY_CHAPTERS;
    return BIOLOGY_CHAPTERS.filter(ch => ch.moduleId === moduleId);
}
