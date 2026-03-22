import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import type { PersonEntity } from '../../types/intelligenceTypes';
import { 
  ArrowLeft, User, Shield, FileText, Network, 
  MapPin, Users, AlertTriangle,
  ExternalLink, Download, Share2
} from 'lucide-react';

const PersonDossier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entities, edges } = useIntelligenceStore();

  const person = useMemo(() => 
    id ? entities.get(id) as PersonEntity : null
  , [id, entities]);

  const relatedEdges = useMemo(() => 
    edges.filter(e => e.source === id || e.target === id)
  , [id, edges]);

  const networkSize = relatedEdges.length;

  if (!person) {
    return (
      <div className="glass-panel" style={styles.errorContainer}>
        <AlertTriangle size={48} className="text-red" />
        <h2>Dossier No Encontrado</h2>
        <p>La entidad solicitada no existe o no tiene privilegios suficientes.</p>
        <button className="primary-btn" onClick={() => navigate('/inteligencia')}>Volver</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div className="glass-panel" style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.profileHeader}>
          <div style={styles.avatarBig}>
            {person.photo ? <img src={person.photo} alt={person.label} /> : <User size={40} />}
          </div>
          <div style={styles.titleInfo}>
            <div style={styles.identityRow}>
              <h1 style={styles.name}>{person.label}</h1>
              <span className="badge badge-red" style={styles.dangerBadge}>ALTO PERFIL</span>
            </div>
            <div style={styles.subtitle}>
              <span>{person.dni ? `DNI: ${person.dni}` : 'DNI No Registrado'}</span>
              <span style={styles.dotSeparator}>•</span>
              <span>Alias: {person.aliases.join(', ') || 'Ninguno'}</span>
            </div>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button className="secondary-btn"><Download size={16} /> PDF Tactical</button>
          <button className="primary-btn"><Share2 size={16} /> Compartir</button>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Main Info Column */}
        <div style={styles.mainCol}>
          <section className="glass-panel" style={styles.section}>
            <h3 style={styles.sectionTitle}><Shield size={18} /> Resumen de Inteligencia</h3>
            <div style={styles.statsRow}>
              <StatBox label="Vínculos Directos" value={networkSize.toString()} icon={<Network size={16} />} />
              <StatBox label="Causas Relacionadas" value={person.criminalRecord.length.toString()} icon={<FileText size={16} />} />
              <StatBox label="Nivel de Confianza" value="Alta (0.9)" icon={<Zap size={16} />} />
            </div>
            <div style={styles.description}>
              {person.physicalDescription || 'Sin descripción física detallada en el sistema.'}
            </div>
          </section>

          <section className="glass-panel" style={styles.section}>
            <h3 style={styles.sectionTitle}><Users size={18} /> Vínculos y Red Social</h3>
            <div style={styles.linksGrid}>
              {relatedEdges.map(edge => {
                const otherId = edge.source === id ? edge.target : edge.source;
                const otherEntity = entities.get(otherId);
                return (
                  <LinkCard 
                    key={edge.id}
                    entity={otherEntity}
                    relation={edge.relationType}
                    confidence={edge.confidence}
                    onLinkClick={() => navigate(`/inteligencia/persona/${otherId}`)}
                  />
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Info Column */}
        <div style={styles.sideCol}>
          <section className="glass-panel" style={styles.section}>
            <h3 style={styles.sectionTitle}><FileText size={18} /> Antecedentes Judiciales</h3>
            <div style={styles.causaList}>
              {person.criminalRecord.map(caseId => (
                <div key={caseId} style={styles.causaItem} className="hover-panel">
                  <div style={styles.causaHeader}>
                    <span style={styles.causaLabel}>IPP {caseId}</span>
                    <ExternalLink size={14} className="text-muted" />
                  </div>
                  <div style={styles.causaSub}>Unidad Fiscal Homicidios</div>
                </div>
              ))}
              {person.criminalRecord.length === 0 && (
                <div style={styles.emptyText}>Sin antecedentes registrados.</div>
              )}
            </div>
          </section>

          <section className="glass-panel" style={styles.section}>
            <h3 style={styles.sectionTitle}><MapPin size={18} /> Últimas Ubicaciones</h3>
            <div style={styles.locList}>
              <div style={styles.locItem}>
                <MapPin size={14} style={{marginTop: '3px'}} />
                <div>
                  <div style={styles.locName}>Calle San Juan 2500, Rosario</div>
                  <div style={styles.locDate}>Reportado: 12 Feb 2024</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Subcomponents
const StatBox = ({ label, value, icon }: any) => (
  <div style={styles.statBox}>
    <div style={styles.statValue}>
      <span style={{ color: 'var(--primary-cyan)' }}>{icon}</span> {value}
    </div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const LinkCard = ({ entity, relation, confidence, onLinkClick }: any) => {
  if (!entity) return null;
  return (
    <div style={styles.linkCard} className="hover-panel" onClick={onLinkClick}>
      <div style={styles.linkRel}>{relation}</div>
      <div style={styles.linkEntity}>
        <div style={styles.linkAvatar}>
          {entity.entityType === 'PERSONA' ? <User size={14} /> : <Users size={14} />}
        </div>
        <div style={styles.linkInfo}>
          <div style={styles.linkName}>{entity.label}</div>
          <div style={styles.linkMeta}>{entity.entityType} • Conf: {confidence}</div>
        </div>
      </div>
    </div>
  );
};

const Zap = ({ size, className }: any) => <Shield size={size} className={className} />;

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    height: '100%',
    overflowY: 'auto' as const
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
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  avatarBig: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(0, 212, 255, 0.1)',
    border: '2px solid var(--primary-cyan)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary-cyan)',
    overflow: 'hidden'
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  identityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  name: {
    margin: 0,
    fontSize: '1.8rem',
    letterSpacing: '-0.5px'
  },
  dangerBadge: {
    fontSize: '0.7rem'
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    display: 'flex',
    gap: '10px'
  },
  dotSeparator: {
    opacity: 0.3
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px',
    alignItems: 'start'
  },
  mainCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  sideCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  section: {
    padding: '20px'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '1rem',
    color: 'var(--text-bright)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px'
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  },
  statBox: {
    flex: 1,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center' as const
  },
  statValue: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  },
  description: {
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    fontSize: '0.95rem'
  },
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px'
  },
  linkCard: {
    padding: '15px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer'
  },
  linkRel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase' as const,
    color: 'var(--primary-cyan)',
    fontWeight: '700',
    marginBottom: '10px',
    letterSpacing: '0.5px'
  },
  linkEntity: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  linkAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)'
  },
  linkInfo: {
    flex: 1
  },
  linkName: {
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  linkMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  causaList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  causaItem: {
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer'
  },
  causaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  causaLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-bright)'
  },
  causaSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  locList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  locItem: {
    display: 'flex',
    gap: '12px',
    color: 'var(--text-muted)'
  },
  locName: {
    fontSize: '0.9rem',
    color: 'var(--text-bright)',
    marginBottom: '2px'
  },
  locDate: {
    fontSize: '0.75rem'
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    textAlign: 'center' as const,
    padding: '20px'
  },
  errorContainer: {
    margin: '40px',
    padding: '60px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px'
  }
};

export default PersonDossier;
