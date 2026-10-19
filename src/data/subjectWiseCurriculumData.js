/**
 * Subject-Wise Curriculum Data for Classes 6–12
 * 
 * Groups:
 * 1. Foundation: Classes 6–8
 * 2. Core Science: Classes 9–10
 * 3. Advanced Science: Classes 11–12
 * 
 * Subjects per class:
 * - Physics
 * - Chemistry
 * - Biology
 * - Anatomy
 */

export const LEARNING_STAGES = [
    {
        id: "foundation",
        name: "Foundation",
        grades: [6, 7, 8],
        label: "Classes 6–8",
        description: "Fundamental scientific observations, introductory physical phenomena, biological classification, and basic body movements.",
        badgeColor: "#38bdf8",
        gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.05))",
        borderColor: "rgba(56, 189, 248, 0.35)"
    },
    {
        id: "core",
        name: "Core Science",
        grades: [9, 10],
        label: "Classes 9–10",
        description: "Rigorous quantitative foundations: Newton's mechanics, atomic models, stoichiometry, periodic trends, and integrated organ systems.",
        badgeColor: "#10b981",
        gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))",
        borderColor: "rgba(16, 185, 129, 0.35)"
    },
    {
        id: "advanced",
        name: "Advanced Science",
        grades: [11, 12],
        label: "Classes 11–12",
        description: "In-depth pre-university disciplines: calculus-based mechanics, electrodynamics, organic synthesis, thermodynamics, molecular genetics, and clinical histology.",
        badgeColor: "#a855f7",
        gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(126, 34, 206, 0.05))",
        borderColor: "rgba(168, 85, 247, 0.35)"
    }
];

export const SUBJECT_METADATA = {
    "Physics": { icon: "⚡", color: "#38bdf8", description: "Mechanics, Heat, Optics, Electromagnetism & Modern Physics" },
    "Chemistry": { icon: "🧪", color: "#f59e0b", description: "Matter, Atomic Structure, Reactions, Stoichiometry & Organic Chemistry" },
    "Biology": { icon: "🌿", color: "#10b981", description: "Cellular Biology, Plant Physiology, Genetics, Evolution & Ecology" },
    "Anatomy": { icon: "🫀", color: "#f43f5e", description: "Human Organ Systems, Cardiovascular, Neuroanatomy & Histology" }
};

export const SUBJECT_WISE_CHAPTERS = [
    // ==========================================
    // FOUNDATION STAGE: CLASS 6
    // ==========================================
    {
        id: "c6-phy-1",
        classNumber: 6,
        stageId: "foundation",
        subject: "Physics",
        chapterNumber: 1,
        title: "Motion and Measurement of Distances",
        description: "Standard units of measurement (SI units), rectilinear motion, circular motion, and periodic motion.",
        hasFullContent: true,
        extractedText: `📐 **Motion and Measurement of Distances (Class 6 Physics)**

### 1. The Story of Transport & Standard Units
Before standardized measurements, ancient humans used body parts such as cubits, hand-spans, and footsteps to estimate lengths. Because human anatomy varies between individuals, scientists and engineers adopted the **International System of Units (SI)**:
- Standard unit of length: **Meter (m)**
- $1\\text{ kilometer (km)} = 1000\\text{ meters (m)}$
- $1\\text{ meter (m)} = 100\\text{ centimeters (cm)}$
- $1\\text{ centimeter (cm)} = 10\\text{ millimeters (mm)}$

### 2. Types of Motion in Nature
1. **Rectilinear Motion**: Motion along a straight line path (e.g., a car driving on a straight highway, a stone falling freely under gravity).
2. **Circular Motion**: Motion of an object along a curved circular trajectory where its distance from a fixed center remains constant (e.g., the blades of an electric ceiling fan, hands of a clock).
3. **Periodic Motion**: Motion that repeats itself at regular fixed intervals of time (e.g., a vibrating guitar string, a pendulum swing, the Earth orbiting the Sun).`,
        syllabusTopics: ["History of transport", "Standard SI units of length", "Correct measurement techniques", "Rectilinear, circular, and periodic motion"],
        keyFormulas: ["1 m = 100 cm", "1 km = 1000 m", "Distance = Speed × Time"],
        learningObjectives: ["Understand why standard units are essential in science", "Differentiate between rectilinear, circular, and periodic motion", "Measure lengths accurately without parallax error"]
    },
    {
        id: "c6-phy-2",
        classNumber: 6,
        stageId: "foundation",
        subject: "Physics",
        chapterNumber: 2,
        title: "Light, Shadows and Reflections",
        description: "Luminous vs non-luminous objects, transparent, translucent, and opaque mediums, rectilinear propagation of light, and pinhole cameras.",
        hasFullContent: true,
        extractedText: `💡 **Light, Shadows and Reflections (Class 6 Physics)**

### 1. Classification of Materials by Light Transmission
- **Transparent**: Materials that allow light to pass through them completely, allowing clear vision (e.g., clear glass, air, pure water).
- **Translucent**: Materials that allow partial light transmission, producing blurred vision (e.g., frosted glass, tracing paper, thin wax paper).
- **Opaque**: Materials that do not allow any light to pass through, casting dark shadows (e.g., cardboard, wood, metals).

### 2. Rectilinear Propagation of Light & Shadow Formation
Light travels in straight lines (**rectilinear propagation**). When an opaque obstacle blocks a beam of straight-line light, a dark region called a **shadow** forms on the screen behind the object. A shadow requires three elements:
1. A source of light
2. An opaque object
3. A screen or background surface`,
        syllabusTopics: ["Luminous and non-luminous objects", "Transparent, translucent, opaque media", "Formation of shadows", "Pinhole camera principles", "Plane mirror reflection"],
        keyFormulas: ["Angle of incidence = Angle of reflection (i = r)"],
        learningObjectives: ["Explain how shadows are formed", "Construct a simple pinhole camera", "Observe image inversion and rectilinear propagation"]
    },
    {
        id: "c6-phy-3",
        classNumber: 6,
        stageId: "foundation",
        subject: "Physics",
        chapterNumber: 3,
        title: "Electricity and Circuits",
        description: "Electric cells, open and closed loops, conductors, insulators, switches, and filament bulbs.",
        hasFullContent: true,
        extractedText: `🔋 **Electricity and Circuits (Class 6 Physics)**

### 1. The Electric Cell & Power Sources
An **electric cell** generates electrical energy from internal stored chemical reactions. Every standard cell features two distinct terminals:
- A positive ($+$) terminal (metal cap)
- A negative ($-$) terminal (flat metal disc)

### 2. Complete Electric Circuit Loop
An electric circuit provides a complete closed conductive path for electric current to flow from the positive terminal of the cell, through a load (such as a bulb filament), and back to the negative terminal.
- **Closed Circuit**: Continuous loop with no gaps; current flows and the bulb illuminates.
- **Open Circuit**: Broken loop; current cannot cross the air gap, and the bulb turns off.
- **Switch**: A mechanical component designed to deliberately bridge or break the conductive circuit path.`,
        syllabusTopics: ["Electric cell structure and terminals", "Filament bulb anatomy", "Closed vs open circuits", "Role of switches", "Conductors vs insulators"],
        keyFormulas: ["Direction of conventional current: Positive (+) to Negative (-) terminal"],
        learningObjectives: ["Build a simple series circuit", "Identify common electrical conductors and insulators", "Practice electrical safety rules"]
    },
    {
        id: "c6-chem-1",
        classNumber: 6,
        stageId: "foundation",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Sorting Materials into Groups",
        description: "Properties of materials: appearance, hardness, solubility, density in water, and transparency.",
        hasFullContent: true,
        extractedText: `🧪 **Sorting Materials into Groups (Class 6 Chemistry)**

### 1. Classification of Matter
Sorting objects into distinct categories based on shared physical and chemical properties makes systematic study and identification possible:
- **Lustre**: Shiny reflective surface characteristic of freshly cut metals (gold, copper, aluminum).
- **Hardness**: Resistance to scratching; diamonds and iron are hard, while chalk and candle wax are soft.
- **Solubility**: Substances that dissolve completely in water are **soluble** (table salt, sugar); substances that remain distinct are **insoluble** (sand, sawdust).
- **Flotation**: Materials denser than water sink (iron nails, stones); materials less dense float (cork, dry leaves, oil).`,
        syllabusTopics: ["Need for classification", "Lustrous vs non-lustrous materials", "Hardness and compressibility", "Solubility in water", "Flotation and density", "Transparency"],
        keyFormulas: ["Density = Mass / Volume (ρ = m/V)"],
        learningObjectives: ["Categorize everyday items by physical properties", "Distinguish between soluble and insoluble solutes"]
    },
    {
        id: "c6-chem-2",
        classNumber: 6,
        stageId: "foundation",
        subject: "Chemistry",
        chapterNumber: 2,
        title: "Separation of Substances",
        description: "Methods of separation: handpicking, threshing, winnowing, sieving, sedimentation, decantation, filtration, and evaporation.",
        hasFullContent: false,
        extractedText: "",
        syllabusTopics: ["Handpicking and threshing", "Winnowing and sieving", "Sedimentation and decantation", "Filtration techniques", "Evaporation and condensation", "Saturated solutions"],
        keyFormulas: ["Solute + Solvent = Solution"],
        learningObjectives: ["Select appropriate separation methods based on component physical properties", "Purify insoluble and soluble mixture constituents"]
    },
    {
        id: "c6-bio-1",
        classNumber: 6,
        stageId: "foundation",
        subject: "Biology",
        chapterNumber: 1,
        title: "Getting to Know Plants",
        description: "Herbs, shrubs, and trees; taproot vs fibrous root systems; leaf venation and photosynthesis basics.",
        hasFullContent: true,
        extractedText: `🌿 **Getting to Know Plants (Class 6 Biology)**

### 1. Classification by Stem Height & Morphology
- **Herbs**: Small plants with soft, tender green stems without woody tissue (e.g., mint, coriander, wheat).
- **Shrubs**: Medium-sized plants with hard, woody stems branching close to the ground (e.g., rose, hibiscus, lemon).
- **Trees**: Tall, sturdy plants with a single thick woody trunk and elevated branch canopies (e.g., mango, banyan, oak).

### 2. Roots and Leaf Venation Correlation
Botanists observe an exact evolutionary correlation between root systems and leaf venation:
1. **Reticulate Venation**: Net-like leaf veins paired with a deep central **Taproot** (e.g., pea, carrot, mango, bean).
2. **Parallel Venation**: Straight parallel leaf veins paired with thin cluster **Fibrous Roots** (e.g., grass, maize, wheat, bamboo).`,
        syllabusTopics: ["Herbs, shrubs, trees, climbers, and creepers", "Stem conduction functions", "Leaf anatomy: petiole, lamina, veins", "Taproot vs fibrous root systems", "Flower parts: sepals, petals, stamens, pistil"],
        keyFormulas: ["Photosynthesis: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2"],
        learningObjectives: ["Identify plant vegetative organs", "Correlate leaf venation with root architecture", "Dissect a flower and name reproductive whorls"]
    },
    {
        id: "c6-anat-1",
        classNumber: 6,
        stageId: "foundation",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Human Body Movements & Skeletal Joints",
        description: "The human skeletal framework, ball and socket joints, hinge joints, pivotal joints, fixed joints, and muscle contraction.",
        hasFullContent: true,
        extractedText: `🦴 **Human Body Movements & Skeletal Joints (Class 6 Anatomy)**

### 1. The Human Skeletal Framework
The adult human skeleton comprises **206 bones** that provide structural support, shield delicate vital organs (brain, heart, lungs), and anchor muscles to enable movement.

### 2. Synovial Joint Mechanics
1. **Ball and Socket Joint**: The spherical head of one bone articulates within the cup-like cavity of another, allowing multi-directional $360^\\circ$ rotation (e.g., shoulder joint, hip joint).
2. **Hinge Joint**: Permits movement restricted to a single plane like a door hinge (flexion and extension; e.g., elbow joint, knee joint).
3. **Pivotal Joint**: A cylindrical bone rotates within a ring formed by another bone and ligament, enabling neck rotation (e.g., atlantoaxial joint between skull and first cervical vertebra).
4. **Fixed (Suture) Joints**: Bones fused rigidly without movement for vital organ protection (e.g., cranial sutures of the skull).`,
        syllabusTopics: ["Functions of the human skeleton", "Bone structure and cartilage cushioning", "Ball and socket, hinge, pivotal, and fixed joints", "Opposing muscle pairs (biceps and triceps contraction)"],
        keyFormulas: ["Flexion = muscle contraction pulling tendon attached to bone"],
        learningObjectives: ["Locate major skeletal joints in the human body", "Demonstrate joint ranges of motion", "Explain how muscles work in antagonistic pairs"]
    },

    // ==========================================
    // FOUNDATION STAGE: CLASS 7
    // ==========================================
    {
        id: "c7-phy-1",
        classNumber: 7,
        stageId: "foundation",
        subject: "Physics",
        chapterNumber: 1,
        title: "Heat, Temperature and Thermal Transfer",
        description: "Clinical vs laboratory thermometers, conduction, convection, and radiation thermal transfer mechanisms.",
        hasFullContent: true,
        extractedText: `🌡️ **Heat, Temperature and Thermal Transfer (Class 7 Physics)**

### 1. Heat vs Temperature
- **Heat**: Form of thermal energy transferred between systems due to a temperature difference (measured in Joules, $\\text{J}$).
- **Temperature**: Quantitative measure of the degree of hotness or coldness of a body (measured in Celsius, Fahrenheit, or Kelvin).

### 2. Three Modes of Heat Transfer
1. **Conduction**: Transfer of thermal energy through solid matter via direct atom-to-atom vibrational collisions without net displacement of matter (e.g., a metal spoon heating up in hot soup).
2. **Convection**: Heat transfer in fluids (liquids and gases) via actual mass circulation of warmed, buoyant fluid currents (e.g., boiling water, sea breezes, land breezes).
3. **Radiation**: Heat transfer through electromagnetic infrared waves without requiring any physical medium (e.g., solar heat traveling through outer space vacuum to reach Earth).`,
        syllabusTopics: ["Concept of temperature and scales", "Clinical vs laboratory thermometers", "Conduction and thermal conductivity", "Convection currents and atmospheric winds", "Thermal radiation and greenhouse effect"],
        keyFormulas: ["C = (F - 32) * 5/9", "K = C + 273.15"],
        learningObjectives: ["Read laboratory and digital thermometers accurately", "Differentiate between conduction, convection, and radiation", "Explain coastal sea and land breeze cycles"]
    },
    {
        id: "c7-chem-1",
        classNumber: 7,
        stageId: "foundation",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Acids, Bases and Salts",
        description: "Natural indicators (litmus, turmeric), neutralization reactions, and everyday applications.",
        hasFullContent: true,
        extractedText: `⚗️ **Acids, Bases and Salts (Class 7 Chemistry)**

### 1. Chemical Properties of Acids and Bases
- **Acids**: Sour-tasting substances containing hydrogen ions ($H^+$) that turn blue litmus paper red (e.g., citric acid in lemons, acetic acid in vinegar, hydrochloric acid in gastric juice).
- **Bases**: Bitter-tasting, soapy-feeling substances containing hydroxide ions ($OH^-$) that turn red litmus paper blue (e.g., sodium hydroxide, calcium hydroxide in limewater, magnesium hydroxide in antacids).

### 2. Neutralization Reactions
When an acid reacts with a base in stoichiometric proportions, their properties neutralize to form a neutral **salt** and **water**, releasing heat:
$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water} + \\text{Heat}$$
$$\\text{HCl} + \\text{NaOH} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O}$$`,
        syllabusTopics: ["Natural and synthetic acid-base indicators", "Litmus, turmeric, and phenolphthalein tests", "Neutralization reactions and thermochemistry", "Antacid treatments, soil pH treatment, and factory waste neutralization"],
        keyFormulas: ["Acid + Base -> Salt + Water", "HCl + NaOH -> NaCl + H2O"],
        learningObjectives: ["Test common household liquids using natural indicators", "Explain neutralization with balanced chemical equations", "Apply neutralization principles to soil treatment and indigestion"]
    },
    {
        id: "c7-bio-1",
        classNumber: 7,
        stageId: "foundation",
        subject: "Biology",
        chapterNumber: 1,
        title: "Nutrition in Plants & Animals",
        description: "Autotrophic nutrition, chlorophyll pigments, stomata gas exchange, and the human digestive tract.",
        hasFullContent: true,
        extractedText: `🌱 **Nutrition in Plants and Animals (Class 7 Biology)**

### 1. Autotrophic Nutrition in Plants
Green autotrophic plants synthesize organic nourishment from atmospheric carbon dioxide and soil water using sunlight absorbed by chlorophyll pigments housed inside leaf chloroplasts:
$$6CO_2 + 6H_2O \\xrightarrow{\\text{Light, Chlorophyll}} C_6H_{12}O_6 + 6O_2$$

### 2. Human Holozoic Digestive Canal
Human digestion is a multi-step process:
1. **Ingestion & Mastication**: Oral cavity salivary amylase hydrolyzes starch into maltose.
2. **Gastric Digestion**: Stomach secretion of hydrochloric acid ($HCl$) and pepsin enzyme digests dietary proteins.
3. **Intestinal Absorption**: Small intestine bile emulsifies fats, while pancreatic enzymes digest carbohydrates, lipids, and proteins. Finger-like microvilli maximize nutrient absorption into capillaries.`,
        syllabusTopics: ["Autotrophs vs heterotrophs", "Stomatal guard cell mechanism", "Parasitic and saprophytic plants (Cuscuta, fungi)", "Human digestive tract: mouth, esophagus, stomach, small and large intestines", "Role of liver and pancreas"],
        keyFormulas: ["Starch + Salivary Amylase -> Maltose Sugar"],
        learningObjectives: ["Diagram the human digestive canal", "Explain chlorophyll function during light capture", "Describe nutrient absorption across intestinal villi"]
    },
    {
        id: "c7-anat-1",
        classNumber: 7,
        stageId: "foundation",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Blood Circulation and Heart Basics in Humans",
        description: "Composition of human blood, blood vessels (arteries, veins, capillaries), and the double circulatory pump.",
        hasFullContent: true,
        extractedText: `🫀 **Blood Circulation and Heart Basics in Humans (Class 7 Anatomy)**

### 1. Blood Composition & Cellular Elements
Blood is a specialized fluid connective tissue comprising:
- **Plasma**: Yellowish liquid matrix ($90\\%$ water) transporting dissolved nutrients, hormones, and metabolic wastes.
- **Red Blood Cells (Erythrocytes)**: Biconcave discs containing iron-rich **hemoglobin** pigment that binds oxygen ($Hb + 4O_2 \\leftrightarrow Hb(O_2)_4$).
- **White Blood Cells (Leukocytes)**: Immune defense cells that ingest pathogens and produce antibodies.
- **Platelets (Thrombocytes)**: Cell fragments essential for clotting.

### 2. Arteries vs Veins vs Capillaries
- **Arteries**: Thick elastic walls; carry oxygenated blood under high pulsatile pressure away from heart to body tissues (exception: pulmonary artery).
- **Veins**: Thinner walls with internal pocket valves; return low-pressure deoxygenated blood to heart (exception: pulmonary veins).
- **Capillaries**: Microscopic single-cell endothelia allowing direct nutrient and gas exchange with interstitial cells.`,
        syllabusTopics: ["Blood elements: plasma, RBCs, WBCs, platelets", "Artery, vein, capillary comparison", "Human heart chambers and unidirectional valves", "Pulse rate and blood pressure basics"],
        keyFormulas: ["Pulse Rate = 72 beats/min average at rest"],
        learningObjectives: ["Compare structural differences between arteries and veins", "Explain how hemoglobin transports oxygen", "Trace blood flow through the double circulatory system"]
    },

    // ==========================================
    // FOUNDATION STAGE: CLASS 8
    // ==========================================
    {
        id: "c8-phy-1",
        classNumber: 8,
        stageId: "foundation",
        subject: "Physics",
        chapterNumber: 1,
        title: "Force, Pressure and Atmospheric Pressure",
        description: "Contact vs non-contact forces, pressure formula P = F/A, hydrostatic liquid pressure, and barometric atmospheric pressure.",
        hasFullContent: true,
        extractedText: `⚡ **Force and Pressure (Class 8 Physics)**

### 1. Definition and Effects of Force
A **force** is a push or pull acting upon an object resulting from its interaction with another object. Force is a vector quantity measured in **Newtons (N)**.
- **Contact Forces**: Muscular force, frictional force, tension.
- **Non-Contact Forces**: Gravitational force, electrostatic force, magnetic force.

### 2. The Concept of Pressure
Pressure is defined as the magnitude of perpendicular force acting per unit surface area:
$$P = \\frac{F}{A}$$
Where:
- $P$ = Pressure in **Pascals ($\\text{Pa}$)**, where $1\\text{ Pa} = 1\\text{ N/m}^2$
- $F$ = Applied perpendicular thrust in Newtons ($\\text{N}$)
- $A$ = Contact surface area in square meters ($\\text{m}^2$)

*Key Insight*: A sharp knife cuts vegetables effortlessly because its microscopic cutting edge has an extremely small contact area ($A$), generating enormous localized pressure ($P$) with modest applied hand force ($F$).`,
        syllabusTopics: ["Force as a vector quantity", "Contact and non-contact forces", "Pressure definition and calculation (P = F/A)", "Liquid pressure and depth dependence", "Atmospheric pressure and barometers"],
        keyFormulas: ["P = F / A", "1 Pa = 1 N/m^2", "P_liquid = ρ * g * h"],
        learningObjectives: ["Calculate pressure from force and area", "Explain why liquid pressure increases with depth", "Demonstrate atmospheric pressure crushing experiments"]
    },
    {
        id: "c8-chem-1",
        classNumber: 8,
        stageId: "foundation",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Materials: Metals and Non-Metals",
        description: "Physical properties: malleability, ductility, sonority; chemical reactions with oxygen, water, and displacement reactions.",
        hasFullContent: true,
        extractedText: `🧪 **Materials: Metals and Non-Metals (Class 8 Chemistry)**

### 1. Physical Properties
- **Malleability**: The mechanical property allowing a material to be beaten into thin sheets without shattering (e.g., gold and silver foil).
- **Ductility**: The ability of a material to be drawn into elongated thin wires (e.g., copper electrical wiring).
- **Sonority**: Generating a ringing acoustic resonance when struck (e.g., metal temple bells).
- **Conductivity**: Metals possess abundant delocalized free electrons, making them outstanding thermal and electrical conductors.

### 2. Metal Reactivity & Single Displacement Reactions
A more reactive metal displaces a less reactive metal from its aqueous salt solution:
$$\\text{Fe}(s) + \\text{CuSO}_4(aq) \\rightarrow \\text{FeSO}_4(aq) + \\text{Cu}(s)$$
*Observation*: The vibrant blue copper sulphate solution turns light green (ferrous sulphate) while reddish-brown metallic copper deposits on the iron nail.`,
        syllabusTopics: ["Malleability, ductility, conductivity, sonority", "Reaction of metals with oxygen (basic oxides)", "Reaction of non-metals with oxygen (acidic oxides)", "Reactivity series of metals", "Displacement reactions in aqueous solutions"],
        keyFormulas: ["Fe + CuSO4 -> FeSO4 + Cu", "2Mg + O2 -> 2MgO"],
        learningObjectives: ["Distinguish metals from non-metals experimentally", "Predict displacement reaction outcomes using the reactivity series", "Explain prevention of iron rusting"]
    },
    {
        id: "c8-bio-1",
        classNumber: 8,
        stageId: "foundation",
        subject: "Biology",
        chapterNumber: 1,
        title: "Microorganisms: Friend and Foe",
        description: "Bacteria, fungi, protozoa, algae, and viruses; nitrogen fixation, fermentation, and pathogenic diseases.",
        hasFullContent: false,
        extractedText: "",
        syllabusTopics: ["Major groups of microorganisms", "Fermentation by yeast (Lactobacillus and curd)", "Antibiotics and vaccines", "Nitrogen cycle and Rhizobium bacteria", "Pathogens, food poisoning, and food preservation"],
        keyFormulas: ["Glucose + Yeast -> Ethyl Alcohol + CO2 (Fermentation)"],
        learningObjectives: ["Identify beneficial vs pathogenic microbes", "Explain the principle of immunization", "Chart the atmospheric nitrogen cycle"]
    },
    {
        id: "c8-anat-1",
        classNumber: 8,
        stageId: "foundation",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Cell Structure and Human Tissue Organization",
        description: "Prokaryotic vs eukaryotic cells, cell membrane, cytoplasm, nucleus, and four primary human tissue classes.",
        hasFullContent: true,
        extractedText: `🔬 **Cell Structure and Human Tissue Organization (Class 8 Anatomy)**

### 1. The Fundamental Unit of Life
All living organisms are composed of cells. Robert Hooke first discovered cells in cork in 1665.
- **Plasma Membrane**: Selectively permeable lipid bilayer controlling solute entry and exit.
- **Cytoplasm**: Gel-like cytosol hosting specialized metabolic organelles.
- **Nucleus**: Spherical organelle containing chromatin (DNA) and nucleolus, commanding cellular activities.

### 2. The Four Primary Human Tissues
1. **Epithelial Tissue**: Continuous cellular sheets covering external body surfaces and lining internal organs (protection, secretion, absorption).
2. **Connective Tissue**: Cells embedded within an abundant extracellular matrix (bone, cartilage, adipose tissue, and blood).
3. **Muscle Tissue**: Contractile filaments containing actin and myosin (skeletal, cardiac, and smooth muscle).
4. **Nervous Tissue**: Highly excitable neurons and supporting neuroglial cells transmitting electro-chemical impulses.`,
        syllabusTopics: ["Cell discovery and cell theory", "Plant vs animal cell ultrastructure", "Prokaryotic vs eukaryotic organization", "Four primary tissue types in humans"],
        keyFormulas: ["Cell -> Tissue -> Organ -> Organ System -> Organism"],
        learningObjectives: ["Label plant and animal cell diagrams", "Differentiate between prokaryotes and eukaryotes", "Classify epithelial, connective, muscle, and nervous tissues"]
    },

    // ==========================================
    // CORE SCIENCE STAGE: CLASS 9
    // ==========================================
    {
        id: "c9-phy-1",
        classNumber: 9,
        stageId: "core",
        subject: "Physics",
        chapterNumber: 1,
        title: "Motion and Equations of Motion",
        description: "Distance vs displacement, speed vs velocity, uniform acceleration, velocity-time graphs, and kinematic derivations.",
        hasFullContent: true,
        extractedText: `🚗 **Motion and Equations of Motion (Class 9 Physics)**

### 1. Kinematic Scalar and Vector Quantities
- **Distance**: Total path length traversed by an object (scalar, always positive, $\\ge 0$).
- **Displacement**: Shortest straight-line vector directed from initial position to final position (vector, can be positive, negative, or zero).
- **Speed**: Rate of change of distance ($v = d/t$).
- **Velocity**: Rate of change of displacement in a specific direction ($\\vec{v} = \\Delta \\vec{s}/\\Delta t$).
- **Acceleration**: Rate of change of velocity ($a = \\frac{v - u}{t}$).

### 2. The Three Fundamental Equations of Motion (Uniform Acceleration)
1. First Equation (Velocity-Time Relation):
   $$v = u + at$$
2. Second Equation (Displacement-Time Relation):
   $$s = ut + \\frac{1}{2}at^2$$
3. Third Equation (Velocity-Displacement Relation):
   $$v^2 = u^2 + 2as$$

Where:
- $u$ = Initial velocity ($\\text{m/s}$)
- $v$ = Final velocity ($\\text{m/s}$)
- $a$ = Constant acceleration ($\\text{m/s}^2$)
- $t$ = Time elapsed ($\\text{s}$)
- $s$ = Total displacement ($\\text{m}$)`,
        syllabusTopics: ["Reference points and motion descriptors", "Uniform vs non-uniform acceleration", "Distance-time and velocity-time graphs", "Graphical derivation of kinematic equations", "Uniform circular motion"],
        keyFormulas: ["v = u + at", "s = ut + 0.5 * a * t^2", "v^2 = u^2 + 2as"],
        learningObjectives: ["Derive the three equations of motion graphically", "Interpret slopes and areas on velocity-time graphs", "Solve numerical kinematics word problems"]
    },
    {
        id: "c9-phy-2",
        classNumber: 9,
        stageId: "core",
        subject: "Physics",
        chapterNumber: 2,
        title: "Force and Laws of Motion (Newton's Laws)",
        description: "Inertia, momentum (p = mv), Newton's three laws of motion, F = ma derivation, and conservation of linear momentum.",
        hasFullContent: true,
        extractedText: `🚀 **Force and Laws of Motion (Class 9 Physics)**

### 1. Newton's Three Laws of Classical Mechanics
1. **Newton's First Law (Law of Inertia)**: An object remains in a state of rest or uniform motion in a straight line unless compelled to change that state by an applied unbalanced external force. Mass ($m$) is the quantitative measure of inertia.
2. **Newton's Second Law**: The rate of change of linear momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction of the force:
   $$\\vec{F} = \\frac{\\Delta \\vec{p}}{\\Delta t} = \\frac{m(v - u)}{t} = m \\cdot \\vec{a}$$
3. **Newton's Third Law**: To every action, there is always an equal and opposite reaction ($F_{AB} = -F_{BA}$). Forces always occur in matched action-reaction pairs acting upon different bodies.

### 2. Principle of Conservation of Momentum
In an isolated system where net external force is zero, the total linear momentum before collision equals total linear momentum after collision:
$$m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$$`,
        syllabusTopics: ["Galileo's experiments and inertia", "Linear momentum (p = mv)", "Newton's first, second, and third laws", "F = ma mathematical derivation", "Conservation of momentum and rocket propulsion"],
        keyFormulas: ["F = m * a", "p = m * v", "m1*u1 + m2*u2 = m1*v1 + m2*v2"],
        learningObjectives: ["Explain real-world inertia phenomena", "Derive F = ma from momentum change", "Calculate recoil velocity of firearms"]
    },
    {
        id: "c9-chem-1",
        classNumber: 9,
        stageId: "core",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Atoms, Molecules and The Mole Concept",
        description: "Laws of chemical combination, Dalton's atomic theory, atomic mass unit, molecular mass, Avogadro's number, and mole stoichiometry.",
        hasFullContent: true,
        extractedText: `⚖️ **Atoms, Molecules and The Mole Concept (Class 9 Chemistry)**

### 1. Fundamental Laws of Chemical Combination
1. **Law of Conservation of Mass (Lavoisier, 1774)**: Mass can neither be created nor destroyed in a chemical reaction. Total mass of reactants equals total mass of products.
2. **Law of Constant Proportions (Proust, 1799)**: In a pure chemical compound, the elements are always present in definite proportions by mass regardless of the source or method of preparation. (e.g., pure water always contains hydrogen and oxygen in a fixed $1:8$ mass ratio).

### 2. The Mole Concept & Avogadro's Constant
A **mole** ($mol$) is the SI unit representing $6.02214076 \\times 10^{23}$ elementary particles:
$$n = \\frac{m}{M} \\quad \\text{and} \\quad N = n \\times N_A$$
Where:
- $n$ = Number of moles
- $m$ = Given mass of sample in grams ($\\text{g}$)
- $M$ = Molar mass of substance in grams per mole ($\\text{g/mol}$)
- $N_A$ = Avogadro's constant ($6.022 \\times 10^{23}\\text{ particles/mol}$)`,
        syllabusTopics: ["Laws of conservation of mass and constant proportions", "Dalton's atomic theory postulates", "Atomic mass unit (amu)", "Valency and writing chemical formulas", "Mole concept formulas and stoichiometry"],
        keyFormulas: ["n = m / M", "N = n * N_A", "N_A = 6.022 x 10^23"],
        learningObjectives: ["Write balanced chemical formulas using criss-cross valency", "Calculate formula unit masses of compounds", "Solve mole-to-mass and mole-to-particle calculations"]
    },
    {
        id: "c9-bio-1",
        classNumber: 9,
        stageId: "core",
        subject: "Biology",
        chapterNumber: 1,
        title: "The Fundamental Unit of Life: Cell & Organelles",
        description: "Plasma membrane osmosis, plant cell wall, nucleus chromatin, endoplasmic reticulum, Golgi apparatus, lysosomes, mitochondria, and plastids.",
        hasFullContent: true,
        extractedText: `🔬 **The Fundamental Unit of Life: Cell & Organelles (Class 9 Biology)**

### 1. Cell Membrane & Osmosis
The plasma membrane is a selectively permeable phospholipid bilayer containing embedded proteins. Water transport across the membrane follows **osmosis**:
- **Hypotonic Solution**: Lower solute concentration outside; water enters the cell, causing animal cells to burst and plant cells to become turgid.
- **Isotonic Solution**: Equal osmotic concentrations; zero net water flux.
- **Hypertonic Solution**: Higher solute concentration outside; water exits, causing cellular plasmolysis.

### 2. Specialized Organelles
- **Endoplasmic Reticulum (ER)**: RER (studded with ribosomes) synthesizes proteins; SER synthesizes lipids and detoxifies poisons.
- **Golgi Apparatus**: Modifies, packages, and stores secretory proteins in vesicles.
- **Lysosomes**: "Suicide bags" containing digestive hydrolytic enzymes.
- **Mitochondria**: "Powerhouse of the cell" with double membranes generating ATP via cellular respiration.
- **Chloroplasts**: Double-membrane plastids containing chlorophyll for solar photosynthesis.`,
        syllabusTopics: ["Plasma membrane structure and transport", "Diffusion vs osmosis in plant and animal cells", "Nucleus, chromosomes, and genes", "Ultrastructure of ER, Golgi, lysosomes, mitochondria, and plastids", "Vacuoles and turgor pressure"],
        keyFormulas: ["Hypertonic vs Isotonic vs Hypotonic solutions", "ATP = Adenosine Triphosphate"],
        learningObjectives: ["Identify organelles under electron microscopy", "Explain why lysosomes are called suicide bags", "Predict cellular behavior in varying osmotic solutions"]
    },
    {
        id: "c9-anat-1",
        classNumber: 9,
        stageId: "core",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Human Musculoskeletal System & Connective Tissues",
        description: "Histology of bone matrix, hyaline cartilage, tendons, ligaments, and striated vs smooth muscle contraction.",
        hasFullContent: false,
        extractedText: "",
        syllabusTopics: ["Compact and spongy bone histology", "Haversian canal systems and osteocytes", "Tendons (muscle-to-bone) vs ligaments (bone-to-bone)", "Striated, unstriated, and cardiac muscle ultrastructure"],
        keyFormulas: ["Tendons = High tensile strength, limited flexibility", "Ligaments = Elastic fibers connecting bone-to-bone"],
        learningObjectives: ["Distinguish between dense regular connective tissues", "Compare skeletal, smooth, and cardiac muscle fibers histologically"]
    },

    // ==========================================
    // CORE SCIENCE STAGE: CLASS 10
    // ==========================================
    {
        id: "c10-phy-1",
        classNumber: 10,
        stageId: "core",
        subject: "Physics",
        chapterNumber: 1,
        title: "Electricity and Ohm's Law",
        description: "Electric potential difference, current, Ohm's law (V = IR), factors affecting resistance, series vs parallel resistors, and Joule's law of heating.",
        hasFullContent: true,
        extractedText: `⚡ **Electricity and Ohm's Law (Class 10 Physics)**

### 1. Potential Difference & Electric Current
- **Electric Current ($I$)**: The rate of flow of electric charges across a conductor's cross section:
  $$I = \\frac{Q}{t}$$ (Unit: Ampere, $\\text{A}$)
- **Electric Potential Difference ($V$)**: Work done per unit positive charge to move it between two points in an electrostatic field:
  $$V = \\frac{W}{Q}$$ (Unit: Volt, $\\text{V}$)

### 2. Ohm's Law
At constant temperature, the electric current flowing through a metallic conductor is directly proportional to the potential difference across its terminals:
$$V \\propto I \\implies V = I \\cdot R$$
Where $R$ is electrical resistance measured in **Ohms ($\\Omega$)**.

### 3. Factors Influencing Electrical Resistance
$$R = \\rho \\frac{L}{A}$$
Where:
- $L$ = Length of conductor in meters ($\\text{m}$)
- $A$ = Cross-sectional area in square meters ($\\text{m}^2$)
- $\\rho$ (rho) = Resistivity of the conductor material in $\\Omega\\cdot\\text{m}$

### 4. Resistor Combinations
- **Series Combination**: $R_{\\text{eq}} = R_1 + R_2 + R_3$ (Current $I$ is identical through all resistors).
- **Parallel Combination**: $\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$ (Voltage $V$ is identical across all branches).`,
        syllabusTopics: ["Electric charge and current (I = Q/t)", "Potential difference and voltmeter connection", "Ohm's law verification and V-I graphs", "Resistivity (rho = R*A/L)", "Series and parallel resistor combinations", "Joule's heating law (H = I^2*R*t) and electric power (P = VI)"],
        keyFormulas: ["V = I * R", "R = rho * L / A", "R_series = R1 + R2 + ...", "1/R_parallel = 1/R1 + 1/R2 + ...", "P = V * I = I^2 * R = V^2 / R"],
        learningObjectives: ["Verify Ohm's law with circuit schematics", "Calculate equivalent resistances in combined circuits", "Compute electrical energy consumption in kilowatt-hours"]
    },
    {
        id: "c10-phy-2",
        classNumber: 10,
        stageId: "core",
        subject: "Physics",
        chapterNumber: 2,
        title: "Magnetic Effects of Electric Current & Electric Motors",
        description: "Oersted's discovery, magnetic field lines, right-hand thumb rule, Lorentz force on a current conductor, Fleming's left-hand rule, and DC motors.",
        hasFullContent: true,
        extractedText: `🧲 **Magnetic Effects of Electric Current (Class 10 Physics)**

### 1. Electromagnetism & Field Lines
Hans Christian Oersted (1820) discovered that an electric current creates a circular magnetic field around the conductor.
- **Right-Hand Thumb Rule**: Curl the fingers of your right hand around the wire with the thumb pointing in the direction of conventional current ($I$). The curled fingers indicate the direction of magnetic flux lines ($\\vec{B}$).

### 2. Force on Current Conductor in Magnetic Field
When a current-carrying conductor is placed in an external magnetic field, it experiences an orthogonal magnetic force:
$$\\vec{F} = I(\\vec{L} \\times \\vec{B}) \\implies F = I L B \\sin\\theta$$

### 3. Fleming's Left-Hand Rule & Electric DC Motor
Extend the thumb, forefinger, and middle finger of the left hand mutually perpendicular to one another:
- **Forefinger**: Points along Magnetic Field ($\\vec{B}$)
- **Middle finger**: Points along Electric Current ($I$)
- **Thumb**: Indicates direction of mechanical Motion / Force ($\\vec{F}$)

In a **DC Motor**, the split-ring commutator reverses current flow every $180^\\circ$, ensuring that opposite sides of the armature coil experience continuous rotational torque.`,
        syllabusTopics: ["Magnetic field lines and compass needles", "Right-hand thumb rule for straight wires and solenoids", "Electromagnet construction and core permeability", "Fleming's left-hand rule", "DC electric motor components and commutator function", "Electromagnetic induction basics"],
        keyFormulas: ["F = I * L * B * sin(theta)", "B_solenoid = mu0 * n * I"],
        learningObjectives: ["Map magnetic fields around current conductors", "Apply Fleming's left-hand rule to predict motor rotation", "Explain the commutator's role in electric motors"]
    },
    {
        id: "c10-chem-1",
        classNumber: 10,
        stageId: "core",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Chemical Reactions, Equations & Balancing",
        description: "Writing skeletal equations, balancing by atom conservation, combination, decomposition, displacement, double displacement, redox, and corrosion.",
        hasFullContent: true,
        extractedText: `⚗️ **Chemical Reactions, Equations & Balancing (Class 10 Chemistry)**

### 1. Chemical Change Indicators
A chemical reaction is confirmed by:
1. Evolution of a gas (e.g., $Zn + H_2SO_4 \\rightarrow ZnSO_4 + H_2\\uparrow$)
2. Change in temperature (exothermic vs endothermic)
3. Formation of a precipitate (e.g., $AgNO_3 + NaCl \\rightarrow AgCl\\downarrow + NaNO_3$)
4. Change in color or physical state

### 2. Five Primary Reaction Types
1. **Combination**: $A + B \\rightarrow AB \\quad (CaO + H_2O \\rightarrow Ca(OH)_2)$
2. **Decomposition**: $AB \\rightarrow A + B \\quad (2FeSO_4 \\xrightarrow{\\Delta} Fe_2O_3 + SO_2 + SO_3)$
3. **Single Displacement**: $A + BC \\rightarrow AC + B \\quad (Zn + CuSO_4 \\rightarrow ZnSO_4 + Cu)$
4. **Double Displacement (Precipitation)**: $AB + CD \\rightarrow AD + CB \\quad (Na_2SO_4 + BaCl_2 \\rightarrow BaSO_4\\downarrow + 2NaCl)$
5. **Redox (Oxidation-Reduction)**:
   - **Oxidation**: Gain of oxygen or loss of electrons (OIL).
   - **Reduction**: Loss of oxygen or gain of electrons (RIG).`,
        syllabusTopics: ["Balancing chemical equations by atom conservation", "Combination and decomposition reactions", "Displacement and precipitation reactions", "Redox reactions and oxidizing/reducing agents", "Corrosion prevention and rancidity in foods"],
        keyFormulas: ["2H2 + O2 -> 2H2O", "CH4 + 2O2 -> CO2 + 2H2O", "Zn + CuSO4 -> ZnSO4 + Cu"],
        learningObjectives: ["Balance complex chemical equations systematically", "Identify oxidation and reduction half-reactions", "Explain economic impacts of metal corrosion"]
    },
    {
        id: "c10-bio-1",
        classNumber: 10,
        stageId: "core",
        subject: "Biology",
        chapterNumber: 1,
        title: "Life Processes: Nutrition, Respiration & Circulation",
        description: "Autotrophic photosynthesis, glycolysis vs aerobic respiration, human heart circulation, and nephron excretion.",
        hasFullContent: true,
        extractedText: `🫀 **Life Processes (Class 10 Biology)**

### 1. Photosynthesis vs Cellular Respiration
- **Photosynthesis (Chloroplasts)**:
  $$6CO_2 + 6H_2O + \\text{Light} \\rightarrow C_6H_{12}O_6 + 6O_2$$
- **Aerobic Cellular Respiration (Mitochondria)**:
  $$C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + 36\\text{--}38\\text{ ATP}$$

### 2. Human Double Circulation
Blood passes twice through the heart during one complete systemic cycle:
1. **Pulmonary Circuit**: Right Ventricle $\\rightarrow$ Pulmonary Artery $\\rightarrow$ Lungs (gas exchange) $\\rightarrow$ Pulmonary Veins $\\rightarrow$ Left Atrium.
2. **Systemic Circuit**: Left Ventricle $\\rightarrow$ Aorta $\\rightarrow$ Body Tissues $\\rightarrow$ Vena Cava $\\rightarrow$ Right Atrium.

### 3. Excretion via Renal Nephrons
Nephrons in the kidneys purify blood in three sequential steps:
1. Ultrafiltration in the glomerulus & Bowman's capsule
2. Selective tubular reabsorption (glucose, amino acids, salts, water)
3. Tubular secretion into collecting ducts to produce urine.`,
        syllabusTopics: ["Photosynthesis stages and stomata mechanism", "Aerobic vs anaerobic respiration pathways", "Human heart structure and double circulation", "Lymphatic system functions", "Nephron structure and urine formation"],
        keyFormulas: ["Double circulation: Pulmonary + Systemic circuits", "Nephron filtration fraction"],
        learningObjectives: ["Chart the double circulation pathway", "Compare aerobic respiration with fermentation", "Explain nephron ultrafiltration mechanisms"]
    },
    {
        id: "c10-anat-1",
        classNumber: 10,
        stageId: "core",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "The Human Brain & Nervous System Architecture",
        description: "Central nervous system (CNS), peripheral nervous system (PNS), reflex arcs, cerebrum, cerebellum, medulla oblongata, and endocrine glands.",
        hasFullContent: true,
        extractedText: `🧠 **The Human Brain & Nervous System Architecture (Class 10 Anatomy)**

### 1. Neuron Micro-Architecture
The **neuron** is the fundamental structural and functional unit of the nervous system:
- **Dendrites**: Receive chemical neurotransmitter signals from adjacent synapses.
- **Cell Body (Soma)**: Synthesizes proteins and processes incoming membrane potentials.
- **Axon**: Myelinated fiber propagating action potentials towards synaptic terminals.
- **Synapse**: Microscopic junction where neurotransmitters bridge the gap to adjacent cells.

### 2. Divisions of the Human Brain
The adult brain is enclosed within the bony **cranium** and shielded by three **meninges**:
1. **Forebrain (Cerebrum)**: Seat of intelligence, sensory perception, conscious thought, memory, and voluntary motor commands.
2. **Midbrain**: Controls involuntary visual and auditory reflex pathways.
3. **Hindbrain**:
   - **Cerebellum**: Precision control of posture, equilibrium balance, and motor coordination.
   - **Pons**: Respiratory pneumotaxic regulation.
   - **Medulla Oblongata**: Commands autonomic vital reflexes (heart rate, breathing, swallowing, blood pressure).`,
        syllabusTopics: ["Neuron anatomy and synaptic transmission", "Reflex arc pathway (stimulus to effector)", "Cerebrum lobes and functional cortices", "Cerebellum, pons, and medulla oblongata functions", "Spinal cord protective anatomy"],
        keyFormulas: ["Reflex Arc: Receptor -> Sensory Neuron -> Spinal Relay -> Motor Neuron -> Effector"],
        learningObjectives: ["Diagram a multipolar neuron and synapse", "Trace somatic reflex arcs", "Assign physiological functions to cerebral and cerebellar lobes"]
    },

    // ==========================================
    // ADVANCED SCIENCE STAGE: CLASS 11
    // ==========================================
    {
        id: "c11-phy-1",
        classNumber: 11,
        stageId: "advanced",
        subject: "Physics",
        chapterNumber: 1,
        title: "Work, Energy, Power & Rotational Mechanics",
        description: "Scalar product, work-energy theorem, conservative forces, potential energy, torque, angular momentum, and moment of inertia.",
        hasFullContent: true,
        extractedText: `⚙️ **Work, Energy, Power & Rotational Mechanics (Class 11 Physics)**

### 1. Work-Energy Theorem
Work done by the net force acting on a particle equals the change in its translational kinetic energy:
$$W_{\\text{net}} = \\Delta KE = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$
Where Work is the line integral of force: $W = \\int \\vec{F} \\cdot d\\vec{r} = F d \\cos\\theta$.

### 2. Rotational Dynamics Analogies
Rotational motion mirrors linear translational dynamics:
- Force ($\\vec{F}$) $\\longleftrightarrow$ **Torque** ($\\vec{\\tau} = \\vec{r} \\times \\vec{F}$)
- Mass ($m$) $\\longleftrightarrow$ **Moment of Inertia** ($I = \\sum m_i r_i^2$)
- Linear Velocity ($v$) $\\longleftrightarrow$ **Angular Velocity** ($\\omega = v/r$)
- Momentum ($p = mv$) $\\longleftrightarrow$ **Angular Momentum** ($L = I\\omega$)
- Dynamic Equation: $\\vec{\\tau} = I \\vec{\\alpha} = \\frac{d\\vec{L}}{dt}$`,
        syllabusTopics: ["Work-energy theorem derivation", "Conservative vs non-conservative forces", "Gravitational and spring potential energy", "Center of mass for continuous bodies", "Torque and moment of inertia (parallel and perpendicular axes theorems)", "Conservation of angular momentum"],
        keyFormulas: ["W = F * d * cos(theta)", "KE = 0.5 * m * v^2", "tau = r x F = I * alpha", "L = I * omega"],
        learningObjectives: ["Apply work-energy theorem to variable force systems", "Calculate moment of inertia for standard geometric bodies", "Analyze gyroscopic and rotational conservation problems"]
    },
    {
        id: "c11-chem-1",
        classNumber: 11,
        stageId: "advanced",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Chemical Bonding and Molecular Structure",
        description: "Lewis structures, ionic vs covalent bonding, VSEPR theory, hybridization (sp, sp2, sp3), and Molecular Orbital (MO) theory.",
        hasFullContent: true,
        extractedText: `🔗 **Chemical Bonding and Molecular Structure (Class 11 Chemistry)**

### 1. Ionic vs Covalent Chemical Bonds
- **Ionic Bond**: Complete electrostatic transfer of one or more valence electrons from an electropositive metal to an electronegative non-metal ($Na^+ + Cl^- \\rightarrow NaCl$). Ionic compounds form three-dimensional crystal lattices with high melting points and electrical conductivity in molten/aqueous states.
- **Covalent Bond**: Mutual sharing of valence electron pairs between non-metallic atoms to achieve noble gas electron configurations ($H_2O, CH_4$).

### 2. Valence Shell Electron Pair Repulsion (VSEPR) & Hybridization
Electron pairs surrounding a central atom repel one another, dictating 3D molecular geometry:
- $sp$ Hybridization: Linear geometry ($180^\\circ$, e.g., $BeCl_2, C_2H_2$)
- $sp^2$ Hybridization: Trigonal planar ($120^\\circ$, e.g., $BF_3, C_2H_4$)
- $sp^3$ Hybridization: Tetrahedral ($109.5^\\circ$, e.g., $CH_4$); Bent geometry in $H_2O$ ($104.5^\\circ$) due to lone pair repulsion.`,
        syllabusTopics: ["Octet rule and Lewis dot structures", "Ionic bonding and lattice enthalpy", "VSEPR theory geometry predictions", "Orbital hybridization (sp, sp2, sp3, sp3d)", "Molecular Orbital (MO) energy level diagrams and bond order"],
        keyFormulas: ["Bond Order = 0.5 * (N_b - N_a)", "Hybridization: Steric Number = sigma bonds + lone pairs"],
        learningObjectives: ["Predict molecular shapes and bond angles using VSEPR", "Determine orbital hybridization of central atoms", "Calculate bond order and magnetic behavior via MO theory"]
    },
    {
        id: "c11-bio-1",
        classNumber: 11,
        stageId: "advanced",
        subject: "Biology",
        chapterNumber: 1,
        title: "Plant Physiology: Photosynthesis & Calvin Cycle",
        description: "Light-dependent reactions, photosystems I & II, photophosphorylation, RuBisCO carboxylation, and C3 vs C4 pathways.",
        hasFullContent: true,
        extractedText: `🌿 **Plant Physiology: Photosynthesis & Calvin Cycle (Class 11 Biology)**

### 1. Light-Dependent Reactions (Thylakoid Grana)
Photosynthetic pigments organized into Photosystem II ($P_{680}$) and Photosystem I ($P_{700}$) drive non-cyclic photophosphorylation (Z-scheme):
1. **Photolysis of Water**: $2H_2O \\rightarrow 4H^+ + 4e^- + O_2$
2. **Electron Transport Chain (ETC)**: Electrons pump protons into the thylakoid lumen, generating a proton-motive force across **ATP Synthase**.
3. **End Products**: High-energy biochemical carriers **ATP** and **NADPH** are released into the stroma.

### 2. Light-Independent Reactions / Calvin Cycle (Stroma)
The enzyme **RuBisCO** (Ribulose-1,5-bisphosphate carboxylase/oxygenase) catalyzes the foundational carbon fixation:
1. **Carboxylation**: $RuBP (5C) + CO_2 \\xrightarrow{RuBisCO} 2 \\times 3\\text{-PGA } (3C)$
2. **Reduction**: ATP and NADPH reduce 3-PGA into glyceraldehyde-3-phosphate (triose sugar).
3. **Regeneration**: ATP regenerates the $RuBP$ carbon acceptor.`,
        syllabusTopics: ["Absorption spectrum vs action spectrum of chlorophylls", "Photosystem I and II organization in thylakoids", "Non-cyclic and cyclic photophosphorylation", "Chemiosmotic ATP synthesis across chloroplast thylakoids", "Calvin cycle enzymatic steps", "C4 pathway (Kranz anatomy) and photorespiration"],
        keyFormulas: ["Photolysis: 2H2O -> 4H+ + 4e- + O2", "Net Calvin: 6CO2 + 18ATP + 12NADPH -> 1 Glucose + 18ADP + 12NADP+"],
        learningObjectives: ["Explain Z-scheme electron transport in thylakoids", "Detail the enzymatic carboxylation catalyzed by RuBisCO", "Contrast C3 and C4 carbon fixation efficiencies"]
    },
    {
        id: "c11-anat-1",
        classNumber: 11,
        stageId: "advanced",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Gross Human Anatomy: Thoracic Cavity & Mediastinum",
        description: "Anatomical planes, boundaries of the thoracic cage, pericardium, cardiac apex, coronary vasculature, and mediastinum compartments.",
        hasFullContent: false,
        extractedText: "",
        syllabusTopics: ["Superior and inferior mediastinum boundaries", "Pericardial sac (fibrous and serous layers)", "Coronary artery branch anatomy (LAD and RCA)", "Phrenic and vagus nerve thoracic course", "Pleural cavities and bronchopulmonary segments"],
        keyFormulas: ["Mediastinum = Central compartment of thoracic cavity between pleural sacs"],
        learningObjectives: ["Identify boundaries of anterior, middle, and posterior mediastinum", "Trace coronary arterial supply to left and right ventricular myocardium"]
    },

    // ==========================================
    // ADVANCED SCIENCE STAGE: CLASS 12
    // ==========================================
    {
        id: "c12-phy-1",
        classNumber: 12,
        stageId: "advanced",
        subject: "Physics",
        chapterNumber: 1,
        title: "Electromagnetism, Induction & AC Circuits",
        description: "Faraday's laws of induction, Lenz's law, self and mutual inductance, alternating current phasor diagrams, and LCR resonance.",
        hasFullContent: true,
        extractedText: `⚡ **Electromagnetism, Induction & AC Circuits (Class 12 Physics)**

### 1. Faraday's Laws & Lenz's Law
- **Faraday's First Law**: Whenever magnetic flux ($\\Phi_B = \\int \\vec{B} \\cdot d\\vec{A}$) linked with a closed conductive loop changes over time, an electromotive force (EMF) is induced.
- **Faraday-Lenz Law**: The induced EMF magnitude equals the time rate of change of magnetic flux, and its polarity opposes the flux change:
  $$\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}$$

### 2. Series LCR Resonant Circuit
In an alternating current circuit containing Inductor ($L$), Capacitor ($C$), and Resistor ($R$):
- Inductive Reactance: $X_L = \\omega L$
- Capacitive Reactance: $X_C = \\frac{1}{\\omega C}$
- Total Impedance: $Z = \\sqrt{R^2 + (X_L - X_C)^2}$
- **Resonance Condition**: When $X_L = X_C$, impedance drops to minimum ($Z = R$), and current reaches maximum resonance:
  $$\\omega_0 = \\frac{1}{\\sqrt{LC}} \\implies f_0 = \\frac{1}{2\\pi \\sqrt{LC}}$$`,
        syllabusTopics: ["Magnetic flux (Phi = B*A*cos(theta))", "Faraday's induction experiments and Lenz's law", "Motional EMF (E = B*L*v)", "Self-inductance and mutual inductance coefficients", "AC voltage across L, C, and R elements", "Series LCR resonance and Q-factor"],
        keyFormulas: ["EMF = -N * dPhi/dt", "Z = sqrt(R^2 + (X_L - X_C)^2)", "f_0 = 1 / (2*pi*sqrt(L*C))"],
        learningObjectives: ["Calculate induced EMF from time-dependent flux", "Construct AC voltage and current phasor diagrams", "Determine resonant frequency and bandwidth of LCR circuits"]
    },
    {
        id: "c12-chem-1",
        classNumber: 12,
        stageId: "advanced",
        subject: "Chemistry",
        chapterNumber: 1,
        title: "Chemical Kinetics and Electrochemistry",
        description: "Rate laws, order and molecularity of reactions, Arrhenius equation, galvanic cells, Nernst equation, and Gibbs free energy.",
        hasFullContent: true,
        extractedText: `🧪 **Chemical Kinetics and Electrochemistry (Class 12 Chemistry)**

### 1. Chemical Kinetics & Arrhenius Equation
The rate of a chemical reaction depends upon reactant concentrations and temperature:
- **First-Order Integrated Rate Law**:
  $$k = \\frac{2.303}{t} \\log_{10} \\left(\\frac{[A]_0}{[A]}\\right) \\quad \\text{and} \\quad t_{1/2} = \\frac{0.693}{k}$$
- **Arrhenius Equation**: Quantifies temperature sensitivity of rate constants via activation energy ($E_a$):
  $$k = A e^{-E_a / (RT)} \\implies \\ln\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

### 2. Galvanic Cells & Nernst Equation
In an electrochemical cell, chemical redox free energy converts into electric current:
$$\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}$$
- **Nernst Equation** (Electrode potential at non-standard concentrations):
  $$E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{2.303 RT}{nF} \\log_{10} Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} \\left(\\frac{[\\text{Products}]}{[\\text{Reactants}]}\\right) \\quad (\\text{at } 298\\text{ K})$$`,
        syllabusTopics: ["Rate of reaction and differential rate expressions", "Order vs molecularity of chemical reactions", "Zero and first-order integrated rate laws", "Arrhenius activation energy equation", "Standard electrode potentials and Daniell galvanic cell", "Nernst equation derivations and Gibbs free energy"],
        keyFormulas: ["t_half = 0.693 / k (First Order)", "E_cell = E0_cell - (0.0591/n)*log10(Q)", "DeltaG0 = -n * F * E0_cell"],
        learningObjectives: ["Determine reaction order from experimental initial rates", "Calculate half-life and activation energy from Arrhenius plots", "Compute cell electromotive force using the Nernst equation"]
    },
    {
        id: "c12-bio-1",
        classNumber: 12,
        stageId: "advanced",
        subject: "Biology",
        chapterNumber: 1,
        title: "Genetics, DNA & Molecular Basis of Inheritance",
        description: "Double helix DNA structure, semiconservative replication, transcription, genetic code, translation, and lac operon regulation.",
        hasFullContent: true,
        extractedText: `🧬 **Genetics & Molecular Basis of Inheritance (Class 12 Biology)**

### 1. DNA Double Helix Molecular Architecture
Watson and Crick (1953) elucidated the secondary structure of deoxyribonucleic acid (DNA):
- Antiparallel double-stranded polynucleotide chains with a deoxyribose-phosphate backbone.
- **Chargaff's Base-Pairing Rules**: Purines pair exclusively with pyrimidines via hydrogen bonds:
  - Adenine pairs with Thymine via **2 hydrogen bonds** ($A = T$).
  - Guanine pairs with Cytosine via **3 hydrogen bonds** ($G \\equiv C$).

### 2. Central Dogma of Molecular Biology
$$\\text{DNA} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Polypeptide / Protein}$$
1. **Replication**: Semiconservative synthesis catalyzed by DNA Polymerase III.
2. **Transcription**: RNA Polymerase transcribes DNA template strand into complementary messenger RNA ($mRNA$) in the $5' \\rightarrow 3'$ direction.
3. **Translation**: Ribosomes decode triplet nucleotide **codons** using transfer RNA ($tRNA$) anticodons to polymerize polypeptide chains.`,
        syllabusTopics: ["Griffith, Avery-MacLeod-McCarty, and Hershey-Chase experiments", "Watson-Crick DNA double helix geometry", "Meselson-Stahl semiconservative replication proof", "Prokaryotic vs eukaryotic transcription and mRNA processing", "Universal genetic code properties (degenerate, non-overlapping)", "Ribosomal translation and lac operon gene regulation"],
        keyFormulas: ["Chargaff: [A] = [T] and [G] = [C]; [A+G] = [T+C]", "Central Dogma: DNA -> RNA -> Protein"],
        learningObjectives: ["Detail historical experimental proofs establishing DNA as genetic material", "Describe the enzymatic machinery of DNA replication", "Translate mRNA codon sequences into amino acid chains"]
    },
    {
        id: "c12-anat-1",
        classNumber: 12,
        stageId: "advanced",
        subject: "Anatomy",
        chapterNumber: 1,
        title: "Clinical Neuroanatomy & Cardiovascular Pathophysiology",
        description: "Circle of Willis cerebral vascularization, ventricular system, cerebrospinal fluid dynamics, and ischemic cardiac pathophysiology.",
        hasFullContent: true,
        extractedText: `🩺 **Clinical Neuroanatomy & Cardiovascular Pathophysiology (Class 12 Anatomy)**

### 1. The Arterial Circle of Willis
Cerebral perfusion is safeguarded by an anastomotic vascular ring at the base of the brain:
- **Internal Carotid Arteries**: Supply anterior and middle cerebral circulations.
- **Vertebrobasilar System**: Basilar artery bifurcates into posterior cerebral arteries.
- **Communicating Arteries**: Anterior and posterior communicating arteries equalize intracranial pressures.

### 2. Ventricular System & Cerebrospinal Fluid (CSF) Flow
- Ependymal cells in the **choroid plexuses** synthesize $\\sim 500\\text{ mL/day}$ of clear CSF.
- **Flow Pathway**:
  $$\\text{Lateral Ventricles} \\xrightarrow{\\text{Foramen of Monro}} \\text{Third Ventricle} \\xrightarrow{\\text{Aqueduct of Sylvius}} \\text{Fourth Ventricle} \\xrightarrow{\\text{Foramina of Luschka/Magendie}} \\text{Subarachnoid Space}$$
- Reabsorbed into superior sagittal venous sinus via arachnoid granulations.

### 3. Left Ventricular Concentric Hypertrophy
In response to chronic systemic hypertension, the left ventricular myocardium thickens to reduce wall stress according to **Laplace's Law** ($\\sigma = \\frac{P \\cdot r}{2h}$). Over time, reduced chamber compliance impairs diastolic filling, precipitating heart failure.`,
        syllabusTopics: ["Circle of Willis anatomy and stroke ischemia territories", "Ventricular system and hydrocephalus pathophysiology", "CSF synthesis and arachnoid granulation reabsorption", "Myocardial infarction and left ventricular hypertrophy hemodynamics"],
        keyFormulas: ["Laplace's Law: Wall Stress (sigma) = (Pressure * Radius) / (2 * Wall Thickness)"],
        learningObjectives: ["Trace the complete circulation of cerebrospinal fluid", "Identify cerebral vascular territories supplied by anterior, middle, and posterior arteries", "Explain the hemodynamic consequences of left ventricular concentric hypertrophy"]
    }
];

export function getChaptersByStage(stageId) {
    if (!stageId || stageId === "all") return SUBJECT_WISE_CHAPTERS;
    return SUBJECT_WISE_CHAPTERS.filter(ch => ch.stageId === stageId);
}

export function getChaptersByClass(classNumber) {
    if (!classNumber || classNumber === "all") return SUBJECT_WISE_CHAPTERS;
    const cNum = parseInt(classNumber, 10);
    return SUBJECT_WISE_CHAPTERS.filter(ch => ch.classNumber === cNum);
}

export function getChaptersBySubject(subject) {
    if (!subject || subject === "all") return SUBJECT_WISE_CHAPTERS;
    return SUBJECT_WISE_CHAPTERS.filter(ch => ch.subject.toLowerCase() === subject.toLowerCase());
}
