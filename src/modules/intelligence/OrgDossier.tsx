import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import type { OrgEntity } from '../../types/intelligenceTypes';
import { 
  ArrowLeft, Users, 
  ExternalLink, User, Crown, Target, AlertCircle
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
          <div style={styles.titleInfo}>
            <h1 style={styles.name}>{org.label}</h1>
            <div style={styles.subtitle}>
              <span className="badge badge-yellow">{org.orgType}</span>
              <span style={styles.dotSeparator}>•</span>
              <span>Territorio: {org.territory || 'En disputa / No definido'}</span>
            </div>
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
        </div>
      </div>
    </div>
  );
};

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
  }
};

export default OrgDossier;
