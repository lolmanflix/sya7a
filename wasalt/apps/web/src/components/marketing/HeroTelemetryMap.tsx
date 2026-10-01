import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, Radio, CheckCircle2 } from 'lucide-react';

export interface VehicleTelemetry {
  id: string;
  name: string;
  route: string;
  driver: string;
  status: 'On Route' | 'At Terminal' | 'In Transit';
  eta: string;
  coords: [number, number];
  heading: number;
}

export const HERO_MOCK_VEHICLES: VehicleTelemetry[] = [
  {
    id: 'bus_102',
    name: 'Bus 102',
    route: 'School Route → Maadi & Corniche',
    driver: 'Ahmed H.',
    status: 'On Route',
    eta: '08:42 AM',
    coords: [29.9602, 31.2589], // Maadi
    heading: 45,
  },
  {
    id: 'bus_115',
    name: 'Bus 115',
    route: 'West Shift → 6th October / Mehwar',
    driver: 'Mahmoud S.',
    status: 'In Transit',
    eta: '08:55 AM',
    coords: [30.0478, 31.1456], // 26th July corridor
    heading: 120,
  },
  {
    id: 'bus_204',
    name: 'Bus 204',
    route: 'East Hub → New Cairo / 90th St',
    driver: 'Tarek E.',
    status: 'On Route',
    eta: '08:49 AM',
    coords: [30.0247, 31.4361], // New Cairo
    heading: 90,
  },
];

interface HeroTelemetryMapProps {
  selectedVehicleId: string;
  onSelectVehicle: (vehicle: VehicleTelemetry) => void;
}

export const HeroTelemetryMap: React.FC<HeroTelemetryMapProps> = ({
  selectedVehicleId,
  onSelectVehicle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map centered on Greater Cairo
    const map = L.map(mapContainerRef.current, {
      center: [30.035, 31.29],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // Zero-API OpenStreetMap / Carto Voyager Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Cairo Arterial Transit Polylines
    const routeMaadi = L.polyline(
      [
        [29.9602, 31.2589],
        [29.9889, 31.28],
        [30.0131, 31.2357],
        [30.0444, 31.2357],
      ],
      { color: '#2563eb', weight: 4, opacity: 0.85, lineCap: 'round' }
    ).addTo(map);

    const routeOctober = L.polyline(
      [
        [29.9739, 30.9525],
        [30.0433, 31.0261],
        [30.0478, 31.1456],
        [30.061, 31.2017],
        [30.0444, 31.2357],
      ],
      { color: '#0d9488', weight: 4, opacity: 0.85, dashArray: '6, 8', lineCap: 'round' }
    ).addTo(map);

    const routeNewCairo = L.polyline(
      [
        [30.0247, 31.4361],
        [30.0561, 31.33],
        [30.0667, 31.2833],
        [30.0444, 31.2357],
      ],
      { color: '#7c3aed', weight: 4, opacity: 0.85, lineCap: 'round' }
    ).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update vehicle markers when selected vehicle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;
    const markersGroup = markersRef.current;
    markersGroup.clearLayers();

    HERO_MOCK_VEHICLES.forEach((v) => {
      const isSelected = v.id === selectedVehicleId;
      const markerHtml = `
        <div class="relative cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="w-8 h-8 rounded-full ${isSelected ? 'bg-blue-600 ring-4 ring-blue-300' : 'bg-slate-900'} text-white shadow-lg flex items-center justify-center border-2 border-white">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>
          ${isSelected ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>' : ''}
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-vehicle-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(v.coords, { icon });
      marker.on('click', () => {
        onSelectVehicle(v);
      });
      marker.bindTooltip(`<b>${v.name}</b><br>${v.route}<br><span class="text-emerald-600 font-bold">${v.status}</span>`, {
        direction: 'top',
        offset: [0, -10],
      });

      markersGroup.addLayer(marker);
    });
  }, [selectedVehicleId, onSelectVehicle]);

  return (
    <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Badges */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Live Telemetry Map (Cairo & Intercity)</span>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero-API Map • OpenStreetMap Core</span>
        </div>
      </div>
    </div>
  );
};
