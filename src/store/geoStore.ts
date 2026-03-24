import { create } from 'zustand';
import type { CrimeIncident, GeoZone, MapLayer, MapFilters, CrimeType } from '../types/geoTypes';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface GeoState {
  incidents: CrimeIncident[];
  zones: GeoZone[];
  layers: MapLayer[];
  filters: MapFilters;
  selectedIncidentId: string | null;
  loading: boolean;
  
  setIncidents: (incidents: CrimeIncident[]) => void;
  addIncident: (incident: CrimeIncident) => void;
  addZone: (zone: GeoZone) => void;
  updateZone: (id: string, updates: Partial<GeoZone>) => void;
  toggleLayer: (id: string) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  selectIncident: (id: string | null) => void;
  importMockGeoData: () => void;
  fetchIncidents: () => Promise<void>;
  fetchZones: () => Promise<void>;
  saveIncident: (incident: Omit<CrimeIncident, 'id'>) => Promise<void>;
  saveZone: (zone: Omit<GeoZone, 'id'>) => Promise<void>;
}

export const useGeoStore = create<GeoState>((set, get) => ({
  incidents: [],
  zones: [],
  layers: [
    { id: 'heatmap', name: 'Mapa de Calor (GPU)', type: 'HEATMAP', visible: true, opacity: 0.8 },
    { id: 'markers', name: 'Incidentes Individuales', type: 'MARKERS', visible: true, opacity: 1 },
    { id: 'zones', name: 'Zonas de Inteligencia', type: 'ZONES', visible: true, opacity: 0.6 },
    { id: 'barrios', name: 'Límites de Barrios', type: 'BARRIOS', visible: false, opacity: 0.4 }
  ],
  filters: {
    crimeTypes: ['HOMICIDIO', 'NARCOTRAFICO', 'ROBO', 'MICROTRAFICO', 'LESIONES', 'AMENAZAS', 'OTROS'],
    dateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), new Date().toISOString()],
    minSeverity: 1,
    searchQuery: ''
  },
  selectedIncidentId: null,
  loading: false,

  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({ incidents: [...state.incidents, incident] })),
  addZone: (zone) => set((state) => ({ zones: [...state.zones, zone] })),
  updateZone: (id, updates) => set((state) => ({
    zones: state.zones.map(z => z.id === id ? { ...z, ...updates } : z)
  })),
  toggleLayer: (id) => set((state) => ({
    layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
  })),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  selectIncident: (id) => set({ selectedIncidentId: id }),

  fetchIncidents: async () => {
    if (!isSupabaseConfigured()) {
      get().importMockGeoData();
      return;
    }
    
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('geo_incidents')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching incidents:', error);
        get().importMockGeoData();
        return;
      }

      if (data && data.length > 0) {
        const mapped: CrimeIncident[] = data.map((row: any) => ({
          id: row.id,
          lat: row.lat,
          lng: row.lng,
          type: row.type,
          date: row.date,
          description: row.description || '',
          severity: row.severity || 3,
          classification: row.classification || 'RESERVADO',
          caseId: row.case_id,
        }));
        set({ incidents: mapped });
      } else {
        get().importMockGeoData();
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchZones: async () => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { data, error } = await supabase
        .from('geo_zones')
        .select('*');

      if (error) {
        console.error('Error fetching zones:', error);
        return;
      }

      if (data && data.length > 0) {
        const mapped: GeoZone[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          polygon: row.polygon,
          color: row.color || '#ff4d4f',
          active: row.active !== false,
          metadata: row.metadata || {},
        }));
        set({ zones: mapped });
      }
    } catch (err) {
      console.error('Error fetching zones:', err);
    }
  },

  saveIncident: async (incident) => {
    if (!isSupabaseConfigured()) {
      const newIncident: CrimeIncident = { ...incident, id: crypto.randomUUID() } as CrimeIncident;
      get().addIncident(newIncident);
      return;
    }

    const { error } = await supabase
      .from('geo_incidents')
      .insert({
        lat: incident.lat,
        lng: incident.lng,
        type: incident.type,
        date: incident.date,
        description: incident.description,
        severity: incident.severity,
        classification: incident.classification,
        case_id: incident.caseId,
      });

    if (error) {
      console.error('Error saving incident:', error);
      return;
    }
    await get().fetchIncidents();
  },

  saveZone: async (zone) => {
    if (!isSupabaseConfigured()) {
      const newZone: GeoZone = { ...zone, id: crypto.randomUUID() } as GeoZone;
      get().addZone(newZone);
      return;
    }

    const { error } = await supabase
      .from('geo_zones')
      .insert({
        name: zone.name,
        type: zone.type,
        polygon: zone.polygon,
        color: zone.color,
        active: zone.active,
        metadata: zone.metadata,
      });

    if (error) {
      console.error('Error saving zone:', error);
      return;
    }
    await get().fetchZones();
  },

  importMockGeoData: () => {
    const { incidents } = get();
    if (incidents.length > 0) return;

    const mockIncidents: CrimeIncident[] = [
      {
        id: 'inc-1',
        lat: -31.6265,
        lng: -60.7180,
        type: 'MICROTRAFICO',
        date: '2025-12-22T17:15:00Z',
        description: 'Bca: Artigas y Gaboto. Maniobras detectadas según Primer Informe.',
        severity: 4,
        classification: 'CONFIDENCIAL'
      },
      {
        id: 'inc-2',
        lat: -31.6240,
        lng: -60.7195,
        type: 'MICROTRAFICO',
        date: '2025-12-30T14:20:00Z',
        description: 'Bca: Centenera 4511. Punto de acopio identificado.',
        severity: 5,
        classification: 'CONFIDENCIAL'
      },
      {
        id: 'inc-3',
        lat: -31.6285,
        lng: -60.7115,
        type: 'MICROTRAFICO',
        date: '2025-12-20T10:00:00Z',
        description: 'Bca: Domingo Silva 3900. Zona de ventas recurrente.',
        severity: 3,
        classification: 'RESERVADO'
      },
      {
        id: 'inc-4',
        lat: -31.6280,
        lng: -60.7150,
        type: 'ROBO',
        date: '2025-12-25T22:30:00Z',
        description: 'Pte Perón 3988. Robo con arma en inmediaciones.',
        severity: 4,
        classification: 'RESERVADO'
      }
    ];

    const types: CrimeType[] = ['HOMICIDIO', 'NARCOTRAFICO', 'ROBO', 'MICROTRAFICO', 'LESIONES', 'AMENAZAS'];
    
    const baseLat = -31.633;
    const baseLng = -60.72;

    for (let i = 5; i < 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      mockIncidents.push({
        id: `geo-${i}`,
        lat: baseLat + (Math.random() - 0.5) * 0.1,
        lng: baseLng + (Math.random() - 0.5) * 0.1,
        type,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Incidente de ${type.toLowerCase()} reportado en patrullaje preventivo.`,
        severity: (Math.floor(Math.random() * 5) + 1) as any,
        classification: 'CONFIDENCIAL'
      });
    }

    set({ incidents: mockIncidents });

    const mockZones: GeoZone[] = [
      {
        id: 'z1',
        name: 'Sector Priorizado: Barranquitas Oeste',
        type: 'ZONA_CALIENTE',
        polygon: [
          [-31.623, -60.720],
          [-31.623, -60.710],
          [-31.630, -60.710],
          [-31.630, -60.720]
        ],
        color: '#ff4d4f',
        active: true,
        metadata: { prioridad: 'ALTA', informe: 'Insumo Microtráfico 2026' }
      },
      {
        id: 'z2',
        name: 'Influencia "La Negrada"',
        type: 'TERRITORIO',
        polygon: [
          [-31.620, -60.730],
          [-31.620, -60.720],
          [-31.625, -60.720],
          [-31.625, -60.730]
        ],
        color: '#faad14',
        active: true,
        metadata: { banda: 'La Negrada' }
      }
    ];

    set({ zones: mockZones });
  }
}));
