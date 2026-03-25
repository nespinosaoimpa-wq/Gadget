import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface DashboardState {
  kpis: {
    activeCases: number;
    clearanceRate: number;
    expiredDeadlines: number;
    activeOperations: number;
    weeklyTrend: number[];
  };
  crimeByType: { type: string; count: number; color: string }[];
  crimeByZone: { zone: string; count: number }[];
  timeline: { id: string; date: string; event: string; module: string; severity: 'info' | 'warning' | 'critical' }[];
  loading: boolean;
  error: string | null;
  
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  kpis: {
    activeCases: 258,
    clearanceRate: 72,
    expiredDeadlines: 18,
    activeOperations: 14,
    weeklyTrend: [65, 72, 78, 85, 82, 94, 98]
  },
  crimeByType: [
    { type: 'Microtráfico', count: 482, color: 'var(--accent-red)' },
    { type: 'Narcotráfico (Federal)', count: 125, color: 'var(--accent-green)' },
    { type: 'Homicidios', count: 42, color: 'var(--primary-blue)' },
    { type: 'Robos Calificados', count: 156, color: 'var(--primary-cyan)' },
    { type: 'Otros', count: 64, color: 'var(--text-muted)' },
  ],
  crimeByZone: [
    { zone: 'Barranquitas', count: 124 },
    { zone: 'San Pantaleón', count: 98 },
    { zone: 'San Lorenzo', count: 86 },
    { zone: 'Recreo', count: 64 },
    { zone: 'C. Dorrego', count: 52 },
  ],
  timeline: [
    { id: '1', date: '2026-01-14 09:15', event: 'Actualización Dossier: Zabala Jon Nelson', module: 'Inteligencia', severity: 'info' },
    { id: '2', date: '2026-01-12 16:40', event: 'Vigilancia Detectada: Gaboto 4500', module: 'Operaciones', severity: 'critical' },
    { id: '3', date: '2026-01-10 14:20', event: 'Conflicto Detectado: Negrada vs Siempre (San Pantaleón)', module: 'Microtráfico', severity: 'warning' },
    { id: '4', date: '2026-01-08 10:00', event: 'Solicitud Órdenes: Castañaduy 6807', module: 'Fiscalía', severity: 'info' },
  ],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    if (!isSupabaseConfigured()) return;

    set({ loading: true });
    try {
      // 1. Fetch Case Count
      const { count: activeCasesCount } = await supabase
        .from('intelligence_entities')
        .select('*', { count: 'exact', head: true })
        .eq('entity_type', 'CAUSA');

      // 2. Fetch Incidents for Distribution
      const { data: incidentData } = await supabase
        .from('geo_incidents')
        .select('type, severity, date');

      // 3. Fetch Recent Intelligence Activity
      const { data: recentEntities } = await supabase
        .from('intelligence_entities')
        .select('id, label, entity_type, created_at, verification_level')
        .order('created_at', { ascending: false })
        .limit(5);

      // Process Incident Distribution
      const typesMap: Record<string, number> = {};
      const zonesMap: Record<string, number> = {
        'Barranquitas': 0,
        'San Pantaleón': 0,
        'San Lorenzo': 0,
        'Villa del Parque': 0,
        'Otros': 0
      };

      incidentData?.forEach(inc => {
        typesMap[inc.type] = (typesMap[inc.type] || 0) + 1;
        // Mock zone assignment based on lat/lng if we had neighborhood polygons, 
        // for now we'll use a weighted random or metadata if we had it.
      });

      const typesList = Object.entries(typesMap).map(([type, count]) => ({
        type,
        count,
        color: type === 'MICROTRAFICO' ? 'var(--accent-red)' : 'var(--primary-cyan)'
      }));

      // Process Timeline
      const timelineData = recentEntities?.map(e => ({
        id: e.id,
        date: new Date(e.created_at).toLocaleString(),
        event: `Entidad Actualizada: ${e.label} (${e.verification_level})`,
        module: 'Inteligencia',
        severity: (e.verification_level === 'CONFIRMADO' ? 'info' : 'warning') as any
      })) || [];

      set({ 
        kpis: {
          ...get().kpis,
          activeCases: activeCasesCount || 0,
        },
        crimeByType: typesList.length > 0 ? typesList : get().crimeByType,
        timeline: timelineData.length > 0 ? timelineData : get().timeline,
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
