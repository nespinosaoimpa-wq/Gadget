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
    cuij: '12-345678-9',
    title: 'Banda de Las Flores - Infracción Ley 23737',
    description: 'Investigación sobre red de distribución de estupefacientes en el barrio Las Flores, Rosario.',
    type: 'NARCOTRÁFICO',
    status: 'EN INVESTIGACIÓN',
    classification: 'RESERVADO',
    fiscal: 'Dr. Martínez',
    fiscalia: 'Fiscalía de Narcotráfico - Rosario',
    startDate: '2024-01-15',
    incidentDate: '2024-01-10',
    location: { address: 'Bv. Seguí 3400, Rosario', lat: -32.987, lng: -60.654 },
    persons: [
      { id: 'p1', name: 'Cantero, M.A.', role: 'IMPUTADO', alias: 'El Viejo', status: 'DETENIDO' },
      { id: 'p2', name: 'Rodríguez, J.C.', role: 'IMPUTADO', status: 'PRÓFUGO' }
    ],
    tags: ['Las Flores', 'Bunker', 'Distribución']
  },
  {
    id: '2',
    cuij: '21-987654-3',
    title: 'Homicidio Calificado - Calle La Tablada',
    description: 'Investigación por hecho de sangre ocurrido en la zona sur de Rosario.',
    type: 'HOMICIDIO',
    status: 'RECIBIDA',
    classification: 'SECRETO',
    fiscal: 'Dra. Sanchez',
    fiscalia: 'Homicidios Dolosos',
    startDate: '2024-03-10',
    persons: [],
    tags: ['Homicidio', 'Ajuste de cuentas']
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
