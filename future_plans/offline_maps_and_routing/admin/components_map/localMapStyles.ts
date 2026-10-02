/**
 * @file localMapStyles.ts
 * @description MapLibre GL vector styling definitions for 100% local MBTiles rendering.
 * Translates OpenMapTiles vector layers (water, roads, buildings, landuse)
 * into high-contrast dark and daytime cartographic presentations with zero external server dependencies.
 */

import type { StyleSpecification } from 'maplibre-gl';

/**
 * Generates MapLibre vector style specification for the local MBTiles endpoint.
 * @param theme - 'dark' | 'clean'
 * @param tileOrigin - Host origin for tiles (default window.location.origin)
 */
export function createLocalVectorStyle(theme: 'dark' | 'clean', tileOrigin?: string): StyleSpecification {
  const origin = tileOrigin || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#090d16' : '#f8fafc';
  const waterColor = isDark ? '#0284c7' : '#38bdf8';
  const waterwayColor = isDark ? '#0369a1' : '#0284c7';
  const landuseColor = isDark ? '#0d1527' : '#f1f5f9';
  const parkColor = isDark ? '#064e3b' : '#dcfce7';
  const buildingFill = isDark ? '#172033' : '#e2e8f0';
  const buildingStroke = isDark ? '#1e293b' : '#cbd5e1';
  const highwayColor = isDark ? '#f59e0b' : '#ea580c';
  const primaryRoadColor = isDark ? '#94a3b8' : '#64748b';
  const minorRoadColor = isDark ? '#334155' : '#cbd5e1';
  const boundaryColor = isDark ? '#475569' : '#94a3b8';

  return {
    version: 8,
    name: `Wasalt Local Vector (${theme})`,
    sources: {
      openmaptiles: {
        type: 'vector',
        tiles: [`${origin}/local-tiles/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 14,
      },
    },
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': bgColor },
      },
      {
        id: 'landcover-base',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        paint: {
          'fill-color': landuseColor,
          'fill-opacity': 0.7,
        },
      },
      {
        id: 'landuse-urban',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        paint: {
          'fill-color': landuseColor,
          'fill-opacity': 0.5,
        },
      },
      {
        id: 'landuse-park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': parkColor,
          'fill-opacity': isDark ? 0.35 : 0.6,
        },
      },
      {
        id: 'water-polygons',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': waterColor,
          'fill-opacity': isDark ? 0.85 : 0.75,
        },
      },
      {
        id: 'waterway-lines',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        paint: {
          'line-color': waterwayColor,
          'line-width': 1.5,
          'line-opacity': 0.9,
        },
      },
      {
        id: 'buildings-footprints',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 12,
        paint: {
          'fill-color': buildingFill,
          'fill-outline-color': buildingStroke,
          'fill-opacity': 0.9,
        },
      },
      {
        id: 'roads-minor',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'minor', 'service', 'residential', 'unclassified', 'tertiary'],
        minzoom: 10,
        paint: {
          'line-color': minorRoadColor,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 1.8],
          'line-opacity': 0.85,
        },
      },
      {
        id: 'roads-primary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'primary', 'secondary'],
        minzoom: 6,
        paint: {
          'line-color': primaryRoadColor,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1.0, 14, 3.0],
          'line-opacity': 0.95,
        },
      },
      {
        id: 'roads-highway-casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk'],
        minzoom: 4,
        paint: {
          'line-color': isDark ? '#78350f' : '#9a3412',
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.8, 14, 5.5],
          'line-opacity': 0.9,
        },
      },
      {
        id: 'roads-highway-core',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'motorway', 'trunk'],
        minzoom: 4,
        paint: {
          'line-color': highwayColor,
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 1.0, 14, 3.8],
          'line-opacity': 1.0,
        },
      },
      {
        id: 'admin-boundaries',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        paint: {
          'line-color': boundaryColor,
          'line-width': 1.0,
          'line-dasharray': [3, 2],
          'line-opacity': 0.7,
        },
      },
    ],
  };
}
