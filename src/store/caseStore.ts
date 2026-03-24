import { create } from 'zustand';
import type { Case } from '../types/case';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface CaseStore {
  cases: Case[];
  activeCase: Case | null;
  loading: boolean;
  setCases: (cases: Case[]) => void;
  setActiveCase: (caseItem: Case | null) => void;
  addCase: (caseItem: Case) => void;
  updateCaseStatus: (id: string, status: Case['status']) => void;
  fetchCases: () => Promise<void>;
  createCase: (caseItem: Omit<Case, 'id'>) => Promise<void>;
}

// Mock data fallback
const mockCases: Case[] = [
  {
    id: '1',
    cuij: '21-09873456-2',
    title: 'Insumo Microtráfico - Barranquitas Oeste',
    description: 'Investigación basada en incidencias priorizadas de fines de 2025. Puntos calientes en Gaboto, Artigas y Domingo Silva.',
    type: 'NARCOTRÁFICO',
    status: 'EN INVESTIGACIÓN',
    classification: 'CONFIDENCIAL',
    fiscal: 'Dr. Martínez',
    fiscalia: 'Microtráfico Santa Fe',
    startDate: '2025-12-01',
    incidentDate: '2025-12-15',
    location: { address: 'Barranquitas, Santa Fe Capital', lat: -31.626, lng: -60.718 },
    persons: [
      { id: 'p1', name: 'Maidana, P.', role: 'IMPUTADO', alias: 'Polaco', status: 'IDENTIFICADO' }
    ],
    tags: ['Barranquitas', 'Insumo', 'Santa Fe']
  },
  {
    id: '2',
    cuij: '21-12344556-9',
    title: 'Organización - Los de Siempre',
    description: 'Análisis de red de distribución en San Lorenzo y San Pantaleón.',
    type: 'NARCOTRÁFICO',
    status: 'PRELIMINAR',
    classification: 'RESERVADO',
    fiscal: 'Dra. Sanchez',
    fiscalia: 'Microtráfico Santa Fe',
    startDate: '2026-01-10',
    persons: [],
    tags: ['San Lorenzo', 'Los de Siempre']
  }
];

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: mockCases,
  activeCase: null,
  loading: false,
  
  setCases: (cases) => set({ cases }),
  setActiveCase: (caseItem) => set({ activeCase: caseItem }),
  addCase: (caseItem) => set((state) => ({ cases: [caseItem, ...state.cases] })),
  updateCaseStatus: (id, status) => set((state) => ({
    cases: state.cases.map(c => c.id === id ? { ...c, status } : c)
  })),

  fetchCases: async () => {
    if (!isSupabaseConfigured()) return; // Use mock data
    
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cases:', error);
        return;
      }

      if (data && data.length > 0) {
        const mapped: Case[] = data.map((row: any) => ({
          id: row.id,
          cuij: row.cuij || '',
          title: row.title,
          description: row.description || '',
          type: row.type,
          status: row.status,
          classification: row.classification || 'RESERVADO',
          fiscal: row.fiscal || '',
          fiscalia: row.fiscalia || '',
          startDate: row.start_date || '',
          incidentDate: row.incident_date || '',
          location: row.location || undefined,
          persons: row.persons || [],
          tags: row.tags || []
        }));
        set({ cases: mapped });
      }
    } finally {
      set({ loading: false });
    }
  },

  createCase: async (caseItem) => {
    if (!isSupabaseConfigured()) {
      // Offline mode: add locally
      const newCase: Case = { ...caseItem, id: crypto.randomUUID() } as Case;
      get().addCase(newCase);
      return;
    }

    const { data, error } = await supabase
      .from('cases')
      .insert({
        cuij: caseItem.cuij,
        title: caseItem.title,
        description: caseItem.description,
        type: caseItem.type,
        status: caseItem.status,
        classification: caseItem.classification,
        fiscal: caseItem.fiscal,
        fiscalia: caseItem.fiscalia,
        start_date: caseItem.startDate,
        incident_date: caseItem.incidentDate,
        location: caseItem.location,
        persons: caseItem.persons,
        tags: caseItem.tags,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating case:', error);
      return;
    }

    if (data) {
      await get().fetchCases();
    }
  }
}));
