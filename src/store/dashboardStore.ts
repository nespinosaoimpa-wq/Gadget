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
    activeCases: 124,
    clearanceRate: 68,
    expiredDeadlines: 12,
    activeOperations: 8,
    weeklyTrend: [45, 52, 48, 61, 55, 67, 72]
  },
  crimeByType: [
    { type: 'Homicidios', count: 42, color: 'var(--accent-red)' },
    { type: 'Narcotráfico', count: 85, color: 'var(--accent-green)' },
    { type: 'Robos Alt. Impacto', count: 64, color: 'var(--primary-cyan)' },
    { type: 'Armas', count: 31, color: 'var(--primary-blue)' },
    { type: 'Otros', count: 18, color: 'var(--text-muted)' },
  ],
  crimeByZone: [
    { zone: 'Macrocentro', count: 25 },
    { zone: 'Zona Norte', count: 42 },
    { zone: 'Zona Sur', count: 58 },
    { zone: 'Zona Oeste', count: 31 },
    { zone: 'V.G. Gálvez', count: 19 },
  ],
  timeline: [
    { id: '1', date: '2024-03-22 18:30', event: 'Nuevo allanamiento solicitado', module: 'Allanamientos', severity: 'info' },
    { id: '2', date: '2024-03-22 17:15', event: 'Plazo procesal vencido: Causa 21-029', module: 'Fiscalía', severity: 'critical' },
    { id: '3', date: '2024-03-22 16:40', event: 'Evidencia de campo capturada', module: 'Operaciones', severity: 'info' },
    { id: '4', date: '2024-03-22 15:20', event: 'Sujeto "El Piraña" vinculado a Causa Narco', module: 'Inteligencia', severity: 'warning' },
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
