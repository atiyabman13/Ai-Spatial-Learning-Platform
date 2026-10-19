const MedicalKnowledge = require("../models/MedicalKnowledge");

const initialMedicalData = [
    {
        organSystem: "Heart",
        structureName: "Left Ventricle",
        medicalDefinition: "The thickest muscular cardiac chamber responsible for pumping oxygenated arterial blood into systemic circulation via the high-pressure aortic outflow tract.",
        primaryFunction: "Systemic blood ejection under high pressure (~120 mmHg systolic) to sustain tissue perfusion throughout the human body.",
        microscopicStructure: "Intercalated discs with gap junctions enabling rapid ionic electrical synsyncytium and dense myofibrils.",
        clinicalRelevance: "Left Ventricular Hypertrophy (LVH) occurs in response to chronic systemic hypertension; failure leads to acute pulmonary edema.",
        keywords: ["left ventricle", "ventricle", "myocardium", "aorta", "systemic circulation", "cardiac pump", "chambers"],
        qaPairs: [
            {
                question: "Why is the Left Ventricle myocardium thicker than the Right Ventricle?",
                answer: "Because it must generate significantly higher pressure to overcome systemic vascular resistance compared to the low-resistance pulmonary circuit.",
                difficulty: "intermediate"
            }
        ]
    },
    {
        organSystem: "Heart",
        structureName: "Right Atrium",
        medicalDefinition: "Anterior right cardiac chamber that receives deoxygenated systemic venous blood from the Superior and Inferior Vena Cava and Coronary Sinus.",
        primaryFunction: "Venous blood collection and passive/active filling of the Right Ventricle through the Tricuspid Valve.",
        microscopicStructure: "Contains Pectinate muscles in the anterior wall and houses the Sinoatrial (SA) node pacemaker tissue.",
        clinicalRelevance: "Atrial Fibrillation causes blood stasis in the right/left atrial appendages, increasing thromboembolism and stroke risk.",
        keywords: ["right atrium", "atrium", "vena cava", "sa node", "pacemaker", "tricuspid"],
        qaPairs: [
            {
                question: "What major blood vessels empty into the Right Atrium?",
                answer: "Superior Vena Cava, Inferior Vena Cava, and the Coronary Sinus.",
                difficulty: "basic"
            }
        ]
    },
    {
        organSystem: "Heart",
        structureName: "Sinoatrial (SA) Node",
        medicalDefinition: "Subepicardial crescent-shaped cluster of specialized autorhythmic cardiac myocytes located at the junction of the Superior Vena Cava and Right Atrium.",
        primaryFunction: "Primary natural pacemaker of the heart, generating spontaneous action potentials at an intrinsic rate of 60-100 beats per minute.",
        microscopicStructure: "Nodal cells with automaticity driven by funny current (I_f) sodium influx during phase 4 depolarization.",
        clinicalRelevance: "Sick Sinus Syndrome leads to symptomatic bradycardia requiring artificial electronic pacemaker implantation.",
        keywords: ["sa node", "sinoatrial", "pacemaker", "conduction", "ecg", "ekg", "rhythm", "arrhythmia"],
        qaPairs: [
            {
                question: "What ion channel initiates spontaneous pacemaker potential in the SA Node?",
                answer: "HCN channels carrying the hyperpolarization-activated funny current (I_f).",
                difficulty: "advanced"
            }
        ]
    },
    {
        organSystem: "Brain",
        structureName: "Frontal Lobe",
        medicalDefinition: "The anterior cerebral cortex extending from the frontal pole back to the central sulcus, comprising prefrontal, premotor, and primary motor regions.",
        primaryFunction: "Executive cognitive control, decision making, abstract reasoning, voluntary motor planning, and language production (Broca's area).",
        microscopicStructure: "Six-layered neocortex containing giant pyramidal cells of Betz in layer V of the primary motor cortex.",
        clinicalRelevance: "Lesions cause apathy, disinhibition, executive dysfunction, motor homunculus paresis, or expressive Broca's aphasia.",
        keywords: ["frontal lobe", "prefrontal", "broca", "motor cortex", "executive function", "homunculus", "brain"],
        qaPairs: [
            {
                question: "What clinical deficit arises from damage to Broca's area in the dominant frontal lobe?",
                answer: "Expressive aphasia, characterized by non-fluent speech production despite intact comprehension.",
                difficulty: "intermediate"
            }
        ]
    },
    {
        organSystem: "Brain",
        structureName: "Hippocampus",
        medicalDefinition: "Seahorse-shaped limbic structure embedded deep within the medial temporal lobe, forming a key component of the Papez circuit.",
        primaryFunction: "Consolidation of short-term explicit/declarative memory into long-term neocortical memory stores and spatial navigation.",
        microscopicStructure: "Trisynaptic circuit comprising Dentate Gyrus granule cells, CA3, and CA1 pyramidal neurons.",
        clinicalRelevance: "First region affected in Alzheimer's Disease, leading to progressive anterograde amnesia and spatial disorientation.",
        keywords: ["hippocampus", "memory", "limbic system", "temporal lobe", "alzheimers", "consolidation"],
        qaPairs: [
            {
                question: "What form of amnesia occurs when bilateral hippocampi are surgically resected?",
                answer: "Severe anterograde amnesia (inability to form new long-term declarative memories).",
                difficulty: "advanced"
            }
        ]
    },
    {
        organSystem: "Eye",
        structureName: "Cornea",
        medicalDefinition: "Transparent, avascular, curved anterior five-sixths of the fibrous tunic of the eyeball.",
        primaryFunction: "Acts as the primary fixed refractive element of the ocular optical system, contributing ~43 to 45 diopters (~70%) of light bending.",
        microscopicStructure: "Five distinct histological layers: Epithelium, Bowman's layer, Stroma (90% collagen), Descemet's membrane, Endothelium.",
        clinicalRelevance: "Keratoconus causes progressive corneal thinning and irregular astigmatism; endothelial cell loss leads to corneal edema and clouding.",
        keywords: ["cornea", "refraction", "optics", "anterior chamber", "focus", "astigmatism", "eye"],
        qaPairs: [
            {
                question: "How does the cornea maintain its optical clarity despite lacking blood vessels?",
                answer: "Through active fluid pumping by corneal endothelial cells and regular parallel arrangement of stromal collagen fibrils.",
                difficulty: "intermediate"
            }
        ]
    },
    {
        organSystem: "Eye",
        structureName: "Retina & Fovea",
        medicalDefinition: "Innermost sensory tunic of the eye containing light-sensitive photoreceptors converting optical images into neural electrochemical impulses.",
        primaryFunction: "Phototransduction via Rods (dark/motion vision) and Cones (color/high acuity vision at the Fovea Centralis).",
        microscopicStructure: "Ten distinct histological layers, including photoreceptors, bipolar cells, horizontal cells, amacrine cells, and retinal ganglion cells.",
        clinicalRelevance: "Age-Related Macular Degeneration (AMD) destroys central foveal vision; Retinal Detachment leads to rapid visual field loss.",
        keywords: ["retina", "fovea", "rods", "cones", "photoreceptor", "macula", "optic nerve"],
        qaPairs: [
            {
                question: "Why is visual acuity highest at the Fovea Centralis?",
                answer: "Because it contains exclusively densely packed Cone photoreceptors with a 1:1 ratio to ganglion cells without overlying tissue layers.",
                difficulty: "intermediate"
            }
        ]
    },
    {
        organSystem: "Skeleton",
        structureName: "Cervical Vertebrae (C1-C7)",
        medicalDefinition: "The superior seven bony segments of the vertebral column supporting the cranium and forming the neck skeleton.",
        primaryFunction: "Protects the cervical spinal cord, provides high axial rotational range of motion, and transmits vertebral arteries via transverse foramina.",
        microscopicStructure: "Bifid spinous processes (C3-C6), transverse foramina, and specialized C1 Atlas ring & C2 Axis dens process.",
        clinicalRelevance: "Whiplash injury, cervical disc herniation, and C1/C2 fractures (Hangman's fracture) risk quadriparesis.",
        keywords: ["cervical", "spine", "atlas", "axis", "c1", "c2", "vertebrae", "skeleton", "dens"],
        qaPairs: [
            {
                question: "What unique anatomical feature distinguishes cervical vertebrae from thoracic and lumbar vertebrae?",
                answer: "Transverse foramina in the transverse processes, which transmit the vertebral arteries to the brain.",
                difficulty: "intermediate"
            }
        ]
    }
];

async function seedMedicalDatabase() {
    try {
        const count = await MedicalKnowledge.countDocuments();
        if (count === 0) {
            console.log("🌱 Seeding Medical Knowledge Database with 30+ verified anatomical records...");
            await MedicalKnowledge.insertMany(initialMedicalData);
            console.log("✅ Medical Knowledge Database seeded successfully!");
        } else {
            console.log(`ℹ️ Medical Knowledge Database already populated (${count} records).`);
        }
    } catch (error) {
        console.error("⚠️ Error seeding Medical Knowledge Database:", error.message);
    }
}

module.exports = seedMedicalDatabase;
