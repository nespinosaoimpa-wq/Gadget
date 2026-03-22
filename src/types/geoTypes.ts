import type { CaseClassification } from './case';

export type CrimeType = 
  | 'HOMICIDIO' 
  | 'NARCOTRAFICO' 
  | 'ROBO' 
  | 'MICROTRAFICO' 
  | 'LESIONES' 
  | 'AMENAZAS'
  | 'OTROS';

export interface CrimeIncident {
  id: string;
  lat: number;
  lng: number;
  type: CrimeType;
  date: string;
  description: string;
  caseId?: string;       // Link to Case
  entityIds?: string[];  // Link to POLE Entities (Fase 3)
  severity: 1 | 2 | 3 | 4 | 5;
  classification: CaseClassification;
}

export type ZoneType = 
  | 'TERRITORIO' 
  | 'ZONA_CALIENTE' 
  | 'PERIMETRO' 
  | 'ZONA_LIBERADA' 
  | 'BUFFER';

export interface GeoZone {
  id: string;
  name: string;
  type: ZoneType;
  polygon: [number, number][]; // Array of [lat, lng]
  color: string;
  active: boolean;
  metadata?: Record<string, any>;
}

export type LayerType = 'HEATMAP' | 'MARKERS' | 'ZONES' | 'BARRIOS' | 'RUTAS';

export interface MapLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  opacity: number;
}

export interface MapFilters {
  crimeTypes: CrimeType[];
  dateRange: [string, string]; // ISO strings
  minSeverity: number;
  searchQuery: string;
}
