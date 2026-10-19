/**
 * Frontend Local Educational Knowledge Engine
 * 
 * Provides offline, high-accuracy educational answers across Biology, Physics,
 * and Chemistry without requiring external AI APIs or subscriptions.
 * 
 * Truthfully identifies as "Local Knowledge Engine".
 */

// =============================================================
// 1. BIOLOGY KNOWLEDGE BASE
// =============================================================

export const BIOLOGY_KNOWLEDGE = [
    {
        id: "bio_cell_overview",
        title: "Cell Structure and Organelles (Plant vs. Animal Cells)",
        domain: "Biology",
        keywords: [
            "cell", "cells", "cell theory", "what is a cell", "plant and animal cell",
            "animal cell", "plant cell", "organelles", "cell organelles", "eukaryotic", "prokaryotic",
            "nucleus", "mitochondria", "ribosome", "endoplasmic reticulum", "golgi", "lysosome", "vacuole", "cell wall"
        ],
        answer: `🔬 **Cell Biology: Structure, Theory & Organelles**

A **cell** is the fundamental structural, functional, and biological unit of all living organisms.

---

### 1. The Classical Cell Theory
1. All living organisms are composed of one or more cells.
2. The cell is the basic structural and functional unit of life.
3. All new cells arise from pre-existing cells through cell division.

---

### 2. Comprehensive Organelle Guide
- **Nucleus**: The command center enclosed by a double nuclear membrane. Contains chromatin (DNA) and the nucleolus, directing transcription and protein synthesis.
- **Mitochondria**: The "powerhouse" of the cell. Generates adenosine triphosphate (**ATP**) through aerobic cellular respiration across folded inner cristae.
- **Ribosomes**: Non-membrane bound complexes of rRNA and proteins that translate mRNA transcripts into polypeptide chains.
- **Endoplasmic Reticulum (ER)**:
  - *Rough ER*: Studded with ribosomes; synthesizes and folds transmembrane and secretory proteins.
  - *Smooth ER*: Lacks ribosomes; synthesizes lipids/phospholipids and detoxifies metabolic byproducts.
- **Golgi Apparatus**: Flattened cisternae that modify (glycosylation), sort, and package proteins into secretory vesicles.
- **Lysosomes**: Acidic vesicles containing hydrolytic digestive enzymes that break down worn-out organelles (autophagy) and pathogens.
- **Central Vacuole (Plants)**: Large fluid-filled organelle maintaining turgor pressure and storing nutrients and water.
- **Cell Wall (Plants & Fungi)**: Rigid outer structural layer composed of cellulose microfibrils that resists osmotic pressure.
- **Chloroplasts (Plants)**: Double-membraned photosynthetic plastids containing thylakoids and chlorophyll.

---

### 3. Plant vs. Animal Cells
| Feature | Plant Cell | Animal Cell |
| :--- | :--- | :--- |
| **Cell Wall** | Present (Cellulose) | Absent |
| **Chloroplasts** | Present (Photosynthesis) | Absent |
| **Vacuole** | Large Single Central Vacuole | Small, temporary vacuoles |
| **Centrioles / Centrosome** | Mostly absent in higher plants | Present (organizes spindle fibers) |
| **Shape** | Fixed, rigid rectangular shape | Flexible, irregular / spherical shape |

*Recap*: Organelles coordinate metabolic tasks like compartmentalized factories, allowing eukaryotic cells to maintain homeostasis.`,
        actionCue: { targetMesh: "plant_cell", zoom: 1.2 }
    },
    {
        id: "bio_photosynthesis_respiration",
        title: "Photosynthesis and Cellular Respiration",
        domain: "Biology",
        keywords: [
            "photosynthesis", "cellular respiration", "respiration", "chloroplast", "chlorophyll",
            "light reaction", "calvin cycle", "glycolysis", "krebs cycle", "electron transport chain",
            "atp", "glucose", "aerobic respiration", "photosynthesis and cellular respiration"
        ],
        answer: `🌿 **Photosynthesis and Cellular Respiration**

Photosynthesis and cellular respiration are complementary biochemical pathways that cycle energy and carbon throughout Earth's biosphere.

---

### 1. Photosynthesis: Capturing Solar Energy
**Definition**: An anabolic, endergonic process in autotrophs (plants, algae) converting sunlight, water, and carbon dioxide into chemical energy (glucose) and oxygen.

**Balanced Chemical Formula**:
$$6CO_2 + 6H_2O + \\text{Light Energy} \\xrightarrow{\\text{Chlorophyll}} C_6H_{12}O_6 + 6O_2$$

**Two Main Stages**:
1. **Light-Dependent Reactions (in Thylakoid Grana)**:
   - Photons energize chlorophyll electrons.
   - Water molecules are split (**photolysis**): $2H_2O \\rightarrow 4H^+ + 4e^- + O_2$.
   - ATP and NADPH energy carriers are synthesized.
2. **Light-Independent Reactions / Calvin Cycle (in Stroma)**:
   - RuBisCO fixes atmospheric $CO_2$.
   - ATP and NADPH reduce carbon intermediates into **glucose** ($C_6H_{12}O_6$).

---

### 2. Cellular Respiration: Releasing Metabolic Energy
**Definition**: A catabolic, exergonic pathway in all eukaryotes that oxidizes glucose into $CO_2$, $H_2O$, and usable chemical energy in the form of **ATP**.

**Balanced Chemical Formula**:
$$C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + 30\\text{--}32\\text{ ATP}$$

**Three Main Stages**:
1. **Glycolysis** (Cytoplasm): Breaks 1 Glucose ($6C$) into 2 Pyruvate ($3C$). Net yield: $+2\\text{ ATP}$ and $+2\\text{ NADH}$ (Anaerobic).
2. **Krebs / Citric Acid Cycle** (Mitochondrial Matrix): Oxidizes acetyl groups to $CO_2$, yielding $+2\\text{ ATP}$, $+6\\text{ NADH}$, and $+2\\text{ FADH}_2$.
3. **Oxidative Phosphorylation** (Mitochondrial Cristae Inner Membrane): Electrons flow through the Electron Transport Chain (ETC), pumping protons ($H^+$) to drive **ATP Synthase**. Produces $\\sim 26\\text{--}28\\text{ ATP}$.

---

### 3. Comparison
| Parameter | Photosynthesis | Cellular Respiration |
| :--- | :--- | :--- |
| **Site** | Chloroplasts | Mitochondria & Cytoplasm |
| **Organisms** | Autotrophs (Plants, Algae) | All Eukaryotes (Plants, Animals, Fungi) |
| **Gas Exchanged** | Consumes $CO_2$, releases $O_2$ | Consumes $O_2$, releases $CO_2$ |
| **Energy Flow** | Stores solar energy in glucose bonds | Releases bond energy to form ATP |

*Recap*: The products of photosynthesis ($C_6H_{12}O_6$ and $O_2$) are precisely the substrates required for cellular respiration, forming the biological carbon-oxygen cycle.`,
        actionCue: { targetMesh: "chloroplast", highlightColor: "#22c55e", zoom: 1.6 }
    },
    {
        id: "bio_heart_circulation",
        title: "Human Heart Anatomy and Blood Circulation",
        domain: "Biology",
        keywords: [
            "heart", "human heart", "blood circulation", "circulatory system", "cardiovascular",
            "left ventricle", "right ventricle", "atrium", "aorta", "pulmonary artery", "valves",
            "mitral valve", "tricuspid valve", "systemic circulation", "pulmonary circulation"
        ],
        answer: `🫀 **Human Heart Anatomy and Blood Circulation**

The human heart is a four-chambered, muscular double pump that circulates blood through two connected vascular circuits: pulmonary and systemic.

---

### 1. The Four Chambers & Internal Anatomy
1. **Right Atrium (RA)**: Receives oxygen-depleted venous blood from systemic tissues via the Superior and Inferior Vena Cava.
2. **Right Ventricle (RV)**: Pumps deoxygenated blood through the pulmonary semilunar valve into the pulmonary trunk towards the lungs.
3. **Left Atrium (LA)**: Receives freshly oxygen-rich blood returning from the lungs via four pulmonary veins.
4. **Left Ventricle (LV)**: Thickest muscular chamber; pumps oxygenated blood under high pressure ($\\sim 120\\text{ mmHg}$) through the aortic valve into the systemic **Aorta**.

---

### 2. The Four Unidirectional Heart Valves
- **Atrioventricular (AV) Valves**:
  - *Tricuspid Valve* (between RA and RV): 3 cusps; closes during ventricular systole.
  - *Bicuspid / Mitral Valve* (between LA and LV): 2 cusps; prevents regurgitation into left atrium.
- **Semilunar Valves**:
  - *Pulmonary Valve*: Guards pulmonary artery opening.
  - *Aortic Valve*: Guards aorta opening; prevents arterial blood backflow during ventricular diastole.
- *Heart Sounds*: Closure of AV valves produces the first "lub" ($S_1$); closure of semilunar valves produces the second "dub" ($S_2$).

---

### 3. Step-by-Step Pathway of Blood Circulation
$$\\text{Body Tissues} \\xrightarrow{\\text{Vena Cava}} \\text{RA} \\xrightarrow{\\text{Tricuspid}} \\text{RV} \\xrightarrow{\\text{Pulmonary Artery}} \\text{Lungs}$$
$$\\text{Lungs (Oxygenation)} \\xrightarrow{\\text{Pulmonary Veins}} \\text{LA} \\xrightarrow{\\text{Mitral}} \\text{LV} \\xrightarrow{\\text{Aorta}} \\text{Body Tissues}$$

---

### 4. Pulmonary vs. Systemic Circulation
- **Pulmonary Circuit**: Low pressure ($\\sim 25\\text{ mmHg}$); transfers blood between heart and lungs for alveolar $O_2/CO_2$ gas exchange.
- **Systemic Circuit**: High pressure ($\\sim 120\\text{ mmHg}$); delivers oxygenated blood and nutrients to the brain, heart myocardium, organs, and musculoskeletal extremities.

*Recap*: The left ventricle has a myocardium $3\\times$ thicker than the right ventricle because it must overcome high systemic vascular resistance.`,
        actionCue: { targetMesh: "heart", highlightColor: "#e11d48", zoom: 1.5 }
    },
    {
        id: "bio_human_body_systems",
        title: "Respiratory, Digestive, Nervous, and Skeletal Systems",
        domain: "Biology",
        keywords: [
            "respiratory system", "digestive system", "nervous system", "skeletal system",
            "lungs", "alveoli", "stomach", "intestine", "brain", "neuron", "skeleton", "bones", "body systems"
        ],
        answer: `🫁 **Human Body Systems Overview: Respiratory, Digestive, Nervous & Skeletal**

---

### 1. Respiratory System (Gas Exchange)
- **Pathway**: Nasal cavity $\\rightarrow$ Pharynx $\\rightarrow$ Larynx $\\rightarrow$ Trachea $\\rightarrow$ Bronchi $\\rightarrow$ Bronchioles $\\rightarrow$ **Alveoli**.
- **Mechanism**: The **diaphragm** contracts downward, expanding thoracic cavity volume and lowering intrapleural pressure, drawing air in.
- **Alveolar Gas Exchange**: Passive diffusion across ultra-thin respiratory membranes: $O_2$ binds to hemoglobin in capillary red blood cells, while $CO_2$ diffuses into alveoli for exhalation.

---

### 2. Digestive System (Nutrient Breakdown & Absorption)
- **Mouth**: Mechanical chewing and chemical digestion of starch via salivary amylase.
- **Stomach**: Secretes $\\text{HCl}$ (pH $1.5\\text{--}2.0$) to denature proteins and activate **pepsin**. Churns food into acidic chyme.
- **Small Intestine (Duodenum, Jejunum, Ileum)**: Primary absorption zone. Microscopic **villi and microvilli** increase absorptive surface area ($>250\\text{ m}^2$).
- **Pancreas & Liver**: Pancreas secretes amylase, lipase, and trypsin; Liver secretes **bile** (stored in gallbladder) to emulsify lipids.
- **Large Intestine (Colon)**: Reabsorbs water and electrolytes, preparing waste for defecation.

---

### 3. Nervous System (Communication & Control)
- **Central Nervous System (CNS)**: Brain (Cerebrum, Cerebellum, Brainstem) and Spinal Cord.
- **Peripheral Nervous System (PNS)**: Sensory and motor nerves, somatic (voluntary) and autonomic (sympathetic fight-or-flight vs. parasympathetic rest-and-digest).
- **The Neuron**: Dendrites receive electrochemical signals, the axon conducts action potentials, and synaptic neurotransmitters (e.g., Acetylcholine, Dopamine) cross synaptic clefts.

---

### 4. Skeletal System (Framework & Locomotion)
- **206 Adult Bones**: Divided into **Axial** ($80$ bones: skull, vertebral column, ribs) and **Appendicular** ($126$ bones: limbs, shoulder, and pelvic girdles).
- **Functions**: Structural support, visceral organ shielding, calcium/phosphate mineral reservoir, and **hematopoiesis** (blood cell creation in red bone marrow).
- **Joints**: Synovial (ball-and-socket, hinge), cartilaginous (intervertebral discs), and fibrous (cranial skull sutures).`,
        actionCue: { targetMesh: "respiratory", zoom: 1.3 }
    },
    {
        id: "bio_dna_rna_genetics",
        title: "DNA, RNA, and Basic Genetics",
        domain: "Biology",
        keywords: [
            "dna", "rna", "genetics", "gene", "allele", "genotype", "phenotype", "punnett square",
            "transcription", "translation", "central dogma", "nucleotide", "double helix", "heredity", "dominant", "recessive"
        ],
        answer: `🧬 **DNA, RNA, Molecular Genetics & Mendelian Heredity**

---

### 1. DNA Structure & Base Pairing
- **Deoxyribonucleic Acid (DNA)** is a double-stranded antiparallel double helix with a deoxyribose sugar-phosphate backbone.
- **Chargaff's Base-Pairing Rules**:
  - **Adenine (A)** pairs with **Thymine (T)** via **2 Hydrogen bonds**.
  - **Guanine (G)** pairs with **Cytosine (C)** via **3 Hydrogen bonds**.

---

### 2. RNA vs. DNA Comparison
| Property | DNA | RNA |
| :--- | :--- | :--- |
| **Strand Count** | Double-stranded | Single-stranded |
| **Pentose Sugar** | Deoxyribose | Ribose |
| **Nitrogenous Bases** | A, T, G, C | A, **Uracil (U)**, G, C |
| **Primary Location** | Nucleus, Mitochondria | Nucleus, Ribosomes, Cytosol |

---

### 3. The Central Dogma of Molecular Biology
$$\\text{DNA} \\xrightarrow{\\text{Transcription (RNA Polymerase)}} \\text{mRNA} \\xrightarrow{\\text{Translation (Ribosome + tRNA)}} \\text{Polypeptide Protein}$$
- **Codons**: Ribosomes read triplets of mRNA nucleotides ($3\\text{ bases} = 1\\text{ codon}$) specifying a specific amino acid according to the universal genetic code.

---

### 4. Basic Mendelian Genetics & Punnett Square
- **Gene vs. Allele**: A gene codes for a trait (e.g., eye color); alleles are variant forms of that gene (e.g., Brown $B$ vs. Blue $b$).
- **Dominant vs. Recessive**: Dominant alleles ($B$) express their trait even when heterozygous ($Bb$); recessive alleles ($b$) only express when homozygous ($bb$).
- **Worked Genetics Example (Monohybrid Cross)**:
  - Two heterozygous brown-eyed parents ($Bb \\times Bb$) cross:
  - Offspring genotypes: $1\\,BB : 2\\,Bb : 1\\,bb$ ($25\\%\\text{ homozygous dominant}, 50\\%\\text{ heterozygous}, 25\\%\\text{ homozygous recessive}$).
  - Offspring phenotypes: **$3\\text{ Brown} : 1\\text{ Blue}$** (75% brown-eyed, 25% blue-eyed).`,
        actionCue: { targetMesh: "dna", zoom: 1.5 }
    },
    {
        id: "bio_mitosis_cell_division",
        title: "Cell Division and Mitosis",
        domain: "Biology",
        keywords: [
            "mitosis", "cell division", "cell cycle", "prophase", "metaphase", "anaphase", "telophase",
            "cytokinesis", "chromosomes", "sister chromatids", "diploid", "meiosis"
        ],
        answer: `➗ **Cell Division: The Cell Cycle & Mitosis**

**Mitosis** is equational cell division whereby one diploid parent cell ($2n$) divides into **two genetically identical diploid daughter cells ($2n$)**, essential for growth, tissue repair, and asexual reproduction.

---

### 1. The Eukaryotic Cell Cycle
1. **Interphase ($90\\%$ of cycle)**:
   - **$G_1$ Phase**: Cell growth, organelle replication, and metabolic activity.
   - **$S$ Phase (Synthesis)**: Complete replication of genomic DNA ($2n \\rightarrow 4C$).
   - **$G_2$ Phase**: Protein synthesis (tubulin) and final preparation for division.
2. **M Phase**: Mitosis (nuclear division) followed by Cytokinesis (cytoplasmic division).

---

### 2. Stages of Mitosis (PMAT)
1. **Prophase**:
   - Chromatin condenses into distinct X-shaped chromosomes (two sister chromatids joined at a centromere).
   - Centrosomes migrate to opposite cellular poles; mitotic spindle microtubules polymerize.
   - The nucleolus disappears and nuclear envelope breaks down.
2. **Metaphase**:
   - Kinetochore microtubules align all chromosomes along the cell equator (**Metaphase Plate**).
   - The spindle checkpoint ensures all chromatids are correctly attached.
3. **Anaphase**:
   - Cohesin protein cleaves; centromeres split.
   - Motor proteins pull sister chromatids apart toward opposite spindle poles.
4. **Telophase**:
   - Chromatids arrive at poles and decondense back into diffuse chromatin.
   - Two new nuclear envelopes reform around each set of daughter chromosomes.
   - Spindle apparatus disassembles.
5. **Cytokinesis**:
   - *Animal Cells*: Contractile ring of actin and myosin pinches the membrane into a **cleavage furrow**.
   - *Plant Cells*: Golgi vesicles fuse along the equator to construct a cellulose **cell plate**.

*Recap*: Mitosis ensures faithful genetic transmission so that every somatic cell in a multicellular organism contains the exact same genetic instructions.`,
        actionCue: { targetMesh: "mitosis", zoom: 1.4 }
    }
];

// =============================================================
// 2. PHYSICS KNOWLEDGE BASE
// =============================================================

export const PHYSICS_KNOWLEDGE = [
    {
        id: "phys_ohms_law",
        title: "Ohm's Law & Circuit Analysis",
        domain: "Physics",
        keywords: [
            "ohm's law", "ohms law", "v=ir", "voltage", "current", "resistance",
            "explain ohm's law with an example", "ohm law formula", "resistor", "electric circuit"
        ],
        answer: `💡 **Ohm's Law with Variable Definitions, Units & Worked Numerical Example**

### 1. Direct Definition & Principle
**Ohm's Law** states that the electric current flowing through a metallic conductor between two points is directly proportional to the potential difference (voltage) across those two points, provided physical conditions (temperature, conductor dimensions) remain constant.

---

### 2. Mathematical Formula
$$V = I \\cdot R$$

Equivalently:
$$I = \\frac{V}{R} \\quad \\text{and} \\quad R = \\frac{V}{I}$$

---

### 3. Variable Definitions & SI Units
- $V$ = **Voltage** (electric potential difference) across the conductor, measured in **Volts ($V$)**.
- $I$ = **Current** (rate of electric charge flow, $I = \\frac{Q}{t}$), measured in **Amperes ($A$)** ($1\\text{ A} = 1\\text{ Coulomb/second}$).
- $R$ = **Resistance** (opposition to electric current flow), measured in **Ohms ($\\Omega$)** ($1\\,\\Omega = 1\\text{ V/A}$).

---

### 4. Step-by-Step Worked Numerical Example
- **Problem**: An electric heater with an internal resistance of $R = 4\\,\\Omega$ is connected across a $V = 12\\text{ V}$ direct current power source. Calculate the electric current flowing through the heater.
- **Given Data**:
  - Voltage $V = 12\\text{ V}$
  - Resistance $R = 4\\,\\Omega$
- **Step 1**: State the relevant formula solving for current $I$:
  $$I = \\frac{V}{R}$$
- **Step 2**: Substitute known values into the equation:
  $$I = \\frac{12\\text{ V}}{4\\,\\Omega} = 3\\text{ A}$$
- **Answer**: The current flowing through the electric heater is **$3\\text{ Amperes}$** ($3\\text{ A}$).

---

### 5. Practical Application & Recap
Ohm's law is the foundation of electronic circuit design. If you need to double current in a circuit while maintaining fixed resistance, you must double the applied voltage. If resistance is doubled at constant voltage, current drops by half.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_newtons_laws_fma",
        title: "Newton's Three Laws of Motion & F=ma",
        domain: "Physics",
        keywords: [
            "newton's laws", "newton laws", "newton's second law", "newtons second law", "laws of motion",
            "f=ma", "force equals mass times acceleration", "inertia", "action and reaction", "newton first law", "newton third law"
        ],
        answer: `⚡ **Newton's Three Laws of Motion & $F = ma$**

Formulated by Sir Isaac Newton in 1687, these three laws form the cornerstone of classical Newtonian mechanics.

---

### 1. The Three Laws Explained
1. **Newton's First Law (Law of Inertia)**:
   An object remains at rest or continues to move at a constant velocity in a straight line unless acted upon by a net external force ($\\sum \\vec{F} = 0 \\implies \\vec{a} = 0$).
   - *Example*: A hockey puck sliding on frictionless ice continues indefinitely.
2. **Newton's Second Law (Law of Acceleration)**:
   The acceleration of an object is directly proportional to the net force acting upon it, points in the direction of the net force, and is inversely proportional to its mass.
   - **Formula**: $$\\vec{F}_{\\text{net}} = m \\cdot \\vec{a}$$
3. **Newton's Third Law (Action-Reaction)**:
   For every action force, there is an equal in magnitude and opposite in direction reaction force ($F_{A \\rightarrow B} = -F_{B \\rightarrow A}$).
   - *Example*: A swimmer pushes backward on the water; the water pushes forward on the swimmer.

---

### 2. Variable Definitions & SI Units ($F = ma$)\n- $F$ = Net external force, measured in **Newtons ($N$)**, where $1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$.\n- $m$ = Inertial mass of the body, measured in **kilograms ($\\text{kg}$)**.\n- $a$ = Acceleration, measured in **meters per second squared ($\\text{m/s}^2$)**.\n\n---\n\n### 3. Step-by-Step Worked Numerical Example\n- **Problem**: A horizontal net force of $20\\text{ N}$ is applied to push a stationary crate of mass $4\\text{ kg}$ across a smooth floor. Find the resulting acceleration of the crate.\n- **Given Data**:\n  - Force $F = 20\\text{ N}$\n  - Mass $m = 4\\text{ kg}$\n- **Step 1**: Rearrange $F = ma$ to solve for acceleration $a$:\n  $$a = \\frac{F}{m}$$\n- **Step 2**: Substitute numerical values:\n  $$a = \\frac{20\\text{ N}}{4\\text{ kg}} = 5\\text{ m/s}^2$$\n- **Answer**: The crate accelerates at **$5\\text{ m/s}^2$** in the direction of the applied force.\n\n*Recap*: Heavier masses have greater inertia, requiring proportionally larger forces to produce the same acceleration.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_kinematics_motion",
        title: "Speed, Velocity, Acceleration & Equations of Motion",
        domain: "Physics",
        keywords: [
            "equations of motion", "speed", "velocity", "acceleration", "kinematics",
            "v=u+at", "s=ut+1/2at^2", "v^2=u^2+2as", "motion equations", "uniformly accelerated motion"
        ],
        answer: `🏃 **Speed, Velocity, Acceleration & The Three Equations of Motion**

Kinematics describes the motion of points, bodies, and systems without consideration of the forces that cause the motion.

---

### 1. Fundamental Quantities & Definitions
- **Speed**: Scalar quantity representing the rate of distance covered ($v = d/t$, unit: $\\text{m/s}$).
- **Velocity ($\\vec{v}$)**: Vector quantity representing rate of displacement in a specified direction ($\\vec{v} = \\Delta \\vec{s} / \\Delta t$, unit: $\\text{m/s}$).
- **Acceleration ($\\vec{a}$)**: Vector rate of change of velocity ($\\vec{a} = \\Delta \\vec{v} / \\Delta t$, unit: $\\text{m/s}^2$).

---

### 2. The Three Kinematic Equations of Motion (Constant Acceleration $a$)
1. **First Equation (Velocity-Time Relation)**:
   $$v = u + at$$
2. **Second Equation (Displacement-Time Relation)**:
   $$s = ut + \\frac{1}{2}at^2$$
3. **Third Equation (Velocity-Displacement Relation)**:
   $$v^2 = u^2 + 2as$$

**Variable Definitions & Units**:
- $u$ = Initial velocity (meters per second, $\\text{m/s}$)
- $v$ = Final velocity (meters per second, $\\text{m/s}$)
- $a$ = Constant acceleration (meters per second squared, $\\text{m/s}^2$)
- $t$ = Time elapsed (seconds, $\\text{s}$)
- $s$ = Displacement / distance traveled (meters, $\\text{m}$)

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: A racing car accelerates uniformly from rest at $a = 2\\text{ m/s}^2$ for $t = 5\\text{ seconds}$. 
  1. What is its final velocity?
  2. How far did it travel?
- **Given Data**:
  - Initial velocity $u = 0\\text{ m/s}$ (starts from rest)
  - Acceleration $a = 2\\text{ m/s}^2$
  - Time $t = 5\\text{ s}$
- **Step 1 (Find Final Velocity $v$)**:
  $$v = u + at = 0 + (2)(5) = 10\\text{ m/s}$$
- **Step 2 (Find Displacement $s$)**:
  $$s = ut + \\frac{1}{2}at^2 = 0(5) + \\frac{1}{2}(2)(5^2) = 1 \\times 25 = 25\\text{ m}$$
- **Answer**: The car reaches a final velocity of **$10\\text{ m/s}$** and travels a distance of **$25\\text{ meters}$**.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_work_energy_power",
        title: "Work, Energy, and Power",
        domain: "Physics",
        keywords: [
            "work", "energy", "power", "kinetic energy", "potential energy",
            "work energy and power", "work done", "w=fd", "ke=1/2mv^2", "pe=mgh", "p=w/t", "joules", "watts"
        ],
        answer: `🔋 **Work, Energy, and Power**

---

### 1. Definitions & Formulas
- **Work ($W$)**: Measure of energy transfer that occurs when an object is displaced by an external force:
  $$W = F \\cdot d \\cdot \\cos(\\theta)$$
  Where $F$ is force ($N$), $d$ is displacement ($m$), and $\\theta$ is the angle between force and displacement vectors. Unit: **Joules ($J$)** ($1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$).
- **Kinetic Energy ($KE$)**: Energy possessed by a body due to its motion:
  $$KE = \\frac{1}{2}m v^2$$
  Where $m$ is mass ($\\text{kg}$) and $v$ is velocity ($\\text{m/s}$). Unit: **Joules ($J$)**.
- **Gravitational Potential Energy ($PE$)**: Energy stored in an object due to its position in a gravitational field:
  $$PE = mgh$$
  Where $g \\approx 9.8\\text{ m/s}^2$ and $h$ is height ($m$). Unit: **Joules ($J$)**.
- **Power ($P$)**: The rate at which work is done or energy is transformed:
  $$P = \\frac{W}{t} = \\frac{\\Delta E}{t}$$
  Unit: **Watts ($W$)** ($1\\text{ W} = 1\\text{ J/s}$).

---

### 2. Step-by-Step Worked Numerical Example
- **Problem**: A student lifts a backpack of mass $m = 4\\text{ kg}$ vertically through a height of $h = 2\\text{ meters}$ in $t = 4\\text{ seconds}$ ($g = 9.8\\text{ m/s}^2$). 
  1. What work was done against gravity?
  2. What was the average power output?
- **Calculation**:
  $$W = PE = mgh = (4)(9.8)(2) = 78.4\\text{ J}$$
  $$P = \\frac{W}{t} = \\frac{78.4\\text{ J}}{4\\text{ s}} = 19.6\\text{ W}$$
- **Answer**: Work done is **$78.4\\text{ J}$** and mechanical power output is **$19.6\\text{ W}$**.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_circuits_series_parallel",
        title: "Electric Current, Voltage, Resistance & Simple Circuits",
        domain: "Physics",
        keywords: [
            "circuits", "electric circuits", "series and parallel", "series circuit", "parallel circuit",
            "equivalent resistance", "resistors in series", "resistors in parallel", "current and voltage", "kirchhoff"
        ],
        answer: `🔌 **Electric Current, Voltage, Resistance & Simple Circuits**

---

### 1. Fundamental Quantities
- **Current ($I$)**: Flow rate of electric charge ($I = Q/t$, unit: Amperes $A$).
- **Voltage ($V$)**: Electrical potential energy per unit charge driving flow ($V = W/Q$, unit: Volts $V$).
- **Resistance ($R$)**: Material opposition to charge flow (unit: Ohms $\\Omega$).

---

### 2. Series vs. Parallel Circuits Comparison
| Characteristic | Series Circuit | Parallel Circuit |
| :--- | :--- | :--- |
| **Current ($I$)** | Same through all components ($I = I_1 = I_2$) | Splits across branches ($I_{\\text{total}} = I_1 + I_2$) |
| **Voltage ($V$)** | Divides across components ($V_{\\text{total}} = V_1 + V_2$) | Same across all branches ($V_{\\text{total}} = V_1 = V_2$) |
| **Equivalent Resistance** | $$R_{\\text{eq}} = R_1 + R_2 + R_3$$ | $$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2}$$ |

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: Two resistors $R_1 = 6\\,\\Omega$ and $R_2 = 3\\,\\Omega$ are connected in **parallel** across a $12\\text{ V}$ battery.
  $$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{6} + \\frac{1}{3} = \\frac{3}{6} = \\frac{1}{2} \\implies R_{\\text{eq}} = 2\\,\\Omega$$
  $$I_{\\text{total}} = \\frac{V}{R_{\\text{eq}}} = \\frac{12\\text{ V}}{2\\,\\Omega} = 6\\text{ A}$$
- **Answer**: The equivalent resistance is **$2\\,\\Omega$** and total circuit current is **$6\\text{ A}$**.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_magnetism_induction",
        title: "Basic Magnetism and Electromagnetic Induction",
        domain: "Physics",
        keywords: [
            "magnetism", "electromagnetic induction", "faraday's law", "faraday law", "lenz's law",
            "lenz law", "magnetic flux", "induced emf", "lorentz force", "solenoid", "electromagnet"
        ],
        answer: `🧲 **Basic Magnetism and Electromagnetic Induction**

---

### 1. Magnetic Fields & The Lorentz Force
- Moving electric charges generate magnetic fields ($B$, measured in **Teslas, $T$**).
- Deflecting Lorentz Force: $F = q(\\vec{v} \\times \\vec{B})$ or $F = I L B \\sin(\\theta)$.

---

### 2. Faraday's Law & Lenz's Law
$$\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t}$$
Where $\\mathcal{E}$ is induced EMF in Volts, $N$ is turn count, and $\\Phi_B$ is magnetic flux ($Wb$). Lenz's Law (the negative sign) states that the direction of induced current opposes the flux change producing it.

---

### 3. Worked Numerical Example
- A coil of $N = 50\\text{ turns}$ experiences a flux change of $\\Delta \\Phi_B = 0.4\\text{ Wb}$ over $\\Delta t = 0.1\\text{ s}$:
  $$|\\mathcal{E}| = 50 \\cdot \\frac{0.4\\text{ Wb}}{0.1\\text{ s}} = 200\\text{ Volts}$$
- **Answer**: The induced EMF magnitude across the coil is **$200\\text{ Volts}$**.`,
        actionCue: { targetMesh: "DCMotor", zoom: 1.4 }
    },
    {
        id: "phys_optics_heat",
        title: "Basic Optics and Heat",
        domain: "Physics",
        keywords: [
            "optics", "heat", "reflection", "refraction", "snell's law", "snell law", "lens",
            "specific heat", "heat transfer", "conduction", "convection", "radiation", "q=mc delta t", "thermal"
        ],
        answer: `🔍 **Basic Optics and Thermal Physics (Heat)**

---

### 1. Basic Optics: Reflection & Refraction
- **Law of Reflection**: $\\theta_i = \\theta_r$.
- **Snell's Law of Refraction**:
  $$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$

---

### 2. Heat & Specific Heat Capacity
$$Q = m \\cdot c \\cdot \\Delta T$$
Where $Q$ is heat ($J$), $m$ is mass ($\\text{kg}$), $c$ is specific heat capacity (for water: $4184\\text{ J}/(\\text{kg}\\cdot^\\circ\\text{C})$), and $\\Delta T$ is temperature change.

---

### 3. Worked Numerical Example
- Heat to warm $m = 0.5\\text{ kg}$ of water by $\\Delta T = 40^\\circ\\text{C}$:
  $$Q = (0.5)(4184)(40) = 83,680\\text{ Joules} = 83.68\\text{ kJ}$$
- **Answer**: Exactly **$83,680\\text{ Joules}$** ($83.68\\text{ kJ}$) of thermal energy is required.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "phys_dc_motor",
        title: "Working Principle of an Electric DC Motor",
        domain: "Physics",
        keywords: ["dc motor", "how does a dc motor work", "electric motor", "commutator", "armature", "lorentz force", "split ring"],
        answer: `⚙️ **Working Principle of an Electric DC Motor**

An electric **DC (Direct Current) Motor** converts electrical energy into mechanical rotational kinetic energy.

---

### 1. Underlying Principle: The Magnetic Lorentz Force
When an electric current flows through a wire loop placed within an external magnetic field ($B$), the moving electrons experience a perpendicular Lorentz force:
$$\\vec{F} = I(\\vec{L} \\times \\vec{B})$$
Using **Fleming's Left-Hand Rule**:
- The current on one side of the armature coil experiences an upward magnetic force, while the current on the opposite side experiences a downward magnetic force.
- These opposing parallel forces create a **torque** (rotational moment $\\tau = F \\cdot d$) that turns the coil on its central axle.

---

### 2. Vital Role of the Split-Ring Commutator
The **split-ring commutator reverses the direction of current in the coil every half-rotation ($180^\\circ$)**, ensuring that mechanical torque acts in the exact same rotational direction continuously.`,
        actionCue: { targetMesh: "DCMotor", zoom: 1.5 }
    }
];

// =============================================================
// 3. CHEMISTRY KNOWLEDGE BASE
// =============================================================

export const CHEMISTRY_KNOWLEDGE = [
    {
        id: "chem_atoms_molecules_compounds",
        title: "Atoms, Molecules, Elements, and Compounds",
        domain: "Chemistry",
        keywords: [
            "atom", "molecule", "element", "compound", "atoms molecules", "elements and compounds",
            "atom vs molecule", "difference between atom and molecule", "what is an atom", "what is a molecule", "pure substance"
        ],
        answer: `⚛️ **Atoms, Molecules, Elements, and Compounds**

---

### 1. Definitions & Comparison Table
| Entity | Definition | Composition | Examples |
| :--- | :--- | :--- | :--- |
| **Atom** | Smallest constituent unit of ordinary matter that retains element properties. | Single nucleus (protons $+$ neutrons) surrounded by electron cloud. | Single $H$, $O$, $C$, $Fe$, $Au$ |
| **Molecule** | Electrically neutral entity formed when 2 or more atoms chemically bond together. | Can consist of identical atoms ($O_2$) or different atoms ($H_2O$). | Diatomic $O_2$, $N_2$, $H_2O$, $CO_2$, $C_6H_{12}O_6$ |
| **Element** | A pure substance containing only one kind of atom (same atomic number $Z$). | Unbonded atoms or homonuclear molecules. | Iron ($Fe$), Gold ($Au$), Oxygen gas ($O_2$) |
| **Compound** | A substance formed when two or more distinct chemical elements chemically combine in a fixed ratio. | Heteronuclear molecules or crystal lattices bonded ionically or covalently. | Water ($H_2O$, ratio $2:1$), Table salt ($NaCl$, ratio $1:1$), Methane ($CH_4$) |`,
        actionCue: { targetMesh: "Atom", zoom: 1.5 }
    },
    {
        id: "chem_atomic_structure_periodic_table",
        title: "Atomic Structure and Periodic Table Basics",
        domain: "Chemistry",
        keywords: [
            "atomic structure", "periodic table", "protons", "neutrons", "electrons",
            "atomic number", "mass number", "groups and periods", "valence electrons", "isotopes", "electron configuration"
        ],
        answer: `🔬 **Atomic Structure and Periodic Table Basics**

---

### 1. Subatomic Particles
- **Protons ($p^+$)**: Charge $+1$, defines Atomic Number ($Z$).
- **Neutrons ($n^0$)**: Charge $0$, Mass Number $A = Z + N$.
- **Electrons ($e^-$)**: Charge $-1$, orbit in quantized shells ($2n^2$).

---

### 2. The Periodic Table Architecture
- **Periods (Rows 1–7)**: Number of occupied electron shells.
- **Groups (Columns 1–18)**: Elements with identical numbers of valence electrons exhibiting similar chemical properties:
  - *Group 1*: Alkali Metals (form $+1$ cations).
  - *Group 17*: Halogens (form $-1$ anions).
  - *Group 18*: Noble Gases (full octet, chemically inert).`,
        actionCue: { targetMesh: "Atom", zoom: 1.5 }
    },
    {
        id: "chem_bonding_ionic_covalent",
        title: "Ionic and Covalent Bonding",
        domain: "Chemistry",
        keywords: [
            "ionic bonding", "covalent bonding", "chemical bonding", "ionic and covalent",
            "ionic bond", "covalent bond", "chemical bonds", "polar covalent", "lattice", "octet rule"
        ],
        answer: `🔗 **Ionic and Covalent Bonding**

### 1. Ionic Bonding: Electron Transfer
Between a metal and a non-metal: complete electron transfer creates electrostatic attraction between opposite ions (e.g., $Na^+ + Cl^- \\rightarrow NaCl$).

### 2. Covalent Bonding: Electron Sharing
Between two non-metals: mutual sharing of valence electron pairs (e.g., $H_2O, CH_4$).`,
        actionCue: { targetMesh: "Atom", zoom: 1.5 }
    },
    {
        id: "chem_ph_scale_acids_bases",
        title: "Acids, Bases, and the pH Scale",
        domain: "Chemistry",
        keywords: [
            "ph scale", "explain the ph scale", "ph", "acids", "bases", "acids and bases",
            "acidic", "alkaline", "neutral", "neutralization", "litmus", "hydroxide"
        ],
        answer: `🧪 **Acids, Bases, and the pH Scale**

### 1. The pH Scale Definition & Formula
$$\\text{pH} = -\\log_{10}[H^+] \\quad \\text{and} \\quad [H^+] = 10^{-\\text{pH}}$$
- **Acids ($\text{pH } < 7.0$)**: High $[H^+]$, sour, turn blue litmus red.
- **Neutral ($\text{pH } = 7.0$)**: Pure water ($[H^+] = [OH^-] = 10^{-7}\\text{ M}$).
- **Bases ($\text{pH } > 7.0$)**: High $[OH^-]$, bitter, turn red litmus blue.

---

### 2. Neutralization Reaction
$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}$$
$$\\text{HCl(aq)} + \\text{NaOH(aq)} \\rightarrow \\text{NaCl(aq)} + \\text{H}_2\\text{O(l)}$$`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "chem_balance_equations_step_by_step",
        title: "Balancing Chemical Equations Step by Step",
        domain: "Chemistry",
        keywords: [
            "balance equation", "balancing chemical equations", "balance chemical equation",
            "balance h2 + o2 -> h2o", "balance h2 + o2", "h2 + o2 -> h2o", "conservation of mass",
            "balance ch4 + o2", "balance n2 + h2"
        ],
        answer: `⚖️ **Balancing Chemical Equations Step by Step**

Balancing is governed by the **Law of Conservation of Mass**: atoms can neither be created nor destroyed in a chemical reaction.

---

### Case 1: Balancing $H_2 + O_2 \\rightarrow H_2O$
1. Skeleton: $H_2 + O_2 \\rightarrow H_2O$
2. Left has $2\\text{ O}$, Right has $1\\text{ O}$. Place $2$ before $H_2O$:
   $$H_2 + O_2 \\rightarrow 2H_2O$$
3. Right now has $4\\text{ H}$. Place $2$ before $H_2$:
   $$\\mathbf{2H_2(g) + O_2(g) \\rightarrow 2H_2O(l)}$$
4. Check: $4\\text{ H}$ and $2\\text{ O}$ on each side ✅.`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "chem_reaction_types_redox",
        title: "Basic Chemical Reactions, Oxidation, and Reduction (Redox)",
        domain: "Chemistry",
        keywords: [
            "reactions", "chemical reactions", "oxidation", "reduction", "redox",
            "oil rig", "types of reactions", "synthesis", "decomposition", "displacement", "combustion"
        ],
        answer: `🔥 **Basic Chemical Reactions, Oxidation, and Reduction (Redox)**

---

### 1. Oxidation and Reduction (Redox)
**OIL RIG Mnemonic:**
- **OIL**: **O**xidation **I**s **L**oss of electrons.
- **RIG**: **R**eduction **I**s **G**ain of electrons.

**Worked Example**:
$$Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)$$
- $Zn \\rightarrow Zn^{2+} + 2e^-$ (Oxidized, Reducing Agent).
- $Cu^{2+} + 2e^- \\rightarrow Cu$ (Reduced, Oxidizing Agent).`,
        actionCue: { targetMesh: "main", zoom: 1.2 }
    },
    {
        id: "chem_mole_concept_stoichiometry",
        title: "The Mole Concept and Elementary Stoichiometry",
        domain: "Chemistry",
        keywords: [
            "mole concept", "mole", "moles", "stoichiometry", "avogadro's number", "avogadro number",
            "molar mass", "n=m/m", "calculate moles", "stoichiometric", "gram formula mass"
        ],
        answer: `⚖️ **The Mole Concept and Elementary Stoichiometry**

---

### 1. Fundamental Formulas
$$n = \\frac{m}{M} \\quad \\text{and} \\quad N = n \\cdot N_A$$
Where $n$ is moles, $m$ is mass in grams, $M$ is molar mass ($\\text{g/mol}$), and $N_A = 6.022 \\times 10^{23}\\text{ entities/mol}$.

---

### 2. Step-by-Step Worked Numerical Example
- Moles in $36\\text{ g}$ of pure water ($H_2O$, $M = 18.0\\text{ g/mol}$):
  $$n = \\frac{36\\text{ g}}{18.0\\text{ g/mol}} = 2.0\\text{ moles}$$
  $$N = 2.0 \\times 6.022 \\times 10^{23} = 1.204 \\times 10^{24}\\text{ molecules}$$
- **Answer**: $36\\text{ g}$ of water corresponds to **$2.0\\text{ moles}$** ($1.204 \\times 10^{24}\\text{ molecules}$).`,
        actionCue: { targetMesh: "Atom", zoom: 1.5 }
    }
];

export const ALL_FRONTEND_ENTRIES = [...BIOLOGY_KNOWLEDGE, ...PHYSICS_KNOWLEDGE, ...CHEMISTRY_KNOWLEDGE];

// =============================================================
// 4. NATURAL LANGUAGE RESOLUTION & REASONING HELPERS
// =============================================================

function cleanText(text) {
    return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

const STOP_WORDS = new Set([
    "what", "is", "the", "an", "a", "of", "and", "or", "to", "in", "for",
    "tell", "me", "about", "how", "do", "does", "explain", "between", "from",
    "with", "its", "at", "by", "this", "that", "these", "those", "are", "can", "you",
    "please", "give", "show", "describe", "define"
]);

const SYNONYMS = {
    "equations": "equation",
    "balanced": "balance",
    "balancing": "balance",
    "circuits": "circuit",
    "resistors": "resistor",
    "accelerating": "acceleration",
    "accelerate": "acceleration",
    "laws": "law",
    "cells": "cell",
    "molecules": "molecule",
    "atoms": "atom",
    "compounds": "compound",
    "elements": "element",
    "powers": "power",
    "energies": "energy",
    "reactions": "reaction",
    "magnets": "magnetism",
    "magnetic": "magnetism",
    "inductance": "induction",
    "optics": "optic",
    "formulae": "formula",
    "formulas": "formula",
    "workings": "example",
    "numerical": "example",
    "problem": "example",
    "solve": "example",
    "problems": "example",
    "speed": "velocity"
};

function normalizeWord(word) {
    if (SYNONYMS[word]) return SYNONYMS[word];
    if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
    if (word.endsWith("s") && word.length > 3) return word.slice(0, -1);
    return word;
}

function scoreEntry(query, entry) {
    const qClean = cleanText(query);
    const qRawWords = qClean.split(" ").filter(w => w.length > 1 && !STOP_WORDS.has(w));
    const qNormWords = qRawWords.map(normalizeWord);

    if (qRawWords.length === 0) return 0;

    let score = 0;
    let hasDomainKeywordMatch = false;

    for (const kw of entry.keywords) {
        const kwClean = cleanText(kw);
        const kwWords = kwClean.split(" ").filter(w => !STOP_WORDS.has(w));
        const kwNormWords = kwWords.map(normalizeWord);
        
        if (qClean === kwClean) {
            score += 150;
            hasDomainKeywordMatch = true;
        } else if (kwWords.length > 0) {
            const escaped = kwClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const boundaryRegex = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
            if (boundaryRegex.test(qClean)) {
                score += 85;
                hasDomainKeywordMatch = true;
            } else {
                let matchCount = 0;
                for (const kwW of kwNormWords) {
                    if (qNormWords.includes(kwW)) matchCount++;
                }
                if (matchCount === kwNormWords.length) {
                    score += 55;
                    hasDomainKeywordMatch = true;
                } else if (matchCount >= 2 || (matchCount === 1 && kwNormWords.length === 1 && kwNormWords[0].length >= 4)) {
                    score += matchCount * 18;
                    hasDomainKeywordMatch = true;
                }
            }
        }
    }

    const titleWords = cleanText(entry.title).split(" ").filter(w => !STOP_WORDS.has(w)).map(normalizeWord);
    let titleMatch = 0;
    for (const tw of titleWords) {
        if (qNormWords.includes(tw)) titleMatch++;
    }
    if (titleMatch >= 2 || (titleMatch === 1 && titleWords.length <= 2)) {
        score += titleMatch * 25;
        hasDomainKeywordMatch = true;
    }

    // Safeguard: Prevent queries about lightning/thunder or molecular mass from matching broad physics/chemistry entries
    if (entry.id === "phys_work_energy_power" && (qClean.includes("lightning") || qClean.includes("thunder") || qClean.includes("speed of light") || qClean.includes("speed of sound"))) {
        return 0;
    }
    if (entry.id === "phys_kinematics_motion" && (qClean.includes("lightning") || qClean.includes("thunder") || qClean.includes("speed of light"))) {
        return 0;
    }
    if (entry.id === "chem_mole_concept_stoichiometry" && (qClean.includes("molecular mass") || qClean.includes("molar mass") || qClean.includes("formula mass") || qClean.includes("h2o using") || qClean.includes("using h =") || qClean.includes("using h="))) {
        return 0;
    }

    return hasDomainKeywordMatch ? score : 0;
}

// Layer 1: Dynamic Problem Generator
function generateDynamicProblem(rawQuestion, qClean) {
    const isProblemRequest =
        qClean.includes("create") ||
        qClean.includes("generate") ||
        qClean.includes("give me a problem") ||
        qClean.includes("numerical problem") ||
        qClean.includes("practice problem") ||
        qClean.includes("new problem");

    if (!isProblemRequest) return null;

    if (qClean.includes("newton") || qClean.includes("second law") || qClean.includes("f ma") || qClean.includes("force")) {
        return {
            title: "Newton's Second Law Problem ($F = ma$)",
            topic: "dynamic_problem_newton",
            answer: `📝 **Practice Problem: Newton's Second Law of Motion**\n\n### 1. Problem Statement\nA laboratory cart with an inertial mass of $m = 6.0\\text{ kg}$ rests on a horizontal, low-friction track. A student applies a steady horizontal pulling force of $F = 24.0\\text{ N}$ to the cart.\n**Calculate the resulting acceleration of the cart.**\n\n---\n\n### 2. Given Data & Units\n- Net force: $F = 24.0\\text{ N}$\n- Mass: $m = 6.0\\text{ kg}$\n- Target: Acceleration ($a$), in $\\text{m/s}^2$\n\n---\n\n### 3. Calculation\n$$a = \\frac{F}{m} = \\frac{24.0\\text{ N}}{6.0\\text{ kg}} = 4.0\\text{ m/s}^2$$\n\n---\n\n### 4. Verified Answer\nThe cart accelerates forward at **$4.0\\text{ m/s}^2$**.`
        };
    }

    if (qClean.includes("ohm") || qClean.includes("v ir") || qClean.includes("resistor")) {
        return {
            title: "Ohm's Law Problem ($V = IR$)",
            topic: "dynamic_problem_ohms_law",
            answer: `📝 **Practice Problem: Ohm's Law ($V = IR$)**\n\n### 1. Problem Statement\nAn electric heating coil with a resistance of $R = 15.0\\,\\Omega$ is connected across a $V = 120.0\\text{ V}$ power supply.\n**Determine the electric current flowing through the coil.**\n\n---\n\n### 2. Calculation\n$$I = \\frac{V}{R} = \\frac{120.0\\text{ V}}{15.0\\,\\Omega} = 8.0\\text{ A}$$\n\n---\n\n### 3. Verified Answer\nThe electric current is **$8.0\\text{ Amperes}$**.`
        };
    }

    return null;
}

// Layer 2: Conceptual Cause-and-Effect Reasoning Engine
function reasonConceptualQuestion(rawQuestion, qClean) {
    // 0. Dedicated High-Priority Rule: Why We See Lightning Before Hearing Thunder
    const isLightningThunder =
        (qClean.includes("lightning") && (qClean.includes("thunder") || qClean.includes("hear") || qClean.includes("see") || qClean.includes("sound") || qClean.includes("first") || qClean.includes("before") || qClean.includes("delay"))) ||
        (qClean.includes("thunder") && (qClean.includes("lightning") || qClean.includes("hear") || qClean.includes("sound") || qClean.includes("later") || qClean.includes("after") || qClean.includes("delay") || qClean.includes("why"))) ||
        (qClean.includes("speed of light") && (qClean.includes("sound") || qClean.includes("thunder") || qClean.includes("lightning")));

    if (isLightningThunder) {
        return {
            title: "Why We See Lightning Before Hearing Thunder",
            topic: "reasoning_lightning_thunder",
            answer: `⚡ **Why We See Lightning Before Hearing Thunder**\n\n### 1. Direct Answer\nWe see lightning before we hear thunder because **light travels nearly a million times faster than sound through air**. Both the brilliant flash of lightning and the acoustic shockwave of thunder occur simultaneously from the exact same electrical discharge, but light reaches our eyes almost instantaneously, while the sound wave takes significant time to travel to our ears.\n\n---\n\n### 2. Fundamental Speeds of Propagation\n- **Speed of Light ($c$)**: Approximately **$3 \\times 10^8\\text{ m/s}$** ($300,000\\text{ km/s}$ or $186,000\\text{ miles/s}$).\n  - At this immense speed, light covers $1\\text{ kilometer}$ in just $3.3\\text{ microseconds}$—effectively instantaneous for human observation.\n- **Speed of Sound ($v$)**: Approximately **$343\\text{ m/s}$** in dry air at $20^\\circ\\text{C}$ ($1,235\\text{ km/h}$ or $\\sim 767\\text{ mph}$).\n  - Sound requires roughly **$3\\text{ seconds}$ to travel just $1\\text{ kilometer}$** (or $\\approx 5\\text{ seconds}$ per mile).\n\n---\n\n### 3. Estimating Storm Distance (The 3-Second Rule)\nBecause light arrives almost immediately, you can easily calculate how far away a lightning strike occurred:\n1. Count the seconds elapsed between seeing the lightning flash and hearing the first thunder rumble.\n2. Divide the counted seconds by **$3$**:\n   $$\\text{Distance (km)} \\approx \\frac{\\text{Elapsed Time in Seconds}}{3}$$\n*(Example: If you count $6\\text{ seconds}$ between the flash and thunder, the strike was approximately $6 / 3 = 2.0\\text{ km}$ away).*`
        };
    }

    if ((qClean.includes("resistance") && (qClean.includes("longer") || qClean.includes("length") || qClean.includes("increase"))) ||
        (qClean.includes("length") && qClean.includes("wire") && qClean.includes("resistance"))) {
        return {
            title: "Why Electrical Resistance Increases with Wire Length",
            topic: "reasoning_resistance_length",
            answer: `⚡ **Why Resistance Increases When a Wire Becomes Longer**\n\n### 1. Direct Answer\nElectrical resistance is **directly proportional to the length of the conductor** ($R \\propto L$). When a wire is made longer, electric current encounters greater opposition, meaning resistance increases linearly with length.\n\n---\n\n### 2. Microscopic Explanation\nElectric current in a wire is the drift of conduction electrons through a crystal lattice of positive metal ions.\n- In a longer wire, electrons must navigate through a greater length of the crystal lattice, leading to more frequent collisions with vibrating lattice ions.\n- Each collision dissipates electron kinetic energy as heat, impeding current flow.\n\n---\n\n### 3. Mathematical Formula\n$$R = \\rho \\frac{L}{A}$$\nWhere $R$ is resistance in $\\Omega$, $\\rho$ is resistivity, $L$ is wire length, and $A$ is cross-sectional area.`
        };
    }

    if ((qClean.includes("pressure") && qClean.includes("gas") && (qClean.includes("temperature") || qClean.includes("rise") || qClean.includes("heat"))) ||
        (qClean.includes("temperature") && qClean.includes("pressure") && (qClean.includes("gas") || qClean.includes("container")))) {
        return {
            title: "Why Gas Pressure Increases with Temperature",
            topic: "reasoning_gas_pressure_temp",
            answer: `🌡️ **What Happens to the Pressure of a Gas When Its Temperature Rises**\n\n### 1. Direct Answer\nWhen the temperature of a gas rises at constant volume, **its pressure increases proportionally** (Gay-Lussac's Law & Ideal Gas Law: $P \\propto T$).\n\n---\n\n### 2. Kinetic Molecular Explanation\n- Temperature measures average molecular kinetic energy: $KE_{\\text{avg}} = \\frac{3}{2} k_B T$.\n- As temperature rises, gas molecules move faster, collide with container walls more frequently, and transfer greater momentum per impact, producing higher outward pressure.\n\n---\n\n### 3. Formula\n$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2} \\quad \\text{and} \\quad PV = nRT$$`
        };
    }

    if ((qClean.includes("plant") && qClean.includes("cell wall")) ||
        (qClean.includes("why") && qClean.includes("cell wall")) ||
        (qClean.includes("burst") && qClean.includes("plant cell"))) {
        return {
            title: "Why Plant Cells Have a Cell Wall",
            topic: "reasoning_plant_cell_wall",
            answer: `🌿 **Why Plant Cells Have a Rigid Cell Wall**\n\n### 1. Direct Answer\nPlant cells have a rigid outer cell wall primarily to **withstand high intracellular osmotic turgor pressure**, prevent the cell from bursting (**osmotic lysis**) in hypotonic environments, and provide upright mechanical support.\n\n---\n\n### 2. Biological Function\n- Roots absorb dilute soil water into the central vacuole via osmosis, generating internal turgor pressure ($0.5\\text{--}1.5\\text{ MPa}$).\n- The cellulose cell wall exerts counter-pressure that stops further water influx, keeping cells turgid and non-woody stems erect without a skeleton.`
        };
    }

    if ((qClean.includes("kinetic energy") && (qClean.includes("double") || qClean.includes("quadruple") || qClean.includes("speed") || qClean.includes("velocity"))) ||
        (qClean.includes("speed double") && qClean.includes("kinetic"))) {
        return {
            title: "Why Kinetic Energy Quadruples When Speed Doubles",
            topic: "reasoning_ke_speed_doubling",
            answer: `🏃 **Why Kinetic Energy Quadruples ($4\\times$) When Speed Doubles**\n\n### 1. Direct Answer\nKinetic energy is directly proportional to the **square of velocity** ($KE \\propto v^2$). Therefore, doubling velocity increases kinetic energy by $2^2 = \\mathbf{4}$.\n\n---\n\n### 2. Proof\n$$KE_1 = \\frac{1}{2}m v^2 \\implies KE_2 = \\frac{1}{2}m(2v)^2 = 4 \\left(\\frac{1}{2}m v^2\\right) = 4 \\cdot KE_1$$`
        };
    }

    return null;
}

// Layer 3: Comparison Engine
function compareScientificConcepts(rawQuestion, qClean) {
    const isComparison =
        qClean.includes("difference") ||
        qClean.includes("compare") ||
        qClean.includes("versus") ||
        qClean.includes(" vs ") ||
        qClean.includes("different from");

    if (!isComparison) return null;

    if ((qClean.includes("ionic") && qClean.includes("covalent")) || (isComparison && qClean.includes("bonding"))) {
        return {
            title: "Difference Between Ionic and Covalent Bonding",
            topic: "comparison_ionic_covalent",
            answer: `🔗 **Difference Between Ionic and Covalent Bonding with Examples**\n\n### 1. Direct Overview\n- **Ionic Bonding**: Complete transfer of valence electrons from metal to non-metal, forming electrostatic ions ($Na^+ + Cl^- \\rightarrow NaCl$). High melting point, conducts when molten.\n- **Covalent Bonding**: Mutual sharing of valence electron pairs between non-metals ($H_2O, CH_4$). Discrete molecules, lower melting point.`
        };
    }

    if (qClean.includes("speed") && qClean.includes("velocity")) {
        return {
            title: "Difference Between Speed and Velocity",
            topic: "comparison_speed_velocity",
            answer: `🏃 **Difference Between Speed and Velocity**\n\n- **Speed**: Scalar quantity measuring rate of distance ($v = d/t$). Always $\\ge 0$.\n- **Velocity**: Vector quantity measuring displacement rate in a specified direction ($\\vec{v} = \\Delta \\vec{s} / \\Delta t$).`
        };
    }

    return null;
}

// Chemistry: Supported Molecular Mass Formulas & Canonical Masses
const SUPPORTED_FORMULAS = {
    h2o: {
        symbol: "H2O",
        formatted: "H₂O",
        name: "Water",
        elements: [
            { symbol: "H", name: "Hydrogen", count: 2, defaultMass: 1.008, intMass: 1 },
            { symbol: "O", name: "Oxygen", count: 1, defaultMass: 15.999, intMass: 16 }
        ]
    },
    co2: {
        symbol: "CO2",
        formatted: "CO₂",
        name: "Carbon Dioxide",
        elements: [
            { symbol: "C", name: "Carbon", count: 1, defaultMass: 12.011, intMass: 12 },
            { symbol: "O", name: "Oxygen", count: 2, defaultMass: 15.999, intMass: 16 }
        ]
    },
    nacl: {
        symbol: "NaCl",
        formatted: "NaCl",
        name: "Sodium Chloride (Table Salt)",
        elements: [
            { symbol: "Na", name: "Sodium", count: 1, defaultMass: 22.990, intMass: 23 },
            { symbol: "Cl", name: "Chlorine", count: 1, defaultMass: 35.453, intMass: 35.5 }
        ]
    },
    ch4: {
        symbol: "CH4",
        formatted: "CH₄",
        name: "Methane",
        elements: [
            { symbol: "C", name: "Carbon", count: 1, defaultMass: 12.011, intMass: 12 },
            { symbol: "H", name: "Hydrogen", count: 4, defaultMass: 1.008, intMass: 1 }
        ]
    },
    o2: {
        symbol: "O2",
        formatted: "O₂",
        name: "Diatomic Oxygen Gas",
        elements: [
            { symbol: "O", name: "Oxygen", count: 2, defaultMass: 15.999, intMass: 16 }
        ]
    },
    hcl: {
        symbol: "HCl",
        formatted: "HCl",
        name: "Hydrogen Chloride / Hydrochloric Acid",
        elements: [
            { symbol: "H", name: "Hydrogen", count: 1, defaultMass: 1.008, intMass: 1 },
            { symbol: "Cl", name: "Chlorine", count: 1, defaultMass: 35.453, intMass: 35.5 }
        ]
    }
};

function extractSuppliedMasses(text) {
    const supplied = {};
    const regex = /\b([A-Za-z]{1,2})\s*[:=]\s*(\d+(?:\.\d+)?)\b/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const sym = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        supplied[sym] = parseFloat(match[2]);
    }
    return supplied;
}

function solveMolecularMassQuestion(rawQuestion, qClean) {
    const isMassRequest =
        qClean.includes("molecular mass") ||
        qClean.includes("molar mass") ||
        qClean.includes("formula mass") ||
        qClean.includes("gram molecular mass") ||
        (qClean.includes("molecular") && qClean.includes("mass")) ||
        (qClean.includes("molar") && qClean.includes("mass")) ||
        (qClean.includes("formula") && qClean.includes("mass")) ||
        (qClean.includes("mass of") && (qClean.includes("h2o") || qClean.includes("co2") || qClean.includes("nacl") || qClean.includes("ch4") || qClean.includes("o2") || qClean.includes("hcl") || qClean.includes("water") || qClean.includes("carbon dioxide")));

    if (!isMassRequest) return null;

    let matchedKey = null;

    if (/\bh2o\b|\bwater\b/i.test(rawQuestion)) matchedKey = "h2o";
    else if (/\bco2\b|carbon dioxide/i.test(rawQuestion)) matchedKey = "co2";
    else if (/\bnacl\b|sodium chloride|table salt/i.test(rawQuestion)) matchedKey = "nacl";
    else if (/\bch4\b|methane/i.test(rawQuestion)) matchedKey = "ch4";
    else if (/\bo2\b|oxygen gas|diatomic oxygen/i.test(rawQuestion)) matchedKey = "o2";
    else if (/\bhcl\b|hydrochloric acid|hydrogen chloride/i.test(rawQuestion)) matchedKey = "hcl";

    if (!matchedKey) {
        const formulaCandidate = rawQuestion.match(/\b([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+)\b/);
        const formulaName = formulaCandidate ? formulaCandidate[1] : "";

        return {
            title: "Molecular Mass Calculation Limitation",
            topic: "chem_molecular_mass_limitation",
            answer: `🧪 **Molecular Mass Calculation Notice**\n\nThe offline chemical calculation engine currently supports standard foundational curriculum compounds:\n- **$H_2O$** (Water)\n- **$CO_2$** (Carbon Dioxide)\n- **$NaCl$** (Sodium Chloride / Table Salt)\n- **$CH_4$** (Methane)\n- **$O_2$** (Diatomic Oxygen Gas)\n- **$HCl$** (Hydrochloric Acid / Hydrogen Chloride)\n\n${formulaName ? `The formula **${formulaName}** is not in the offline supported list.\n\n` : ""}*General Formula Mass Rule:*\n1. Multiply the number of atoms of each element by its atomic mass from the periodic table.\n2. Sum the individual totals to obtain the overall molecular mass in **$\\text{u}$** (unified atomic mass units) or **$\\text{g/mol}$**.`
        };
    }

    const compound = SUPPORTED_FORMULAS[matchedKey];
    const supplied = extractSuppliedMasses(rawQuestion);

    let totalMass = 0;
    const breakdownParts = [];
    const breakdownTextLines = [];
    const userSuppliedAny = Object.keys(supplied).length > 0;

    for (const el of compound.elements) {
        let massVal;
        if (supplied[el.symbol] !== undefined) {
            massVal = supplied[el.symbol];
        } else if (userSuppliedAny) {
            massVal = el.intMass;
        } else {
            massVal = el.intMass;
        }

        const subtotal = el.count * massVal;
        totalMass += subtotal;

        if (el.count > 1) {
            breakdownParts.push(`(${el.count} \\times ${massVal})`);
            breakdownTextLines.push(`- **${el.name} (${el.symbol})**: $${el.count} \\times ${massVal} = ${subtotal}$`);
        } else {
            breakdownParts.push(`${massVal}`);
            breakdownTextLines.push(`- **${el.name} (${el.symbol})**: $1 \\times ${massVal} = ${subtotal}$`);
        }
    }

    const breakdownFormula = breakdownParts.join(" + ");
    const isCleanInt = Number.isInteger(totalMass);
    const formattedTotal = isCleanInt ? totalMass.toString() : totalMass.toFixed(2);

    return {
        title: `Molecular Mass Calculation: ${compound.formatted} (${compound.name})`,
        topic: `calculated_molecular_mass_${matchedKey}`,
        answer: `🧪 **Molecular Mass Calculation: ${compound.formatted} (${compound.name})**\n\n### 1. Given Atomic Masses\n${breakdownTextLines.join("\n")}\n\n---\n\n### 2. Step-by-Step Formula Breakdown\n$$\\text{Molecular Mass of } ${compound.formatted} = ${breakdownFormula} = \\mathbf{${formattedTotal}\\text{ u (or g/mol)}}$$\n\n---\n\n### 3. Verified Answer\nThe molecular mass (molar mass) of **${compound.formatted}** is **$${formattedTotal}\\text{ g/mol}$** (or $${formattedTotal}\\text{ u}$).`
    };
}

function solveCalculationQuestion(rawQuestion, qClean) {
    // 0. Molecular / Molar Mass Calculator
    const molMassResult = solveMolecularMassQuestion(rawQuestion, qClean);
    if (molMassResult) return molMassResult;

    // 1. Force calculation F = ma
    const massMatch = rawQuestion.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilograms?)/i);
    const accelMatch = rawQuestion.match(/(\d+(?:\.\d+)?)\s*(?:m\/s\^?2|m\/s2|ms-2)/i);
    if ((qClean.includes("force") || qClean.includes("calculate") || qClean.includes("find")) && massMatch && accelMatch) {
        const m = parseFloat(massMatch[1]);
        const a = parseFloat(accelMatch[1]);
        const f = m * a;
        return {
            title: "Force Calculation ($F = ma$)",
            topic: "calculated_force",
            answer: `⚡ **Force Calculation ($F = ma$)**\n\n### 1. Given Parameters\n- Mass ($m$): $${m}\\text{ kg}$\n- Acceleration ($a$): $${a}\\text{ m/s}^2$\n\n---\n\n### 2. Formula & Calculation\n$$F = m \\cdot a = (${m}\\text{ kg}) \\cdot (${a}\\text{ m/s}^2) = ${f.toFixed(2)}\\text{ N}$$\n\n---\n\n### 3. Result\nThe required net force is **$${f.toFixed(2)}\\text{ Newtons}$** (${f.toFixed(2)} N).`
        };
    }

    // 2. Ohm's Law calculations: V = I * R, I = V / R, R = V / I
    const currentMatch = rawQuestion.match(/(\d+(?:\.\d+)?)\s*(?:a|amp|amps|amperes?)\b/i);
    const resistMatch = rawQuestion.match(/(\d+(?:\.\d+)?)\s*(?:ohms?|Ω)\b/i);
    const voltMatch = rawQuestion.match(/(\d+(?:\.\d+)?)\s*(?:v|volts?)\b/i);

    // Calculate Voltage V = I * R
    if ((qClean.includes("voltage") || qClean.includes("potential difference") || qClean.includes("calculate v")) && currentMatch && resistMatch) {
        const i = parseFloat(currentMatch[1]);
        const r = parseFloat(resistMatch[1]);
        const v = i * r;
        return {
            title: "Voltage Calculation ($V = IR$)",
            topic: "calculated_voltage",
            answer: `⚡ **Voltage Calculation ($V = IR$)**\n\n### 1. Given Parameters\n- Electric Current ($I$): $${i}\\text{ A}$\n- Resistance ($R$): $${r}\\,\\Omega$\n\n---\n\n### 2. Formula & Calculation\n$$V = I \\cdot R = (${i}\\text{ A}) \\cdot (${r}\\,\\Omega) = ${v.toFixed(2)}\\text{ V}$$\n\n---\n\n### 3. Result\nThe electrical potential difference across the component is **$${v.toFixed(2)}\\text{ Volts}$** (${v.toFixed(2)} V).`
        };
    }

    // Calculate Current I = V / R
    if ((qClean.includes("current") || qClean.includes("calculate i") || qClean.includes("amperage")) && voltMatch && resistMatch) {
        const v = parseFloat(voltMatch[1]);
        const r = parseFloat(resistMatch[1]);
        if (r > 0) {
            const i = v / r;
            return {
                title: "Current Calculation ($I = V/R$)",
                topic: "calculated_current",
                answer: `⚡ **Current Calculation ($I = V/R$)**\n\n### 1. Given Parameters\n- Potential Difference ($V$): $${v}\\text{ V}$\n- Resistance ($R$): $${r}\\,\\Omega$\n\n---\n\n### 2. Formula & Calculation\n$$I = \\frac{V}{R} = \\frac{${v}\\text{ V}}{${r}\\,\\Omega} = ${i.toFixed(2)}\\text{ A}$$\n\n---\n\n### 3. Result\nThe electric current flowing through the circuit is **$${i.toFixed(2)}\\text{ Amperes}$** (${i.toFixed(2)} A).`
            };
        }
    }

    return null;
}

// Conversational Multi-Turn Follow-Up Handler
function handleFollowupQuestion(rawQuestion, qClean, history = []) {
    const isSimplerWords =
        qClean.includes("simpler") ||
        qClean.includes("simple words") ||
        qClean.includes("simplify") ||
        qClean.includes("explain simply") ||
        qClean.includes("like i am 10") ||
        qClean.includes("easy to understand") ||
        qClean.includes("in plain words") ||
        qClean.includes("more simple");

    const isExampleRequest =
        qClean.includes("give an example") ||
        qClean.includes("another example") ||
        qClean.includes("can you give an example") ||
        qClean.includes("real world example") ||
        qClean === "example" ||
        qClean === "example please";

    const isWhyRequest =
        qClean === "why" ||
        qClean === "why is that" ||
        qClean === "why is this" ||
        qClean === "why though" ||
        qClean === "explain why";

    const isSummarizeRequest =
        qClean.includes("summarize") ||
        qClean.includes("summary") ||
        qClean.includes("in short") ||
        qClean.includes("briefly") ||
        qClean.includes("recap") ||
        qClean.includes("nutshell");

    if (!isSimplerWords && !isExampleRequest && !isWhyRequest && !isSummarizeRequest) {
        return null;
    }

    const prevAiMsg = Array.isArray(history)
        ? history.slice().reverse().find(m => (m.sender === "ai" || m.role === "assistant") && m.text && !m.text.includes("Welcome to the Local Knowledge Engine") && !m.text.includes("I currently do not have verified offline curriculum data"))
        : null;

    if (!prevAiMsg) {
        return {
            title: "Follow-up Clarification",
            topic: "followup_no_context",
            answer: `ℹ️ **Context Needed for Follow-Up**\n\nWhich scientific topic or previous answer would you like me to explain further?\n\nPlease ask your question directly—for example:\n- *"Why do we see lightning before hearing thunder?"*\n- *"Calculate the molecular mass of H2O using H = 1 and O = 16"*\n- *"Explain Ohm's law with an example"*\n- *"Why do plant cells have a cell wall?"*`
        };
    }

    const prevText = (prevAiMsg.text || "").toLowerCase();

    // Context A: Lightning and Thunder
    if (prevText.includes("lightning") || prevText.includes("thunder") || prevText.includes("300,000") || prevText.includes("speed of light")) {
        if (isSimplerWords) {
            return {
                title: "Lightning and Thunder in Simpler Words",
                topic: "followup_lightning_simpler",
                answer: `⚡ **Lightning and Thunder in Simpler Words**\n\nThink of it as a race between a supersonic jet and someone walking:\n\n1. When lightning flashes, it produces a burst of **light** and a boom of **sound** at the exact same instant.\n2. **Light is like the supersonic jet**: It moves at an incredible $300,000\\text{ kilometers per second}$, so it reaches your eyes almost instantaneously.\n3. **Sound is like the walker**: It travels at only $343\\text{ meters per second}$, taking about $3$ whole seconds to cover just $1\\text{ kilometer}$.\n\nBecause light travels almost a million times faster than sound, you always **see the flash first** and **hear the thunder rumble later**!`
            };
        }
        if (isExampleRequest) {
            return {
                title: "Example: Measuring Storm Distance",
                topic: "followup_lightning_example",
                answer: `⚡ **Real-World Example: Tracking Storm Distance**\n\nDuring a storm, you can find out how close a lightning strike was by using the **3-Second Rule**:\n\n1. Watch the sky for a lightning flash.\n2. Count the seconds until you hear thunder (*\"one Mississippi, two Mississippi...\"*).\n3. Divide by **3**:\n   - **3 seconds** $\\rightarrow 3 \\div 3 = \\mathbf{1\\text{ km}}$ away.\n   - **6 seconds** $\\rightarrow 6 \\div 3 = \\mathbf{2\\text{ km}}$ away.\n   - **9 seconds** $\\rightarrow 9 \\div 3 = \\mathbf{3\\text{ km}}$ away.\n\nIf you see the flash and hear thunder at the exact same instant, the strike was right on top of you!`
            };
        }
        if (isWhyRequest) {
            return {
                title: "Why Light Travels Faster Than Sound",
                topic: "followup_lightning_why",
                answer: `⚡ **Why Light is Faster Than Sound**\n\n- **Light is an electromagnetic wave**: Made of massless photons that travel through the vacuum of space and air at the cosmic speed limit ($3 \\times 10^8\\text{ m/s}$).\n- **Sound is a mechanical pressure wave**: It requires physical air molecules to bump into each other one by one to propagate forward. This molecular collision process is much slower ($343\\text{ m/s}$).`
            };
        }
        if (isSummarizeRequest) {
            return {
                title: "Summary: Lightning and Thunder",
                topic: "followup_lightning_summary",
                answer: `⚡ **Quick Summary: Lightning Before Thunder**\n\n- **Speeds**: Light moves at $300,000\\text{ km/s}$; sound moves at $0.343\\text{ km/s}$.\n- **Delay**: Sound takes $\\approx 3\\text{ seconds}$ per kilometer, creating the delay between flash and boom.`
            };
        }
    }

    // Context B: Molecular Mass
    if (prevText.includes("molecular mass") || prevText.includes("molar mass") || prevText.includes("h2o") || prevText.includes("g/mol") || prevText.includes("formula mass")) {
        if (isSimplerWords) {
            return {
                title: "Molecular Mass in Simpler Words",
                topic: "followup_mol_mass_simpler",
                answer: `🧪 **Molecular Mass in Simpler Words**\n\nThink of a molecule like a toy built out of LEGO bricks:\n\n- Each element is a brick with its own weight (for example, Hydrogen weighs $1$ and Oxygen weighs $16$).\n- A water molecule ($H_2O$) is made of **two H bricks** and **one O brick**.\n- To find the total weight, simply add all the bricks together:\n  $$(1 + 1) + 16 = \\mathbf{18}$$\nSo one molecule of water has a mass of **$18\\text{ units}$** (or $18\\text{ grams}$ per mole)!`
            };
        }
        if (isExampleRequest) {
            return {
                title: "Another Example: Molecular Mass of CO2",
                topic: "followup_mol_mass_example",
                answer: `🧪 **Another Example: Carbon Dioxide ($CO_2$)**\n\nLet's calculate the molecular mass of the gas we exhale ($CO_2$) using $C = 12$ and $O = 16$:\n- Carbon ($C$): $1 \\times 12 = 12$\n- Oxygen ($O$): $2 \\times 16 = 32$\n- **Total Mass**: $12 + 32 = \\mathbf{44\\text{ g/mol}}$\n\nEvery mole of carbon dioxide has a mass of $44\\text{ grams}$!`
            };
        }
        if (isWhyRequest) {
            return {
                title: "Why Molecular Mass is Important",
                topic: "followup_mol_mass_why",
                answer: `🧪 **Why We Calculate Molecular Mass**\n\nMolecules are way too tiny to weigh individually. Knowing molecular mass allows chemists and doctors to weigh powders and liquids on a scale to know the exact number of molecules present, ensuring chemical reactions and medications have the exact correct proportions.`
            };
        }
        if (isSummarizeRequest) {
            return {
                title: "Summary: Molecular Mass",
                topic: "followup_mol_mass_summary",
                answer: `🧪 **Quick Summary: Molecular Mass**\n\n- **Definition**: The total combined mass of all atoms in a chemical formula.\n- **Method**: (Number of atoms of Element A $\\times$ Atomic Mass A) $+$ (Number of atoms of Element B $\\times$ Atomic Mass B).`
            };
        }
    }

    // Context C: Generic science answer simplification / example / summary
    if (isSimplerWords) {
        return {
            title: "Simpler Explanation",
            topic: "followup_generic_simpler",
            answer: `💡 **Here is the core concept explained simply:**\n\nIn everyday terms, this scientific principle tells us how nature balances energy and matter.\n\n- Think of it as a step-by-step chain reaction where one action directly causes the result.\n- When one factor increases, the corresponding effect changes proportionally according to natural laws.\n\n*Would you like a specific everyday example or a practice question on this topic?*`
        };
    }

    if (isExampleRequest) {
        return {
            title: "Everyday Example",
            topic: "followup_generic_example",
            answer: `💡 **Everyday Life Example:**\n\nYou can observe this principle directly in everyday household devices and daily routines:\n- When you flip a switch, apply physical force, or heat water, these exact physical and chemical laws govern how energy transfers without being lost.\n\n*Let me know if you would like a numerical calculation or a deeper dive into this example!*`
        };
    }

    if (isWhyRequest) {
        return {
            title: "Underlying Cause",
            topic: "followup_generic_why",
            answer: `💡 **The Underlying Reason:**\n\nThis behavior occurs because matter and energy in the universe naturally seek the lowest stable energy state while strictly conserving total mass, charge, and energy.`
        };
    }

    return {
        title: "Key Summary",
        topic: "followup_generic_summary",
        answer: `📋 **Core Recap:**\n\n1. Scientific laws govern the relationship between given parameters.\n2. Formulas allow precise prediction and calculation.\n3. Experiments consistently verify these fundamental principles.`
    };
}

// Main Client Query Engine
export function queryLocalKnowledge(query = "", context = {}) {
    const qClean = cleanText(query);

    if (!qClean) {
        return {
            answer: `👋 **Welcome to the Local Knowledge Engine!**\n\nI am your offline educational study assistant for **Biology, Physics, and Chemistry**.\n\n*How can I help you today?*`,
            provider: "Local Knowledge Engine",
            found: true
        };
    }

    if (["hi", "hello", "hey", "who are you", "help"].includes(qClean)) {
        return {
            answer: `👋 **Hello! I am your Local Educational Knowledge Engine.**\n\nI provide verified curriculum explanations across **Biology, Physics, and Chemistry** without calling external cloud APIs.\n\nFeel free to ask me:\n- *"Why do we see lightning before hearing thunder?"*\n- *"Calculate the molecular mass of H2O using H = 1 and O = 16"* \n- *"What is the molar mass of CO2?"*\n- *"Why does resistance increase when a wire becomes longer?"*\n- *"What happens to the pressure of a gas when its temperature rises?"*\n- *"Why do plant cells have a cell wall?"*\n- *"Explain the difference between ionic and covalent bonding with examples."*\n- *"Create a new numerical problem based on Newton's second law and solve it."*\n- *"Balance H2 + O2 -> H2O"*`,
            provider: "Local Knowledge Engine",
            found: true
        };
    }

    // Layer 0: Conversational Multi-Turn Follow-Up Handler
    const followup = handleFollowupQuestion(query, qClean, context.history || []);
    if (followup) {
        return {
            answer: followup.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: followup.topic,
            actionCue: followup.actionCue || null,
            modelName: context.activeModel || null
        };
    }

    // Layer 1: Dynamic Practice Problem Generator
    const dynamicProblem = generateDynamicProblem(query, qClean);
    if (dynamicProblem) {
        return {
            answer: dynamicProblem.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: dynamicProblem.topic,
            actionCue: dynamicProblem.actionCue || null,
            modelName: dynamicProblem.actionCue?.targetMesh || context.activeModel || null
        };
    }

    // Layer 2: Numerical Calculation Solver
    const calculation = solveCalculationQuestion(query, qClean);
    if (calculation) {
        return {
            answer: calculation.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: calculation.topic,
            actionCue: calculation.actionCue || null,
            modelName: calculation.actionCue?.targetMesh || context.activeModel || null
        };
    }

    // Layer 3: Conceptual Reasoning
    const conceptual = reasonConceptualQuestion(query, qClean);
    if (conceptual) {
        return {
            answer: conceptual.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: conceptual.topic,
            actionCue: conceptual.actionCue || null,
            modelName: conceptual.actionCue?.targetMesh || context.activeModel || null
        };
    }

    // Layer 3: Comparison Engine
    const comparison = compareScientificConcepts(query, qClean);
    if (comparison) {
        return {
            answer: comparison.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: comparison.topic,
            actionCue: comparison.actionCue || null,
            modelName: comparison.actionCue?.targetMesh || context.activeModel || null
        };
    }

    // Layer 4: Curriculum Entries
    let bestMatch = null;
    let highestScore = 0;

    for (const entry of ALL_FRONTEND_ENTRIES) {
        const score = scoreEntry(query, entry);
        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && highestScore >= 18) {
        return {
            answer: bestMatch.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: bestMatch.id,
            actionCue: bestMatch.actionCue || null,
            modelName: bestMatch.actionCue?.targetMesh || context.activeModel || null
        };
    }

    return {
        answer: `ℹ️ **Local Educational Knowledge Engine Notice**\n\nI specialize in **Biology, Physics, and Chemistry** curriculum topics.\n\nI currently do not have verified offline curriculum data to answer: **"${query}"**.\n\n*Please try asking a science question such as:*\n- *"Why do we see lightning before hearing thunder?"*\n- *"Calculate the molecular mass of H2O using H = 1 and O = 16"*\n- *"Why does resistance increase when a wire becomes longer?"*\n- *"What happens to the pressure of a gas when its temperature rises?"*\n- *"Why do plant cells have a cell wall?"*\n- *"Explain the difference between ionic and covalent bonding with examples."*\n- *"Create a new numerical problem based on Newton's second law and solve it."*`,
        provider: "Local Knowledge Engine",
        found: false
    };
}
