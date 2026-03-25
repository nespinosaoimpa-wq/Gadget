import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import type { OrgEntity } from '../../types/intelligenceTypes';
import { 
  ArrowLeft, Users, 
  ExternalLink, User, Crown, Target, AlertCircle,
  ShieldCheck, History, Download, Database
} from 'lucide-react';

const OrgDossier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entities } = useIntelligenceStore();

  const org = useMemo(() => 
    id ? entities.get(id) as OrgEntity : null
  , [id, entities]);

  if (!org) return <div className="p-6">Organización no encontrada.</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div className="glass-panel" style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.profileHeader}>
          <div style={styles.avatarOrg}>
            <Users size={40} />
          </div>
          <div style={styles.titleAreaWrapper}>
            <div style={styles.titleInfo}>
              <h1 style={styles.name}>{org.label}</h1>
              <div style={styles.subtitle}>
                <span className={`badge ${org.verificationLevel === 'VERIFICADO' || org.verificationLevel === 'JUDICIALIZADO' ? 'badge-cyan' : 'badge-yellow'}`}>
                  {org.verificationLevel || 'SUGERIDO'}
                </span>
                <span style={styles.dotSeparator}>•</span>
                <span className="badge badge-gray">{org.orgType}</span>
                <span style={styles.dotSeparator}>•</span>
                <span>Territorio: {org.territory || 'En disputa / No definido'}</span>
              </div>
            </div>
            <button style={styles.exportBtn} onClick={() => window.print()}>
              <Download size={16} /> Exportar Dossier Táctico
            </button>
          </div>
        </div>
      </div>
      
      {/* Investigation Protocol Status */}
      <div className="glass-panel" style={styles.protocolBanner}>
        <div style={styles.protocolHeader}>
          <Target size={20} color="var(--primary-cyan)" />
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Protocolo de Priorización: Fase {org.metadata?.investigationPhase || 1}</h3>
        </div>
        <div style={styles.phaseSteps}>
          <PhaseStep active={true} label="Mapeo Territorial" subtext="Incidencias 911 / Puntos de Venta" />
          <PhaseStep active={(org.metadata?.investigationPhase || 1) >= 2} label="Individualización" subtext="Identificación de Objetivos (SNA)" />
          <PhaseStep active={(org.metadata?.investigationPhase || 1) >= 3} label="Priorización Táctica" subtext="Documentación para Allanamientos" />
        </div>
      </div>

      <div style={styles.grid}>
        {/* Hierarchy Section */}
        <div className="glass-panel" style={styles.mainCard}>
          <h3 style={styles.sectionTitle}><Crown size={18} /> Estructura Jerárquica</h3>
          <div style={styles.hierarchyGrid}>
            {org.hierarchy.map((member, idx) => {
              const person = entities.get(member.personId);
              return (
                <div key={idx} style={styles.memberCard} className="hover-panel" onClick={() => navigate(`/inteligencia/persona/${member.personId}`)}>
                  <div style={styles.memberRank}>{member.rank}</div>
                  <div style={styles.memberMain}>
                    <div style={styles.memberAvatar}>
                      <User size={16} />
                    </div>
                    <div style={styles.memberInfo}>
                      <div style={styles.memberName}>{person?.label || 'Sujeto No Identificado'}</div>
                      <div style={styles.memberRole}>{member.role || 'Operativo'}</div>
                    </div>
                    <ExternalLink size={14} className="text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div style={styles.sideCol}>
          <div className="glass-panel" style={styles.sideCard}>
            <h3 style={styles.sectionTitle}><Target size={18} /> Modus Operandi</h3>
            <p style={styles.text}>
              Basado en informes de la AIC y el CICO, esta organización opera principalmente mediante:
            </p>
            <ul style={styles.list}>
              <li>Extorsión a comercios ("Ablande")</li>
              <li>Microtráfico en puntos fijos</li>
              <li>Uso de sicariato tercerizado</li>
            </ul>
          </div>

          <div className="glass-panel" style={{...styles.sideCard, borderLeft: '3px solid var(--accent-yellow)'}}>
            <h3 style={styles.sectionTitle}><AlertCircle size={18} color="var(--accent-yellow)" /> Nivel de Amenaza</h3>
            <div style={styles.threatLevel}>CRÍTICO</div>
            <p style={styles.textSmall}>Prioridad de investigación 1 - Dirección General de Inteligencia Criminal.</p>
          </div>

          <div className="glass-panel" style={styles.sideCard}>
            <h3 style={styles.sectionTitle}><ShieldCheck size={18} className="text-cyan" /> Calidad Informativa</h3>
            <div style={styles.qualityMeter}>
              <div style={styles.qualityLabel}>Confiabilidad: {org.reliabilityScore || 5}/10</div>
              <div style={styles.progressBg}>
                <div style={{...styles.progressFill, width: `${(org.reliabilityScore || 5) * 10}%`}} />
              </div>
            </div>
            <p style={styles.textSmall}>Métrica calculada basada en la convergencia de fuentes y verificaciones técnicas.</p>
          </div>

          <div className="glass-panel" style={styles.sideCard}>
            <h3 style={styles.sectionTitle}><Database size={18} /> Fuentes de Información</h3>
            <div style={styles.sourceGrid}>
              <SourceItem label="AIC / PDI" count={12} active />
              <SourceItem label="911 / Incidencias" count={42} active />
              <SourceItem label="CICO / SNA" count={5} active />
              <SourceItem label="Testimonios" count={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Logic & Milestones Section */}
      <div className="glass-panel" style={styles.milestonesCard}>
        <h3 style={styles.sectionTitle}><History size={18} /> Cronología de Investigación (Objetiva)</h3>
        <div style={styles.milestoneList}>
          {org.milestones && org.milestones.length > 0 ? (
            org.milestones.map((m, idx) => (
              <div key={idx} style={styles.milestoneItem}>
                <div style={styles.milestoneLine} />
                <div style={styles.milestoneDot} />
                <div style={styles.milestoneContent}>
                  <div style={styles.milestoneHeader}>
                    <span style={styles.milestoneDate}>{m.date}</span>
                    <span className="badge badge-cyan" style={{fontSize: '0.6rem'}}>{m.type}</span>
                  </div>
                  <div style={styles.milestoneDesc}>{m.description}</div>
                  <div style={styles.milestoneVerify}>Verificado por: {m.verifiedBy}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyMilestones}>No hay hitos de investigación registrados para esta entidad.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const SourceItem = ({ label, count, active }: { label: string, count: number, active?: boolean }) => (
  <div style={{...styles.sourceItem, opacity: active ? 1 : 0.5}}>
    <div style={styles.sourceLabel}>{label}</div>
    <div style={styles.sourceCount}>[{count}]</div>
  </div>
);

const PhaseStep = ({ active, label, subtext }: { active: boolean, label: string, subtext: string }) => (
  <div style={{ ...styles.phaseStep, opacity: active ? 1 : 0.4 }}>
    <div style={{ ...styles.phaseIndicator, background: active ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.1)' }} />
    <div style={styles.phaseInfo}>
      <div style={styles.phaseLabel}>{label}</div>
      <div style={styles.phaseSubtext}>{subtext}</div>
    </div>
  </div>
);

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  avatarOrg: {
    width: '70px',
    height: '70px',
    borderRadius: '15px',
    background: 'rgba(255, 214, 102, 0.1)',
    border: '2px solid #ffd666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffd666'
  },
  titleAreaWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    flex: 1
  },
  exportBtn: {
    padding: '8px 16px',
    background: 'var(--primary-cyan)',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)'
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  name: {
    margin: 0,
    fontSize: '1.6rem'
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  dotSeparator: {
    opacity: 0.3
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '20px'
  },
  mainCard: {
    padding: '25px'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  hierarchyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '15px'
  },
  memberCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer'
  },
  memberRank: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#ffd666',
    textTransform: 'uppercase' as const,
    marginBottom: '10px',
    letterSpacing: '1px'
  },
  memberMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  memberAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)'
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-bright)'
  },
  memberRole: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  sideCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  sideCard: {
    padding: '20px'
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    lineHeight: '1.5'
  },
  textSmall: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '10px'
  },
  list: {
    paddingLeft: '20px',
    margin: '10px 0',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  threatLevel: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: 'var(--accent-yellow)',
    textAlign: 'center' as const,
    padding: '10px',
    background: 'rgba(255, 214, 102, 0.1)',
    borderRadius: '8px'
  },
  protocolBanner: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    borderLeft: '4px solid var(--primary-cyan)'
  },
  protocolHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  phaseSteps: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginTop: '10px'
  },
  phaseStep: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  phaseIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginTop: '4px',
    boxShadow: '0 0 10px rgba(0,212,255,0.3)'
  },
  phaseInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px'
  },
  phaseLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)'
  },
  phaseSubtext: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  qualityMeter: {
    marginTop: '10px'
  },
  qualityLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    marginBottom: '8px',
    fontWeight: '600'
  },
  progressBg: {
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4ff 0%, #0095ff 100%)',
    boxShadow: '0 0 10px rgba(0,212,255,0.3)'
  },
  milestonesCard: {
    padding: '25px',
    marginTop: '20px'
  },
  milestoneList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
    paddingLeft: '10px'
  },
  milestoneItem: {
    display: 'flex',
    gap: '20px',
    position: 'relative' as const,
    paddingBottom: '20px'
  },
  milestoneLine: {
    position: 'absolute' as const,
    left: '5px',
    top: '15px',
    bottom: '0',
    width: '1px',
    background: 'rgba(255,255,255,0.1)'
  },
  milestoneDot: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    background: 'var(--primary-cyan)',
    border: '2px solid rgba(255,255,255,0.2)',
    marginTop: '5px',
    zIndex: 1
  },
  milestoneContent: {
    flex: 1,
    background: 'rgba(255,255,255,0.02)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  milestoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  milestoneDate: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--primary-cyan)'
  },
  milestoneDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    lineHeight: '1.4'
  },
  milestoneVerify: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontStyle: 'italic'
  },
  emptyMilestones: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '20px'
  },
  sourceGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '10px'
  },
  sourceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  sourceLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-main)'
  },
  sourceCount: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--primary-cyan)'
  }
};

export default OrgDossier;
