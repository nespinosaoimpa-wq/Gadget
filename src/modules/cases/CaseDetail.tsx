import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCaseStore } from '../../store/caseStore';
import { getStatusColor, getClassificationIcon } from './caseHelpers';
import { 
  ArrowLeft, FileText, Users, Clock, Map as MapIcon, 
  Network, Shield, Briefcase, ChevronRight, Download, 
  Plus, Edit, MoreVertical, Share2
} from 'lucide-react';
import WorkFolder from './WorkFolder';
import ChainOfCustody from './ChainOfCustody';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases } = useCaseStore();
  const [activeTab, setActiveTab] = useState<'resumen' | 'cuaderno' | 'personas' | 'timeline' | 'evidencia' | 'mapa' | 'vinculos'>('resumen');

  const caseData = cases.find(c => c.id === id);

  if (!caseData) return <div>Causa no encontrada</div>;

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: <Briefcase size={18} /> },
    { id: 'cuaderno', label: 'Cuaderno', icon: <FileText size={18} /> },
    { id: 'personas', label: 'Personas', icon: <Users size={18} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={18} /> },
    { id: 'evidencia', label: 'Evidencia', icon: <Shield size={18} /> },
    { id: 'mapa', label: 'Mapa', icon: <MapIcon size={18} /> },
    { id: 'vinculos', label: 'Vínculos', icon: <Network size={18} /> },
  ];

  return (
    <div style={styles.container}>
      {/* Top Breadcrumbs & Actions */}
      <div style={styles.breadcrumbBar}>
        <div style={styles.breadcrumbs}>
          <button onClick={() => navigate('/causas')} style={styles.backBtn}>
            <ArrowLeft size={18} />
          </button>
          <span>Causas</span>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{caseData.cuij}</span>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryBtn}><Share2 size={18} /> Compartir</button>
          <button style={styles.secondaryBtn}><Download size={18} /> Exportar</button>
          <button style={styles.primaryBtn}><Edit size={18} /> Editar Causa</button>
        </div>
      </div>

      {/* Case Header Info */}
      <div className="glass-panel" style={styles.caseHeader}>
        <div style={styles.headerTop}>
          <div style={styles.headerTitleSection}>
            <div style={styles.titleRow}>
              <span style={{ fontSize: '24px' }}>{getClassificationIcon(caseData.classification)}</span>
              <h1 style={styles.caseTitle}>{caseData.title}</h1>
              <span style={{...styles.statusBadge, borderColor: getStatusColor(caseData.status), color: getStatusColor(caseData.status)}}>
                {caseData.status}
              </span>
            </div>
            <p style={styles.caseDescription}>{caseData.description}</p>
          </div>
          <div style={styles.classificationTag}>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Clasificación</span>
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{caseData.classification}</span>
          </div>
        </div>

        <div style={styles.headerMeta}>
          <MetaItem label="CUIJ" value={caseData.cuij} color="var(--primary-cyan)" />
          <MetaItem label="Fiscalía" value={caseData.fiscalia} />
          <MetaItem label="Fiscal" value={caseData.fiscal} />
          <MetaItem label="Inicio" value={caseData.startDate} />
          <MetaItem label="Tipo Penal" value={caseData.type} />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={styles.tabsBar}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            style={{
              ...styles.tabBtn,
              color: activeTab === tab.id ? 'var(--primary-cyan)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-cyan)' : '2px solid transparent',
              background: activeTab === tab.id ? 'rgba(0,212,255,0.05)' : 'transparent'
            }}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'resumen' && (
          <div style={styles.resumenGrid}>
            <div className="glass-panel" style={styles.resumenCard}>
              <h3 style={styles.cardTitle}>Personas Vinculadas</h3>
              <div style={styles.personList}>
                {caseData.persons.length > 0 ? caseData.persons.map(p => (
                  <div key={p.id} style={styles.personItem}>
                    <div style={styles.personAvatar}>{p.name.charAt(0)}</div>
                    <div style={styles.personInfo}>
                      <span style={styles.personName}>{p.name} {p.alias && <small style={{ color: 'var(--primary-cyan)' }}>({p.alias})</small>}</span>
                      <span style={styles.personRole}>{p.role}</span>
                    </div>
                    {p.status && <span style={styles.personStatus}>{p.status}</span>}
                  </div>
                )) : <p style={{ color: 'var(--text-muted)' }}>No hay personas vinculadas aún.</p>}
                <button style={styles.addBtn}><Plus size={16} /> Vincular Persona</button>
              </div>
            </div>

            <div className="glass-panel" style={styles.resumenCard}>
              <h3 style={styles.cardTitle}>Documentos Recientes</h3>
              <div style={styles.docList}>
                <DocItem name="Orden_Allanamiento_3400.pdf" date="Hace 2 horas" type="PDF" />
                <DocItem name="Informe_Preliminar_Narcotrafico.docx" date="Ayer" type="DOCX" />
                <button style={styles.addBtn}><Plus size={16} /> Generar Documento</button>
              </div>
            </div>

            <div className="glass-panel" style={{...styles.resumenCard, gridColumn: 'span 2'}}>
              <h3 style={styles.cardTitle}>Ubicaciones en el Mapa</h3>
              <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <MapIcon size={32} style={{ opacity: 0.2 }} />
                <span style={{ marginLeft: '10px' }}>Vista previa del mapa desactivada</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cuaderno' && (
          <WorkFolder />
        )}
        
        {activeTab === 'evidencia' && (
          <ChainOfCustody />
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'resumen' && activeTab !== 'cuaderno' && activeTab !== 'evidencia' && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Módulo {activeTab} en etapa de implementación.
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Components
const MetaItem = ({ label, value, color = 'var(--text-main)' }: any) => (
  <div style={styles.metaItem}>
    <span style={styles.metaLabel}>{label}</span>
    <span style={{...styles.metaValue, color}}>{value}</span>
  </div>
);

const DocItem = ({ name, date }: any) => (
  <div style={styles.docItem}>
    <FileText size={20} style={{ color: 'var(--primary-cyan)' }} />
    <div style={styles.docInfo}>
      <span style={styles.docName}>{name}</span>
      <span style={styles.docDate}>{date}</span>
    </div>
    <MoreVertical size={16} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  breadcrumbBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '6px',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  caseHeader: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    flex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  caseTitle: {
    fontSize: '24px',
    margin: 0,
    color: 'var(--text-main)',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 600,
  },
  caseDescription: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: 0,
    maxWidth: '800px',
  },
  classificationTag: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
    background: 'rgba(0,0,0,0.2)',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  headerMeta: {
    display: 'flex',
    gap: '40px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    flexWrap: 'wrap' as const,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  metaLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: 600,
  },
  tabsBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    gap: '10px',
  },
  tabBtn: {
    padding: '12px 20px',
    border: 'none',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  tabContent: {
    marginTop: '10px',
  },
  resumenGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  resumenCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    margin: 0,
    color: 'var(--text-main)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  personList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  personItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
  },
  personAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'var(--primary-cyan)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  personInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  personName: {
    fontSize: '14px',
    fontWeight: 600,
  },
  personRole: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  personStatus: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'rgba(255,100,100,0.1)',
    color: 'var(--accent-red)',
    fontWeight: 600,
  },
  docList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  docItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
  },
  docInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  docName: {
    fontSize: '14px',
    fontWeight: 500,
  },
  docDate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  addBtn: {
    marginTop: '8px',
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '10px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'var(--primary-cyan)',
      color: 'var(--primary-cyan)',
      background: 'rgba(0,212,255,0.05)',
    }
  },
  cuadernoContainer: {
    padding: 0,
    height: '600px',
    overflow: 'hidden',
  },
  notebookLayout: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr 300px',
    height: '100%',
  },
  notebookSources: {
    borderRight: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  notebookHeader: {
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fileTree: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  treeFolder: {
    padding: '6px 8px',
    borderRadius: '4px',
    fontSize: '13px',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    '&:hover': { background: 'rgba(255,255,255,0.05)' }
  },
  treeFile: {
    padding: '6px 8px 6px 28px',
    borderRadius: '4px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    '&:hover': { background: 'rgba(255,255,255,0.05)', color: 'var(--primary-cyan)' }
  },
  notebookContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.4)',
  },
  emptyContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    textAlign: 'center' as const,
    padding: '40px',
  },
  notebookNotes: {
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  notesArea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '16px',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
    lineHeight: '1.6',
  }
};

export default CaseDetail;
