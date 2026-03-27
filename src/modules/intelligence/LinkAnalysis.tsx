import { useEffect, useMemo, useState } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, ControlsContainer, ZoomControl, FullScreenControl } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import { useGeoStore } from '../../store/geoStore';
import type { EntityType, PersonEntity } from '../../types/intelligenceTypes';
import { 
  Network, Search, Filter, Info, Layers, 
  Share2, Settings, Cloud, ShieldCheck, 
  Zap, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClaudeInsight from '../../components/intelligence/ClaudeInsight';

const getEntityColor = (type: EntityType) => {
  switch (type) {
    case 'PERSONA': return '#ff4d4f';
    case 'ORGANIZACION': return '#ffd666';
    case 'TELEFONO': return '#40a9ff';
    case 'VEHICULO': return '#73d13d';
    case 'UBICACION': return '#9254de';
    case 'EVENTO': return '#ffa940';
    case 'CAUSA': return '#595959';
    default: return '#bfbfbf';
  }
};

const GraphDataController = ({ minVerification }: { minVerification: string }) => {
  const { graph, importMockData } = useIntelligenceStore();
  const loadGraph = useLoadGraph();

  const levelValues: Record<string, number> = {
    'SUGERIDO': 1,
    'INFERIDO': 2,
    'VERIFICADO': 3,
    'JUDICIALIZADO': 4,
    'CONFIRMADO': 5
  };

  useEffect(() => {
    if (graph.order === 0) {
      importMockData();
    }
    
    graph.forEachNode((node, attributes) => {
      const nodeLevel = attributes.verificationLevel || 'SUGERIDO';
      const isVisible = levelValues[nodeLevel] >= levelValues[minVerification];
      
      graph.setNodeAttribute(node, 'hidden', !isVisible);
      
      if (isVisible) {
        graph.setNodeAttribute(node, 'size', attributes.entityType === 'PERSONA' ? 15 : 10);
        graph.setNodeAttribute(node, 'color', getEntityColor(attributes.entityType));
        graph.setNodeAttribute(node, 'label', attributes.label);
        if (!attributes.x) graph.setNodeAttribute(node, 'x', Math.random());
        if (!attributes.y) graph.setNodeAttribute(node, 'y', Math.random());
      }
    });

    loadGraph(graph);
  }, [graph, loadGraph, importMockData, minVerification]);

  return null;
};

const GraphEventsController = ({ onNodeSelect }: { onNodeSelect: (id: string | null) => void }) => {
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      clickNode: (event) => onNodeSelect(event.node),
      clickStage: () => onNodeSelect(null),
    });
  }, [registerEvents, onNodeSelect]);

  return null;
};

const LinkAnalysis = () => {
  const { entities, selectedEntityId, selectEntity, syncWithSupabase, isLoading } = useIntelligenceStore();
  const { syncWithSupabase: syncGeo } = useGeoStore();
  const [activePanel, setActivePanel] = useState<'info' | 'filters' | 'tools'>('info');
  const [minVerification, setMinVerification] = useState<string>('SUGERIDO');
  const [showInsight, setShowInsight] = useState(false);
  const navigate = useNavigate();

  const verificationLevels = ['SUGERIDO', 'INFERIDO', 'VERIFICADO', 'JUDICIALIZADO', 'CONFIRMADO'];

  const handleSync = async () => {
    try {
      await syncWithSupabase();
      await syncGeo();
      alert('Datos sincronizados con éxito en Supabase.');
    } catch (err) {
      alert('Error al sincronizar datos.');
    }
  };

  const selectedEntity = useMemo(() => 
    selectedEntityId ? entities.get(selectedEntityId) : null
  , [selectedEntityId, entities]);

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.header}>
        <div style={styles.headerTitle}>
          <Network className="text-cyan" size={20} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Análisis de Vínculos</h2>
        </div>
        <div style={styles.headerActions}>
          <div className="search-box" style={styles.search}>
            <Search size={16} />
            <input type="text" placeholder="Buscar entidad, DNI, alias..." style={styles.input} />
          </div>
          <button className="secondary-btn" onClick={handleSync} disabled={isLoading}>
            {isLoading ? <Zap size={16} className="animate-spin" /> : <Cloud size={16} />}
            Sincronizar
          </button>
          <button className="secondary-btn"><Share2 size={16} /> Exportar</button>
          <button className="primary-btn"><Settings size={16} /> Analizar</button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.graphWrapper} className="glass-panel">
          <SigmaContainer settings={{ allowInvalidContainer: true, labelFont: 'Inter' }} style={{ height: '100%', width: '100%' }}>
            <GraphDataController minVerification={minVerification} />
            <GraphEventsController onNodeSelect={selectEntity} />
            <ControlsContainer position={'bottom-right'}>
              <ZoomControl />
              <FullScreenControl />
            </ControlsContainer>
          </SigmaContainer>
          
          <div style={styles.floatingControls}>
            <button style={styles.controlBtn} className={activePanel === 'filters' ? 'active' : ''} onClick={() => setActivePanel('filters')}>
              <Filter size={20} />
            </button>
            <button style={styles.controlBtn} className={activePanel === 'tools' ? 'active' : ''} onClick={() => setActivePanel('tools')}>
              <Layers size={20} />
            </button>
            <button style={styles.controlBtn} className={activePanel === 'info' ? 'active' : ''} onClick={() => setActivePanel('info')}>
              <Info size={20} />
            </button>
          </div>
        </div>

        <div style={styles.sidePanel} className="glass-panel">
          {activePanel === 'info' && (
            <div style={styles.panelContent}>
            {selectedEntity ? (
              <div style={styles.detailContent}>
                <div style={styles.detailHeader}>
                  <div style={styles.nodeIconLarge}>
                    <Zap size={24} color="var(--primary-cyan)" />
                  </div>
                  <div>
                    <h4 style={styles.detailName}>{selectedEntity.label}</h4>
                    <span className={`badge ${selectedEntity.verificationLevel === 'VERIFICADO' ? 'badge-cyan' : 'badge-yellow'}`}>
                      {selectedEntity.verificationLevel}
                    </span>
                  </div>
                </div>

                <div style={styles.deductiveSection}>
                  <div style={styles.deductiveHeader}>
                    <ShieldCheck size={14} color="var(--primary-cyan)" />
                    <span>LÓGICA DEDUCTIVA</span>
                  </div>
                  <p style={styles.deductiveText}>
                    Vínculo establecido por convergencia de {selectedEntity.id.includes('v-') ? 'testigos reservados' : 'registros técnicos'}. 
                    Nivel de Certeza: {(selectedEntity as any).reliabilityScore || 7}/10.
                  </p>
                </div>

                <div style={styles.detailsList}>
                    <DetailItem label="ID" value={selectedEntity.id} icon={<Info size={14} />} />
                    <DetailItem label="Fuente" value={selectedEntity.source} icon={<Info size={14} />} />
                    <DetailItem label="Verificación" value={selectedEntity.verificationLevel || 'SUGERIDO'} icon={<ShieldCheck size={14} />} />
                    <DetailItem label="Confiabilidad" value={`${selectedEntity.reliabilityScore || 5}/10`} icon={<AlertTriangle size={14} />} />
                    <DetailItem label="Clasificación" value={selectedEntity.classification} icon={<Layers size={14} />} />
                    <DetailItem label="Creado" value={new Date(selectedEntity.createdAt).toLocaleDateString()} icon={<Info size={14} />} />
                    
                    {selectedEntity.entityType === 'PERSONA' && (
                      <>
                        <div style={styles.sectionDivider}>Antropometría y Datos</div>
                        <DetailItem label="Aliases" value={(selectedEntity as PersonEntity).aliases.join(', ') || 'N/A'} icon={<Info size={14} />} />
                        <DetailItem label="Causas" value={(selectedEntity as PersonEntity).criminalRecord.length.toString()} icon={<Info size={14} />} />
                      </>
                    )}
                  </div>

                <div style={styles.detailActions}>
                  <button 
                    className="primary-btn" 
                    style={{ marginBottom: '10px', width: '100%', background: 'var(--primary-blue)' }}
                    onClick={() => setShowInsight(true)}
                  >
                    <Zap size={16} /> Análisis Claude
                  </button>
                  <button className="secondary-btn" style={{ width: '100%' }} onClick={() => navigate(`/inteligencia/${selectedEntity.entityType.toLowerCase()}/${selectedEntity.id}`)}>
                    Ver Dossier Completo
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <Network size={48} className="text-muted" opacity={0.3} />
                <p>Seleccione un nodo en el visor para analizar sus vínculos e información detallada.</p>
              </div>
            )}
            </div>
          )}

          {activePanel === 'filters' && (
            <div style={styles.panelContent}>
              <h3>Filtros de Inteligencia</h3>
              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Nivel Mínimo de Verificación</label>
                <div style={styles.verificationSelector}>
                  {verificationLevels.map(level => (
                    <button 
                      key={level}
                      style={{
                        ...styles.levelBtn,
                        backgroundColor: minVerification === level ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.05)',
                        color: minVerification === level ? 'black' : 'white'
                      }}
                      onClick={() => setMinVerification(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.filterSection}>
                <label style={styles.filterLabel}>Tipos de Entidad</label>
                <FilterToggle label="Personas" active={true} color={getEntityColor('PERSONA')} />
                <FilterToggle label="Organizaciones" active={true} color={getEntityColor('ORGANIZACION')} />
                <FilterToggle label="Vehículos" active={true} color={getEntityColor('VEHICULO')} />
                <FilterToggle label="Teléfonos" active={true} color={getEntityColor('TELEFONO')} />
              </div>
            </div>
          )}

          {activePanel === 'tools' && (
            <div style={styles.panelContent}>
              <h3>Herramientas SNA</h3>
              <div style={styles.toolList}>
                <ToolItem title="Comunidades (Louvain)" description="Detectar grupos dentro de la red." />
                <ToolItem title="Intermediación" description="Encontrar puentes críticos entre delincuentes." />
                <ToolItem title="Camino más corto" description="Vínculo oculto entre dos nodos." />
              </div>
            </div>
          )}
        </div>
      </div>
      {showInsight && selectedEntity && (
        <ClaudeInsight 
          entityId={selectedEntity.id} 
          entityName={selectedEntity.label} 
          onClose={() => setShowInsight(false)} 
        />
      )}
    </div>
  );
};

const DetailItem = ({ label, value, icon }: any) => (
  <div style={styles.detailItem}>
    <span style={styles.detailIcon}>{icon}</span>
    <div style={{ flex: 1 }}>
      <label style={styles.detailLabel}>{label}</label>
      <div style={styles.detailValue}>{value}</div>
    </div>
  </div>
);

const FilterToggle = ({ label, active, color }: any) => (
  <div style={styles.filterToggle}>
    <div style={{...styles.dot, backgroundColor: color}} />
    <span style={{ flex: 1 }}>{label}</span>
    <input type="checkbox" checked={active} readOnly />
  </div>
);

const ToolItem = ({ title, description }: any) => (
  <div style={styles.toolItem} className="hover-panel">
    <div style={{ fontWeight: '600', color: 'var(--text-bright)' }}>{title}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{description}</div>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    gap: '20px'
  },
  header: {
    padding: '15px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  search: {
    width: '300px'
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem'
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    gap: '20px',
    minHeight: 0
  },
  graphWrapper: {
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  floatingControls: {
    position: 'absolute' as const,
    left: '20px',
    top: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    zIndex: 10
  },
  controlBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(20, 20, 30, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  },
  sidePanel: {
    width: '350px',
    overflowY: 'auto' as const,
    background: 'rgba(10,12,20,0.4)'
  },
  panelContent: {
    padding: '25px'
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    gap: '20px',
    padding: '40px'
  },
  detailHeader: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  detailName: {
    margin: '0 0 5px 0',
    fontSize: '1.2rem',
    color: 'var(--text-bright)'
  },
  nodeIconLarge: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(0, 212, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deductiveSection: {
    background: 'rgba(0, 212, 255, 0.05)',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid rgba(0, 212, 255, 0.1)',
    marginBottom: '20px'
  },
  deductiveHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.7rem',
    fontWeight: '800',
    color: 'var(--primary-cyan)',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },
  deductiveText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    margin: 0,
    fontStyle: 'italic'
  },
  detailActions: {
    marginTop: 'auto'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginBottom: '30px'
  },
  detailItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  detailIcon: {
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  detailLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  },
  detailValue: {
    color: 'var(--text-bright)',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  sectionDivider: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '5px',
    marginTop: '10px'
  },
  filterSection: {
    marginTop: '25px'
  },
  filterLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '10px'
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
    fontSize: '0.9rem',
    color: 'var(--text-bright)'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  verificationSelector: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '10px'
  },
  levelBtn: {
    fontSize: '0.65rem',
    padding: '4px 8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    transition: 'all 0.2s ease'
  },
  toolList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '20px'
  },
  toolItem: {
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)'
  }
};

export default LinkAnalysis;
