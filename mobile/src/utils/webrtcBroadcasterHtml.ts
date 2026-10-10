/**
 * Wasalt SafeTrip™ - WebRTC Broadcaster HTML Engine
 * Embedded into React Native WebView for hardware-accelerated 30 FPS video
 * and low-latency Opus audio streaming with zero custom native compilation.
 */

export function getWebRtcBroadcasterHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Wasalt SafeTrip Broadcaster</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #videoContainer { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
    video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
    #statusBadge {
      position: absolute; bottom: 14px; left: 12px; right: 12px; z-index: 100;
      background: rgba(15, 23, 42, 0.95); color: #34d399; font-size: 11px; font-weight: bold;
      padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(52, 211, 153, 0.4);
      display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    }
    #dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 1.5s infinite; shrink-0; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
  </style>
</head>
<body>
  <div id="videoContainer">
    <video id="localVideo" autoplay playsinline muted></video>
    <div id="statusBadge">
      <span id="dot"></span>
      <span id="statusText">INITIALIZING P2P ENGINE...</span>
    </div>
  </div>

  <script>
    (function() {
      let pc = null;
      let localStream = null;
      let engineReady = false;
      let startRequested = false;
      const statusBadge = document.getElementById('statusBadge');
      const statusText = document.getElementById('statusText');
      const localVideo = document.getElementById('localVideo');
      const dot = document.getElementById('dot');

      const config = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      };

      /**
       * Sends WebRTC signaling messages from WebView to native React Native layer.
       */
      function sendToNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      /**
       * Updates status display banner in the WebRTC stream monitor.
       */
      function updateStatus(text, color, isError) {
        if (statusText) statusText.innerText = text;
        if (statusBadge && color) {
          statusBadge.style.color = color;
          statusBadge.style.borderColor = isError ? 'rgba(239, 68, 68, 0.6)' : 'rgba(52, 211, 153, 0.4)';
          statusBadge.style.background = isError ? 'rgba(69, 10, 10, 0.95)' : 'rgba(15, 23, 42, 0.95)';
        }
        if (dot) dot.style.backgroundColor = isError ? '#ef4444' : '#10b981';
      }

      /**
       * Stops any live local stream and peer connection.
       */
      function teardown() {
        if (localStream) {
          localStream.getTracks().forEach(function(t) { t.stop(); });
          localStream = null;
        }
        if (localVideo) {
          localVideo.srcObject = null;
        }
        if (pc) {
          try { pc.close(); } catch (e) { /* already closed */ }
          pc = null;
        }
      }

      /**
       * Acquires camera/mic with progressively looser constraints so a busy
       * camera sensor or missing mic degrades gracefully instead of failing
       * the whole inspection (final fallback: audio-only).
       */
      async function acquireMedia() {
        const attempts = [
          {
            label: 'ideal AV',
            constraints: {
              video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
              audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            }
          },
          { label: 'flexible AV', constraints: { video: true, audio: true } },
          { label: 'video-only', constraints: { video: true } },
          { label: 'audio-only', constraints: { audio: true } }
        ];
        let lastErr = null;
        for (let i = 0; i < attempts.length; i++) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia(attempts[i].constraints);
            console.warn('[WebRTC] Using media profile:', attempts[i].label);
            return stream;
          } catch (err) {
            lastErr = err;
            console.warn('[WebRTC] Media profile failed:', attempts[i].label, err);
          }
        }
        throw lastErr || new Error('Camera and microphone access failed.');
      }

      /**
       * Initializes WebRTC peer connection and media stream acquisition.
       */
      async function initWebRtc() {
        try {
          teardown();
          updateStatus('REQUESTING CAMERA & MIC...', '#f59e0b', false);

          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('navigator.mediaDevices is unavailable. Ensure WebView has secure origin and camera permissions.');
          }

          const stream = await acquireMedia();
          localStream = stream;
          localVideo.srcObject = localStream;
          updateStatus('HARDWARE READY - NEGOTIATING P2P...', '#38bdf8', false);

          pc = new RTCPeerConnection(config);

          localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
          });

          pc.onicecandidate = event => {
            if (event.candidate) {
              sendToNative({
                type: 'driverCandidate',
                candidate: {
                  candidate: event.candidate.candidate,
                  sdpMid: event.candidate.sdpMid,
                  sdpMLineIndex: event.candidate.sdpMLineIndex
                }
              });
            }
          };

          pc.oniceconnectionstatechange = () => {
            sendToNative({ type: 'connectionState', state: pc.iceConnectionState });
            if (pc.iceConnectionState === 'connected') {
              updateStatus('P2P LIVE TO DISPATCH', '#34d399', false);
            } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
              updateStatus('P2P DISCONNECTED', '#ef4444', true);
            }
          };

          const offer = await pc.createOffer({
            offerToReceiveVideo: false,
            offerToReceiveAudio: false
          });
          await pc.setLocalDescription(offer);

          sendToNative({
            type: 'offer',
            sdp: offer.sdp
          });
          updateStatus('OFFER DISPATCHED - AWAITING ADMIN', '#60a5fa', false);
        } catch (err) {
          const errMsg = (err.name ? err.name + ': ' : '') + (err.message || 'Camera access failed');
          updateStatus('ERROR: ' + errMsg, '#f87171', true);
          sendToNative({ type: 'error', message: errMsg });
        }
      }

      /**
       * Starts broadcasting once the engine is ready (or immediately if it is).
       */
      function requestStart() {
        startRequested = true;
        if (engineReady) {
          initWebRtc();
        }
        // Otherwise initWebRtc runs from the load handler below.
      }

      /**
       * Processes incoming signaling data messages from dispatch admin
       * and native session lifecycle commands (start/stop).
       */
      async function handleAdminMessage(event) {
        try {
          const raw = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
          const msg = JSON.parse(raw);

          if (msg.type === 'start') {
            requestStart();
          } else if (msg.type === 'stop') {
            startRequested = false;
            teardown();
            updateStatus('STREAM ENDED', '#94a3b8', false);
          } else if (msg.type === 'answer' && pc) {
            updateStatus('CONNECTING TO DISPATCH...', '#a78bfa', false);
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
          } else if (msg.type === 'adminCandidate' && pc && msg.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          }
        } catch (err) {
          sendToNative({ type: 'error', message: 'Signaling error: ' + (err.message || err) });
        }
      }

      window.addEventListener('message', handleAdminMessage);
      document.addEventListener('message', handleAdminMessage);

      // Engine boots idle: camera/mic are only acquired when the native layer
      // posts {type:'start'} after the driver accepts an admin inspection
      // request (and the native camera preview has released the sensor).
      window.onload = () => {
        engineReady = true;
        updateStatus('P2P ENGINE STANDBY', '#60a5fa', false);
        sendToNative({ type: 'ready' });
        if (startRequested) {
          setTimeout(initWebRtc, 300);
        }
      };
    })();
  </script>
</body>
</html>`;
}
