import { create } from 'zustand';
import Graph from 'graphology';
import type { AnyEntity, GraphEdge, PersonEntity, VehicleEntity, OrgEntity } from '../types/intelligenceTypes';

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
        hierarchy: []
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
      { id: 'pn-aguilar-diego', entityType: 'PERSONA', label: 'Aguilar Diego Francisco', aliases: ['Dieguito'], source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), criminalRecord: [] },
      { id: 'pn-alostiza-jon', entityType: 'PERSONA', label: 'Alostiza Jonatan', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-carnaghi-lau', entityType: 'PERSONA', label: 'Carnaghi Lautaro Fabian', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-cisneros-lau', entityType: 'PERSONA', label: 'Cisneros Lautaro Jesus', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-fazzio-jose', entityType: 'PERSONA', label: 'Fazzio Jose Maria', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-giovann-em', entityType: 'PERSONA', label: 'Giovanniello Emilce', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-ibarra-jon', entityType: 'PERSONA', label: 'Ibarra Jonatan', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'pn-tavecchio-mat', entityType: 'PERSONA', label: 'Tavecchio Matias', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
    ];

    // PERSONAS - LOS DE SIEMPRE
    const personasSiempre: PersonEntity[] = [
      { id: 'ps-celer-walter', entityType: 'PERSONA', label: 'Celer Walter Damian', aliases: ['Celer'], source: 'Dossier Microtráfico', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), criminalRecord: [] },
      { id: 'ps-pasculli-bruno', entityType: 'PERSONA', label: 'Bruno Pasculli', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-simon-elide', entityType: 'PERSONA', label: 'Simon Elide Alejandra', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-leiva-brian', entityType: 'PERSONA', label: 'Leiva Brian', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-martinez-jose', entityType: 'PERSONA', label: 'Martinez Jose Hector', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-passarello-jes', entityType: 'PERSONA', label: 'Passarello Jesica Haydee', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-roppulo-nic', entityType: 'PERSONA', label: 'Roppulo Nicolas Javier', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-echeverria-juan', entityType: 'PERSONA', label: 'Echeverria Juan Eduardo', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'ps-leiva-analia', entityType: 'PERSONA', label: 'Leiva Analia Guadalupe', source: 'Dossier Microtráfico', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
    ];

    // PERSONAS - OTRAS BANDAS
    const personasOtras: PersonEntity[] = [
      { id: 'po-alviso-pri', entityType: 'PERSONA', label: 'Alviso Priscila Daiana', source: 'Banda Correntino', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'po-pedriel-clau', entityType: 'PERSONA', label: 'Pedriel Claudia Josefina', source: 'Banda Correntino', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
      { id: 'po-leguizamon-dar', entityType: 'PERSONA', label: 'Leguizamon Dardo Gabriel', aliases: ['Aceitero'], source: 'Aceiteros', classification: 'CONFIDENCIAL', createdAt: new Date().toISOString(), criminalRecord: [] },
      { id: 'po-leguizamon-per', entityType: 'PERSONA', label: 'Leguizamon Perla Maria del Carmen', source: 'Aceiteros', classification: 'RESERVADO', createdAt: new Date().toISOString(), aliases: [], criminalRecord: [] },
    ];

    // VEHICULOS
    const vehicles: VehicleEntity[] = [
      { id: 'v1', entityType: 'VEHICULO', label: 'Honda Tornado (123 ABC)', plate: '123ABC', make: 'Honda', model: 'Tornado', color: 'Rojo/Blanco', source: 'LPR-BARRANQUITAS', createdAt: new Date().toISOString(), classification: 'USO INTERNO' },
      { id: 'v2', entityType: 'VEHICULO', label: 'Peugeot 206 Gris (DYH 883)', plate: 'DYH883', make: 'Peugeot', model: '206', color: 'Gris', source: 'Polaco Maidana', createdAt: new Date().toISOString(), classification: 'RESERVADO' },
      { id: 'v3', entityType: 'VEHICULO', label: 'Prisma Blanco (AD 165 RV)', plate: 'AD165RV', make: 'Chevrolet', model: 'Prisma', color: 'Blanco', source: 'Polaco Maidana', createdAt: new Date().toISOString(), classification: 'RESERVADO' },
    ];

    const allEntities = [...organizations, ...personasNegrada, ...personasSiempre, ...personasOtras, ...vehicles];
    allEntities.forEach(e => addEntity(e as AnyEntity));

    // VINCULOS
    const edges: GraphEdge[] = [
      // La Negrada
      { id: 'e-neg-1', source: 'pn-zabala-jon', target: 'org-negrada', relationType: 'MIEMBRO_DE', confidence: 0.95, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-neg-2', source: 'pn-bergallo-ig', target: 'org-negrada', relationType: 'MIEMBRO_DE', confidence: 0.8, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-neg-3', source: 'pn-rios-cam', target: 'org-negrada', relationType: 'MIEMBRO_DE', confidence: 0.75, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      
      // Los de Siempre
      { id: 'e-sie-1', source: 'ps-celer-walter', target: 'org-siempre', relationType: 'MIEMBRO_DE', confidence: 0.9, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-sie-2', source: 'ps-pasculli-bruno', target: 'org-siempre', relationType: 'MIEMBRO_DE', confidence: 0.85, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      { id: 'e-sie-3', source: 'ps-leiva-brian', target: 'org-siempre', relationType: 'MIEMBRO_DE', confidence: 0.8, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      
      // Banda Correntino
      { id: 'e-cor-1', source: 'po-alviso-pri', target: 'org-correntino', relationType: 'MIEMBRO_DE', confidence: 0.9, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      
      // Aceiteros
      { id: 'e-ace-1', source: 'po-leguizamon-dar', target: 'org-aceitero', relationType: 'MIEMBRO_DE', confidence: 0.95, sourceInfo: 'Dossier', dateDetected: '2025-12-01' },
      
      // Vinculos Inter-Banda (Conflictos o Alianzas)
      { id: 'e-conf-1', source: 'org-negrada', target: 'org-siempre', relationType: 'VINCULADO_A', confidence: 0.9, sourceInfo: 'Cruce de Incidencias 2026', dateDetected: '2026-01-10' },
      
      // Vehiculos
      { id: 'ev-1', source: 'pn-zabala-jon', target: 'v1', relationType: 'ASOCIADO_CON', confidence: 0.8, sourceInfo: 'Visualización', dateDetected: '2025-12-20' },
      { id: 'ev-2', source: 'po-leguizamon-dar', target: 'v3', relationType: 'PROPIETARIO', confidence: 0.95, sourceInfo: 'Registro', dateDetected: '2025-11-15' },
    ];

    edges.forEach(e => addEdge(e));
  }
}));
