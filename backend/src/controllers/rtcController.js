const { AccessToken, RoomServiceClient } = require("livekit-server-sdk");
const crypto = require("crypto");
const ClassroomSession = require("../models/ClassroomSession");
const { notifyClassroomEnded } = require("../modules/socket");

const ROOM_ID_REGEX = /^[a-zA-Z0-9_-]{3,50}$/;

/**
 * Generate Secure LiveKit RTC Room Token
 * POST /api/rtc/token
 * 
 * Access: Authenticated (JWT protect middleware required)
 * Authorization Rules:
 * - Teachers: Authorized to initialize or host an active classroom session.
 * - Students: Only authorized to join an ACTIVE session started by a teacher.
 */
exports.getLiveKitToken = async (req, res) => {
    try {
        // 1. Verify authenticated user identity (derived strictly from server-side JWT session)
        if (!req.user || !req.user._id || !req.user.role) {
            return res.status(401).json({
                message: "Authentication required. User profile could not be verified."
            });
        }

        const userId = String(req.user._id);
        const userRole = req.user.role;
        const userName = req.user.name || (userRole === "teacher" ? "Teacher" : "Student");

        // 2. Validate requested classroom room ID format
        const { roomId: rawRoomId } = req.body;
        if (!rawRoomId || typeof rawRoomId !== "string" || !ROOM_ID_REGEX.test(rawRoomId.trim())) {
            return res.status(400).json({
                message: "A valid classroom room code is required (3–50 alphanumeric characters, hyphens, or underscores)."
            });
        }
        const roomId = rawRoomId.trim();

        // 3. Enforce Classroom Room Authorization Rules
        if (userRole === "teacher") {
            // Teacher is authorized to host/activate the classroom session
            await ClassroomSession.findOneAndUpdate(
                { roomId },
                {
                    teacherId: req.user._id,
                    teacherName: userName,
                    isActive: true
                },
                { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
            );
        } else if (userRole === "student") {
            // Student is ONLY authorized to join an active classroom session started by a teacher
            const session = await ClassroomSession.findOne({ roomId, isActive: true });
            if (!session) {
                return res.status(403).json({
                    message: `Classroom session '${roomId}' is not currently active. Please wait for your teacher to start the session.`
                });
            }
        } else {
            return res.status(403).json({
                message: "Forbidden: Your account role is not authorized for classroom RTC."
            });
        }

        // 4. Verify server-side LiveKit Cloud configuration
        const livekitUrl = process.env.LIVEKIT_URL;
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!livekitUrl || !apiKey || !apiSecret) {
            return res.status(503).json({
                message: "LiveKit RTC service is not configured on the server. Please check server configuration."
            });
        }

        // 5. Generate short-lived LiveKit participant token with least-privilege grants
        // Suffix participant identity with a per-connection random token to prevent DUPLICATE_IDENTITY
        // disconnections when testing multiple browser sessions or tabs on one machine / shared accounts
        const connectionSuffix = crypto.randomBytes(3).toString("hex");
        const participantIdentity = `${userId}_${connectionSuffix}`;

        const at = new AccessToken(apiKey, apiSecret, {
            identity: participantIdentity,
            name: userName,
            ttl: "1h",
            metadata: JSON.stringify({
                userId,
                role: userRole
            })
        });

        at.addGrant({
            room: roomId,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });

        const token = await at.toJwt();

        // 6. Return sanitized client configuration (secrets never exposed)
        return res.json({
            status: "success",
            serverUrl: livekitUrl,
            token,
            room: roomId,
            participant: {
                identity: participantIdentity,
                name: userName,
                role: userRole
            }
        });
    } catch (error) {
        console.error("RTC token generation error:", error.message);
        return res.status(500).json({
            message: "Failed to generate RTC room token due to an internal server error."
        });
    }
};

/**
 * End Active Classroom Session (Host Only)
 * POST /api/rtc/end-session
 * 
 * Access: Authenticated Teacher Only
 * 
 * Idempotently deactivates the classroom session in MongoDB, verifies
 * that the requesting user is the owning teacher host, and notifies all
 * connected students via Socket.IO to terminate their classroom session.
 */
exports.endClassroomSession = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;

        // 1. Enforce Teacher Role (Students must never terminate sessions)
        if (userRole !== "teacher") {
            return res.status(403).json({
                message: "Forbidden: Only authorized teachers can end a classroom session."
            });
        }

        // 2. Validate Room ID format
        const { roomId: rawRoomId } = req.body;
        if (!rawRoomId || typeof rawRoomId !== "string" || !ROOM_ID_REGEX.test(rawRoomId.trim())) {
            return res.status(400).json({
                message: "A valid classroom room code is required (3–50 alphanumeric characters, hyphens, or underscores)."
            });
        }
        const roomId = rawRoomId.trim();

        // 3. Find Classroom Session
        const session = await ClassroomSession.findOne({ roomId });

        // Idempotency: If session does not exist or is already inactive, return success
        if (!session || !session.isActive) {
            return res.json({
                status: "success",
                message: `Classroom session '${roomId}' is already inactive.`,
                roomId,
                isActive: false
            });
        }

        // 4. Verify Ownership: Requester must be the teacher who owns this session
        if (session.teacherId && session.teacherId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Forbidden: You are not authorized to end this session as you are not the recorded host."
            });
        }

        // 5. Mark Session Inactive in MongoDB
        await ClassroomSession.findOneAndUpdate(
            { roomId },
            { isActive: false, connectedStudents: [], updatedAt: Date.now() }
        );

        // 5b. Forcibly revoke/delete LiveKit Cloud room so active WebRTC connections are immediately terminated
        const livekitUrl = process.env.LIVEKIT_URL;
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        if (livekitUrl && apiKey && apiSecret) {
            try {
                const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
                await roomService.deleteRoom(roomId);
                console.log(`🔌 LiveKit room '${roomId}' revoked and deleted from server.`);
            } catch (lkErr) {
                console.warn("Notice during LiveKit room revocation:", lkErr.message);
            }
        }

        // 6. Notify All Students in Room via Socket.IO
        notifyClassroomEnded(roomId, {
            reason: "host-ended",
            message: "The teacher has ended this classroom session."
        });

        console.log(`🛑 Classroom session '${roomId}' deactivated by host (${req.user?.name || userId}).`);

        return res.json({
            status: "success",
            message: `Classroom session '${roomId}' has been successfully ended.`,
            roomId,
            isActive: false
        });
    } catch (error) {
        console.error("End classroom session error:", error.message);
        return res.status(500).json({
            message: "Failed to end classroom session due to an internal server error."
        });
    }
};

/**
 * Check Classroom Session Status
 * GET /api/rtc/session/:roomId
 * 
 * Access: Authenticated (Teacher or Student)
 */
exports.getSessionStatus = async (req, res) => {
    try {
        const { roomId: rawRoomId } = req.params;
        if (!rawRoomId || typeof rawRoomId !== "string" || !ROOM_ID_REGEX.test(rawRoomId.trim())) {
            return res.status(400).json({
                message: "A valid classroom room code is required (3–50 alphanumeric characters, hyphens, or underscores)."
            });
        }
        const roomId = rawRoomId.trim();
        const session = await ClassroomSession.findOne({ roomId });
        const isActive = Boolean(session && session.isActive);

        return res.json({
            status: "success",
            roomId,
            isActive,
            teacherName: isActive ? session.teacherName : null,
            activeModel: isActive ? (session.activeModel || "Heart") : null,
            message: isActive ? "Classroom session is active." : "No active classroom session. Please wait for your teacher."
        });
    } catch (error) {
        console.error("Get session status error:", error.message);
        return res.status(500).json({
            message: "Failed to query classroom session status."
        });
    }
};

/**
 * Temporary LiveKit Credential & Connectivity Diagnostic (Read-only)
 * GET /api/rtc/diagnostic
 *
 * Access: Authenticated Teacher Only
 *
 * Safety constraints:
 * - Executes non-destructive RoomServiceClient.listRooms() call.
 * - Does not modify rooms or classroom sessions.
 * - Genuinely bounded request lifetime via SDK requestTimeout (5s) with native AbortSignal cancellation.
 * - Never returns or logs secrets, API keys, URLs, tokens, or request/response headers.
 * - Emits strictly allowlisted status: "SUCCESS", "AUTH_FAILED", "URL_OR_NETWORK_ERROR", "OTHER_FAILURE".
 */
exports.getLiveKitDiagnostic = async (req, res) => {
    // 1. Enforce Teacher Role strictly at controller level
    if (req.user?.role !== "teacher") {
        return res.status(403).json({
            message: "Forbidden: Only authorized teachers can access RTC diagnostics."
        });
    }

    // 2. Validate configuration existence with explicit classification
    const livekitUrl = (process.env.LIVEKIT_URL || "").trim();
    const apiKey = (process.env.LIVEKIT_API_KEY || "").trim();
    const apiSecret = (process.env.LIVEKIT_API_SECRET || "").trim();

    if (!livekitUrl) {
        return res.json({
            status: "success",
            diagnosticResult: "URL_OR_NETWORK_ERROR"
        });
    }

    if (!apiKey || !apiSecret) {
        return res.json({
            status: "success",
            diagnosticResult: "AUTH_FAILED"
        });
    }

    let diagnosticResult = "OTHER_FAILURE";

    try {
        // Instantiate RoomServiceClient with verified SDK options:
        // - requestTimeout: 5 (seconds) directly sets AbortSignal.timeout(5000) on fetch, actively cancelling hung requests.
        // - failover: false disables cross-region retries, guaranteeing a single attempt and strict bounded lifetime.
        const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret, {
            requestTimeout: 5,
            failover: false
        });

        await roomService.listRooms();
        diagnosticResult = "SUCCESS";
    } catch (err) {
        const status = err?.status;
        const code = err?.code || err?.cause?.code;
        const name = err?.name || err?.cause?.name;

        // Verified Authentication Failures (HTTP 401/403 or Twirp error codes)
        if (status === 401 || code === "unauthenticated" || status === 403 || code === "permission_denied") {
            diagnosticResult = "AUTH_FAILED";
        }
        // Verified URL and Network Transport Errors
        else if (
            code === "ERR_INVALID_URL" ||
            code === "ENOTFOUND" ||
            code === "ECONNREFUSED" ||
            code === "ECONNRESET" ||
            code === "ETIMEDOUT" ||
            code === "CERT_HAS_EXPIRED" ||
            code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
            code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
            name === "TimeoutError" ||
            name === "AbortError" ||
            name === "FetchError" ||
            (typeof code === "string" && code.startsWith("ERR_TLS_"))
        ) {
            diagnosticResult = "URL_OR_NETWORK_ERROR";
        }
        // Ambiguous, internal, or other unexpected errors fall through to OTHER_FAILURE
        else {
            diagnosticResult = "OTHER_FAILURE";
        }
    }

    // Log only the allowlisted result token (no sensitive data or errors)
    console.log("[LiveKit Diagnostic] Completed check with outcome:", diagnosticResult);

    return res.json({
        status: "success",
        diagnosticResult
    });
};
