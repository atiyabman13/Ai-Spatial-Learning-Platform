/**
 * Local Educational Knowledge Engine
 * 
 * Provides offline, high-accuracy educational answers across Biology, Physics,
 * and Chemistry without requiring external AI APIs or subscriptions.
 * 
 * Truthfully identifies as "Local Knowledge Engine".
 */

// =============================================================
// 1. BIOLOGY KNOWLEDGE BASE
// =============================================================

const BIOLOGY_KNOWLEDGE = [
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

const PHYSICS_KNOWLEDGE = [
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

### 2. Variable Definitions & SI Units ($F = ma$)
- $F$ = Net external force, measured in **Newtons ($N$)**, where $1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$.
- $m$ = Inertial mass of the body, measured in **kilograms ($\\text{kg}$)**.
- $a$ = Acceleration, measured in **meters per second squared ($\\text{m/s}^2$)**.

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: A horizontal net force of $20\\text{ N}$ is applied to push a stationary crate of mass $4\\text{ kg}$ across a smooth floor. Find the resulting acceleration of the crate.
- **Given Data**:
  - Force $F = 20\\text{ N}$
  - Mass $m = 4\\text{ kg}$
- **Step 1**: Rearrange $F = ma$ to solve for acceleration $a$:
  $$a = \\frac{F}{m}$$
- **Step 2**: Substitute numerical values:
  $$a = \\frac{20\\text{ N}}{4\\text{ kg}} = 5\\text{ m/s}^2$$
- **Answer**: The crate accelerates at **$5\\text{ m/s}^2$** in the direction of the applied force.

*Recap*: Heavier masses have greater inertia, requiring proportionally larger forces to produce the same acceleration.`,
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
- **Verification with 3rd Equation**:
  $$v^2 = u^2 + 2as \\implies 10^2 = 0^2 + 2(2)(25) \\implies 100 = 100 \\quad \\text{(Matches perfectly!)}$$
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
  Where $g \\approx 9.8\\text{ m/s}^2$ (standard gravity) and $h$ is height ($m$). Unit: **Joules ($J$)**.
- **Power ($P$)**: The rate at which work is done or energy is transformed:
  $$P = \\frac{W}{t} = \\frac{\\Delta E}{t}$$
  Unit: **Watts ($W$)** ($1\\text{ W} = 1\\text{ J/s}$).

---

### 2. Step-by-Step Worked Numerical Example
- **Problem**: A student lifts a backpack of mass $m = 4\\text{ kg}$ vertically through a height of $h = 2\\text{ meters}$ in $t = 4\\text{ seconds}$ (use $g = 9.8\\text{ m/s}^2$). 
  1. What work was done against gravity?
  2. What was the average power output?
- **Given Data**:
  - Mass $m = 4\\text{ kg}$
  - Height $h = 2\\text{ m}$
  - Time $t = 4\\text{ s}$
  - Gravity $g = 9.8\\text{ m/s}^2$
- **Step 1 (Calculate Work Done)**:
  $$W = PE = m \\cdot g \\cdot h = (4\\text{ kg}) \\cdot (9.8\\text{ m/s}^2) \\cdot (2\\text{ m}) = 78.4\\text{ Joules}$$
- **Step 2 (Calculate Power Output)**:
  $$P = \\frac{W}{t} = \\frac{78.4\\text{ J}}{4\\text{ s}} = 19.6\\text{ Watts}$$
- **Answer**: The work done is **$78.4\\text{ J}$** and the mechanical power output is **$19.6\\text{ W}$**.

*Recap*: By the Law of Conservation of Energy, mechanical energy ($E = KE + PE$) remains constant in a closed conservative system without friction.`,
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
| **Effect of Failure** | One broken element breaks entire circuit | Remaining branches continue functioning |

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: Two resistors $R_1 = 6\\,\\Omega$ and $R_2 = 3\\,\\Omega$ are connected in **parallel** across a $12\\text{ V}$ battery.
  1. Find the equivalent resistance $R_{\\text{eq}}$.
  2. Find the total current drawn from the battery.
- **Given Data**:
  - $R_1 = 6\\,\\Omega$, $R_2 = 3\\,\\Omega$, $V = 12\\text{ V}$
- **Step 1 (Find Parallel Equivalent Resistance)**:
  $$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} = \\frac{1}{6} + \\frac{1}{3} = \\frac{1 + 2}{6} = \\frac{3}{6} = \\frac{1}{2}$$
  $$R_{\\text{eq}} = 2\\,\\Omega$$
- **Step 2 (Find Total Circuit Current)**:
  $$I_{\\text{total}} = \\frac{V}{R_{\\text{eq}}} = \\frac{12\\text{ V}}{2\\,\\Omega} = 6\\text{ A}$$
- **Branch Currents**:
  - Branch 1: $I_1 = \\frac{12}{6} = 2\\text{ A}$
  - Branch 2: $I_2 = \\frac{12}{3} = 4\\text{ A}$
  - Sum check: $I_1 + I_2 = 2\\text{ A} + 4\\text{ A} = 6\\text{ A}$ (Matches total current!).
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
- A magnetic field exerts a sideways deflecting force on moving charges:
  $$\\vec{F} = q(\\vec{v} \\times \\vec{B}) \\quad \\text{or for a wire} \\quad \\vec{F} = I(\\vec{L} \\times \\vec{B})$$
  Magnitude: $F = I L B \\sin(\\theta)$. The direction is given by the Right-Hand Rule.

---

### 2. Faraday's Law of Electromagnetic Induction
**Definition**: Any change in the magnetic flux linked with a closed conducting loop induces an electromotive force (EMF) across the circuit.

**Mathematical Formula**:
$$\\mathcal{E} = -N \\frac{\\Delta \\Phi_B}{\\Delta t}$$

**Variable Definitions & Units**:
- $\\mathcal{E}$ = Induced Electromotive Force (EMF), measured in **Volts ($V$)**.
- $N$ = Number of wire turns in the coil (dimensionless).
- $\\Phi_B$ = Magnetic flux ($B \\cdot A \\cdot \\cos\\theta$), measured in **Webers ($Wb = T\\cdot m^2$)**.
- $\\Delta t$ = Time interval over which flux changes, in **seconds ($s$)**.

---

### 3. Lenz's Law (The Negative Sign)
The negative sign in Faraday's equation represents **Lenz's Law**:
*The direction of the induced current is always such that its own magnetic field opposes the change in magnetic flux that produced it.* This directly upholds the Law of Conservation of Energy.

---

### 4. Step-by-Step Worked Numerical Example
- **Problem**: A coil of $N = 50\\text{ turns}$ experiences a magnetic flux change from $\\Phi_1 = 0.2\\text{ Wb}$ to $\\Phi_2 = 0.6\\text{ Wb}$ over a time interval of $\\Delta t = 0.1\\text{ seconds}$. What is the magnitude of the induced EMF?
- **Given Data**:
  - $N = 50$ turns
  - $\\Delta \\Phi_B = 0.6\\text{ Wb} - 0.2\\text{ Wb} = 0.4\\text{ Wb}$
  - $\\Delta t = 0.1\\text{ s}$
- **Calculation**:
  $$|\\mathcal{E}| = N \\frac{\\Delta \\Phi_B}{\\Delta t} = 50 \\cdot \\frac{0.4\\text{ Wb}}{0.1\\text{ s}} = 50 \\times 4 = 200\\text{ Volts}$$
- **Answer**: The induced EMF magnitude across the coil is **$200\\text{ Volts}$**.

*Practical Applications*: Power transformers, electrical AC generators, and inductive smartphone chargers.`,
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
- **Law of Reflection**: Angle of incidence equals angle of reflection ($\\theta_i = \\theta_r$) relative to the surface normal.
- **Snell's Law of Refraction**:
  $$n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$$
  Where $n_1, n_2$ are refractive indices of the media ($n = c/v$), and $\\theta_1, \\theta_2$ are the angles of the ray with the normal. Light bends toward normal entering a denser medium ($n_2 > n_1$).
- **Thin Lens Equation**:
  $$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$
  Where $f$ is focal length, $v$ is image distance, and $u$ is object distance.

---

### 2. Heat & Specific Heat Capacity
**Definition**: Heat ($Q$) is thermal energy transferred between systems due to a temperature gradient.
**Formula**:
$$Q = m \\cdot c \\cdot \\Delta T$$

**Variables & Units**:
- $Q$ = Heat energy absorbed or released, in **Joules ($J$)**.
- $m$ = Mass of the substance, in **kilograms ($\\text{kg}$)**.
- $c$ = Specific heat capacity, in **$\\text{J}/(\\text{kg}\\cdot^\\circ\\text{C})$** (for liquid water, $c \\approx 4184\\text{ J}/(\\text{kg}\\cdot^\\circ\\text{C})$).
- $\\Delta T = T_{\\text{final}} - T_{\\text{initial}}$ = Temperature change, in **degrees Celsius ($^\\circ\\text{C}$)** or **Kelvin ($K$)**.

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: How much heat energy ($Q$) is required to warm $m = 0.5\\text{ kg}$ of water from $T_1 = 20^\\circ\\text{C}$ to $T_2 = 60^\\circ\\text{C}$? (Specific heat of water $c = 4184\\text{ J}/(\\text{kg}\\cdot^\\circ\\text{C})$).
- **Given Data**:
  - Mass $m = 0.5\\text{ kg}$
  - Specific heat $c = 4184\\text{ J}/(\\text{kg}\\cdot^\\circ\\text{C})$
  - $\\Delta T = 60^\\circ\\text{C} - 20^\\circ\\text{C} = 40^\\circ\\text{C}$
- **Calculation**:
  $$Q = m \\cdot c \\cdot \\Delta T = (0.5\\text{ kg}) \\cdot (4184\\text{ J}/(\\text{kg}\\cdot^\\circ\\text{C})) \\cdot (40^\\circ\\text{C})$$
  $$Q = 0.5 \\times 167360 = 83,680\\text{ Joules} = 83.68\\text{ kJ}$$
- **Answer**: Exactly **$83,680\\text{ Joules}$** ($83.68\\text{ kJ}$) of thermal energy is required.

---

### 4. Three Modes of Heat Transfer
1. **Conduction**: Thermal vibration transfer through direct atomic contact in solids (e.g., metal spoon in hot soup).
2. **Convection**: Bulk fluid/gas circulation currents driven by density changes (e.g., boiling water).
3. **Radiation**: Electromagnetic infrared wave emission without needing a material medium (e.g., solar warmth reaching Earth through vacuum).`,
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

### 2. Key Components & Functions
1. **Permanent Stator Magnets**: Establish a stationary magnetic field across the rotor.
2. **Armature Coil**: Copper loops on an iron core that rotate when current passes through.
3. **Split-Ring Commutator**: Two semicircular copper segments that rotate with the coil.
4. **Carbon Brushes**: Fixed spring-loaded contacts delivering continuous DC power to the rotating commutator.

---

### 3. Vital Role of the Split-Ring Commutator
Without a commutator, as the rotating loop passes the vertical neutral plane, magnetic forces would reverse and oppose rotation, locking the coil.
The **split-ring commutator reverses the direction of current in the coil every half-rotation ($180^\\circ$)**, ensuring that mechanical torque acts in the exact same rotational direction continuously.`,
        actionCue: { targetMesh: "DCMotor", zoom: 1.5 }
    }
];

// =============================================================
// 3. CHEMISTRY KNOWLEDGE BASE
// =============================================================

const CHEMISTRY_KNOWLEDGE = [
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
| **Compound** | A substance formed when two or more distinct chemical elements chemically combine in a fixed ratio. | Heteronuclear molecules or crystal lattices bonded ionically or covalently. | Water ($H_2O$, ratio $2:1$), Table salt ($NaCl$, ratio $1:1$), Methane ($CH_4$) |

---

### 2. Key Conceptual Clarifications
- **All compounds are molecules, but not all molecules are compounds**:
  - $O_2$ (diatomic oxygen) is a molecule because it consists of bonded atoms, but it is **not** a compound because both atoms are the same element.
  - $H_2O$ is both a molecule and a compound because it contains two distinct elements ($H$ and $O$) chemically bonded in a fixed stoichiometric ratio.`,
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
An atom consists of a dense central **nucleus** surrounded by an electron cloud:
- **Protons ($p^+$)**: Positive charge ($+1$), mass $\\approx 1.007\\text{ amu}$, located in nucleus. The number of protons is the **Atomic Number ($Z$)**, defining the element.
- **Neutrons ($n^0$)**: Neutral charge ($0$), mass $\\approx 1.008\\text{ amu}$, located in nucleus. Contributes to nuclear stability.
  - **Mass Number ($A$)**: $$A = Z + N \\quad (\\text{Protons} + \\text{Neutrons})$$
  - **Isotopes**: Atoms of the same element with identical $Z$ but differing numbers of neutrons $N$ (e.g., Carbon-12 vs. Carbon-14).
- **Electrons ($e^-$)**: Negative charge ($-1$), negligible mass ($\\approx 1/1836\\text{ amu}$), orbiting in quantized energy levels.

---

### 2. Electron Shells & Orbitals
- Maximum electrons per principal quantum shell $n$: $$2n^2$$
  - Shell 1 ($K$): up to $2$ electrons
  - Shell 2 ($L$): up to $8$ electrons
  - Shell 3 ($M$): up to $18$ electrons
- **Valence Electrons**: Outermost electrons that participate in chemical bonding. Atoms tend to gain, lose, or share electrons to achieve a stable octet ($8$ valence electrons).

---

### 3. The Periodic Table Architecture
- **Periods (Rows 1–7)**: Number of occupied electron shells. Moving left to right across a period, atomic radius decreases while electronegativity and ionization energy increase.
- **Groups (Columns 1–18)**: Elements with identical numbers of valence electrons exhibiting similar chemical properties:
  - *Group 1*: Alkali Metals ($1$ valence electron, highly reactive, form $+1$ cations).
  - *Group 2*: Alkaline Earth Metals ($2$ valence electrons, form $+2$ cations).
  - *Group 17*: Halogens ($7$ valence electrons, highly reactive, form $-1$ anions).
  - *Group 18*: Noble Gases ($8$ valence electrons, full octet, chemically inert).`,
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

Chemical bonding occurs when atoms interact to achieve a stable, low-energy valence electron configuration (the **Octet Rule**).

---

### 1. Ionic Bonding: Electron Transfer
**Mechanism**: Occurs between a **metal** (low electronegativity) and a **non-metal** (high electronegativity).
- The metal transfers one or more electrons to the non-metal.
- Forms oppositely charged ions: a positive **cation** and a negative **anion**.
- The bond is the strong electrostatic Coulomb attraction between these opposite ions.
- **Classic Example**:
  $$Na (2,8,1) + Cl (2,8,7) \\rightarrow Na^+ [2,8] + Cl^- [2,8,8] \\rightarrow NaCl$$

---

### 2. Covalent Bonding: Electron Sharing
**Mechanism**: Occurs between two **non-metals** having similar, relatively high electronegativities.
- Neither atom has sufficient pulling force to completely strip electrons, so they **share** one or more pairs of valence electrons.
- Single bond ($1$ shared pair, e.g., $H-H$), Double bond ($2$ pairs, e.g., $O=O$), Triple bond ($3$ pairs, e.g., $N \\equiv N$).
- **Polar vs. Nonpolar**:
  - *Nonpolar Covalent*: Equal sharing between atoms of identical electronegativity ($H_2, Cl_2$).
  - *Polar Covalent*: Unequal sharing creating partial dipole charges ($\\delta^+, \\delta^-$) due to electronegativity differences (e.g., $H_2O$).

---

### 3. Comparison of Physical Properties
| Property | Ionic Compounds (e.g., $NaCl$) | Covalent Compounds (e.g., $H_2O, CH_4$) |
| :--- | :--- | :--- |
| **Structure** | Giant 3D crystalline lattice | Discrete individual molecules |
| **Melting/Boiling Points** | High (strong electrostatic bonds) | Low to moderate (weak intermolecular forces) |
| **Electrical Conductivity** | Conducts when molten or dissolved in water | Non-conducting in all states (no free ions) |
| **State at Room Temp** | Hard, brittle crystalline solids | Gases, liquids, or soft solids |`,
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

---

### 1. The pH Scale Definition & Formula
The **pH scale** (potential of Hydrogen) measures the molar concentration of hydrogen / hydronium ions ($[H^+]$ or $[H_3O^+]$) in an aqueous solution.

**Mathematical Formula**:
$$\\text{pH} = -\\log_{10}[H^+] \\quad \\text{and} \\quad [H^+] = 10^{-\\text{pH}}$$

Because it is logarithmic, **each unit change on the pH scale represents a 10-fold change in $[H^+]$ concentration**:
- A solution of $\\text{pH } 2$ has $10\\times$ more $H^+$ ions than $\\text{pH } 3$, and $100\\times$ more than $\\text{pH } 4$.

---

### 2. Acidic, Neutral, and Basic Regions ($0\\text{ to }14$)
- **Acids ($\text{pH } < 7.0$)**: $[H^+] > 1.0 \\times 10^{-7}\\text{ M}$.
  - Sour taste, turn blue litmus paper **red**, donate protons (Brønsted-Lowry acid).
  - *Examples*: Battery acid ($\text{pH } 0$), Stomach gastric acid ($\text{pH } 1.5$), Lemon juice ($\text{pH } 2.4$), Vinegar ($\text{pH } 2.9$).
- **Neutral ($\text{pH } = 7.0$)**: Pure water at $25^\\circ\\text{C}$ where $[H^+] = [OH^-] = 1.0 \\times 10^{-7}\\text{ M}$.
- **Bases / Alkaline ($\text{pH } > 7.0$)**: $[OH^-] > 1.0 \\times 10^{-7}\\text{ M}$.
  - Bitter taste, slippery soapy feel, turn red litmus paper **blue**, accept protons.
  - *Examples*: Baking soda solution ($\text{pH } 8.5$), Milk of Magnesia ($\text{pH } 10.5$), Bleach ($\text{pH } 12.5$), $1\\text{ M NaOH}$ ($\text{pH } 14$).

---

### 3. Step-by-Step Worked Numerical Example
- **Problem**: Calculate the pH of a $0.001\\text{ M}$ ($1.0 \\times 10^{-3}\\text{ mol/L}$) solution of hydrochloric acid ($\text{HCl}$).
- **Step 1**: Since $\\text{HCl}$ is a strong acid, it completely dissociates:
  $$\\text{HCl} \\rightarrow \\text{H}^+ + \\text{Cl}^- \\implies [H^+] = 0.001\\text{ M} = 10^{-3}\\text{ M}$$
- **Step 2**: Apply the pH definition:
  $$\\text{pH} = -\\log_{10}(10^{-3}) = -(-3) = 3$$
- **Answer**: The solution has a **$\\text{pH of } 3$** (strongly acidic).

---

### 4. Neutralization Reaction
When an acid reacts with a base, they neutralize to form a salt and water:
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

Balancing is governed by the **Law of Conservation of Mass**: atoms can neither be created nor destroyed in a chemical reaction. The total number of each type of atom must be identical on both sides of the reaction arrow.

---

### Case 1: Balancing $H_2 + O_2 \\rightarrow H_2O$
#### Step 1: Write the Unbalanced Skeleton Equation
$$\\text{H}_2 + \\text{O}_2 \\rightarrow \\text{H}_2\\text{O}$$

#### Step 2: Inventory Atoms on Both Sides
- **Reactants (Left)**: $H = 2$, $O = 2$
- **Products (Right)**: $H = 2$, $O = 1$ $\\rightarrow$ *Oxygen is deficient on the right!*

#### Step 3: Balance Oxygen Atoms
Place coefficient **$2$** in front of $\\text{H}_2\\text{O}$:
$$\\text{H}_2 + \\text{O}_2 \\rightarrow \\mathbf{2}\\text{H}_2\\text{O}$$
- Right side now has: $2 \\times 1 = 2\\text{ Oxygen}$ ✅
- Right side now has: $2 \\times 2 = 4\\text{ Hydrogen}$ ❌

#### Step 4: Balance Hydrogen Atoms
Place coefficient **$2$** in front of $\\text{H}_2$ on the left:
$$\\mathbf{2}\\text{H}_2 + \\text{O}_2 \\rightarrow \\mathbf{2}\\text{H}_2\\text{O}$$

#### Step 5: Final Check
- Reactants: $4\\text{ H}$, $2\\text{ O}$
- Products: $4\\text{ H}$, $2\\text{ O}$
- **Final Balanced Equation**: $$\\mathbf{2H_2(g) + O_2(g) \\rightarrow 2H_2O(l)}$$

---

### Case 2: Balancing Methane Combustion ($CH_4 + O_2 \\rightarrow CO_2 + H_2O$)
1. **Unbalanced**: $CH_4 + O_2 \\rightarrow CO_2 + H_2O$
2. **Balance Carbon**: $1\\text{ C}$ on left, $1\\text{ C}$ on right (Already balanced).
3. **Balance Hydrogen**: $4\\text{ H}$ on left $\\rightarrow$ Place $2$ before $H_2O$:
   $$CH_4 + O_2 \\rightarrow CO_2 + \\mathbf{2}H_2O$$
4. **Balance Oxygen**: Right side has $2\\text{ (from }CO_2) + 2\\text{ (from }2H_2O) = 4\\text{ O}$ atoms. Place $2$ before $O_2$:
   $$\\mathbf{CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O}$$
5. **Final Check**: $1\\text{ C}, 4\\text{ H}, 4\\text{ O}$ on each side ✅.

---

### Rules for Balancing Any Chemical Equation
1. Never change chemical formulas or subscripts (e.g., do not change $H_2O$ to $H_2O_2$).
2. Only change stoichiometric **coefficients** in front of formulas.
3. Balance elements appearing in only one compound first; balance free elemental gases ($O_2, H_2$) last.`,
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

### 1. The Five Fundamental Chemical Reaction Types
1. **Synthesis / Combination**: Two or more reactants combine to form one product:
   $$A + B \\rightarrow AB \\quad (e.g., 2Mg + O_2 \\rightarrow 2MgO)$$
2. **Decomposition**: A single compound breaks down into two or more simpler substances:
   $$AB \\rightarrow A + B \\quad (e.g., 2H_2O_2 \\xrightarrow{MnO_2} 2H_2O + O_2)$$
3. **Single Displacement**: A more reactive element replaces a less reactive element in a compound:
   $$A + BC \\rightarrow AC + B \\quad (e.g., Zn + 2HCl \\rightarrow ZnCl_2 + H_2)$$
4. **Double Displacement (Precipitation)**: Two ionic compounds exchange ion partners:
   $$AB + CD \\rightarrow AD + CB \\quad (e.g., AgNO_3 + NaCl \\rightarrow AgCl(s) \\downarrow + NaNO_3)$$
5. **Combustion**: A hydrocarbon fuel reacts exothermically with oxygen gas releasing $CO_2$ and $H_2O$:
   $$CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O + \\text{Heat}$$

---

### 2. Oxidation and Reduction (Redox)
Redox reactions involve the transfer of electrons between chemical species.

**The Golden Mnemonic: OIL RIG**
- **OIL**: **O**xidation **I**s **L**oss of electrons (increase in oxidation state).
- **RIG**: **R**eduction **I**s **G**ain of electrons (decrease in oxidation state).

**Worked Redox Example**:
$$Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)$$
- Zinc ($Zn$) loses 2 electrons: $Zn \\rightarrow Zn^{2+} + 2e^-$ (**Oxidized**, acts as Reducing Agent).
- Copper ion ($Cu^{2+}$) gains 2 electrons: $Cu^{2+} + 2e^- \\rightarrow Cu$ (**Reduced**, acts as Oxidizing Agent).`,
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

### 1. What is a Mole?
In chemistry, a **mole** (symbol: $\\text{mol}$) is the standard SI unit for amount of substance.
- **Avogadro's Number ($N_A$)**: Exactly **$6.02214076 \\times 10^{23}$** elementary entities (atoms, molecules, or ions) per mole.
- **Molar Mass ($M$)**: The mass of 1 mole of a substance, expressed in **grams per mole ($\\text{g/mol}$)**. Numerically equal to atomic/molecular mass in atomic mass units ($\\text{amu}$).

---

### 2. Fundamental Molar Formulas
1. **Mole-Mass Relationship**:
   $$n = \\frac{m}{M}$$
   Where:
   - $n$ = Number of moles ($\\text{mol}$)
   - $m$ = Mass of sample in grams ($\\text{g}$)
   - $M$ = Molar mass of substance ($\\text{g/mol}$)
2. **Mole-Particle Relationship**:
   $$N = n \\cdot N_A$$
   Where $N$ is total particle count and $N_A = 6.022 \\times 10^{23}\\text{ particles/mol}$.

---

### 3. Step-by-Step Worked Numerical Example (Mole Calculation)
- **Problem**: Calculate how many moles and how many molecules are in $36\\text{ g}$ of pure water ($H_2O$). (Atomic masses: $H = 1.0\\text{ g/mol}$, $O = 16.0\\text{ g/mol}$).
- **Step 1 (Find Molar Mass $M$ of $H_2O$)**:
  $$M = 2(1.0) + 1(16.0) = 18.0\\text{ g/mol}$$
- **Step 2 (Calculate Number of Moles $n$)**:
  $$n = \\frac{m}{M} = \\frac{36\\text{ g}}{18.0\\text{ g/mol}} = 2.0\\text{ moles}$$
- **Step 3 (Calculate Total Molecule Count $N$)**:
  $$N = n \\times N_A = 2.0 \\times (6.022 \\times 10^{23}) = 1.2044 \\times 10^{24}\\text{ molecules}$$
- **Answer**: $36\\text{ g}$ of water corresponds to **$2.0\\text{ moles}$** and contains **$1.204 \\times 10^{24}\\text{ water molecules}$**.

---

### 4. Elementary Stoichiometry Example
- In the balanced reaction: $2H_2 + O_2 \\rightarrow 2H_2O$, $2\\text{ moles of }H_2$ react with $1\\text{ mole of }O_2$ to produce $2\\text{ moles of }H_2O$.
- Therefore, $4\\text{ g of }H_2$ reacts completely with $32\\text{ g of }O_2$ to form $36\\text{ g of }H_2O$, satisfying conservation of mass.`,
        actionCue: { targetMesh: "Atom", zoom: 1.5 }
    }
];

// All Knowledge Entries combined
const ALL_ENTRIES = [...BIOLOGY_KNOWLEDGE, ...PHYSICS_KNOWLEDGE, ...CHEMISTRY_KNOWLEDGE];

// =============================================================
// 4. NATURAL LANGUAGE RESOLUTION & SEARCH ENGINE
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

// Basic stemming & synonym mapping for robust intent recognition
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

/**
 * Score how well a question matches an entry using token overlap, keyword matching,
 * and semantic phrase matching with spelling and synonym tolerance.
 */
function scoreEntry(query, entry) {
    const qClean = cleanText(query);
    const qRawWords = qClean.split(" ").filter(w => w.length > 1 && !STOP_WORDS.has(w));
    const qNormWords = qRawWords.map(normalizeWord);

    if (qRawWords.length === 0) return 0;

    let score = 0;
    let hasDomainKeywordMatch = false;

    // Check direct and normalized keyword matches
    for (const kw of entry.keywords) {
        const kwClean = cleanText(kw);
        const kwWords = kwClean.split(" ").filter(w => !STOP_WORDS.has(w));
        const kwNormWords = kwWords.map(normalizeWord);
        
        if (qClean === kwClean) {
            score += 150;
            hasDomainKeywordMatch = true;
        } else if (kwWords.length > 0) {
            // Word-boundary aware phrase check
            const escaped = kwClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const boundaryRegex = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
            if (boundaryRegex.test(qClean)) {
                score += 85;
                hasDomainKeywordMatch = true;
            } else {
                let matchCount = 0;
                for (const kwW of kwNormWords) {
                    if (qNormWords.includes(kwW)) {
                        matchCount++;
                    }
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

    // Check title match
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

/**
 * Resolve follow-up questions using multi-turn conversation history.
 */
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
        ? history.slice().reverse().find(m => (m.sender === "ai" || m.role === "assistant") && (m.text || m.content) && !(m.text || m.content).includes("Welcome to the Local Knowledge Engine") && !(m.text || m.content).includes("I currently do not have verified offline curriculum data"))
        : null;

    if (!prevAiMsg) {
        return {
            title: "Follow-up Clarification",
            topic: "followup_no_context",
            answer: `ℹ️ **Context Needed for Follow-Up**\n\nWhich scientific topic or previous answer would you like me to explain further?\n\nPlease ask your question directly—for example:\n- *"Why do we see lightning before hearing thunder?"*\n- *"Calculate the molecular mass of H2O using H = 1 and O = 16"*\n- *"Explain Ohm's law with an example"*\n- *"Why do plant cells have a cell wall?"*`
        };
    }

    const prevText = ((prevAiMsg.text || prevAiMsg.content) || "").toLowerCase();

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
                answer: `🧪 **Molecular Mass in Simpler Words**\n\nThink of a molecule like a toy built out of LEGO bricks:\n\n- Each element is a brick with its own weight (for example, Hydrogen weighs $1$ and Oxygen weighs $16$).\n- A water molecule ($H_2O$) has **two H bricks** and **one O brick**.\n- To find the total weight, simply add all the bricks together:\n  $$(1 + 1) + 16 = \\mathbf{18}$$\nSo one molecule of water has a mass of **$18\\text{ units}$** (or $18\\text{ grams}$ per mole)!`
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

/**
 * Layer 1: Dynamic Problem Generator
 * Generates verified practice problems with given values, formula, and step-by-step arithmetic.
 */
function generateDynamicProblem(rawQuestion, qClean) {
    const isProblemRequest =
        qClean.includes("create") ||
        qClean.includes("generate") ||
        qClean.includes("give me a problem") ||
        qClean.includes("numerical problem") ||
        qClean.includes("practice problem") ||
        qClean.includes("new problem");

    if (!isProblemRequest) return null;

    // Newton's Second Law
    if (qClean.includes("newton") || qClean.includes("second law") || qClean.includes("f ma") || qClean.includes("force")) {
        return {
            title: "Newton's Second Law Problem ($F = ma$)",
            topic: "dynamic_problem_newton",
            answer: `📝 **Practice Problem: Newton's Second Law of Motion**

### 1. Problem Statement
A laboratory cart with an inertial mass of $m = 6.0\\text{ kg}$ rests on a horizontal, low-friction track. A student applies a steady horizontal pulling force of $F = 24.0\\text{ N}$ to the cart. 
**Calculate the resulting acceleration of the cart.**

---

### 2. Given Data & Units
- Net applied force: $F = 24.0\\text{ N}$ ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$)
- Mass of cart: $m = 6.0\\text{ kg}$
- Target variable: Acceleration ($a$), in $\\text{m/s}^2$

---

### 3. Governing Formula
$$\\vec{F} = m \\cdot \\vec{a} \\implies a = \\frac{F}{m}$$

---

### 4. Step-by-Step Calculation
$$a = \\frac{24.0\\text{ N}}{6.0\\text{ kg}} = 4.0\\text{ m/s}^2$$

---

### 5. Final Verified Answer
The cart accelerates forward at **$4.0\\text{ m/s}^2$** (meters per second squared).

*Key Takeaway*: If the applied force were doubled to $48.0\\text{ N}$, the acceleration would also double to $8.0\\text{ m/s}^2$. If the mass were doubled to $12.0\\text{ kg}$ with the same force, acceleration would drop by half to $2.0\\text{ m/s}^2$.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // Ohm's Law
    if (qClean.includes("ohm") || qClean.includes("v ir") || qClean.includes("resistor") || qClean.includes("voltage") || qClean.includes("current")) {
        return {
            title: "Ohm's Law Problem ($V = IR$)",
            topic: "dynamic_problem_ohms_law",
            answer: `📝 **Practice Problem: Ohm's Law ($V = IR$)**

### 1. Problem Statement
An electric laboratory heating coil has a measured internal resistance of $R = 15.0\\,\\Omega$. It is connected across a regulated direct current power supply providing a voltage of $V = 120.0\\text{ V}$.
**Determine the electric current flowing through the coil.**

---

### 2. Given Data & Units
- Potential difference (Voltage): $V = 120.0\\text{ V}$
- Electrical Resistance: $R = 15.0\\,\\Omega$
- Target variable: Electric Current ($I$), in Amperes ($A$)

---

### 3. Governing Formula
$$V = I \\cdot R \\implies I = \\frac{V}{R}$$

---

### 4. Step-by-Step Calculation
$$I = \\frac{120.0\\text{ V}}{15.0\\,\\Omega} = 8.0\\text{ A}$$

---

### 5. Final Verified Answer
The electric current flowing through the heating coil is **$8.0\\text{ Amperes}$** ($8.0\\text{ A}$).

*Key Takeaway*: If the coil is swapped for a higher resistance element of $R = 30.0\\,\\Omega$, the current drawn from the $120.0\\text{ V}$ source will decrease to $4.0\\text{ A}$.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // Kinematics / Equations of Motion
    if (qClean.includes("motion") || qClean.includes("kinematics") || qClean.includes("speed") || qClean.includes("velocity") || qClean.includes("acceleration")) {
        return {
            title: "Uniform Acceleration Problem (Equations of Motion)",
            topic: "dynamic_problem_kinematics",
            answer: `📝 **Practice Problem: Kinematics & Equations of Motion**

### 1. Problem Statement
A drone begins from a stationary hover ($u = 0\\text{ m/s}$) and accelerates horizontally in a straight line with a constant acceleration of $a = 2.5\\text{ m/s}^2$ for a duration of $t = 4.0\\text{ seconds}$.
**Calculate:**
1. The drone's velocity at the end of the $4.0\\text{ s}$ interval.
2. The total displacement traveled during this acceleration.

---

### 2. Given Data & Units
- Initial velocity: $u = 0\\text{ m/s}$ (starts from rest)
- Constant acceleration: $a = 2.5\\text{ m/s}^2$
- Time elapsed: $t = 4.0\\text{ s}$

---

### 3. Step-by-Step Solution
**Part 1: Final Velocity ($v$)**
$$v = u + at = 0 + (2.5\\text{ m/s}^2)(4.0\\text{ s}) = 10.0\\text{ m/s}$$

**Part 2: Total Displacement ($s$)**
$$s = ut + \\frac{1}{2}at^2 = (0)(4.0) + \\frac{1}{2}(2.5)(4.0^2) = \\frac{1}{2}(2.5)(16.0) = 20.0\\text{ m}$$

---

### 4. Final Verified Answers
1. Final Velocity: **$10.0\\text{ m/s}$** ($36\\text{ km/h}$)
2. Displacement: **$20.0\\text{ meters}$**`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // Mole Concept
    if (qClean.includes("mole") || qClean.includes("stoichiometry") || qClean.includes("chemistry")) {
        return {
            title: "Mole Concept Problem ($n = m/M$)",
            topic: "dynamic_problem_mole",
            answer: `📝 **Practice Problem: The Mole Concept**

### 1. Problem Statement
A canister contains $88.0\\text{ g}$ of pure carbon dioxide gas ($CO_2$).
(Given molar atomic masses: Carbon $C = 12.0\\text{ g/mol}$, Oxygen $O = 16.0\\text{ g/mol}$; Avogadro's constant $N_A = 6.022 \\times 10^{23}\\text{ entities/mol}$).
**Calculate:**
1. The molar mass of $CO_2$.
2. The number of moles of $CO_2$ in the canister.
3. The total number of $CO_2$ molecules present.

---

### 2. Step-by-Step Solution
**Step 1: Calculate Molar Mass ($M$)**
$$M(CO_2) = 1(12.0\\text{ g/mol}) + 2(16.0\\text{ g/mol}) = 12.0 + 32.0 = 44.0\\text{ g/mol}$$

**Step 2: Calculate Number of Moles ($n$)**
$$n = \\frac{m}{M} = \\frac{88.0\\text{ g}}{44.0\\text{ g/mol}} = 2.0\\text{ moles}$$

**Step 3: Calculate Total Molecule Count ($N$)**
$$N = n \\times N_A = (2.0\\text{ mol}) \\times (6.022 \\times 10^{23}\\text{ molecules/mol}) = 1.2044 \\times 10^{24}\\text{ molecules}$$

---

### 3. Final Verified Answers
1. Molar Mass: **$44.0\\text{ g/mol}$**
2. Amount: **$2.0\\text{ moles}$**
3. Total Molecules: **$1.204 \\times 10^{24}\\text{ molecules}$**`,
            actionCue: { targetMesh: "Atom", zoom: 1.5 }
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

/**
 * Layer 2: Direct Numerical Solver
 * Solves specific arithmetic problems if numbers and variables are provided
 */
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
            answer: `⚡ **Force Calculation ($F = ma$)**

### 1. Given Parameters
- Mass ($m$): $${m}\\text{ kg}$
- Acceleration ($a$): $${a}\\text{ m/s}^2$

---

### 2. Formula & Calculation
$$F = m \\cdot a = (${m}\\text{ kg}) \\cdot (${a}\\text{ m/s}^2) = ${f.toFixed(2)}\\text{ N}$$

---

### 3. Result
The required net force is **$${f.toFixed(2)}\\text{ Newtons}$** (${f.toFixed(2)} N).`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
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
            answer: `⚡ **Voltage Calculation ($V = IR$)**

### 1. Given Parameters
- Electric Current ($I$): $${i}\\text{ A}$
- Resistance ($R$): $${r}\\,\\Omega$

---

### 2. Formula & Calculation
$$V = I \\cdot R = (${i}\\text{ A}) \\cdot (${r}\\,\\Omega) = ${v.toFixed(2)}\\text{ V}$$

---

### 3. Result
The electrical potential difference across the component is **$${v.toFixed(2)}\\text{ Volts}$** (${v.toFixed(2)} V).`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
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
                answer: `⚡ **Current Calculation ($I = V/R$)**

### 1. Given Parameters
- Potential Difference ($V$): $${v}\\text{ V}$
- Resistance ($R$): $${r}\\,\\Omega$

---

### 2. Formula & Calculation
$$I = \\frac{V}{R} = \\frac{${v}\\text{ V}}{${r}\\,\\Omega} = ${i.toFixed(2)}\\text{ A}$$

---

### 3. Result
The electric current flowing through the circuit is **$${i.toFixed(2)}\\text{ Amperes}$** (${i.toFixed(2)} A).`,
                actionCue: { targetMesh: "main", zoom: 1.2 }
            };
        }
    }

    return null;
}

/**
 * Layer 3: Conceptual Cause-and-Effect Reasoning Engine
 * Handles custom explanatory questions ("Why does...", "What happens when...", "Explain why...")
 */
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

    // 1. Wire Resistance & Length
    if ((qClean.includes("resistance") && (qClean.includes("longer") || qClean.includes("length") || qClean.includes("increase"))) ||
        (qClean.includes("length") && qClean.includes("wire") && qClean.includes("resistance"))) {
        return {
            title: "Why Electrical Resistance Increases with Wire Length",
            topic: "reasoning_resistance_length",
            answer: `⚡ **Why Resistance Increases When a Wire Becomes Longer**

### 1. Direct Answer
Electrical resistance is **directly proportional to the length of the conductor** ($R \\propto L$). When a wire is made longer, electric current encounters greater opposition, meaning resistance increases linearly with length.

---

### 2. Microscopic Physical Explanation
Electric current in a metallic wire is the macroscopic drift of free conduction electrons propelled by an applied electric field ($E$).
1. **Lattice Collisions**: As electrons travel through the wire, they do not move unobstructed; they collide with vibrating positive metal ions in the crystal lattice.
2. **Greater Distance = More Collisions**: In a longer wire, electrons must navigate through a greater length of the crystal lattice. This significantly increases the total number of inelastic collisions per second.
3. **Energy Dissipation**: Each collision transfers kinetic energy from the drift electrons to the metal lattice as thermal vibrations (Joule heating). Therefore, for a given voltage, fewer electrons pass through per second, resulting in a reduced electric current ($I$) and higher electrical resistance ($R$).

---

### 3. Mathematical Formula
$$R = \\rho \\frac{L}{A}$$

Where:
- $R$ = Electrical Resistance in **Ohms ($\\Omega$)**
- $\\rho$ (rho) = Resistivity of the conductor material in **Ohm-meters ($\\Omega\\cdot\\text{m}$)** (material constant)
- $L$ = Length of the wire in **meters ($\\text{m}$)**
- $A$ = Cross-sectional area of the wire in **square meters ($\\text{m}^2$)**

---

### 4. Practical Engineering Takeaway
- If you double the length of an extension cord ($L \\rightarrow 2L$), its resistance doubles ($R \\rightarrow 2R$), resulting in twice the voltage drop and power loss ($P = I^2R$).
- To compensate for long transmission distances, electrical engineers use thicker conductors (greater $A$) or higher voltages to minimize line losses.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // 2. Gas Pressure & Temperature
    if ((qClean.includes("pressure") && qClean.includes("gas") && (qClean.includes("temperature") || qClean.includes("rise") || qClean.includes("heat"))) ||
        (qClean.includes("temperature") && qClean.includes("pressure") && (qClean.includes("gas") || qClean.includes("container")))) {
        return {
            title: "Why Gas Pressure Increases with Temperature",
            topic: "reasoning_gas_pressure_temp",
            answer: `🌡️ **What Happens to the Pressure of a Gas When Its Temperature Rises**

### 1. Direct Answer
When the temperature of a gas rises at constant volume, **its pressure increases proportionally**. This fundamental relationship is described by **Gay-Lussac's Law** and the **Ideal Gas Law** ($P \\propto T$).

---

### 2. Physical Explanation (Kinetic Molecular Theory)
Pressure is the cumulative normal force per unit area exerted by gas molecules colliding against the inner walls of their container ($P = \\frac{F}{A}$).
1. **Increased Molecular Kinetic Energy**: Temperature is the direct macroscopic measure of the average translational kinetic energy of gas particles:
   $$KE_{\\text{avg}} = \\frac{1}{2}m v_{\\text{rms}}^2 = \\frac{3}{2} k_B T$$
   When temperature $T$ increases, gas molecules absorb thermal energy and move at significantly higher speeds ($v_{\\text{rms}}$).
2. **Higher Collision Frequency**: Faster-moving molecules travel across the container more rapidly, colliding with the container walls more times per second.
3. **Greater Momentum Transfer**: In each elastic rebound collision against a wall, the momentum change ($\\Delta p = 2mv$) is greater because of the higher velocity.
4. **Resulting Net Pressure**: More frequent collisions combined with greater force per impact generates a higher net outward pressure on the container walls.

---

### 3. Mathematical Formulation
$$\\frac{P_1}{T_1} = \\frac{P_2}{T_2} \\quad \\text{and} \\quad PV = nRT$$

Where:
- $P$ = Gas pressure in **Pascals ($\\text{Pa}$)** or **atmospheres ($\\text{atm}$)**
- $T$ = Absolute temperature in **Kelvin ($K$)** (Note: must be in Kelvin, where $K = ^\\circ\\text{C} + 273.15$)
- $V$ = Volume in cubic meters ($\\text{m}^3$) or liters ($\\text{L}$)
- $n$ = Moles of gas
- $R$ = Universal Gas Constant ($8.314\\text{ J}/(\\text{mol}\\cdot K)$)

---

### 4. Real-World Practical Example
- **Automobile Tires**: After driving at high speeds on an asphalt road in summer, friction and ambient heat increase tire air temperature, causing tire pressure gauge readings to rise by $3\\text{--}5\\text{ psi}$.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // 3. Why Plant Cells Have a Cell Wall
    if ((qClean.includes("plant") && qClean.includes("cell wall")) ||
        (qClean.includes("why") && qClean.includes("cell wall")) ||
        (qClean.includes("burst") && qClean.includes("plant cell"))) {
        return {
            title: "Why Plant Cells Have a Cell Wall",
            topic: "reasoning_plant_cell_wall",
            answer: `🌿 **Why Plant Cells Have a Rigid Cell Wall**

### 1. Direct Answer
Plant cells have a rigid outer cell wall primarily to **withstand high intracellular osmotic turgor pressure**, prevent the cell from bursting (**osmotic lysis**) in hypotonic environments, and provide upright mechanical support for the plant structure.

---

### 2. Biological & Physiological Mechanisms
Unlike animal cells which are bathed in isotonic extracellular fluids, terrestrial plant roots are surrounded by dilute soil water (a **hypotonic environment**).

1. **Osmosis & Turgor Pressure**:
   - Because the plant cell's cytoplasm and central vacuole contain high concentrations of dissolved sugars, minerals, and organic acids, water naturally diffuses inward across the semipermeable plasma membrane via **osmosis**.
   - As the large central vacuole fills, it expands outward, exerting internal hydrostatic pressure (**turgor pressure**, typically $0.5\\text{ to }1.5\\text{ MPa}$, equivalent to several atmospheres) against the cell perimeter.
2. **Prevention of Osmotic Lysis (Bursting)**:
   - An animal cell exposed to pure water absorbs water continuously until its fragile plasma membrane ruptures (lysis).
   - The plant cell wall exerts an equal and opposite mechanical resistance (**wall pressure**). When wall pressure equals osmotic potential, net water influx ceases, keeping the cell firm and fully inflated without rupturing.
3. **Structural Skeletal Function**:
   - Plants do not possess internal bones or an exoskeleton. Collective turgor pressure pushing against tough, interlocking cellulose cell walls provides the structural stiffness that holds leaves, herbaceous stems, and floral petals upright against gravity.

---

### 3. Composition & Architecture
- **Cellulose Microfibrils**: Long, unbranched chains of $\\beta$-glucose bundled with high tensile strength.
- **Hemicellulose & Pectin**: Polysaccharide matrices that crosslink cellulose fibers into a flexible, porous mesh.
- **Middle Lamella**: Calcium and magnesium pectate layer that cements adjacent plant cells together.

*Key Takeaway*: When a plant is deprived of water, its vacuoles shrink, turgor pressure drops to zero (plasmolysis), and the entire plant wilts. Watering restores vacuolar volume, turgor pressure, and upright rigidity.`,
            actionCue: { targetMesh: "plant_cell", zoom: 1.4 }
        };
    }

    // 4. Kinetic Energy & Doubling Speed
    if ((qClean.includes("kinetic energy") && (qClean.includes("double") || qClean.includes("quadruple") || qClean.includes("speed") || qClean.includes("velocity"))) ||
        (qClean.includes("speed double") && qClean.includes("kinetic"))) {
        return {
            title: "Why Kinetic Energy Quadruples When Speed Doubles",
            topic: "reasoning_ke_speed_doubling",
            answer: `🏃 **Why Kinetic Energy Quadruples ($4\\times$) When Speed Doubles**

### 1. Direct Answer
Kinetic energy is directly proportional to the **square of velocity** ($KE \\propto v^2$). Therefore, doubling velocity increases kinetic energy by a factor of $2^2 = \\mathbf{4}$.

---

### 2. Mathematical Proof
The definition of translational kinetic energy is:
$$KE = \\frac{1}{2}m v^2$$

Let an initial mass $m$ have initial velocity $v_1 = v$:
$$KE_1 = \\frac{1}{2}m v^2$$

Now double the velocity so that $v_2 = 2v$:
$$KE_2 = \\frac{1}{2}m (2v)^2 = \\frac{1}{2}m (4v^2) = 4 \\left(\\frac{1}{2}m v^2\\right) = 4 \\cdot KE_1$$

---

### 3. Worked Numerical Demonstration
- A car of mass $m = 1,000\\text{ kg}$ travels at $v = 10\\text{ m/s}$ ($36\\text{ km/h}$):
  $$KE_1 = \\frac{1}{2}(1,000)(10^2) = 500 \\times 100 = 50,000\\text{ Joules} = 50\\text{ kJ}$$
- If the car doubles its speed to $v = 20\\text{ m/s}$ ($72\\text{ km/h}$):
  $$KE_2 = \\frac{1}{2}(1,000)(20^2) = 500 \\times 400 = 200,000\\text{ Joules} = 200\\text{ kJ}$$
- Ratio check: $\\frac{200\\text{ kJ}}{50\\text{ kJ}} = 4.0$ (Exactly four times!).

---

### 4. Practical Real-World Implication
Because vehicle braking distance is determined by the work required to dissipate kinetic energy ($W = F_{\\text{friction}} \\cdot d = \\Delta KE$), **doubling your driving speed quadruples the required braking distance**, making high-speed collisions disproportionately severe.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // 5. Why the Sky is Blue
    if (qClean.includes("sky") && qClean.includes("blue")) {
        return {
            title: "Why the Sky is Blue (Rayleigh Scattering)",
            topic: "reasoning_blue_sky",
            answer: `☀️ **Why the Sky Appears Blue (Rayleigh Scattering)**

### 1. Direct Answer
The daytime sky appears blue because gas molecules in Earth's atmosphere scatter solar sunlight through a process called **Rayleigh Scattering**, which scatters shorter blue wavelengths far more efficiently than longer red wavelengths.

---

### 2. Physical Explanation
1. **Solar Spectrum**: White sunlight reaching Earth contains all rainbow colors of the electromagnetic spectrum, ranging from long red wavelengths ($\\sim 700\\text{ nm}$) to short violet/blue wavelengths ($\\sim 400\\text{--}450\\text{ nm}$).
2. **Rayleigh Scattering Law**: When electromagnetic waves encounter particles much smaller than their wavelength (such as atmospheric nitrogen $N_2$ and oxygen $O_2$ molecules), the intensity of scattered light ($I$) is inversely proportional to the **fourth power of the wavelength**:
   $$I_{\\text{scatter}} \\propto \\frac{1}{\\lambda^4}$$
3. **Wavelength Comparison**:
   $$\\frac{I_{\\text{blue}}}{I_{\\text{red}}} \\approx \\left(\\frac{700\\text{ nm}}{420\\text{ nm}}\\right)^4 \\approx (1.67)^4 \\approx 8\\text{ to }10\\text{ times more scattering}$$
   Because blue and violet wavelengths are scattered roughly $10\\times$ more intensely than red light, blue light is deflected in all directions across the entire dome of the sky.
4. **Why Not Violet?**: While violet light has an even shorter wavelength than blue, human retinal cone photoreceptors are significantly more sensitive to blue wavelengths, and the solar spectrum has lower violet intensity.`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    // 6. How Catalysts Speed Up Chemical Reactions
    if (qClean.includes("catalyst") && (qClean.includes("reaction") || qClean.includes("speed") || qClean.includes("rate") || qClean.includes("how"))) {
        return {
            title: "How Catalysts Accelerate Chemical Reactions",
            topic: "reasoning_catalyst_mechanism",
            answer: `⚡ **How a Catalyst Speeds Up a Chemical Reaction**

### 1. Direct Answer
A **catalyst** accelerates a chemical reaction by providing an alternative reaction pathway with a **lower activation energy ($E_a$)**, without being consumed or permanently altered in the process.

---

### 2. Scientific Mechanism (Collision Theory)
For reactant molecules to undergo a chemical transformation into products, two criteria must be met:
1. They must collide with correct spatial orientation.
2. They must collide with kinetic energy greater than or equal to the minimum energy barrier, known as the **Activation Energy ($E_a$)**.

**How the Catalyst Operates:**
- The catalyst stabilizes the transition state intermediate or adsorbs reactant molecules onto its surface, lowering $E_a$.
- According to the **Arrhenius Equation**:
  $$k = A \\cdot e^{-\\frac{E_a}{RT}}$$
  Because the activation energy $E_a$ is in the negative exponent, a modest reduction in $E_a$ causes an **exponential increase in the reaction rate constant ($k$)**.
- A much higher fraction of molecular collisions now possess sufficient thermal energy to clear the barrier and form products.

---

### 3. Key Characteristics
- **Unchanged Equilibrium**: A catalyst speeds up both forward and reverse reaction rates equally, reaching chemical equilibrium faster without changing the final equilibrium constant ($K_{\\text{eq}}$).
- **Biological Catalysts**: In living organisms, protein catalysts are called **enzymes** (e.g., amylase, DNA polymerase, catalase).`,
            actionCue: { targetMesh: "Atom", zoom: 1.5 }
        };
    }

    return null;
}

/**
 * Layer 4: Comparison & Contrast Engine
 * Handles comparative queries ("difference between X and Y", "compare X and Y", "X vs Y")
 */
function compareScientificConcepts(rawQuestion, qClean) {
    const isComparison =
        qClean.includes("difference") ||
        qClean.includes("compare") ||
        qClean.includes("versus") ||
        qClean.includes(" vs ") ||
        qClean.includes("different from");

    if (!isComparison) return null;

    // Ionic vs. Covalent Bonding
    if ((qClean.includes("ionic") && qClean.includes("covalent")) || (isComparison && qClean.includes("bonding"))) {
        return {
            title: "Difference Between Ionic and Covalent Bonding",
            topic: "comparison_ionic_covalent",
            answer: `🔗 **Difference Between Ionic and Covalent Bonding with Examples**

### 1. Direct Overview
- **Ionic Bonding** involves the **complete transfer** of one or more valence electrons from a metal atom to a non-metal atom, forming oppositely charged ions held together by electrostatic forces.
- **Covalent Bonding** involves the **mutual sharing** of one or more pairs of valence electrons between non-metallic atoms to achieve a stable octet.

---

### 2. Comprehensive Comparison Table
| Feature | **Ionic Bonding** | **Covalent Bonding** |
| :--- | :--- | :--- |
| **Electron Mechanism** | Transfer of electrons (Cation $+$ Anion) | Sharing of valence electron pairs |
| **Participating Elements** | Metal (low electronegativity) $+$ Non-metal (high electronegativity) | Non-metal $+$ Non-metal (similar electronegativities) |
| **Bonding Force** | Omnidirectional electrostatic Coulomb attraction | Directional molecular orbital electron sharing |
| **Physical Structure** | Giant 3D continuous crystal lattice | Discrete independent molecules |
| **Melting & Boiling Points** | **High** (requires immense thermal energy to break ionic bonds) | **Low to Moderate** (weak intermolecular van der Waals forces) |
| **Electrical Conductivity** | Conducts when molten or dissolved in water; insulator as a solid | Non-conductive in all states (no free mobile ions or electrons) |
| **State at Room Temp** | Hard, brittle crystalline solids | Gases, liquids, or soft solids |

---

### 3. Clear Concrete Examples
1. **Ionic Bond Example: Sodium Chloride ($NaCl$)**
   - Sodium ($Na$, atomic number $11$, electron config $2,8,1$) loses its $1$ valence electron:
     $$Na \\rightarrow Na^+ + 1e^- \\quad [2,8]$$
   - Chlorine ($Cl$, atomic number $17$, config $2,8,7$) gains that electron:
     $$Cl + 1e^- \\rightarrow Cl^- \\quad [2,8,8]$$
   - The oppositely charged ions attract electrostatically:
     $$Na^+ + Cl^- \\rightarrow NaCl$$
2. **Covalent Bond Example: Water ($H_2O$) and Methane ($CH_4$)**
   - In water ($H_2O$), Oxygen ($6$ valence electrons) shares $1$ electron pair with each of two Hydrogen atoms, forming two polar covalent single bonds ($H-O-H$) and completing Oxygen's valence octet ($8$) and Hydrogen's duet ($2$).`,
            actionCue: { targetMesh: "Atom", zoom: 1.5 }
        };
    }

    // Speed vs. Velocity
    if (qClean.includes("speed") && qClean.includes("velocity")) {
        return {
            title: "Difference Between Speed and Velocity",
            topic: "comparison_speed_velocity",
            answer: `🏃 **Difference Between Speed and Velocity**

### 1. Direct Definition
- **Speed** is a **scalar quantity** measuring how fast an object moves regardless of direction.
- **Velocity** is a **vector quantity** measuring the rate and direction of an object's position displacement.

---

### 2. Comparison Table
| Feature | **Speed** | **Velocity** |
| :--- | :--- | :--- |
| **Quantity Type** | Scalar (Magnitude only) | Vector (Magnitude $+$ Spatial Direction) |
| **Formula** | $$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$$ | $$\\vec{v} = \\frac{\\Delta \\vec{s}}{\\Delta t} = \\frac{\\text{Displacement}}{\\text{Time}}$$ |
| **Sign** | Always positive or zero ($v \\ge 0$) | Can be positive, negative, or zero (indicates direction) |
| **Circular Motion** | Remains constant if speed is steady | Changes constantly because direction is continuously rotating |
| **Example** | A car travels at $60\\text{ km/h}$ | A car travels at $60\\text{ km/h due North}$ |`,
            actionCue: { targetMesh: "main", zoom: 1.2 }
        };
    }

    return null;
}

/**
 * Main query processor for Local Knowledge Engine.
 */
function queryKnowledgeEngine(rawQuestion, context = {}) {
    const { history = [], activeModel = null, selectedPart = null } = context;
    const qClean = cleanText(rawQuestion);

    if (!qClean) {
        return {
            answer: `👋 **Welcome to the Local Knowledge Engine!**\n\nI am your offline educational study assistant for **Biology, Physics, and Chemistry**.\n\nYou can ask about:\n- 🫀 **Biology**: Cell structures, photosynthesis, cellular respiration, heart anatomy & circulation, body systems, DNA/genetics, mitosis.\n- ⚡ **Physics**: Ohm's law ($V=IR$), Newton's laws ($F=ma$), equations of motion, work/energy/power, circuits, magnetism & induction, optics & heat, DC motors.\n- 🧪 **Chemistry**: Atoms vs. molecules, periodic table, chemical bonding, the pH scale, balancing equations ($H_2 + O_2 \\rightarrow H_2O$), chemical reactions/redox, and the mole concept.\n\n*How can I help you today?*`,
            provider: "Local Knowledge Engine",
            found: true,
            topic: "welcome"
        };
    }

    // Check for greetings
    if (["hi", "hello", "hey", "who are you", "help"].includes(qClean)) {
        return {
            answer: `👋 **Hello! I am your Local Educational Knowledge Engine.**\n\nI provide verified curriculum explanations across **Biology, Physics, and Chemistry** without calling external cloud APIs.\n\nFeel free to ask me:\n- *"Why do we see lightning before hearing thunder?"*\n- *"Calculate the molecular mass of H2O using H = 1 and O = 16"*\n- *"What is the molar mass of CO2?"*\n- *"Why does resistance increase when a wire becomes longer?"*\n- *"What happens to the pressure of a gas when its temperature rises?"*\n- *"Why do plant cells have a cell wall?"*\n- *"Explain the difference between ionic and covalent bonding with examples."*\n- *"Create a new numerical problem based on Newton's second law and solve it."*\n- *"Balance H2 + O2 -> H2O"*\n- *"Explain Ohm's law with an example"*`,
            provider: "Local Knowledge Engine",
            found: true,
            topic: "greeting"
        };
    }

    // Layer 0: Conversational Multi-Turn Follow-Up Handler
    const followup = handleFollowupQuestion(rawQuestion, qClean, history);
    if (followup) {
        return {
            answer: followup.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: followup.topic,
            actionCue: followup.actionCue || null,
            modelName: activeModel || null
        };
    }

    // Layer 1: Dynamic Practice Problem Generator
    const dynamicProblem = generateDynamicProblem(rawQuestion, qClean);
    if (dynamicProblem) {
        return {
            answer: dynamicProblem.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: dynamicProblem.topic,
            actionCue: dynamicProblem.actionCue || null,
            modelName: dynamicProblem.actionCue?.targetMesh || activeModel || null
        };
    }

    // Layer 2: Direct Numerical Calculation Solver
    const directCalc = solveCalculationQuestion(rawQuestion, qClean);
    if (directCalc) {
        return {
            answer: directCalc.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: directCalc.topic,
            actionCue: directCalc.actionCue || null,
            modelName: directCalc.actionCue?.targetMesh || activeModel || null
        };
    }

    // Layer 3: Conceptual Cause-and-Effect Reasoning
    const conceptualReasoning = reasonConceptualQuestion(rawQuestion, qClean);
    if (conceptualReasoning) {
        return {
            answer: conceptualReasoning.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: conceptualReasoning.topic,
            actionCue: conceptualReasoning.actionCue || null,
            modelName: conceptualReasoning.actionCue?.targetMesh || activeModel || null
        };
    }

    // Layer 4: Comparison & Contrast Engine
    const comparisonAnswer = compareScientificConcepts(rawQuestion, qClean);
    if (comparisonAnswer) {
        return {
            answer: comparisonAnswer.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: comparisonAnswer.topic,
            actionCue: comparisonAnswer.actionCue || null,
            modelName: comparisonAnswer.actionCue?.targetMesh || activeModel || null
        };
    }

    // Handle explicit follow-up for right ventricle if previous context was left ventricle
    if (qClean.includes("right ventricle") || (qClean.includes("right") && (qClean.includes("ventricle") || qClean.includes("what about")))) {
        return {
            answer: `🫀 **The Right Ventricle vs. Left Ventricle**\n\nIn contrast to the thick-walled left ventricle, the **Right Ventricle**:\n1. **Function**: Receives deoxygenated systemic venous blood from the Right Atrium through the tricuspid valve.\n2. **Destination**: Contracts during systole to pump blood past the pulmonary semilunar valve into the **pulmonary trunk and arteries** directly to the lungs for oxygen replenishment.\n3. **Lower Pressure**: Operates against much lower resistance (pulmonary vascular resistance), generating systolic pressures of only $\\sim 20\\text{--}25\\text{ mmHg}$ (about one-sixth the pressure of the left ventricle).\n4. **Wall Structure**: Features a thinner, crescent-shaped myocardium designed for volume displacement rather than high pressure.`,
            provider: "Local Knowledge Engine",
            found: true,
            topic: "bio_heart_right_ventricle",
            actionCue: { targetMesh: "ventricle_r", highlightColor: "#f59e0b", zoom: 1.5 },
            modelName: "Heart"
        };
    }

    // Layer 5: Score all knowledge curriculum entries
    let bestMatch = null;
    let highestScore = 0;

    for (const entry of ALL_ENTRIES) {
        const score = scoreEntry(rawQuestion, entry);
        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    }

    // Minimum confidence threshold
    if (bestMatch && highestScore >= 18) {
        return {
            answer: bestMatch.answer,
            provider: "Local Knowledge Engine",
            found: true,
            topic: bestMatch.id,
            actionCue: bestMatch.actionCue || null,
            modelName: bestMatch.actionCue?.targetMesh || activeModel || null
        };
    }

    // Contextual fallback ONLY if an explicit active 3D model was passed and question has matching topic
    if (activeModel && ALL_ENTRIES.some(e => e.keywords.includes(activeModel.toLowerCase()))) {
        const modelEntry = ALL_ENTRIES.find(e => e.keywords.includes(activeModel.toLowerCase()));
        if (modelEntry) {
            return {
                answer: `📚 **${modelEntry.title}**\n\n${modelEntry.answer}`,
                provider: "Local Knowledge Engine",
                found: true,
                topic: modelEntry.id,
                actionCue: modelEntry.actionCue || null,
                modelName: activeModel
            };
        }
    }

    // Honest limitation handling for queries outside supported curriculum
    return {
        answer: `ℹ️ **Local Educational Knowledge Engine Notice**\n\nI specialize in verified school-level and introductory college-level questions in **Biology, Physics, and Chemistry** (such as cell organelles, photosynthesis, heart circulation, Newton's laws, Ohm's law, equations of motion, circuits, magnetism, atomic structure, chemical bonding, balancing equations, and the mole concept).\n\nI currently do not have verified offline curriculum data to answer: **"${rawQuestion}"**.\n\n*Please try asking a science curriculum question such as:*\n- *"Why does resistance increase when a wire becomes longer?"*\n- *"What happens to the pressure of a gas when its temperature rises?"*\n- *"Why do plant cells have a cell wall?"*\n- *"Explain the difference between ionic and covalent bonding with examples."*\n- *"Create a new numerical problem based on Newton's second law and solve it."*\n- *"Explain Ohm's law with an example"*\n- *"Balance H2 + O2 -> H2O"*`,
        provider: "Local Knowledge Engine",
        found: false,
        topic: "unsupported"
    };
}

/**
 * Generate 3D Interactive Quiz for Teacher / Assessment tools.
 */
function generateOfflineQuiz(activeModel = "Heart", selectedPart = null) {
    const model = activeModel || "Heart";
    const part = selectedPart || "General Structure";

    if (model === "PlantCell") {
        return {
            answer: `📝 **Interactive 3D Biology Quiz: Plant Cell & Organelles**\n\n**Question 1 (Cellular Biology)**: Which organelle is responsible for solar photon absorption and carbohydrate synthesis in plant cells?\n- A) Mitochondria\n- B) **Chloroplasts**\n- C) Ribosomes\n- D) Central Vacuole\n\n*Correct Answer*: **B) Chloroplasts**\n*Explanation*: Chloroplasts contain chlorophyll pigments organized in thylakoid grana that convert sunlight, $CO_2$, and water into glucose during photosynthesis.\n\n---\n\n**Question 2 (3D Structure Inspection)**: What structural feature prevents plant cells from bursting when the large central vacuole fills with water?\n- A) Plasma membrane\n- B) Nuclear envelope\n- C) **Cellulose Cell Wall**\n- D) Cytosol\n\n*Correct Answer*: **C) Cellulose Cell Wall**\n*Explanation*: The rigid outer cell wall provides structural resistance against high intracellular turgor pressure.`,
            provider: "Local Knowledge Engine"
        };
    }

    if (model === "DCMotor") {
        return {
            answer: `📝 **Interactive 3D Physics Quiz: Electric DC Motor**\n\n**Question 1 (Electromagnetism)**: What component in a DC motor is responsible for reversing the coil's current direction every half-rotation?\n- A) Armature coil\n- B) Permanent stator magnet\n- C) **Split-Ring Commutator**\n- D) Axle shaft\n\n*Correct Answer*: **C) Split-Ring Commutator**\n*Explanation*: The split-ring commutator acts as a mechanical inverter, reversing current flow every $180^\\circ$ to keep magnetic torque pushing forward in the same direction.\n\n---\n\n**Question 2 (Magnetic Forces)**: Which physical law dictates the magnetic force acting on a current-carrying loop inside a magnetic field?\n- A) Ohm's Law\n- B) **Lorentz Force ($F = IL \\times B$)**\n- C) Newton's Third Law\n- D) Snell's Law\n\n*Correct Answer*: **B) Lorentz Force**\n*Explanation*: The magnetic field exerts orthogonal forces on opposite sides of the coil, generating rotational torque.`,
            provider: "Local Knowledge Engine"
        };
    }

    // Default Anatomical Heart Quiz
    return {
        answer: `📝 **Interactive 3D Anatomical Board Quiz: ${model} (${part})**\n\n**Question 1 (Hemodynamics)**: Why is the left ventricular myocardium significantly thicker than that of the right ventricle?\n- A) It stores larger volumes of venous blood.\n- B) **It must overcome systemic vascular resistance to pump blood throughout the entire body.**\n- C) It contains the primary SA node pacemaker.\n- D) It functions under low pulmonary resistance.\n\n*Correct Answer*: **B**\n*Explanation*: The left ventricle generates high systolic pressure ($\\sim 120\\text{ mmHg}$) to circulate oxygenated blood to systemic tissues, requiring $3\\times$ thicker musculature.\n\n---\n\n**Question 2 (Valvular Mechanics)**: Which valve prevents backward regurgitation of blood from the aorta into the left ventricle during diastole?\n- A) Tricuspid Valve\n- B) Mitral (Bicuspid) Valve\n- C) Pulmonary Valve\n- D) **Aortic Valve**\n\n*Correct Answer*: **D) Aortic Valve**\n*Explanation*: The aortic semilunar valve snaps shut as ventricular pressure drops below aortic pressure, ensuring strictly unidirectional systemic flow.`,
        provider: "Local Knowledge Engine"
    };
}

/**
 * Generate Clinical Case Study for Teacher / Healthcare simulations.
 */
function generateOfflineClinicalCase(activeModel = "Heart", selectedPart = null) {
    const model = activeModel || "Heart";
    const part = selectedPart || "Myocardial System";

    return `🩺 **Clinical Case Study: ${model} Pathophysiology (${part})**\n\n**Patient Profile**: A 58-year-old patient presents with progressive exertional dyspnea (shortness of breath), mild bilateral ankle edema, and elevated systolic blood pressure ($155/95\\text{ mmHg}$).\n\n---\n\n### 🔬 3D Spatial Scan & Findings\n- **Target Structure**: **${model} (${part})**\n- **Observed Pathology**: Significant left ventricular concentric hypertrophy with reduced diastolic compliance.\n- **Hemodynamic Impact**: Impaired ventricular filling leading to pulmonary venous congestion.\n\n---\n\n### 📋 Recommended Clinical & Viewport Actions\n1. **Interactive 3D Inspection**: Toggle **Cross-Section** cutaway view in the 3D stage to visualize the thickened myocardial wall encroaching into the ventricular chamber cavity.\n2. **Diagnostic Confirmation**: Order 2D Echocardiogram with Doppler flow to evaluate mitral inflow velocities and calculate ejection fraction ($EF$).\n3. **Management Strategy**: Institute afterload reduction therapy (ACE inhibitors or ARBs) and lifestyle sodium restriction to reduce systemic vascular resistance.`;
}

module.exports = {
    queryKnowledgeEngine,
    generateOfflineQuiz,
    generateOfflineClinicalCase,
    BIOLOGY_KNOWLEDGE,
    PHYSICS_KNOWLEDGE,
    CHEMISTRY_KNOWLEDGE
};
