/**
 * Passenger Map HTML Template for Leaflet WebView
 * Renders base map, active bus markers, and multi-point road itineraries with intermediate stops.
 */

export const getMapHTML = (isDark: boolean) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bus Tracker Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; background: ${isDark ? '#000' : '#fff'}; }
        #map { width: 100%; height: 100vh; }
        .bus-icon-wrapper { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; }
        .bus-icon-shadow { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); }
        .leaflet-marker-icon { transition: none; }
        .bus-animated .leaflet-marker-icon { transition: transform 1s ease-out !important; }
        .custom-stop-marker { display:flex; align-items:center; justify-content:center; }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        const isDark = ${isDark};
        const tileUrl = isDark
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        const map = L.map('map', { zoomControl: false }).setView([30.0444, 31.2357], 13);
        L.tileLayer(tileUrl, { attribution: '© OpenStreetMap contributors © CARTO' }).addTo(map);

        const busMarkers = {};
        const routeLayer = L.layerGroup().addTo(map);
        const stopsLayer = L.layerGroup().addTo(map);
        let lastRoutePos = null;

        function calcDistKm(lat1, lng1, lat2, lng2) {
          const R = 6371008.8;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
                    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
                    Math.sin(dLon/2)*Math.sin(dLon/2);
          return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))) / 1000;
        }

        // --- Multi-point Road Route & Stops Renderer ---
        window.drawFullRouteWithStops = function(routeDef) {
          if (!routeDef) return;
          stopsLayer.clearLayers();

          const waypoints = [];
          if (routeDef.startLat && routeDef.startLng) {
            waypoints.push({ lat: Number(routeDef.startLat), lng: Number(routeDef.startLng), name: routeDef.startPoint || 'Origin', type: 'start' });
          }

          if (Array.isArray(routeDef.stops)) {
            const sortedStops = [...routeDef.stops].sort((a, b) => (a.order || 0) - (b.order || 0));
            sortedStops.forEach((s, idx) => {
              if (s.lat && s.lng) {
                waypoints.push({ lat: Number(s.lat), lng: Number(s.lng), name: s.name || ('Stop ' + (idx + 1)), type: 'stop', idx: idx + 1 });
              }
            });
          }

          if (routeDef.endLat && routeDef.endLng) {
            waypoints.push({ lat: Number(routeDef.endLat), lng: Number(routeDef.endLng), name: routeDef.endPoint || 'Destination', type: 'end' });
          }

          if (waypoints.length < 2) return;

          // Render numbered / terminal stop markers
          waypoints.forEach(wp => {
            let iconHtml = '';
            if (wp.type === 'start') {
              iconHtml = '<div style="background:#10B981;color:#fff;border:2.5px solid #fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 3px 6px rgba(0,0,0,0.35);">A</div>';
            } else if (wp.type === 'end') {
              iconHtml = '<div style="background:#EF4444;color:#fff;border:2.5px solid #fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;box-shadow:0 3px 6px rgba(0,0,0,0.35);">B</div>';
            } else {
              iconHtml = '<div style="background:#2563EB;color:#fff;border:2px solid #fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:10px;box-shadow:0 2px 5px rgba(0,0,0,0.3);">' + wp.idx + '</div>';
            }

            const marker = L.marker([wp.lat, wp.lng], {
              icon: L.divIcon({ className: 'custom-stop-marker', html: iconHtml, iconSize: [26, 26], iconAnchor: [13, 13] })
            }).addTo(stopsLayer);
            marker.bindPopup('<b>' + wp.name + '</b>');
          });

          // Fetch multi-point OSRM road geometry
          const coordsParam = waypoints.map(w => w.lng + ',' + w.lat).join(';');
          const url = 'https://router.project-osrm.org/route/v1/driving/' + coordsParam + '?overview=full&geometries=geojson';

          fetch(url)
            .then(r => r.json())
            .then(data => {
              if (data.routes && data.routes[0]) {
                const coordinates = data.routes[0].geometry.coordinates;
                const latLngs = coordinates.map(c => [c[1], c[0]]);
                const poly = L.polyline(latLngs, {
                  color: '#2563EB',
                  weight: 5,
                  opacity: 0.85
                }).addTo(stopsLayer);
                if (!window.hasFittedBounds) {
                  map.fitBounds(poly.getBounds().pad(0.15));
                  window.hasFittedBounds = true;
                }
              }
            })
            .catch(() => {
              const latLngs = waypoints.map(w => [w.lat, w.lng]);
              const poly = L.polyline(latLngs, {
                color: '#2563EB',
                weight: 4,
                opacity: 0.7,
                dashArray: '8, 8'
              }).addTo(stopsLayer);
              if (!window.hasFittedBounds) {
                map.fitBounds(poly.getBounds().pad(0.15));
                window.hasFittedBounds = true;
              }
            });
        };

        // --- Live Bus Markers ---
        function updateBusMarkers(busLocations) {
          busLocations.forEach(bus => {
            const newLatLng = L.latLng(bus.latitude, bus.longitude);

            if (busMarkers[bus.id]) {
              const existingLatLng = busMarkers[bus.id].getLatLng();
              const distKm = calcDistKm(existingLatLng.lat, existingLatLng.lng, bus.latitude, bus.longitude);

              if (distKm < 5 && distKm > 0) {
                busMarkers[bus.id].setLatLng(newLatLng);
                const markerEl = busMarkers[bus.id].getElement();
                if (markerEl) markerEl.style.transition = 'all 1s ease-out';
              } else if (distKm === 0) {
                busMarkers[bus.id].setLatLng(newLatLng);
              } else {
                const markerEl = busMarkers[bus.id].getElement();
                if (markerEl) markerEl.style.transition = 'none';
                busMarkers[bus.id].setLatLng(newLatLng);
              }
            } else {
              const svg = "<div class='bus-icon-wrapper'><svg class='bus-icon-shadow' width='36' height='36' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='3' y='3' width='18' height='12' rx='3' ry='3' fill='#007AFF' stroke='#FFFFFF' stroke-width='2'/><rect x='5' y='5' width='10' height='5' rx='1.5' fill='#E6F0FF'/><circle cx='7.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1.5'/><circle cx='16.5' cy='16.5' r='2' fill='#1C1C1E' stroke='#FFFFFF' stroke-width='1.5'/><rect x='17' y='5' width='3' height='5' rx='1' fill='#E6F0FF'/></svg></div>";

              const marker = L.marker([bus.latitude, bus.longitude], {
                icon: L.divIcon({
                  className: 'bus-icon bus-animated',
                  html: svg,
                  iconSize: [44, 44],
                  iconAnchor: [22, 22]
                })
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
              map.fitBounds(group.getBounds().pad(0.2));
            }
            window.hasFittedBounds = true;
          }
        }

        window.updateBusLocations = updateBusMarkers;

        // User location marker
        window.addUserLocation = function(lat, lng) {
          if (lat && lng) {
            if (window.userMarker) {
              window.userMarker.setLatLng([lat, lng]);
            } else {
              window.userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'user-marker',
                  html: '<div style="background-color:#007AFF;border:3px solid #FFFFFF;border-radius:50%;width:22px;height:22px;box-shadow:0 0 10px rgba(0,122,255,0.5);"></div>',
                  iconSize: [22, 22],
                  iconAnchor: [11, 11]
                })
              }).addTo(map);
            }
          }
        };

        // User → Bus route (dashed)
        window.drawUserToBus = async function(userLat, userLng, busLat, busLng) {
          if (window.userToBusLine) map.removeLayer(window.userToBusLine);
          if (!(userLat && userLng && busLat && busLng)) return;
          try {
            const url = 'https://router.project-osrm.org/route/v1/driving/' + userLng + ',' + userLat + ';' + busLng + ',' + busLat + '?overview=full&geometries=geojson';
            const res = await fetch(url);
            const json = await res.json();
            const coords = json && json.routes && json.routes[0] && json.routes[0].geometry && json.routes[0].geometry.coordinates;
            if (Array.isArray(coords)) {
              const latlngs = coords.map(([lng, lat]) => [lat, lng]);
              window.userToBusLine = L.polyline(latlngs, { color: '#34C759', weight: 4, opacity: 0.7, dashArray: '10, 10' }).addTo(map);
            }
          } catch (e) {
            window.userToBusLine = L.polyline([[userLat, userLng], [busLat, busLng]], { color: '#34C759', weight: 3, opacity: 0.6, dashArray: '6, 10' }).addTo(map);
          }
        };
    </script>
</body>
</html>
`;
