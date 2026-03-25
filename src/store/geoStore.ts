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
  syncWithSupabase: () => Promise<void>;
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

  syncWithSupabase: async () => {
    const { incidents, zones } = get();
    if (incidents.length === 0 && zones.length === 0) return;

    set({ loading: true });
    try {
      if (incidents.length > 0) {
        const incidentPayload = incidents.map(inc => ({
          id: inc.id.startsWith('geo-') || inc.id.startsWith('inc-') ? undefined : inc.id,
          lat: inc.lat,
          lng: inc.lng,
          type: inc.type,
          date: inc.date,
          description: inc.description,
          severity: inc.severity,
          classification: inc.classification,
          case_id: inc.caseId
        }));

        const { error: incError } = await supabase
          .from('geo_incidents')
          .upsert(incidentPayload.filter(p => p.id), { onConflict: 'id' });
        
        // For new ones (mock IDs), we might want to insert without ID to let Supabase generate UUIDs
        const newIncidents = incidentPayload.filter(p => !p.id);
        if (newIncidents.length > 0) {
          const { error: newIncError } = await supabase
            .from('geo_incidents')
            .insert(newIncidents.map(({ id, ...rest }) => rest));
          if (newIncError) throw newIncError;
        }

        if (incError) throw incError;
      }

      if (zones.length > 0) {
        const zonePayload = zones.map(z => ({
          id: z.id.startsWith('z') ? undefined : z.id,
          name: z.name,
          type: z.type,
          polygon: z.polygon,
          color: z.color,
          active: z.active,
          metadata: z.metadata
        }));

        const { error: zoneError } = await supabase
          .from('geo_zones')
          .upsert(zonePayload.filter(p => p.id), { onConflict: 'id' });

        const newZones = zonePayload.filter(p => !p.id);
        if (newZones.length > 0) {
          await supabase.from('geo_zones').insert(newZones.map(({ id, ...rest }) => rest));
        }

        if (zoneError) throw zoneError;
      }
    } catch (err) {
      console.error('Error syncing geo data:', err);
    } finally {
      set({ loading: false });
    }
  },

  importMockGeoData: () => {
    const { incidents } = get();
    if (incidents.length > 5) return;

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
        lat: -31.6110,
        lng: -60.7050,
        type: 'MICROTRAFICO',
        date: '2026-01-05T11:30:00Z',
        description: 'San Pantaleón: Intercepción de pasamanos recurrente.',
        severity: 4,
        classification: 'RESERVADO'
      },
      {
        id: 'inc-5',
        lat: -31.5850,
        lng: -60.7020,
        type: 'MICROTRAFICO',
        date: '2026-01-12T16:45:00Z',
        description: 'Recreo: Domicilio de interés (Leguizamón).',
        severity: 5,
        classification: 'CONFIDENCIAL'
      }
    ];

    const types: CrimeType[] = ['HOMICIDIO', 'NARCOTRAFICO', 'ROBO', 'MICROTRAFICO', 'LESIONES', 'AMENAZAS'];
    const baseLat = -31.633;
    const baseLng = -60.72;

    for (let i = 6; i < 60; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      mockIncidents.push({
        id: `geo-${i}`,
        lat: baseLat + (Math.random() - 0.5) * 0.12,
        lng: baseLng + (Math.random() - 0.5) * 0.12,
        type,
        date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Incidente de ${type.toLowerCase()} registrado en sistema 911/Informes.`,
        severity: (Math.floor(Math.random() * 5) + 1) as any,
        classification: 'RESERVADO'
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
        metadata: { 
          prioridad: 'CRÍTICA', 
          informe: 'INT-BCA-2026-004', 
          banda: 'La Negrada',
          contexto: 'Eje de alta conflictividad por control de puntos de acopio en Artigas y Gaboto. Se registra desplazamiento forzado de familias y uso de sicariato para "ablande" de comercios locales. El nodo Bordon opera como nexo logístico en este sector.',
          puntosCriticos: 'Artigas y Gaboto, Centenera 4511',
          ultimoHito: 'Operativo "Barranquitas Limpio" (Diciembre 2025)'
        }
      },
      {
        id: 'z2',
        name: 'Influencia "Los de Siempre"',
        type: 'TERRITORIO',
        polygon: [
          [-31.615, -60.710],
          [-31.615, -60.700],
          [-31.620, -60.700],
          [-31.620, -60.710]
        ],
        color: '#faad14',
        active: true,
        metadata: { 
          banda: 'Los de Siempre', 
          territorio: 'San Pantaleón',
          contexto: 'Zona de expansión territorial. Se observa una mutación del modus operandi: de robos calificados a microtráfico estático. Conflicto latente con remanentes de "Los Millonarios".',
          puntosCriticos: 'Pasaje Irala, Intercepción 9 de Julio',
          prioridad: 'ALTA'
        }
      },
      {
        id: 'z3',
        name: 'Foco Norte: Clan Leguizamón',
        type: 'ZONA_CALIENTE',
        polygon: [
          [-31.580, -60.705],
          [-31.580, -60.695],
          [-31.590, -60.695],
          [-31.590, -60.705]
        ],
        color: '#fa541c',
        active: true,
        metadata: { 
          banda: 'Aceiteros (Leguizamón)', 
          operacion: 'Castañaduy 6807',
          contexto: 'Estructura familiar piramidal. Utilizan empresas de fachada para lavado de activos de baja escala. Se detectó flujo de telefonía desde unidades penitenciarias hacia este sector.',
          prioridad: 'MEDIA-ALTA'
        }
      }
    ];

    set({ zones: mockZones });
  }
}));
