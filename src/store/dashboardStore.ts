import { create } from 'zustand';

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

export const useDashboardStore = create<DashboardState>((set) => ({
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
    set({ loading: true });
    try {
      // En una implementación real, aquí haríamos consultas paralelas a Supabase
      // query 1: count cases where status = 'active'
      // query 2: calculate clearance rate
      // query 3: count expired deadlines in legal_deadlines table
      
      // Simulamos un pequeño delay para demostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
