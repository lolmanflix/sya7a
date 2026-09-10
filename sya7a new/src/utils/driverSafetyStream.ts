/**
 * Wasalt SafeTrip™ - Driver Safety Stream Controller & Hook
 * Standalone service managing WebRTC P2P 30 FPS video & audio signaling,
 * remote admin consent inspection, and zero-cost Firebase RTDB token exchange.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { ref, set, onValue, off, remove } from 'firebase/database';
import { database } from '../config/firebase';
import { getWebRtcBroadcasterHtml } from './webrtcBroadcasterHtml';

export type MediaRequestKind = 'audio' | 'video' | 'both';
export type MediaRequestStatus = 'pending' | 'accepted' | 'declined' | 'closed';

export interface DriverMediaRequestData {
  kind: MediaRequestKind;
  status: MediaRequestStatus;
  requestedAt: string;
  requestedBy: string;
  respondedAt?: string;
  driverUid?: string;
}

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
  const webrtcHtml = getWebRtcBroadcasterHtml();

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
        setActiveSession(null);
        return;
      }

      if (data.status === 'pending') {
        setActiveSession(null);
        if (data.requestedAt && data.requestedAt !== lastRequestedAtRef.current) {
          lastRequestedAtRef.current = data.requestedAt;
          setPendingRequest(data);

          const kind = data.kind === 'video' ? (isRTL ? 'فيديو' : 'video') : isRTL ? 'صوتي' : 'audio';
          Alert.alert(
            isRTL ? 'طلب فحص أمان مرئي ومسموع' : 'Safety Check Requested',
            isRTL
              ? `طلب المشرف فحص ${kind} مباشر بتقنية P2P. هل توافق على بدء الفحص؟`
              : `An administrator requested a live ${kind} inspection (30 FPS WebRTC). Do you agree to connect?`,
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
        setActiveSession(data);
        if (onSessionStart) onSessionStart();
      } else {
        setPendingRequest(null);
        setActiveSession(null);
        if (onSessionEnd) onSessionEnd();
      }
    });

    return () => {
      off(controlRef, 'value', unsubscribe);
    };
  }, [user?.uid, isRTL]);

  // 2. Accept incoming request
  const acceptRequest = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      const webrtcRef = ref(database, `driverControls/${user.uid}/webrtc`);
      await remove(webrtcRef).catch(() => {});

      await set(controlRef, {
        ...(pendingRequest || { kind: 'both' }),
        status: 'accepted',
        respondedAt: new Date().toISOString(),
        driverUid: user.uid,
      });
      setPendingRequest(null);
    } catch (err) {
      console.log('[SafeTrip] Accept error:', err);
    }
  }, [user?.uid, pendingRequest]);

  // 3. Decline incoming request
  const declineRequest = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      await set(controlRef, {
        ...(pendingRequest || { kind: 'both' }),
        status: 'declined',
        respondedAt: new Date().toISOString(),
        driverUid: user.uid,
      });
      setPendingRequest(null);
      setActiveSession(null);
    } catch (err) {
      console.log('[SafeTrip] Decline error:', err);
    }
  }, [user?.uid, pendingRequest]);

  // 4. End active stream session
  const endStream = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const controlRef = ref(database, `driverControls/${user.uid}/mediaRequest`);
      const webrtcRef = ref(database, `driverControls/${user.uid}/webrtc`);
      const streamRef = ref(database, `driverControls/${user.uid}/mediaStream`);

      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({ type: 'stop' }));
      }

      await remove(controlRef).catch(() => {});
      await remove(webrtcRef).catch(() => {});
      await remove(streamRef).catch(() => {});
      setActiveSession(null);
      if (onSessionEnd) onSessionEnd();
    } catch (err) {
      console.log('[SafeTrip] End stream error:', err);
    }
  }, [user?.uid]);

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
        Alert.alert(
          isRTL ? 'خطأ في بث الكاميرا' : 'Camera Stream Error',
          data.message || 'Unable to access camera or microphone hardware.'
        );
      }
    } catch (err) {
      console.log('[SafeTrip] WebView message parse error:', err);
    }
  }, [user?.uid, driverName, isRTL]);

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
      off(answerRef, 'value', unsubAnswer);
      off(adminCandidatesRef, 'value', unsubCandidates);
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
