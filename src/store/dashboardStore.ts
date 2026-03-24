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
    { type: 'Microtráfico', count: 142, color: 'var(--accent-red)' },
    { type: 'Narcotráfico (Federal)', count: 45, color: 'var(--accent-green)' },
    { type: 'Homicidios', count: 28, color: 'var(--primary-blue)' },
    { type: 'Robos Calificados', count: 84, color: 'var(--primary-cyan)' },
    { type: 'Otros', count: 32, color: 'var(--text-muted)' },
  ],
  crimeByZone: [
    { zone: 'Barranquitas', count: 58 },
    { zone: 'C. Dorrego', count: 42 },
    { zone: 'San Lorenzo', count: 35 },
    { zone: 'Alto Verde', count: 29 },
    { zone: 'Guadalupe Oeste', count: 24 },
  ],
  timeline: [
    { id: '1', date: '2025-12-30 14:20', event: 'Allanamiento: Centenera 4511 (Bca Oeste)', module: 'Microtráfico', severity: 'critical' },
    { id: '2', date: '2025-12-22 17:15', event: 'Secuestro Estupefacientes: Artigas y Gaboto', module: 'Operaciones', severity: 'warning' },
    { id: '3', date: '2025-12-21 16:40', event: 'Identificación: Miembro "La Negrada"', module: 'Inteligencia', severity: 'info' },
    { id: '4', date: '2025-12-20 15:20', event: 'Priorización Sector Domingo Silva 3900', module: 'Fiscalía', severity: 'info' },
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
