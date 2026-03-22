import { create } from 'zustand';
import Graph from 'graphology';
import type { AnyEntity, GraphEdge } from '../types/intelligenceTypes';

interface IntelligenceState {
  graph: Graph;
  entities: Map<string, AnyEntity>;
  edges: GraphEdge[];
  selectedEntityId: string | null;
  
  // Actions
  addEntity: (entity: AnyEntity) => void;
  addEdge: (edge: GraphEdge) => void;
  selectEntity: (id: string | null) => void;
  importMockData: () => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  graph: new Graph(),
  entities: new Map(),
  edges: [],
  selectedEntityId: null,

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

  importMockData: () => {
    const { addEntity, addEdge } = get();
    
    const mockEntities: AnyEntity[] = [
      {
        id: 'p1',
        entityType: 'PERSONA',
        label: 'Ariel C.',
        aliases: ['Guille'],
        criminalRecord: ['case1'],
        source: 'REINCIDENCIA',
        classification: 'RESERVADO',
        createdAt: new Date().toISOString()
      },
      {
        id: 'p2',
        entityType: 'PERSONA',
        label: 'Máximo C.',
        aliases: ['Viejo'],
        criminalRecord: ['case1'],
        source: 'AIC',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString()
      },
      {
        id: 'org1',
        entityType: 'ORGANIZACION',
        label: 'Clan C.',
        orgType: 'CLAN',
        territory: 'Barrio Granada',
        hierarchy: [
          { personId: 'p1', rank: 'LÍDER' },
          { personId: 'p2', rank: 'FUNDADOR' }
        ],
        source: 'INTELIGENCIA',
        classification: 'RESERVADO',
        createdAt: new Date().toISOString()
      },
      {
        id: 't1',
        entityType: 'TELEFONO',
        label: '341-4455XXX',
        number: '3414455000',
        source: 'OFICIO-TELECOM',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString()
      },
      {
        id: 'v1',
        entityType: 'VEHICULO',
        label: 'VW Amarok (AF 123 XX)',
        plate: 'AF123XX',
        make: 'VW',
        model: 'Amarok',
        color: 'Blanco',
        source: 'LPR-CENTRO',
        classification: 'USO INTERNO',
        createdAt: new Date().toISOString()
      }
    ];

    mockEntities.forEach(e => addEntity(e));

    const mockEdges: GraphEdge[] = [
      {
        id: 'e1',
        source: 'p1',
        target: 'org1',
        relationType: 'MIEMBRO_DE',
        confidence: 1.0,
        sourceInfo: 'SENTENCIA JUDICIAL',
        dateDetected: '2020-05-15'
      },
      {
        id: 'e2',
        source: 'p2',
        target: 'org1',
        relationType: 'MIEMBRO_DE',
        confidence: 1.0,
        sourceInfo: 'SENTENCIA JUDICIAL',
        dateDetected: '2015-02-10'
      },
      {
        id: 'e3',
        source: 'p1',
        target: 'p2',
        relationType: 'FAMILIAR',
        confidence: 1.0,
        sourceInfo: 'REGISTRO CIVIL',
        dateDetected: '2000-01-01'
      },
      {
        id: 'e4',
        source: 'p1',
        target: 't1',
        relationType: 'PROPIETARIO',
        confidence: 0.9,
        sourceInfo: 'INTERVENCION TELEFONICA',
        dateDetected: '2023-11-01'
      },
      {
        id: 'e5',
        source: 'p1',
        target: 'v1',
        relationType: 'ASOCIADO_CON',
        confidence: 0.8,
        sourceInfo: 'RECONOCIMIENTO POR TESTIGO',
        dateDetected: '2024-01-10'
      }
    ];

    mockEdges.forEach(e => addEdge(e));
  }
}));
