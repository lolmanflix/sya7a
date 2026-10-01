/**
 * @file passengerMapHtml.ts
 * @description Commuter passenger Leaflet WebView HTML template.
 * Renders 100% local vector MBTiles base map (water, roads, buildings),
 * 3-layer navigation polyline corridor, numbered stop pins, and live driver beacons.
 * Zero CartoDB dependencies, zero synthetic spline shortcuts.
 */

export const getMapHTML = (isDark: boolean, tileServerUrl: string = 'http://localhost:5173') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bus Tracker Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
    <script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.1.4/dist/leaflet-maplibre-gl.js"></script>
    <style>
        body { margin: 0; padding: 0; background: ${isDark ? '#090d16' : '#f8fafc'}; overflow: hidden; }
        #map { width: 100%; height: 100vh; background: ${isDark ? '#090d16' : '#f8fafc'}; }
        .bus-icon-wrapper { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; }
        .bus-icon-shadow { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)); }
        .leaflet-marker-icon { transition: none; }
        .bus-animated .leaflet-marker-icon { transition: transform 1s ease-out !important; }
        .custom-stop-marker { display:flex; align-items:center; justify-content:center; }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        const isDark = ${isDark};
        const tileHost = "${tileServerUrl}";

        const map = L.map('map', {
          zoomControl: false,
          maxBounds: [[180, -Infinity], [-180, Infinity]],
          maxBoundsViscosity: 1,
          minZoom: 1
        }).setView([30.0444, 31.2357], 13);

        // Ensure Leaflet animation proxy exists
        if (typeof map._createAnimProxy === 'function' && !map._proxy) {
          try { map._createAnimProxy(); } catch (e) {}
        }

        // Configure self-hosted worker if available
        if (typeof maplibregl !== 'undefined' && typeof maplibregl.setWorkerUrl === 'function') {
          maplibregl.setWorkerUrl(tileHost + '/maplibre-gl-worker.mjs');
        }

        // 100% Local Vector Style from MBTiles
        const localVectorStyle = {
          version: 8,
          name: 'Mobile Local Vector',
          sources: {
            openmaptiles: {
              type: 'vector',
              tiles: [tileHost + '/local-tiles/{z}/{x}/{y}'],
              minzoom: 0,
              maxzoom: 14
            }
          },
          layers: [
            { id: 'bg', type: 'background', paint: { 'background-color': isDark ? '#090d16' : '#f8fafc' } },
            { id: 'landcover', type: 'fill', source: 'openmaptiles', 'source-layer': 'landcover', paint: { 'fill-color': isDark ? '#0d1527' : '#f1f5f9', 'fill-opacity': 0.7 } },
            { id: 'landuse', type: 'fill', source: 'openmaptiles', 'source-layer': 'landuse', paint: { 'fill-color': isDark ? '#0d1527' : '#f1f5f9', 'fill-opacity': 0.5 } },
            { id: 'water', type: 'fill', source: 'openmaptiles', 'source-layer': 'water', paint: { 'fill-color': isDark ? '#0284c7' : '#38bdf8', 'fill-opacity': isDark ? 0.85 : 0.75 } },
            { id: 'waterway', type: 'line', source: 'openmaptiles', 'source-layer': 'waterway', paint: { 'line-color': '#0284c7', 'line-width': 1.5 } },
            { id: 'buildings', type: 'fill', source: 'openmaptiles', 'source-layer': 'building', minzoom: 12, paint: { 'fill-color': isDark ? '#172033' : '#e2e8f0', 'fill-outline-color': isDark ? '#1e293b' : '#cbd5e1' } },
            { id: 'roads-minor', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'minor', 'service', 'residential', 'unclassified', 'tertiary'], minzoom: 10, paint: { 'line-color': isDark ? '#334155' : '#cbd5e1', 'line-width': 1.2 } },
            { id: 'roads-primary', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'primary', 'secondary'], minzoom: 6, paint: { 'line-color': isDark ? '#94a3b8' : '#64748b', 'line-width': 2.0 } },
            { id: 'roads-hw-casing', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'motorway', 'trunk'], minzoom: 4, paint: { 'line-color': isDark ? '#78350f' : '#9a3412', 'line-width': 4.0 } },
            { id: 'roads-hw-core', type: 'line', source: 'openmaptiles', 'source-layer': 'transportation', filter: ['in', 'class', 'motorway', 'trunk'], minzoom: 4, paint: { 'line-color': isDark ? '#f59e0b' : '#ea580c', 'line-width': 2.5 } }
          ]
        };

        try {
          L.maplibreGL({ style: localVectorStyle, interactive: false }).addTo(map);
        } catch (glErr) {
          console.warn('[PassengerMap] Local vector layer fallback:', glErr);
        }

        const busMarkers = {};
        const stopsLayer = L.layerGroup().addTo(map);
        let activeRouteLayers = [];

        function calcDistKm(lat1, lon1, lat2, lon2) {
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

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
            let startLat = null, startLng = null, startName = '';
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
                if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                  try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'selectBus', payload: bus })); } catch (e) {}
                }
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
    </script>
</body>
</html>
`;
