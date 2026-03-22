import * as turf from '@turf/turf';
import type { CrimeIncident, GeoZone } from '../../types/geoTypes';

/**
 * Motor de análisis espacial para inteligencia criminal
 * Basado en Turf.js
 */

/**
 * Crea una zona de influencia (buffer) alrededor de un punto
 */
export const createBufferZone = (lat: number, lng: number, radiusKm: number): number[][] => {
  const point = turf.point([lng, lat]);
  const buffered = turf.buffer(point, radiusKm, { units: 'kilometers' });
  
  if (buffered && buffered.geometry.type === 'Polygon') {
    // Turf returns [lng, lat], Leaflet wants [lat, lng]
    return buffered.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
  }
  return [];
};

/**
 * Verifica si un incidente cae dentro de una zona (Geofencing)
 */
export const isIncidentInZone = (incident: CrimeIncident, zone: GeoZone): boolean => {
  const pt = turf.point([incident.lng, incident.lat]);
  // Convert [lat, lng] back to [lng, lat] for turf
  const polyCoords = zone.polygon.map((coord: number[]) => [coord[1], coord[0]]);
  
  // Turf requires the first and last point to be the same to close the polygon
  if (polyCoords.length > 0 && (polyCoords[0][0] !== polyCoords[polyCoords.length-1][0] || polyCoords[0][1] !== polyCoords[polyCoords.length-1][1])) {
    polyCoords.push(polyCoords[0]);
  }

  const poly = turf.polygon([polyCoords]);
  return turf.booleanPointInPolygon(pt, poly);
};

/**
 * Encuentra incidentes cercanos a una ubicación (Radio de búsqueda)
 */
export const findNearbyIncidents = (lat: number, lng: number, radiusKm: number, allIncidents: CrimeIncident[]): CrimeIncident[] => {
  const center = turf.point([lng, lat]);
  
  return allIncidents.filter(incident => {
    const incidentPt = turf.point([incident.lng, incident.lat]);
    const distance = turf.distance(center, incidentPt, { units: 'kilometers' });
    return distance <= radiusKm;
  });
};

/**
 * Calcula el centroide de un conjunto de incidentes
 */
export const getIncidentsCenter = (incidents: CrimeIncident[]): [number, number] | null => {
  if (incidents.length === 0) return null;
  
  const points = turf.featureCollection(
    incidents.map(i => turf.point([i.lng, i.lat]))
  );
  
  const center = turf.centroid(points);
  return [center.geometry.coordinates[1], center.geometry.coordinates[0]];
};

/**
 * Identifica "Clusters" o Hotspots de delitos
 * Retorna polígonos convexos que encierran grupos de delitos densos
 */
export const findCrimeHotspots = (incidents: CrimeIncident[], maxDistanceKm: number = 0.5): number[][][] => {
  if (incidents.length < 3) return [];

  // Implementación simplificada de detección de clusters
  // En un entorno real usaríamos DBScan, aquí agrupamos por proximidad
  const hotspots: number[][][] = [];
  const processed = new Set<string>();

  incidents.forEach(i => {
    if (processed.has(i.id)) return;

    const nearby = findNearbyIncidents(i.lat, i.lng, maxDistanceKm, incidents);
    if (nearby.length >= 4) { // Umbral de cluster
      nearby.forEach(n => processed.add(n.id));
      
      // Close the set for hull calculation
      const hull = turf.convex(turf.featureCollection(nearby.map(n => turf.point([n.lng, n.lat]))));
      
      if (hull && hull.geometry.type === 'Polygon') {
        hotspots.push(hull.geometry.coordinates[0].map(c => [c[1], c[0]]));
      }
    }
  });

  return hotspots;
};
