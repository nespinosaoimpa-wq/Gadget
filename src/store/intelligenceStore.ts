import { create } from 'zustand';
import Graph from 'graphology';
import { supabase } from '../lib/supabaseClient';
import type { AnyEntity, GraphEdge, PersonEntity, OrgEntity } from '../types/intelligenceTypes';

interface IntelligenceState {
  graph: Graph;
  entities: Map<string, AnyEntity>;
  edges: GraphEdge[];
  selectedEntityId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addEntity: (entity: AnyEntity) => void;
  addEdge: (edge: GraphEdge) => void;
  selectEntity: (id: string | null) => void;
  fetchIntelligence: () => Promise<void>;
  syncWithSupabase: () => Promise<void>;
  importMockData: () => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  graph: new Graph(),
  entities: new Map(),
  edges: [],
  selectedEntityId: null,
  isLoading: false,
  error: null,

  addEntity: (entity) => {
    const { graph, entities } = get();
    if (!graph.hasNode(entity.id)) {
      graph.addNode(entity.id, { ...entity });
      const newEntities = new Map(entities);
      newEntities.set(entity.id, entity);
      set({ entities: newEntities });
    }
  },

  addEdge: (edge) => {
    const { graph, edges } = get();
    if (!graph.hasEdge(edge.id)) {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdgeWithKey(edge.id, edge.source, edge.target, { ...edge });
        set({ edges: [...edges, edge] });
      }
    }
  },

  selectEntity: (id) => set({ selectedEntityId: id }),

  fetchIntelligence: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: entityData, error: entityError } = await supabase
        .from('intelligence_entities')
        .select('*');

      if (entityError) throw entityError;

      const { data: relData, error: relError } = await supabase
        .from('intelligence_relationships')
        .select('*');

      if (relError) throw relError;

      const newGraph = new Graph();
      const newEntities = new Map<string, AnyEntity>();

      // Load Entities
      entityData?.forEach(row => {
        const entity: AnyEntity = {
          id: row.id,
          entityType: row.entity_type,
          label: row.label,
          source: row.source,
          classification: row.classification,
          verificationLevel: row.verification_level || 'SUGERIDO',
          reliabilityScore: row.reliability_score || 5,
          analyticalNotes: row.analytical_notes,
          milestones: row.milestones || [],
          createdAt: row.created_at,
          metadata: row.metadata || {},
          ...row.data // Spread entity-specific data (dni, aliases, hierarchy, etc.)
        };
        newEntities.set(entity.id, entity);
        newGraph.addNode(entity.id, { ...entity });
      });

      // Load Edges
      const newEdges: GraphEdge[] = relData?.map(row => ({
        id: row.id,
        source: row.source_id,
        target: row.target_id,
        relationType: row.relation_type,
        confidence: row.confidence,
        verificationLevel: row.verification_level || 'SUGERIDO',
        sourceInfo: row.source_info,
        dateDetected: row.date_detected,
        metadata: row.metadata || {}
      })) || [];

      newEdges.forEach(edge => {
        if (newGraph.hasNode(edge.source) && newGraph.hasNode(edge.target)) {
          newGraph.addEdgeWithKey(edge.id, edge.source, edge.target, { ...edge });
        }
      });

      set({ entities: newEntities, edges: newEdges, graph: newGraph, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  syncWithSupabase: async () => {
    const { entities, edges } = get();
    if (entities.size === 0) return;

    set({ isLoading: true });

    try {
      // Upsert Entities
      const entityPayload = Array.from(entities.values()).map(e => ({
        id: e.id,
        entity_type: e.entityType,
        label: e.label,
        source: e.source,
        classification: e.classification,
        verification_level: e.verificationLevel,
        reliability_score: e.reliabilityScore,
        analytical_notes: e.analyticalNotes,
        milestones: e.milestones || [],
        metadata: e.metadata || {},
        data: {
          ...Object.fromEntries(
            Object.entries(e).filter(([key]) => 
              !['id', 'entityType', 'label', 'source', 'classification', 'metadata', 'createdAt', 'verificationLevel', 'reliabilityScore', 'analyticalNotes', 'milestones'].includes(key)
            )
          )
        }
      }));

      const { error: entityError } = await supabase
        .from('intelligence_entities')
        .upsert(entityPayload, { onConflict: 'id' });

      if (entityError) throw entityError;

      // Upsert Relationships
      const relPayload = edges.map(e => ({
        id: e.id,
        source_id: e.source,
        target_id: e.target,
        relation_type: e.relationType,
        confidence: e.confidence,
        verification_level: e.verificationLevel,
        source_info: e.sourceInfo,
        date_detected: e.dateDetected,
        metadata: e.metadata || {}
      }));

      const { error: relError } = await supabase
        .from('intelligence_relationships')
        .upsert(relPayload, { onConflict: 'id' });

      if (relError) throw relError;

      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  importMockData: () => {
    const { addEntity, addEdge } = get();
    
    // ORGANIZACIONES (BANDAS)
    const organizations: OrgEntity[] = [
      {
        id: 'org-negrada',
        entityType: 'ORGANIZACION',
        label: 'La Negrada',
        orgType: 'BANDA',
        territory: 'Barrio Barranquitas / Villa del Parque',
        source: 'MPA-SANTA-FE',
        classification: 'RESERVADO',
        verificationLevel: 'VERIFICADO',
        reliabilityScore: 8,
        createdAt: new Date().toISOString(),
        hierarchy: [
          { personId: 'pn-zabala-jon', rank: 'JEFE', role: 'Líder Operativo' },
          { personId: 'tp-bordon', rank: 'SEGUNDO', role: 'Logística Armas' }
        ],
        milestones: [
          { id: 'm1', type: 'IDENTIFICACION', date: '2025-06-15', description: 'Identificación inicial tras homicidios en Barranquitas', verifiedBy: 'Analista 01' },
          { id: 'm2', type: 'ANALISIS_SNA', date: '2025-12-20', description: 'Mapeo de red con 12 nodos vinculados', verifiedBy: 'SIGIC Core' }
        ]
      },
      {
        id: 'org-siempre',
        entityType: 'ORGANIZACION',
        label: 'Los de Siempre',
        orgType: 'BANDA',
        territory: 'San Pantaleón / San Lorenzo',
        source: 'TRI-SANTA-FE',
        classification: 'RESERVADO',
        verificationLevel: 'INFERIDO',
        reliabilityScore: 6,
        createdAt: new Date().toISOString(),
        hierarchy: []
      }
    ];

    // PERSONAS - TARGETS PRIORITARIOS (BARRANQUITAS)
    const targetsBarranquitas: PersonEntity[] = [
      { 
        id: 'tp-bordon', 
        entityType: 'PERSONA', 
        label: 'Bordon', 
        aliases: ['Bordon'], 
        source: 'SEGUNDO INFORME - Bca', 
        classification: 'CONFIDENCIAL', 
        verificationLevel: 'VERIFICADO',
        reliabilityScore: 9,
        createdAt: new Date().toISOString(), 
        criminalRecord: [],
        metadata: { investigationPhase: 2, priority: 'ALTA', neighborhood: 'Barranquitas' },
        milestones: [
          { id: 'm1-b', type: 'VIGILANCIA', date: '2025-12-23', description: 'Observado en punto de venta Artigas y Gaboto', verifiedBy: 'PDI SF' },
          { id: 'm2-b', type: 'IDENTIFICACION', date: '2025-12-30', description: 'Confirmado por testigos de identidad reservada', verifiedBy: 'Ministerio Público' }
        ]
      },
      { 
        id: 'tp-cueva', 
        entityType: 'PERSONA', 
        label: 'Cueva', 
        aliases: ['Cueva'], 
        source: 'SEGUNDO INFORME - Bca', 
        classification: 'CONFIDENCIAL', 
        verificationLevel: 'INFERIDO',
        reliabilityScore: 7,
        createdAt: new Date().toISOString(), 
        criminalRecord: [],
        metadata: { investigationPhase: 2, priority: 'ALTA', neighborhood: 'Barranquitas' }
      }
    ];

    const allEntities = [...organizations, ...targetsBarranquitas];
    allEntities.forEach(e => addEntity(e as AnyEntity));

    // VINCULOS
    const edges: GraphEdge[] = [
      { 
        id: 'e-neg-2', 
        source: 'tp-bordon', 
        target: 'org-negrada', 
        relationType: 'MIEMBRO_DE', 
        confidence: 0.8, 
        verificationLevel: 'VERIFICADO',
        sourceInfo: 'Fuerzas de Seguridad / Informantes', 
        dateDetected: '2025-12-01' 
      },
      { 
        id: 'e-conf-1', 
        source: 'org-negrada', 
        target: 'org-siempre', 
        relationType: 'VINCULADO_A', 
        confidence: 0.9, 
        verificationLevel: 'INFERIDO',
        sourceInfo: 'Cruce de Incidencias 2026', 
        dateDetected: '2026-01-10' 
      }
    ];

    // --- TRATA DE PERSONAS DATA ---
    const trataEntities: PersonEntity[] = [
      {
        id: 'suj-101',
        entityType: 'PERSONA',
        label: 'Persona A (Víctima)',
        aliases: ['Víctima 01'],
        source: 'RESUMEN-TRATA-NTE',
        classification: 'CONFIDENCIAL',
        verificationLevel: 'VERIFICADO',
        reliabilityScore: 9,
        createdAt: new Date().toISOString(),
        criminalRecord: ['trata-1'],
        metadata: { status: 'Asistida', caseId: 'trata-1' }
      },
      {
        id: 'suj-102',
        entityType: 'PERSONA',
        label: 'Persona B (Sospechoso)',
        aliases: ['Alias B'],
        source: 'RESUMEN-TRATA-NTE',
        classification: 'RESERVADO',
        verificationLevel: 'INFERIDO',
        reliabilityScore: 7,
        createdAt: new Date().toISOString(),
        criminalRecord: ['trata-1'],
        metadata: { status: 'Bajo Vigilancia', caseId: 'trata-1' }
      },
      {
        id: 'suj-103',
        entityType: 'PERSONA',
        label: 'Persona C (Testigo)',
        aliases: ['Testigo Clave'],
        source: 'RESUMEN-TRATA-442',
        classification: 'CONFIDENCIAL',
        verificationLevel: 'VERIFICADO',
        reliabilityScore: 8,
        createdAt: new Date().toISOString(),
        criminalRecord: ['trata-2'],
        metadata: { status: 'Protegido', caseId: 'trata-2' }
      }
    ];

    trataEntities.forEach(e => addEntity(e as AnyEntity));

    const trataEdges: GraphEdge[] = [
      {
        id: 'rel-102-101',
        source: 'suj-102',
        target: 'suj-101',
        relationType: 'FAMILIAR',
        confidence: 1.0,
        verificationLevel: 'VERIFICADO',
        sourceInfo: 'Registro Civil / Declaraciones',
        dateDetected: '2024-03-27',
        metadata: { role: 'Cónyuge' }
      },
      {
        id: 'rel-102-trata1',
        source: 'suj-102',
        target: 'trata-1',
        relationType: 'SOSPECHOSO_DE',
        confidence: 0.8,
        verificationLevel: 'INFERIDO',
        sourceInfo: 'Inteligencia Operativo Norte',
        dateDetected: '2024-03-27'
      }
    ];

    trataEdges.forEach(e => addEdge(e));

    // --- END TRATA DE PERSONAS DATA ---
    edges.forEach(e => addEdge(e));
  }
}));
