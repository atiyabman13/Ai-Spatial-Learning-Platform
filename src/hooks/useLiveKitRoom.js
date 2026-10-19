import { useState, useEffect, useRef, useCallback } from "react";
import { Room, RoomEvent, Track, ConnectionState } from "livekit-client";
import { API_URL } from "../config/api";

/**
 * useLiveKitRoom — Custom Hook for Managed LiveKit Cloud RTC Audio/Video
 *
 * Guarantees:
 * - Single Room instance and connection attempt per active roomId.
 * - Connection status synchronized directly with LiveKit connection events.
 * - Local camera/microphone tracks preserved across re-renders without duplicate getUserMedia calls.
 * - Local video track exposed via React state to ensure reliable video element attachment.
 * - Cleanup executed only on explicit room leave or component unmount.
 * - Parent re-renders (e.g. timers, state updates) will NOT trigger reconnection.
 */
export function useLiveKitRoom({
    roomId,
    enabled = false,
    authToken = null,
    onDisconnected
}) {
    // Connection & Status States
    const [status, setStatus] = useState("idle"); // "idle" | "requesting-token" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error"
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorCode, setErrorCode] = useState(null);
    const [deviceWarning, setDeviceWarning] = useState(null);

    // Media & Participant States
    const [isMicEnabled, setIsMicEnabled] = useState(true);
    const [isCameraEnabled, setIsCameraEnabled] = useState(true);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [serverParticipant, setServerParticipant] = useState(null);
    const [remoteParticipants, setRemoteParticipants] = useState([]);
    const [activeSpeakers, setActiveSpeakers] = useState([]);

    // Lifecycle Refs
    const roomRef = useRef(null);
    const isConnectingRef = useRef(false);
    const isCleaningUpRef = useRef(false);
    const isCancelledRef = useRef(false);
    const localTracksRef = useRef(new Set());
    const currentRoomIdRef = useRef(null);
    const onDisconnectedRef = useRef(onDisconnected);
    onDisconnectedRef.current = onDisconnected;
    const authTokenRef = useRef(authToken);
    authTokenRef.current = authToken;

    // Helper: Safely stop all locally owned MediaStreamTracks and LiveKit LocalTracks
    const stopAllLocalTracks = useCallback((room) => {
        // 1. Stop and unpublish tracks published on localParticipant
        if (room && room.localParticipant) {
            const pubs = Array.from(room.localParticipant.trackPublications?.values() || room.localParticipant.tracks?.values() || []);
            for (const pub of pubs) {
                if (pub.track) {
                    try {
                        if (pub.track.mediaStreamTrack && typeof pub.track.mediaStreamTrack.stop === "function") {
                            pub.track.mediaStreamTrack.stop();
                        }
                        if (typeof pub.track.stop === "function") {
                            pub.track.stop();
                        }
                    } catch (e) {
                        console.warn("[LiveKit RTC] Notice stopping published track:", e.message);
                    }
                }
            }
        }

        // 2. Stop any explicitly cached local tracks (e.g. acquired during connection or device switches)
        localTracksRef.current.forEach((track) => {
            try {
                if (track.mediaStreamTrack && typeof track.mediaStreamTrack.stop === "function") {
                    track.mediaStreamTrack.stop();
                }
                if (typeof track.stop === "function") {
                    track.stop();
                }
            } catch (e) {
                console.warn("[LiveKit RTC] Notice stopping cached track:", e.message);
            }
        });
        localTracksRef.current.clear();
    }, []);

    // Helper: Collect current remote participants and their active media tracks (deduplicated, excluding local)
    const syncParticipants = useCallback((room) => {
        if (!room) {
            setRemoteParticipants([]);
            return;
        }

        const localIdentity = room.localParticipant?.identity;
        const localSid = room.localParticipant?.sid;
        let localUserId = null;
        try {
            if (room.localParticipant?.metadata) {
                const parsed = JSON.parse(room.localParticipant.metadata);
                localUserId = parsed.userId;
            }
        } catch {}

        const seen = new Set();
        const remotes = [];

        for (const p of room.remoteParticipants.values()) {
            if (!p || !p.identity) continue;

            // Exclude local participant by identity or sid
            if (p.identity === localIdentity || p.sid === localSid) {
                continue;
            }

            // Exclude duplicate/stale session of local user by userId in metadata
            let pUserId = null;
            try {
                if (p.metadata) {
                    const parsed = JSON.parse(p.metadata);
                    pUserId = parsed.userId;
                }
            } catch {}

            if (localUserId && pUserId && String(pUserId) === String(localUserId)) {
                continue;
            }

            // Deduplicate by unique identity
            if (seen.has(p.identity)) {
                continue;
            }
            seen.add(p.identity);

            let videoTrack = null;
            let audioTrack = null;
            let isVideoMuted = true;
            let isAudioMuted = true;

            if (p.videoTrackPublications) {
                for (const pub of p.videoTrackPublications.values()) {
                    if (pub.track) {
                        videoTrack = pub.track;
                        isVideoMuted = pub.isMuted;
                        break;
                    }
                }
            }

            if (p.audioTrackPublications) {
                for (const pub of p.audioTrackPublications.values()) {
                    if (pub.track) {
                        audioTrack = pub.track;
                        isAudioMuted = pub.isMuted;
                        break;
                    }
                }
            }

            let role = "student";
            try {
                if (p.metadata) {
                    const parsed = JSON.parse(p.metadata);
                    if (parsed.role) role = parsed.role;
                }
            } catch {}

            remotes.push({
                sid: p.sid,
                identity: p.identity,
                name: p.name || p.identity,
                role,
                isSpeaking: p.isSpeaking,
                isAudioMuted,
                isVideoMuted,
                videoTrack,
                audioTrack,
                participant: p
            });
        }

        setRemoteParticipants(remotes);
    }, []);

    // Helper: Safely unpublish tracks, stop media stream tracks, and disconnect room
    const disconnectAndCleanup = useCallback(async () => {
        if (isCleaningUpRef.current) return;
        isCleaningUpRef.current = true;
        isConnectingRef.current = false;

        const room = roomRef.current;
        console.log(`[LiveKit RTC] Disconnecting room: ${currentRoomIdRef.current || "unknown"}`);

        try {
            stopAllLocalTracks(room);
            if (room) {
                room.removeAllListeners();
                await room.disconnect();
            }
        } catch (err) {
            console.warn("[LiveKit RTC] Notice during disconnect:", err.message);
        } finally {
            roomRef.current = null;
            currentRoomIdRef.current = null;
            setLocalVideoTrack(null);
            setIsMicEnabled(false);
            setIsCameraEnabled(false);
            setRemoteParticipants([]);
            setActiveSpeakers([]);
            isCleaningUpRef.current = false;
        }
    }, [stopAllLocalTracks]);

    // Main Room Connection Effect — only triggers when roomId or enabled changes
    useEffect(() => {
        isCancelledRef.current = false;

        // If disabled or missing roomId, ensure cleanly disconnected
        if (!enabled || !roomId) {
            if (roomRef.current || isConnectingRef.current) {
                disconnectAndCleanup().then(() => setStatus("idle"));
            }
            return;
        }

        // Avoid duplicate connection to the same active room
        if (roomRef.current && currentRoomIdRef.current === roomId) {
            const state = roomRef.current.state;
            if (state === ConnectionState.Connected || state === ConnectionState.Connecting) {
                console.log(`[LiveKit RTC] Already active in room: ${roomId} (state: ${state})`);
                return;
            }
        }

        const connect = async () => {
            isConnectingRef.current = true;
            setStatus("requesting-token");
            setErrorMessage(null);
            setErrorCode(null);
            setDeviceWarning(null);

            // 1. Get Authentication Token
            const tokenToUse = authTokenRef.current || localStorage.getItem("ai_spatial_token");
            if (!tokenToUse) {
                isConnectingRef.current = false;
                setStatus("error");
                setErrorCode(401);
                setErrorMessage("Authentication token not found. Please log in again.");
                return;
            }

            // 2. Request RTC Room Token from Backend
            console.log(`[LiveKit RTC] Requesting token for room: ${roomId}`);
            let rtcData;
            try {
                const response = await fetch(`${API_URL}/api/rtc/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenToUse}`
                    },
                    body: JSON.stringify({ roomId })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    isConnectingRef.current = false;
                    setStatus("error");
                    setErrorCode(response.status);
                    if (response.status === 503) {
                        setErrorMessage(data.message || "LiveKit Cloud service credentials are not configured on the server.");
                    } else if (response.status === 403) {
                        setErrorMessage(data.message || "Classroom session is not currently active.");
                    } else {
                        setErrorMessage(data.message || `Server error (${response.status}) requesting RTC token.`);
                    }
                    return;
                }

                rtcData = data;
            } catch (err) {
                if (isCancelledRef.current) return;
                isConnectingRef.current = false;
                setStatus("error");
                setErrorCode(500);
                setErrorMessage("Unable to connect to platform server. Please check backend status.");
                return;
            }

            if (isCancelledRef.current) return;

            // 3. Store server-derived participant details
            if (rtcData.participant) {
                setServerParticipant(rtcData.participant);
            }

            // 4. Create single LiveKit Room instance
            console.log(`[LiveKit RTC] Connecting to room: ${roomId}`);
            setStatus("connecting");

            try {
                // If previous room instance lingered, disconnect first
                if (roomRef.current) {
                    await disconnectAndCleanup();
                }

                if (isCancelledRef.current) return;

                const room = new Room({
                    adaptiveStream: true,
                    dynacast: true,
                    videoCaptureDefaults: {
                        resolution: { width: 640, height: 360, frameRate: 20 }
                    }
                });

                roomRef.current = room;
                currentRoomIdRef.current = roomId;

                // Event Listeners: Connection State
                room.on(RoomEvent.ConnectionStateChanged, (connState) => {
                    if (isCancelledRef.current) return;
                    console.log(`[LiveKit RTC] Connection state changed: ${connState}`);
                    switch (connState) {
                        case ConnectionState.Connected:
                            setStatus("connected");
                            break;
                        case ConnectionState.Connecting:
                            setStatus("connecting");
                            break;
                        case ConnectionState.Reconnecting:
                        case ConnectionState.SignalReconnecting:
                            setStatus("reconnecting");
                            break;
                        case ConnectionState.Disconnected:
                            setStatus("disconnected");
                            break;
                        default:
                            break;
                    }
                });

                room.on(RoomEvent.Connected, () => {
                    if (isCancelledRef.current) return;
                    console.log(`[LiveKit RTC] Successfully connected to room: ${roomId}`);
                    setStatus("connected");
                    syncParticipants(room);
                });

                room.on(RoomEvent.Reconnecting, () => {
                    if (!isCancelledRef.current) setStatus("reconnecting");
                });

                room.on(RoomEvent.Reconnected, () => {
                    if (isCancelledRef.current) return;
                    console.log(`[LiveKit RTC] Reconnected to room: ${roomId}`);
                    setStatus("connected");
                    syncParticipants(room);
                });

                room.on(RoomEvent.Disconnected, () => {
                    console.log(`[LiveKit RTC] Room disconnected: ${roomId}`);
                    stopAllLocalTracks(room);
                    setStatus("disconnected");
                    setLocalVideoTrack(null);
                    setRemoteParticipants([]);
                    if (onDisconnectedRef.current) {
                        onDisconnectedRef.current();
                    }
                });

                // Participant events
                room.on(RoomEvent.ParticipantConnected, (p) => {
                    console.log(`[LiveKit RTC] Remote participant connected: ${p.identity}`);
                    syncParticipants(room);
                });

                room.on(RoomEvent.ParticipantDisconnected, (p) => {
                    console.log(`[LiveKit RTC] Remote participant disconnected: ${p.identity}`);
                    syncParticipants(room);
                });

                room.on(RoomEvent.TrackPublished, () => syncParticipants(room));
                room.on(RoomEvent.TrackUnpublished, () => syncParticipants(room));
                room.on(RoomEvent.TrackSubscribed, () => syncParticipants(room));
                room.on(RoomEvent.TrackUnsubscribed, () => syncParticipants(room));
                room.on(RoomEvent.TrackMuted, () => syncParticipants(room));
                room.on(RoomEvent.TrackUnmuted, () => syncParticipants(room));

                // Local track publication events
                room.on(RoomEvent.LocalTrackPublished, (pub) => {
                    if (isCancelledRef.current) {
                        try {
                            if (pub.track?.mediaStreamTrack) pub.track.mediaStreamTrack.stop();
                            pub.track?.stop();
                        } catch {}
                        return;
                    }
                    if (pub.track) {
                        localTracksRef.current.add(pub.track);
                    }
                    if (pub.kind === Track.Kind.Video && pub.track) {
                        console.log("[LiveKit RTC] Local camera track published");
                        setLocalVideoTrack(pub.track);
                    }
                    syncParticipants(room);
                });

                room.on(RoomEvent.LocalTrackUnpublished, (pub) => {
                    if (pub.track) {
                        localTracksRef.current.delete(pub.track);
                    }
                    if (pub.kind === Track.Kind.Video) {
                        console.log("[LiveKit RTC] Local camera track unpublished");
                        setLocalVideoTrack(null);
                    }
                    syncParticipants(room);
                });

                // Active Speaker Detection
                room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
                    if (isCancelledRef.current) return;
                    setActiveSpeakers(speakers.map(s => s.identity));
                    syncParticipants(room);
                });

                // Establish WebRTC / WebSocket connection to LiveKit Cloud
                await room.connect(rtcData.serverUrl, rtcData.token);
                isConnectingRef.current = false;

                if (isCancelledRef.current) {
                    await disconnectAndCleanup();
                    return;
                }

                // 5. Publish Local Audio & Video Tracks
                try {
                    await room.localParticipant.setMicrophoneEnabled(true);
                    if (isCancelledRef.current) {
                        await disconnectAndCleanup();
                        return;
                    }
                    setIsMicEnabled(true);
                    const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
                    if (micPub && micPub.track) {
                        localTracksRef.current.add(micPub.track);
                    }
                } catch (micErr) {
                    console.warn("[LiveKit RTC] Microphone access warning:", micErr.message);
                    setIsMicEnabled(false);
                    setDeviceWarning(prev => prev ? `${prev} | Mic unavailable` : "Microphone permission denied or unavailable");
                }

                if (isCancelledRef.current) {
                    await disconnectAndCleanup();
                    return;
                }

                try {
                    await room.localParticipant.setCameraEnabled(true);
                    if (isCancelledRef.current) {
                        await disconnectAndCleanup();
                        return;
                    }
                    setIsCameraEnabled(true);
                    const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
                    if (camPub && camPub.track) {
                        localTracksRef.current.add(camPub.track);
                        setLocalVideoTrack(camPub.track);
                    }
                } catch (camErr) {
                    console.warn("[LiveKit RTC] Camera access warning:", camErr.message);
                    setIsCameraEnabled(false);
                    setDeviceWarning(prev => prev ? `${prev} | Camera unavailable` : "Camera permission denied or unavailable");
                }

                if (isCancelledRef.current) {
                    await disconnectAndCleanup();
                    return;
                }

                if (room.state === ConnectionState.Connected) {
                    setStatus("connected");
                }

                syncParticipants(room);
            } catch (connErr) {
                isConnectingRef.current = false;
                if (!isCancelledRef.current) {
                    console.error("[LiveKit RTC] Connection error:", connErr);
                    setStatus("error");
                    setErrorCode(502);
                    setErrorMessage(connErr.message || "Failed to establish LiveKit RTC media session.");
                }
            }
        };

        connect();

        return () => {
            isCancelledRef.current = true;
            disconnectAndCleanup();
        };
    }, [roomId, enabled, syncParticipants, disconnectAndCleanup, stopAllLocalTracks]);

    // Media Control: Toggle Microphone
    const toggleMicrophone = async () => {
        const room = roomRef.current;
        if (!room || !room.localParticipant) return;
        try {
            const nextState = !isMicEnabled;
            if (!nextState) {
                const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
                if (micPub && micPub.track) {
                    try {
                        if (micPub.track.mediaStreamTrack && typeof micPub.track.mediaStreamTrack.stop === "function") {
                            micPub.track.mediaStreamTrack.stop();
                        }
                    } catch {}
                }
            }
            await room.localParticipant.setMicrophoneEnabled(nextState);
            setIsMicEnabled(nextState);
            if (nextState) {
                const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
                if (micPub && micPub.track) {
                    localTracksRef.current.add(micPub.track);
                }
            }
            console.log(`[LiveKit RTC] Microphone toggled: ${nextState ? "ON" : "MUTED"}`);
        } catch (err) {
            console.warn("[LiveKit RTC] Error toggling microphone:", err.message);
            setDeviceWarning("Unable to switch microphone state.");
        }
    };

    // Media Control: Toggle Camera
    const toggleCamera = async () => {
        const room = roomRef.current;
        if (!room || !room.localParticipant) return;
        try {
            const nextState = !isCameraEnabled;
            if (!nextState) {
                const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
                if (camPub && camPub.track) {
                    try {
                        if (camPub.track.mediaStreamTrack && typeof camPub.track.mediaStreamTrack.stop === "function") {
                            camPub.track.mediaStreamTrack.stop();
                        }
                        if (typeof camPub.track.stop === "function") {
                            camPub.track.stop();
                        }
                    } catch {}
                    localTracksRef.current.delete(camPub.track);
                }
                setLocalVideoTrack(null);
            }
            await room.localParticipant.setCameraEnabled(nextState);
            setIsCameraEnabled(nextState);
            if (nextState) {
                const camPub = room.localParticipant.getTrackPublication(Track.Source.Camera);
                if (camPub && camPub.track) {
                    localTracksRef.current.add(camPub.track);
                    setLocalVideoTrack(camPub.track);
                }
            }
            console.log(`[LiveKit RTC] Camera toggled: ${nextState ? "ON" : "OFF"}`);
        } catch (err) {
            console.warn("[LiveKit RTC] Error toggling camera:", err.message);
            setDeviceWarning("Unable to switch camera state.");
        }
    };

    // User-initiated leave
    const leaveRoom = async () => {
        isCancelledRef.current = true;
        await disconnectAndCleanup();
        setStatus("disconnected");
        if (onDisconnectedRef.current) {
            onDisconnectedRef.current();
        }
    };

    return {
        status,
        errorMessage,
        errorCode,
        serverParticipant,
        isMicEnabled,
        isCameraEnabled,
        deviceWarning,
        localVideoTrack,
        remoteParticipants,
        activeSpeakers,
        toggleMicrophone,
        toggleCamera,
        leaveRoom
    };
}
