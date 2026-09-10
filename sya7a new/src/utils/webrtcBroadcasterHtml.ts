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

      function sendToNative(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      }

      function updateStatus(text, color, isError) {
        if (statusText) statusText.innerText = text;
        if (statusBadge && color) {
          statusBadge.style.color = color;
          statusBadge.style.borderColor = isError ? 'rgba(239, 68, 68, 0.6)' : 'rgba(52, 211, 153, 0.4)';
          statusBadge.style.background = isError ? 'rgba(69, 10, 10, 0.95)' : 'rgba(15, 23, 42, 0.95)';
        }
        if (dot) dot.style.backgroundColor = isError ? '#ef4444' : '#10b981';
      }

      async function initWebRtc() {
        try {
          updateStatus('REQUESTING CAMERA & MIC...', '#f59e0b', false);

          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('navigator.mediaDevices is unavailable. Ensure WebView has secure origin and camera permissions.');
          }

          let stream = null;
          try {
            // First attempt: Ideal 30fps 600kbps video + Opus audio
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 },
                frameRate: { ideal: 30 }
              },
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            });
          } catch (firstErr) {
            console.warn('[WebRTC] First constraints failed, retrying flexible video/audio:', firstErr);
            try {
              stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch (secondErr) {
              console.warn('[WebRTC] Audio+video failed, falling back to video-only:', secondErr);
              stream = await navigator.mediaDevices.getUserMedia({ video: true });
            }
          }

          localStream = stream;
          localVideo.srcObject = localStream;
          updateStatus('HARDWARE READY • NEGOTIATING P2P...', '#38bdf8', false);

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
              updateStatus('● P2P 30FPS LIVE TO DISPATCH', '#34d399', false);
            } else if (pc.iceConnectionState === 'disconnected') {
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
          updateStatus('OFFER DISPATCHED • AWAITING ADMIN', '#60a5fa', false);
        } catch (err) {
          const errMsg = (err.name ? err.name + ': ' : '') + (err.message || 'Camera access failed');
          updateStatus('ERROR: ' + errMsg, '#f87171', true);
          sendToNative({ type: 'error', message: errMsg });
        }
      }

      async function handleAdminMessage(event) {
        try {
          const raw = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
          const msg = JSON.parse(raw);

          if (msg.type === 'answer' && pc) {
            updateStatus('CONNECTING TO DISPATCH...', '#a78bfa', false);
            await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
          } else if (msg.type === 'adminCandidate' && pc && msg.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } else if (msg.type === 'stop') {
            if (localStream) {
              localStream.getTracks().forEach(t => t.stop());
            }
            if (pc) {
              pc.close();
              pc = null;
            }
            updateStatus('STREAM ENDED', '#94a3b8', false);
          }
        } catch (err) {
          sendToNative({ type: 'error', message: 'Signaling error: ' + (err.message || err) });
        }
      }

      window.addEventListener('message', handleAdminMessage);
      document.addEventListener('message', handleAdminMessage);

      // Delay 700ms to ensure Android Camera2 HAL releases camera sensor from expo-camera
      window.onload = () => {
        setTimeout(initWebRtc, 700);
      };
    })();
  </script>
</body>
</html>`;
}
