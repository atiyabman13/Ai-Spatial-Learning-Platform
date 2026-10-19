const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { createWorker } = require("tesseract.js");
const { v4: uuidv4 } = require("uuid");

// In-memory registry for tracking and cancelling active jobs
const activeJobs = new Map();

// Root storage directories
const JOBS_DIR = path.join(__dirname, "../../uploads/jobs");
const GENERATED_MODELS_DIR = path.join(__dirname, "../../generated-models");

// Ensure directories exist
if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });
if (!fs.existsSync(GENERATED_MODELS_DIR)) fs.mkdirSync(GENERATED_MODELS_DIR, { recursive: true });

/**
 * Periodically purge jobs older than 2 hours to conserve disk space
 */
function cleanupOldJobs() {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    try {
        if (fs.existsSync(JOBS_DIR)) {
            const dirs = fs.readdirSync(JOBS_DIR);
            dirs.forEach((dir) => {
                const dirPath = path.join(JOBS_DIR, dir);
                const stat = fs.statSync(dirPath);
                if (stat.mtimeMs < twoHoursAgo) {
                    fs.rmSync(dirPath, { recursive: true, force: true });
                }
            });
        }
    } catch (err) {
        console.warn("Cleanup warning:", err.message);
    }
}
setInterval(cleanupOldJobs, 30 * 60 * 1000);

/**
 * Run OCR Extraction on image to identify scientific text and component labels
 */
async function extractLabelsWithOCR(imagePath) {
    let worker = null;
    try {
        worker = await createWorker("eng");
        const ret = await worker.recognize(imagePath);
        const words = ret.data.words || [];

        // Filter and deduplicate words with reasonable confidence
        const detectedLabels = [];
        let count = 1;

        words.forEach((w) => {
            const cleanText = (w.text || "").replace(/[^a-zA-Z0-9\s-]/g, "").trim();
            if (cleanText.length >= 3 && w.confidence > 45) {
                const bbox = w.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 };
                detectedLabels.push({
                    id: `label_ocr_${count++}`,
                    text: cleanText,
                    confidence: Math.round(w.confidence),
                    bbox: [bbox.x0, bbox.y0, bbox.x1, bbox.y1],
                    // Initial status: unverified until user confirms
                    status: "unverified",
                    source: "ocr"
                });
            }
        });

        await worker.terminate();
        return detectedLabels.slice(0, 15); // Return top 15 labels
    } catch (err) {
        console.warn("Tesseract OCR skipped or failed:", err.message);
        if (worker) {
            try { await worker.terminate(); } catch (_) {}
        }
        return [];
    }
}

/**
 * Execute Python 3D geometric reconstruction process
 */
function runPythonReconstruction(imagePath, outputGlbPath, resolution = 120, depthScale = 0.55, jobId = null) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, "../../services/reconstruct3d.py");
        const pythonExecutable = "python";

        const args = [
            pythonScript,
            imagePath,
            outputGlbPath,
            String(resolution),
            String(depthScale)
        ];

        const pyProc = spawn(pythonExecutable, args, {
            windowsHide: true
        });

        if (jobId) {
            activeJobs.set(jobId, { process: pyProc, cancelled: false });
        }

        let stdout = "";
        let stderr = "";

        pyProc.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        pyProc.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        // 60-second timeout guard
        const timeout = setTimeout(() => {
            pyProc.kill();
            reject(new Error("3D Reconstruction timed out after 60 seconds."));
        }, 60000);

        pyProc.on("close", (code) => {
            clearTimeout(timeout);
            if (jobId) activeJobs.delete(jobId);

            if (code !== 0) {
                return reject(new Error(`Reconstruction failed (code ${code}): ${stderr || stdout}`));
            }

            try {
                const parsed = JSON.parse(stdout);
                if (parsed.status === "error") {
                    return reject(new Error(parsed.message || "Unknown reconstruction error"));
                }
                resolve(parsed);
            } catch (err) {
                reject(new Error(`Failed to parse 3D reconstruction output: ${err.message}. Raw: ${stdout}`));
            }
        });

        pyProc.on("error", (err) => {
            clearTimeout(timeout);
            if (jobId) activeJobs.delete(jobId);
            reject(new Error(`Failed to spawn Python process: ${err.message}`));
        });
    });
}

/**
 * Main conversion pipeline coordinator
 */
async function processImageTo3D({ file, resolution = 120, depthScale = 0.55 }) {
    if (!file) {
        throw new Error("No image file provided for reconstruction.");
    }

    const jobId = uuidv4();
    const jobDir = path.join(JOBS_DIR, jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    const sourceImagePath = path.join(jobDir, `source${ext}`);
    const outputGlbName = `${jobId}.glb`;
    const outputGlbPath = path.join(GENERATED_MODELS_DIR, outputGlbName);

    // Save uploaded buffer to job directory
    fs.writeFileSync(sourceImagePath, file.buffer);

    // 1. Run OCR Label Extraction in parallel with geometric analysis
    const ocrLabelsPromise = extractLabelsWithOCR(sourceImagePath);

    // 2. Run Geometric Volumetric 3D Mesh Reconstruction
    const reconResult = await runPythonReconstruction(
        sourceImagePath,
        outputGlbPath,
        resolution,
        depthScale,
        jobId
    );

    // 3. Await OCR and merge
    const ocrLabels = await ocrLabelsPromise;

    // Map 2D OCR boxes to 3D positions on the model surface
    const [origW, origH] = reconResult.imageDimensions || [400, 400];
    const aspect = reconResult.aspectRatio || (origW / origH);
    const worldW = 3.0;
    const worldH = worldW / aspect;

    const mappedLabels = ocrLabels.map((lbl) => {
        const cx = (lbl.bbox[0] + lbl.bbox[2]) / 2.0;
        const cy = (lbl.bbox[1] + lbl.bbox[3]) / 2.0;

        const posX = ((cx / origW) - 0.5) * worldW;
        const posY = -((cy / origH) - 0.5) * worldH;
        const posZ = 0.35; // Slightly elevated above model face

        return {
            ...lbl,
            position3D: [Number(posX.toFixed(3)), Number(posY.toFixed(3)), Number(posZ.toFixed(3))]
        };
    });

    // Also map detected geometric structural regions
    const structuralRegions = (reconResult.structuralRegions || []).map((reg) => {
        const cx = (reg.center[0] / 100.0) * origW;
        const cy = (reg.center[1] / 100.0) * origH;
        const posX = ((cx / origW) - 0.5) * worldW;
        const posY = -((cy / origH) - 0.5) * worldH;
        const posZ = 0.35;

        return {
            id: reg.id,
            text: reg.label,
            confidence: 90,
            bbox: [
                Math.round(reg.bbox[0] / 100.0 * origW),
                Math.round(reg.bbox[1] / 100.0 * origH),
                Math.round(reg.bbox[2] / 100.0 * origW),
                Math.round(reg.bbox[3] / 100.0 * origH)
            ],
            position3D: [Number(posX.toFixed(3)), Number(posY.toFixed(3)), Number(posZ.toFixed(3))],
            status: "unverified",
            source: "geometric_contour",
            relativeArea: reg.relativeArea
        };
    });

    // Combined label candidates (deduplicated)
    const combinedLabels = [...mappedLabels];
    structuralRegions.forEach(sr => {
        if (!combinedLabels.some(cl => Math.abs(cl.position3D[0] - sr.position3D[0]) < 0.2 && Math.abs(cl.position3D[1] - sr.position3D[1]) < 0.2)) {
            combinedLabels.push(sr);
        }
    });

    return {
        jobId,
        status: "completed",
        modelUrl: `/generated-models/${outputGlbName}`,
        maskUrl: reconResult.maskPath ? `/generated-models/${path.basename(reconResult.maskPath)}` : null,
        downloadUrl: `/api/convert3d/download/${jobId}`,
        fileSizeKb: reconResult.fileSizeKb,
        fileSizeBytes: reconResult.fileSizeBytes,
        vertexCount: reconResult.vertexCount,
        triangleCount: reconResult.triangleCount,
        segmentation: reconResult.segmentation || null,
        imageDimensions: reconResult.imageDimensions,
        aspectRatio: reconResult.aspectRatio,
        classification: reconResult.classification,
        detectedLabels: combinedLabels,
        hardwareInfo: {
            computeDevice: "Local CPU (Intel Core Architecture)",
            gpuType: "Intel Iris Xe Graphics (Shared memory, No CUDA)",
            pipelineType: "Continuous Volumetric Bilateral Reconstruction Engine",
            neuralStatus: "Offline mathematical volumetric synthesis active. Deep learning diffusion models (TripoSR/InstantMesh) require discrete NVIDIA CUDA GPU (>=8GB VRAM)."
        },
        depthInferenceNotice: "Depth geometry is inferred from 2D contour boundaries, luminance gradients, and bilateral posterior closure. Single 2D views cannot capture occluded rear features."
    };
}

/**
 * Cancel an active job
 */
function cancelJob(jobId) {
    const job = activeJobs.get(jobId);
    if (job && job.process) {
        job.cancelled = true;
        job.process.kill();
        activeJobs.delete(jobId);
        return true;
    }
    return false;
}

module.exports = {
    processImageTo3D,
    cancelJob,
    GENERATED_MODELS_DIR,
    JOBS_DIR
};
