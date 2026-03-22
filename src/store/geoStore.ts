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

    const mockIncidents: CrimeIncident[] = [];
    const types: CrimeType[] = ['HOMICIDIO', 'NARCOTRAFICO', 'ROBO', 'MICROTRAFICO', 'LESIONES', 'AMENAZAS'];
    
    const baseLat = -32.9442;
    const baseLng = -60.6505;

    for (let i = 0; i < 60; i++) {
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
        name: 'Territorio Clan Cantero (Granada)',
        type: 'TERRITORIO',
        polygon: [
          [-32.99, -60.64],
          [-32.99, -60.63],
          [-33.00, -60.63],
          [-33.00, -60.64]
        ],
        color: '#ff4d4f',
        active: true,
        metadata: { banda: 'Los Monos' }
      },
      {
        id: 'z2',
        name: 'Zona Caliente Microcentro',
        type: 'ZONA_CALIENTE',
        polygon: [
          [-32.94, -60.65],
          [-32.94, -60.64],
          [-32.95, -60.64],
          [-32.95, -60.65]
        ],
        color: '#faad14',
        active: true
      }
    ];

    set({ zones: mockZones });
  }
}));
