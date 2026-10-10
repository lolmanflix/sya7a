/**
 * Wasalt SafeTrip™ - Driver Safety Stream Controller & Hook
 * Standalone service managing WebRTC P2P 30 FPS video & audio signaling,
 * remote admin consent inspection, and zero-cost Firebase RTDB token exchange.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { getWebRtcBroadcasterHtml } from './webrtcBroadcasterHtml';

export type MediaRequestKind = 'audio' | 'video' | 'both';
export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'failed' | 'closed';

export interface DriverMediaRequestData {
  kind: MediaRequestKind;
  status: MediaRequestStatus;
  requestedAt: string;
  requestedBy: string;
  respondedAt?: string;
  driverUid?: string;
  error?: string;
}

/**
 * Delay after session acceptance before the WebView broadcaster touches the
 * camera sensor, giving the native expo-camera preview time to release the
 * exclusive Android Camera HAL handle.
 */
const BROADCASTER_START_DELAY_MS = 500;

export interface UseDriverSafetyStreamOptions {
  user: { uid: string; email?: string | null; displayName?: string | null } | null;
  driverName?: string;
  cameraRef?: React.RefObject<any>;
  isRTL?: boolean;
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
}

export interface UseDriverSafetyStreamResult {
  pendingRequest: DriverMediaRequestData | null;
  isStreaming: boolean;
  activeSession: DriverMediaRequestData | null;
  acceptRequest: () => Promise<void>;
  declineRequest: () => Promise<void>;
  endStream: () => Promise<void>;
  webrtcHtml: string;
  webViewRef: React.RefObject<any>;
  onWebViewMessage: (event: any) => void;
}

/**
 * React Hook for Driver Handsets:
 * Manages SafeTrip consent requests and WebRTC P2P signaling via Firebase RTDB.
 */
export function useDriverSafetyStream({
  user,
  driverName = 'Driver',
  cameraRef,
  isRTL = false,
  onSessionStart,
  onSessionEnd,
}: UseDriverSafetyStreamOptions): UseDriverSafetyStreamResult {
  const [pendingRequest, setPendingRequest] = useState<DriverMediaRequestData | null>(null);
  const [activeSession, setActiveSession] = useState<DriverMediaRequestData | null>(null);
  const isStreaming = Boolean(activeSession && activeSession.status === 'accepted');

  const webViewRef = useRef<any>(null);
  const lastRequestedAtRef = useRef<string>('');
  const pendingRequestRef = useRef<DriverMediaRequestData | null>(null);
  const activeSessionRef = useRef<DriverMediaRequestData | null>(null);
  const activeSessionKeyRef = useRef<string>('');
  const wasStreamingRef = useRef(false);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const webrtcHtml = getWebRtcBroadcasterHtml();

  // Mirror pending/active requests into refs so async handlers never capture stale state.
  useEffect(() => {
    pendingRequestRef.current = pendingRequest;
  }, [pendingRequest]);
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  /** Posts a control command to the hidden WebRTC broadcaster WebView. */
  const postToBroadcaster = useCallback((payload: Record<string, unknown>) => {
    try {
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify(payload));
      }
    } catch (err) {
      console.warn('[SafeTrip] Broadcaster postMessage failed:', err);
    }
  }, []);

  /** Requests the WebView engine to acquire camera/mic and start the P2P offer. */
  const startBroadcaster = useCallback(() => {
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    startTimerRef.current = setTimeout(() => {
      startTimerRef.current = null;
      postToBroadcaster({ type: 'start' });
    }, BROADCASTER_START_DELAY_MS);
  }, [postToBroadcaster]);

  // 1. Realtime listener for incoming admin safety inspection requests
  useEffect(() => {
    if (!user?.uid) {
      setPendingRequest(null);
      setActiveSession(null);
      return;
    }

    const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);

    const unsubscribe = onValue(controlRef, (snapshot) => {
      const data: DriverMediaRequestData | null = snapshot.val();

      if (!data) {
        setPendingRequest(null);
        activeSessionKeyRef.current = '';
        if (wasStreamingRef.current) {
          wasStreamingRef.current = false;
          postToBroadcaster({ type: 'stop' });
          if (onSessionEnd) onSessionEnd();
        }
        setActiveSession(null);
        return;
      }

      if (data.status === 'pending') {
        setActiveSession(null);
        if (data.requestedAt && data.requestedAt !== lastRequestedAtRef.current) {
          lastRequestedAtRef.current = data.requestedAt;
          setPendingRequest(data);

          const kindLabel =
            data.kind === 'video'
              ? isRTL ? 'مرئي' : 'video'
              : data.kind === 'audio'
              ? isRTL ? 'صوتي' : 'audio'
              : isRTL ? 'مرئي وصوتي' : 'audio/video';
          Alert.alert(
            isRTL ? 'طلب فحص أمان مرئي ومسموع' : 'Safety Check Requested',
            isRTL
              ? `طلب المشرف فحص ${kindLabel} مباشر. هل توافق على بدء الفحص؟`
              : `An administrator requested a live ${kindLabel} inspection. Do you agree to connect?`,
            [
              {
                text: isRTL ? 'رفض' : 'Decline',
                style: 'cancel',
                onPress: () => declineRequest(),
              },
              {
                text: isRTL ? 'قبول' : 'Accept',
                onPress: () => acceptRequest(),
              },
            ]
          );
        }
      } else if (data.status === 'accepted') {
        setPendingRequest(null);
        const sessionKey = `${data.requestedAt || ''}:${data.respondedAt || ''}`;
        const isNewSession = sessionKey !== activeSessionKeyRef.current;
        activeSessionKeyRef.current = sessionKey;
        setActiveSession(data);
        if (isNewSession) {
          if (onSessionStart) onSessionStart();
          wasStreamingRef.current = true;
          startBroadcaster();
        }
      } else {
        setPendingRequest(null);
        activeSessionKeyRef.current = '';
        if (wasStreamingRef.current) {
          wasStreamingRef.current = false;
          postToBroadcaster({ type: 'stop' });
          if (onSessionEnd) onSessionEnd();
        }
        setActiveSession(null);
      }
    });

    return () => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
      unsubscribe();
    };
  }, [user?.uid, isRTL]);

  // 2. Accept incoming request
  const acceptRequest = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const request = pendingRequestRef.current;
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      const webrtcRef = ref(database, `driverControls/${user.uid}/webrtc`);
      // Clear any stale signaling state from a previous session before accepting.
      await remove(webrtcRef).catch(() => {});

      await set(controlRef, {
        ...(request || { kind: 'both' }),
        status: 'accepted',
        respondedAt: new Date().toISOString(),
        driverUid: user.uid,
      });
      setPendingRequest(null);
    } catch (err) {
      console.warn('[SafeTrip] Accept error:', err);
      Alert.alert(
        isRTL ? 'تعذر قبول الطلب' : 'Could Not Accept Request',
        isRTL
          ? 'تعذر تحديث حالة الطلب. تحقق من الاتصال بالإنترنت وحاول مرة أخرى.'
          : 'Failed to update the request status. Check your connection and try again.'
      );
    }
  }, [user?.uid, isRTL]);

  // 3. Decline incoming request
  const declineRequest = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const request = pendingRequestRef.current;
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      await set(controlRef, {
        ...(request || { kind: 'both' }),
        status: 'declined',
        respondedAt: new Date().toISOString(),
        driverUid: user.uid,
      });
      setPendingRequest(null);
      setActiveSession(null);
    } catch (err) {
      console.warn('[SafeTrip] Decline error:', err);
      Alert.alert(
        isRTL ? 'تعذر رفض الطلب' : 'Could Not Decline Request',
        isRTL
          ? 'تعذر تحديث حالة الطلب. تحقق من الاتصال بالإنترنت وحاول مرة أخرى.'
          : 'Failed to update the request status. Check your connection and try again.'
      );
    }
  }, [user?.uid, isRTL]);

  // 4. End active stream session
  const endStream = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      const webrtcRef = ref(database, `driverControls/${user.uid}/webrtc`);
      const streamRef = ref(database, `driverControls/${user.uid}/mediaStream`);

      postToBroadcaster({ type: 'stop' });
      wasStreamingRef.current = false;
      activeSessionKeyRef.current = '';

      await remove(controlRef).catch(() => {});
      await remove(webrtcRef).catch(() => {});
      await remove(streamRef).catch(() => {});
      setActiveSession(null);
      if (onSessionEnd) onSessionEnd();
    } catch (err) {
      console.warn('[SafeTrip] End stream error:', err);
    }
  }, [user?.uid, postToBroadcaster, onSessionEnd]);

  // 5. Handle messages posted from WebRTC Broadcaster WebView
  const onWebViewMessage = useCallback(async (event: any) => {
    if (!user?.uid) return;
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const webrtcPath = `driverControls/${user.uid}/webrtc`;

      if (data.type === 'offer' && data.sdp) {
        // Write WebRTC Offer to RTDB for Admin Panel to read
        await set(ref(database, `${webrtcPath}/offer`), {
          type: 'offer',
          sdp: data.sdp,
          driverName,
          driverUid: user.uid,
          createdAt: Date.now(),
        });
      } else if (data.type === 'driverCandidate' && data.candidate) {
        // Push ICE candidate
        const candId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await set(ref(database, `${webrtcPath}/driverCandidates/${candId}`), data.candidate);
      } else if (data.type === 'error') {
        console.warn('[SafeTrip] WebRTC Broadcaster error:', data.message);
        postToBroadcaster({ type: 'stop' });
        // Surface the hardware failure to the admin console instead of
        // leaving the request stuck in "accepted" with no stream.
        if (wasStreamingRef.current) {
          const session = activeSessionRef.current;
          await set(ref(database, `driverControls/${user.uid}/mediaRequest`), {
            ...(session || { kind: 'both' }),
            status: 'failed',
            respondedAt: new Date().toISOString(),
            driverUid: user.uid,
            error: String(data.message || 'Camera/microphone unavailable on handset.'),
          }).catch(() => {});
        }
        wasStreamingRef.current = false;
        activeSessionKeyRef.current = '';
        setActiveSession(null);
        if (onSessionEnd) onSessionEnd();
        Alert.alert(
          isRTL ? 'خطأ في بث الكاميرا' : 'Camera Stream Error',
          data.message || 'Unable to access camera or microphone hardware.'
        );
      }
    } catch (err) {
      console.warn('[SafeTrip] WebView message parse error:', err);
    }
  }, [user?.uid, driverName, isRTL, postToBroadcaster, onSessionEnd]);

  // 6. Real-time listener for Admin WebRTC Answer and Admin ICE Candidates
  useEffect(() => {
    if (!user?.uid || !isStreaming) return;

    const answerRef = ref(database, `driverControls/${user.uid}/webrtc/answer`);
    const adminCandidatesRef = ref(database, `driverControls/${user.uid}/webrtc/adminCandidates`);

    // Listen for WebRTC Answer from Admin
    const unsubAnswer = onValue(answerRef, (snapshot) => {
      const answer = snapshot.val();
      if (answer && answer.sdp && webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'answer',
          sdp: answer.sdp,
        }));
      }
    });

    // Listen for Admin ICE Candidates
    const processedCandidates = new Set<string>();
    const unsubCandidates = onValue(adminCandidatesRef, (snapshot) => {
      const candidatesObj = snapshot.val();
      if (candidatesObj && webViewRef.current) {
        Object.entries(candidatesObj).forEach(([id, cand]: [string, any]) => {
          if (!processedCandidates.has(id) && cand?.candidate) {
            processedCandidates.add(id);
            webViewRef.current.postMessage(JSON.stringify({
              type: 'adminCandidate',
              candidate: cand,
            }));
          }
        });
      }
    });

    return () => {
      unsubAnswer();
      unsubCandidates();
      processedCandidates.clear();
    };
  }, [user?.uid, isStreaming]);

  return {
    pendingRequest,
    isStreaming,
    activeSession,
    acceptRequest,
    declineRequest,
    endStream,
    webrtcHtml,
    webViewRef,
    onWebViewMessage,
  };
}
