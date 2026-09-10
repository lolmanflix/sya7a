import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Landmark } from 'lucide-react';

interface RoutePickerMapProps {
  startLat?: number;
  startLng?: number;
  endLat?: number;
  endLng?: number;
  onPointsSelected: (start: { lat: number; lng: number; address: string }, end: { lat: number; lng: number; address: string }) => void;
}

// Curated well-known Egyptian transit landmarks (extracted directly from Wasalt main app)
const OFFLINE_EGYPTIAN_LANDMARKS = [
  { name: 'الجامعة المصرية الصينية (ECU Nasr City)', lat: 30.0345, lng: 31.3588 },
  { name: 'ميدان التحرير (Tahrir Square)', lat: 30.0444, lng: 31.2357 },
  { name: 'ميدان رمسيس / محطة مصر (Ramses)', lat: 30.0626, lng: 31.2469 },
  { name: 'مدينة نصر - مكرم عبيد (Nasr City)', lat: 30.0561, lng: 31.3300 },
  { name: 'ميدان لبنان - المهندسين (Lebanon Sq)', lat: 30.0610, lng: 31.2017 },
  { name: 'التجمع الخامس (New Cairo / 5th Settl)', lat: 30.0073, lng: 31.4916 },
  { name: 'مطار القاهرة الدولي (Cairo Airport)', lat: 30.1219, lng: 31.4055 },
  { name: 'أهرامات الجيزة (Giza Pyramids)', lat: 29.9792, lng: 31.1342 },
  { name: 'جامعة القاهرة (Cairo University)', lat: 30.0264, lng: 31.2086 },
  { name: 'المعادي (Maadi)', lat: 29.9600, lng: 31.2700 },
  { name: 'مدينة 6 أكتوبر (6th of October)', lat: 29.9637, lng: 30.9177 },
];

export const RoutePickerMap: React.FC<RoutePickerMapProps> = ({
  startLat = 30.0444,
  startLng = 31.2357,
  endLat = 30.0561,
  endLng = 31.3300,
  onPointsSelected,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  const [activeMode, setActiveMode] = useState<'start' | 'end'>('start');
  const [startPoint, setStartPoint] = useState({ lat: startLat, lng: startLng, address: 'Start Station' });
  const [endPoint, setEndPoint] = useState({ lat: endLat, lng: endLng, address: 'Destination' });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [startLat, startLng],
      zoom: 13,
    });

    // Standard OpenStreetMap tiles (matching Wasalt main app)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Start Marker (Blue A)
    const sIcon = L.divIcon({
      className: 'picker-start',
      html: `<div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">A</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    startMarkerRef.current = L.marker([startLat, startLng], { icon: sIcon }).addTo(map);

    // End Marker (Purple B)
    const eIcon = L.divIcon({
      className: 'picker-end',
      html: `<div class="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">B</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    endMarkerRef.current = L.marker([endLat, endLng], { icon: eIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Map Click Handler (sets coordinates without requiring external geocoding APIs)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const fallbackAddress = `Station @ ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      if (activeMode === 'start') {
        const newStart = { lat, lng, address: fallbackAddress };
        setStartPoint(newStart);
        if (startMarkerRef.current) startMarkerRef.current.setLatLng([lat, lng]);
        onPointsSelected(newStart, endPoint);
        setActiveMode('end'); // auto-switch to setting destination
      } else {
        const newEnd = { lat, lng, address: fallbackAddress };
        setEndPoint(newEnd);
        if (endMarkerRef.current) endMarkerRef.current.setLatLng([lat, lng]);
        onPointsSelected(startPoint, newEnd);
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [activeMode, startPoint, endPoint, onPointsSelected]);

  // Apply offline preset landmark
  const applyPreset = (landmark: { name: string; lat: number; lng: number }) => {
    if (activeMode === 'start') {
      const newStart = { lat: landmark.lat, lng: landmark.lng, address: landmark.name };
      setStartPoint(newStart);
      if (startMarkerRef.current) startMarkerRef.current.setLatLng([landmark.lat, landmark.lng]);
      if (mapRef.current) mapRef.current.panTo([landmark.lat, landmark.lng]);
      onPointsSelected(newStart, endPoint);
      setActiveMode('end');
    } else {
      const newEnd = { lat: landmark.lat, lng: landmark.lng, address: landmark.name };
      setEndPoint(newEnd);
      if (endMarkerRef.current) endMarkerRef.current.setLatLng([landmark.lat, landmark.lng]);
      if (mapRef.current) mapRef.current.panTo([landmark.lat, landmark.lng]);
      onPointsSelected(startPoint, newEnd);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('start')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === 'start'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Click Map to Place Start (A)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('end')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeMode === 'end'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Click Map to Place Destination (B)
          </button>
        </div>
      </div>

      {/* Interactive Map Box */}
      <div className="h-60 rounded-xl overflow-hidden border border-slate-700/80 shadow-inner">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Offline Landmark Quick Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <Landmark className="w-3.5 h-3.5 text-brand-400" />
          Quick Egyptian Terminal Presets (No API Needed):
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {OFFLINE_EGYPTIAN_LANDMARKS.map((lm) => (
            <button
              key={lm.name}
              type="button"
              onClick={() => applyPreset(lm)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {lm.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
