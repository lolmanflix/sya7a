/**
 * @file passengerMapHtml.ts
 * @description Commuter passenger WebView map HTML template.
 * Basemap = OpenFreeMap vector styles (light: liberty, dark: dark) rendered
 * through @maplibre/maplibre-gl-leaflet, so every React Native bridge function
 * keeps operating on a real Leaflet instance (markers, polylines, fitBounds).
 * Overlay geometry comes from the local offline routing engine; tiles never do.
 */

import { MAP_ATTRIBUTION, MAP_CDN, OFM_STYLES } from '../../config/mapConfig';

/**
 * Builds the passenger map HTML document.
 *
 * @param isDark - Initial theme mode (true = OpenFreeMap dark style).
 * @returns Self-contained HTML string for react-native-webview.
 */
export const getMapHTML = (isDark: boolean): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bus Tracker Map</title>
    <link rel="stylesheet" href="${MAP_CDN.leafletCss}" />
    <link rel="stylesheet" href="${MAP_CDN.maplibreGlCss}" />
    <script src="${MAP_CDN.leafletJs}"></script>
    <script src="${MAP_CDN.maplibreGlJs}"></script>
    <script src="${MAP_CDN.maplibreGlLeafletJs}"></script>
    <style>
        body { margin: 0; padding: 0; background: ${isDark ? '#090d16' : '#f8fafc'}; overflow: hidden; }
        #map { width: 100%; height: 100vh; background: ${isDark ? '#090d16' : '#f8fafc'}; }
        #map-fallback { display: none; position: fixed; left: 12px; right: 12px; bottom: 42px;
            padding: 10px 14px; border-radius: 8px; background: rgba(15, 23, 42, 0.92);
            color: #f8fafc; font: 13px/1.4 -apple-system, Roboto, sans-serif; text-align: center; z-index: 1000; }
        .bus-icon-wrapper { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; }
        .bus-icon-shadow { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); }
        .leaflet-marker-icon { transition: none; }
        .bus-animated .leaflet-marker-icon { transition: transform 1s ease-out !important; }
        .custom-stop-marker { display:flex; align-items:center; justify-content:center; }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="map-fallback" role="status"></div>

    <script>
    (function () {
        'use strict';

        var STYLE_URLS = { light: '${OFM_STYLES.light}', dark: '${OFM_STYLES.dark}' };
        var MAP_ATTRIBUTION_TEXT = '${MAP_ATTRIBUTION}';
        var PAGE_BG = { light: '#f8fafc', dark: '#090d16' };
        var FALLBACK_MSG = 'Map preview unavailable - check your network connection.';
        var currentMode = ${JSON.stringify(isDark ? 'dark' : 'light')};
        var glLayer = null;

        function showFallback(message) {
            var el = document.getElementById('map-fallback');
            if (!el) return;
            el.textContent = message;
            el.style.display = 'block';
        }

        function hideFallback() {
            var el = document.getElementById('map-fallback');
            if (el) el.style.display = 'none';
        }

        function applyPageBackground(mode) {
            var bg = PAGE_BG[mode] || PAGE_BG.light;
            document.body.style.backgroundColor = bg;
            var mapEl = document.getElementById('map');
            if (mapEl) mapEl.style.backgroundColor = bg;
        }

        function reportToNative(payload) {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                try { window.ReactNativeWebView.postMessage(JSON.stringify(payload)); } catch (e) {}
            }
        }

        if (typeof L === 'undefined' || typeof maplibregl === 'undefined') {
            showFallback('Map libraries failed to load. Check your connection.');
            reportToNative({ type: 'mapError', payload: { reason: 'cdn_load_failed' } });
            return;
        }

        applyPageBackground(currentMode);

        var map = L.map('map', {
          zoomControl: false,
          maxBounds: [[180, -Infinity], [-180, Infinity]],
          maxBoundsViscosity: 1,
          minZoom: 1
        }).setView([30.0444, 31.2357], 13);

        // Ensure Leaflet animation proxy exists
        if (typeof map._createAnimProxy === 'function' && !map._proxy) {
          try { map._createAnimProxy(); } catch (e) {}
        }

        if (map.attributionControl) {
            map.attributionControl.setPrefix(false);
            map.attributionControl.addAttribution(MAP_ATTRIBUTION_TEXT);
        }

        function createGlLayer(styleUrl) {
            return L.maplibreGL({
                style: styleUrl,
                interactive: false,
                attributionControl: { customAttribution: MAP_ATTRIBUTION_TEXT }
            }).addTo(map);
        }

        function bindGlEvents(layer) {
            if (!layer || typeof layer.getMaplibreMap !== 'function') return;
            var glMap = layer.getMaplibreMap();
            if (!glMap || typeof glMap.on !== 'function') return;
            glMap.on('style.load', hideFallback);
            glMap.on('error', function (ev) {
                var msg = ev && ev.error && ev.error.message ? String(ev.error.message) : 'unknown';
                console.warn('[PassengerMap] MapLibre error:', msg);
                // Per-tile errors are transient; style/worker failures block the basemap.
                if (!ev || !ev.sourceId) {
                    showFallback(FALLBACK_MSG);
                    reportToNative({ type: 'mapError', payload: { reason: 'style_load_failed', message: msg } });
                }
            });
        }

        try {
            glLayer = createGlLayer(STYLE_URLS[currentMode]);
            bindGlEvents(glLayer);
        } catch (glErr) {
            console.warn('[PassengerMap] vector layer fallback:', glErr);
            showFallback(FALLBACK_MSG);
        }

        /**
         * RN bridge: switch OpenFreeMap style (light <-> dark) without reloading.
         * @param {'light'|'dark'} mode - Target map theme mode.
         * @returns {boolean} True when a style swap was attempted successfully.
         */
        window.__setMapStyle = function (mode) {
            var next = mode === 'dark' ? 'dark' : 'light';
            currentMode = next;
            applyPageBackground(next);
            try {
                if (glLayer && typeof glLayer.getMaplibreMap === 'function') {
                    var glMap = glLayer.getMaplibreMap();
                    if (glMap && typeof glMap.setStyle === 'function') {
                        glMap.setStyle(STYLE_URLS[next]);
                        hideFallback();
                        return true;
                    }
                }
                if (glLayer) {
                    try { map.removeLayer(glLayer); } catch (e) {}
                    glLayer = null;
                }
                glLayer = createGlLayer(STYLE_URLS[next]);
                bindGlEvents(glLayer);
                hideFallback();
                return true;
            } catch (err) {
                console.warn('[PassengerMap] style switch failed:', err);
                showFallback('Map style could not be switched.');
                return false;
            }
        };

        /** RN bridge: current map theme mode. */
        window.__getMapStyle = function () { return currentMode; };

        var busMarkers = {};
        var stopsLayer = L.layerGroup().addTo(map);
        var activeRouteLayers = [];

        // Draw Authentic Multi-Stop Road Corridor
        window.drawFullRouteWithStops = function(routeDef, activeBus) {
          if (!routeDef) return;
          window.lastRouteDef = routeDef;
          window.lastActiveBus = activeBus;

          stopsLayer.clearLayers();
          activeRouteLayers.forEach(l => map.removeLayer(l));
          activeRouteLayers = [];

          const waypoints = [];
          if (Array.isArray(routeDef.stops) && routeDef.stops.length >= 2) {
            routeDef.stops.forEach((s, idx) => {
              waypoints.push({
                lat: Number(s.lat),
                lng: Number(s.lng),
                name: s.name || ('Stop ' + (idx + 1)),
                type: idx === 0 ? 'start' : (idx === routeDef.stops.length - 1 ? 'end' : 'stop'),
                idx: idx + 1
              });
            });
          } else {
            let startLat = null;
            let startLng = null;
            let startName = '';
            if (activeBus && activeBus.latitude && activeBus.longitude) {
              startLat = Number(activeBus.latitude);
              startLng = Number(activeBus.longitude);
              startName = activeBus.startPoint || 'Point A';
            } else if (routeDef.startLat && routeDef.startLng) {
              startLat = Number(routeDef.startLat);
              startLng = Number(routeDef.startLng);
              startName = routeDef.startPoint || 'Origin (A)';
            }
            if (startLat !== null && startLng !== null) {
              waypoints.push({ lat: startLat, lng: startLng, name: startName, type: 'start' });
            }
            if (routeDef.endLat && routeDef.endLng) {
              waypoints.push({ lat: Number(routeDef.endLat), lng: Number(routeDef.endLng), name: routeDef.endPoint || 'Destination (B)', type: 'end' });
            }
          }

          if (waypoints.length < 2) return;

          // Render Terminal A, Terminal B, and Intermediate stop badges
          waypoints.forEach(wp => {
            let badgeHtml = '';
            if (wp.type === 'start') {
              badgeHtml = '<div style="background:#10B981;color:#fff;border:2.5px solid #fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 3px 6px rgba(0,0,0,0.35);">A</div>';
            } else if (wp.type === 'end') {
              badgeHtml = '<div style="background:#8B5CF6;color:#fff;border:2.5px solid #fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 3px 6px rgba(0,0,0,0.35);">B</div>';
            } else {
              badgeHtml = '<div style="background:#0284C7;color:#fff;border:2px solid #fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:10px;box-shadow:0 2px 5px rgba(0,0,0,0.3);">' + wp.idx + '</div>';
            }

            const m = L.marker([wp.lat, wp.lng], {
              icon: L.divIcon({ className: 'custom-stop-marker', html: badgeHtml, iconSize: [26, 26], iconAnchor: [13, 13] })
            }).addTo(stopsLayer);
            m.bindPopup('<b>' + wp.name + '</b>');
          });

          // Use pre-computed authentic road coordinates if provided, else waypoints
          const roadPoints = routeDef.computedCoordinates || waypoints.map(w => [w.lat, w.lng]);

          // High-contrast 3-layer navigation road polyline
          const halo = L.polyline(roadPoints, { color: '#06B6D4', weight: 9, opacity: 0.3, lineCap: 'round', lineJoin: 'round' }).addTo(map);
          const casing = L.polyline(roadPoints, { color: '#083344', weight: 5.5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }).addTo(map);
          const core = L.polyline(roadPoints, { color: '#22D3EE', weight: 3.5, opacity: 1.0, lineCap: 'round', lineJoin: 'round' }).addTo(map);
          activeRouteLayers = [halo, casing, core];

          if (!window.hasFittedBounds) {
            map.fitBounds(core.getBounds().pad(0.18));
            window.hasFittedBounds = true;
          }
        };

        // Live Bus Vehicle Markers
        function updateBusMarkers(busLocations) {
          if (!Array.isArray(busLocations)) return;
          busLocations.forEach(bus => {
            const newLatLng = L.latLng(bus.latitude, bus.longitude);

            if (busMarkers[bus.id]) {
              busMarkers[bus.id].setLatLng(newLatLng);
            } else {
              const svg = "<div class='bus-icon-wrapper'><svg class='bus-icon-shadow' width='38' height='38' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='3' y='3' width='18' height='12' rx='3' ry='3' fill='#06B6D4' stroke='#FFFFFF' stroke-width='2'/><rect x='5' y='5' width='10' height='5' rx='1.5' fill='#E0F2FE'/><circle cx='7.5' cy='16.5' r='2' fill='#083344' stroke='#FFFFFF' stroke-width='1.5'/><circle cx='16.5' cy='16.5' r='2' fill='#083344' stroke='#FFFFFF' stroke-width='1.5'/><rect x='17' y='5' width='3' height='5' rx='1' fill='#E0F2FE'/></svg></div>";

              const marker = L.marker([bus.latitude, bus.longitude], {
                icon: L.divIcon({ className: 'bus-icon bus-animated', html: svg, iconSize: [44, 44], iconAnchor: [22, 22] })
              }).addTo(map);

              marker.on('click', function () {
                reportToNative({ type: 'selectBus', payload: bus });
              });

              busMarkers[bus.id] = marker;
            }
          });

          const activeIds = new Set(busLocations.map(b => b.id));
          Object.keys(busMarkers).forEach(id => {
            if (!activeIds.has(id)) {
              map.removeLayer(busMarkers[id]);
              delete busMarkers[id];
            }
          });

          if (busLocations.length > 0 && !window.hasFittedBounds) {
            const group = new L.featureGroup(Object.values(busMarkers));
            if (group.getBounds().isValid()) {
              map.fitBounds(group.getBounds().pad(0.18));
            }
            window.hasFittedBounds = true;
          }
        }

        window.updateBusLocations = updateBusMarkers;

        // User Position Pin
        window.addUserLocation = function(lat, lng) {
          if (lat && lng) {
            if (window.userMarker) {
              window.userMarker.setLatLng([lat, lng]);
            } else {
              window.userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'user-marker',
                  html: '<div style="background-color:#0284C7;border:3px solid #FFFFFF;border-radius:50%;width:22px;height:22px;box-shadow:0 0 10px rgba(2,132,199,0.6);"></div>',
                  iconSize: [22, 22],
                  iconAnchor: [11, 11]
                })
              }).addTo(map);
            }
          }
        };

        // User -> Vehicle Direct Itinerary
        window.drawUserToBus = function(userLat, userLng, busLat, busLng) {
          if (window.userToBusLine) map.removeLayer(window.userToBusLine);
          if (!(userLat && userLng && busLat && busLng)) return;
          window.userToBusLine = L.polyline([[userLat, userLng], [busLat, busLng]], {
            color: '#10B981',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8'
          }).addTo(map);
        };
    })();
    </script>
</body>
</html>
`;
