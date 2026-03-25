import { create } from 'zustand';
import Graph from 'graphology';
import { supabase } from '../lib/supabaseClient';
import type { AnyEntity, GraphEdge, PersonEntity, VehicleEntity, OrgEntity, LocationEntity } from '../types/intelligenceTypes';

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
        metadata: e.metadata || {},
        data: {
          ...Object.fromEntries(
            Object.entries(e).filter(([key]) => 
              !['id', 'entityType', 'label', 'source', 'classification', 'metadata', 'createdAt'].includes(key)
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
        createdAt: new Date().toISOString(),
        hierarchy: [
          { personId: 'pn-zabala-jon', rank: 'JEFE', role: 'Líder Operativo' },
          { personId: 'tp-bordon', rank: 'SEGUNDO', role: 'Logística Armas' }
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
        createdAt: new Date().toISOString(),
        hierarchy: []
      },
      {
        id: 'org-correntino',
        entityType: 'ORGANIZACION',
        label: 'Banda Correntino',
        orgType: 'BANDA',
        territory: 'Sante Fe Capital / Conexión Corrientes',
        source: 'INTELIGENCIA-SF',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString(),
        hierarchy: []
      },
      {
        id: 'org-aceitero',
        entityType: 'ORGANIZACION',
        label: 'El Aceitero (Clan Leguizamón)',
        orgType: 'CLAN',
        territory: 'Zona Norte / Recreo',
        source: 'DGI-SANTA-FE',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString(),
        hierarchy: []
      }
    ];

    // PERSONAS - LA NEGRADA
    const personasNegrada: PersonEntity[] = [
      { id: 'pn-zabala-jon', entityType: 'PERSONA', label: 'Zabala Jon Nelson', aliases: ['Jon'], criminalRecord: ['exp-2025-01'], source: 'Dossier Microtráfico', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString() },
      { id: 'pn-bergallo-ig', entityType: 'PERSONA', label: 'Bergallo Ignacio', aliases: ['Nacho'], source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), criminalRecord: [] },
      { id: 'pn-rios-cam', entityType: 'PERSONA', label: 'Rios Camila', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
    ];

    // PERSONAS - LOS DE SIEMPRE
    const personasSiempre: PersonEntity[] = [
      { id: 'ps-celer-walter', entityType: 'PERSONA', label: 'Celer Walter Damian', aliases: ['Celer'], source: 'Dossier Microtráfico', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), criminalRecord: [] },
      { id: 'ps-pasculli-bruno', entityType: 'PERSONA', label: 'Bruno Pasculli', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-leiva-brian', entityType: 'PERSONA', label: 'Leiva Brian', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
    ];

    // PERSONAS - OTRAS BANDAS
    const personasOtras: PersonEntity[] = [
      { id: 'po-alviso-pri', entityType: 'PERSONA', label: 'Alviso Priscila Daiana', source: 'Banda Correntino', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'po-leguizamon-dar', entityType: 'PERSONA', label: 'Leguizamon Dardo Gabriel', aliases: ['Aceitero'], source: 'Aceiteros', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), criminalRecord: [] },
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
        createdAt: new Date().toISOString(), 
        criminalRecord: [],
        metadata: { investigationPhase: 2, priority: 'ALTA', neighborhood: 'Barranquitas' }
      },
      { 
        id: 'tp-cueva', 
        entityType: 'PERSONA', 
        label: 'Cueva', 
        aliases: ['Cueva'], 
        source: 'SEGUNDO INFORME - Bca', 
        classification: 'CONFIDENCIAL', 
        createdAt: new Date().toISOString(), 
        criminalRecord: [],
        metadata: { investigationPhase: 2, priority: 'ALTA', neighborhood: 'Barranquitas' }
      },
      { 
        id: 'tp-ali', 
        entityType: 'PERSONA', 
        label: 'Ali', 
        aliases: ['Ali'], 
        source: 'SEGUNDO INFORME - Bca', 
        classification: 'CONFIDENCIAL', 
        createdAt: new Date().toISOString(), 
        criminalRecord: [],
        metadata: { investigationPhase: 2, priority: 'MEDIA', neighborhood: 'Barranquitas' }
      }
    ];

    // VEHICULOS
    const vehicles: VehicleEntity[] = [
      { id: 'v1', entityType: 'VEHICULO', label: 'Honda Tornado (123 ABC)', plate: '123ABC', make: 'Honda', model: 'Tornado', color: 'Rojo/Blanco', source: 'LPR-BARRANQUITAS', createdAt: new Date().toISOString(), classification: 'USO INTERNO' },
      { id: 'v3', entityType: 'VEHICULO', label: 'Prisma Blanco (AD 165 RV)', plate: 'AD165RV', make: 'Chevrolet', model: 'Prisma', color: 'Blanco', source: 'Polaco Maidana', createdAt: new Date().toISOString(), classification: 'RESERVADO' },
    ];

    // UBICACIONES TACTICAS (PUNTOS DE VENTA / ACOPIO)
    const tacticLocations: LocationEntity[] = [
      {
        id: 'loc-artigas-gaboto',
        entityType: 'UBICACION',
        label: 'Artigas y Gaboto',
        address: 'Artigas esquina Gaboto, Santa Fe',
        locationType: 'PUNTO_VENTA',
        lat: -31.6265,
        lng: -60.7180,
        source: 'PRIMER INFORME - Bca',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString(),
        metadata: { hotSpot: true, priorityReport: 'R-237080-25' }
      },
      {
        id: 'loc-centenera-4511',
        entityType: 'UBICACION',
        label: 'Centenera 4511',
        address: 'Centenera 4511, Santa Fe',
        locationType: 'AGUANTADERO',
        lat: -31.6240,
        lng: -60.7195,
        source: 'PRIMER INFORME - Bca',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString(),
        metadata: { stashHouse: true }
      }
    ];

    const allEntities = [
      ...organizations, 
      ...personasNegrada, 
      ...personasSiempre, 
      ...personasOtras, 
      ...targetsBarranquitas, 
      ...vehicles, 
      ...tacticLocations
    ];
    allEntities.forEach(e => addEntity(e as AnyEntity));

    // VINCULOS
    const baseEdges: GraphEdge[] = [
      { id: 'e-neg-1', source: 'pn-zabala-jon', target: 'org-negrada', relationType: 'MIEMBRO_DE', confidence: 0.95, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-neg-2', source: 'tp-bordon', target: 'org-negrada', relationType: 'MIEMBRO_DE', confidence: 0.8, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-sie-1', source: 'ps-celer-walter', target: 'org-siempre', relationType: 'MIEMBRO_DE', confidence: 0.9, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-cor-1', source: 'po-alviso-pri', target: 'org-correntino', relationType: 'MIEMBRO_DE', confidence: 0.9, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-ace-1', source: 'po-leguizamon-dar', target: 'org-aceitero', relationType: 'MIEMBRO_DE', confidence: 0.95, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-conf-1', source: 'org-negrada', target: 'org-siempre', relationType: 'VINCULADO_A', confidence: 0.9, sourceInfo: 'Cruce de Incidencias 2026', dateDetected: '2026-01-10' },
      { id: 'ev-1', source: 'pn-zabala-jon', target: 'v1', relationType: 'ASOCIADO_CON', confidence: 0.8, sourceInfo: 'Visualización', dateDetected: '2025-12-20' },
      { id: 'ev-2', source: 'po-leguizamon-dar', target: 'v3', relationType: 'PROPIETARIO', confidence: 0.95, sourceInfo: 'Registro', dateDetected: '2025-11-15' },
    ];

    const tacticEdges: GraphEdge[] = [
      { id: 'et-1', source: 'tp-bordon', target: 'loc-artigas-gaboto', relationType: 'UBICADO_EN', confidence: 0.95, sourceInfo: 'Vigilancia Directa', dateDetected: '2025-12-22' },
      { id: 'et-2', source: 'tp-cueva', target: 'loc-centenera-4511', relationType: 'UBICADO_EN', confidence: 0.9, sourceInfo: 'Informe AIC', dateDetected: '2025-12-30' },
      { id: 'et-3', source: 'tp-ali', target: 'loc-artigas-gaboto', relationType: 'ASOCIADO_CON', confidence: 0.85, sourceInfo: 'Vigilancia', dateDetected: '2025-12-22' },
    ];

    const finalEdges = [...baseEdges, ...tacticEdges];
    finalEdges.forEach(e => addEdge(e));
  }
}));
