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
        label: 'Polaco Maidana',
        aliases: ['Polaco'],
        criminalRecord: ['case-mt1'],
        source: 'INTELIGENCIA-SF',
        classification: 'CONFIDENCIAL',
        createdAt: new Date().toISOString()
      },
      {
        id: 'org1',
        entityType: 'ORGANIZACION',
        label: 'La Negrada',
        orgType: 'BANDA',
        territory: 'Barrio Barranquitas / Villa del Parque',
        hierarchy: [
          { personId: 'p1', rank: 'CABECILLA' }
        ],
        source: 'MPA-SANTA-FE',
        classification: 'RESERVADO',
        createdAt: new Date().toISOString()
      },
      {
        id: 'org2',
        entityType: 'ORGANIZACION',
        label: 'Los de Siempre',
        orgType: 'BANDA',
        territory: 'San Pantaleón / San Lorenzo',
        source: 'TRI-SANTA-FE',
        classification: 'RESERVADO',
        createdAt: new Date().toISOString()
      },
      {
        id: 'v1',
        entityType: 'VEHICULO',
        label: 'Honda Tornado (Dominio 123 ABC)',
        plate: '123ABC',
        make: 'Honda',
        model: 'Tornado',
        color: 'Rojo/Blanco',
        source: 'LPR-BARRANQUITAS',
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
        confidence: 0.9,
        sourceInfo: 'INFORME PRELIMINAR BARRANQUITAS',
        dateDetected: '2025-12-15'
      },
      {
        id: 'e2',
        source: 'org1',
        target: 'org2',
        relationType: 'RELEVO_DE',
        confidence: 0.7,
        sourceInfo: 'CRUCE DE INCIDENCIAS 2026',
        dateDetected: '2026-01-10'
      },
      {
        id: 'e3',
        source: 'p1',
        target: 'v1',
        relationType: 'ASOCIADO_CON',
        confidence: 0.8,
        sourceInfo: 'VISUALIZACION DIRECTA GABOTO',
        dateDetected: '2025-12-20'
      }
    ];

    mockEdges.forEach(e => addEdge(e));
  }
}));
