import { 
  Scale, 
  Clock, 
  FileText, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';

const FiscalDashboard = () => {
  const { activeCase } = useCaseStore();
  
  const deadlines = [
    { id: 1, title: 'Vencimiento Plazo Imputativa', date: '2026-03-22', urgency: 'HIGH', case: '21-098765-1' },
    { id: 2, title: 'Prórroga de Detención', date: '2026-03-23', urgency: 'MEDIUM', case: '21-044221-5' },
    { id: 3, title: 'Informe RENAPER Pendiente', date: '2026-03-25', urgency: 'LOW', case: '21-088339-0' },
  ];

  const pendingDecisions = [
    { id: 101, type: 'ALLANAMIENTO', status: 'POR_AUTORIZAR', requester: 'Dir. Inteligencia' },
    { id: 102, type: 'INTERVENCION_TELEFONICA', status: 'REVISION_LEGAL', requester: 'Dpto. Análisis' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.topGrid}>
        {/* Deadlines Card */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Clock size={20} color="var(--accent-red)" />
            <h3 style={styles.cardTitle}>Plazos Procesales Críticos</h3>
          </div>
          <div style={styles.list}>
            {deadlines.map(d => (
              <div key={d.id} style={styles.listItem}>
                <div style={styles.listInfo}>
                  <span style={styles.itemTitle}>{d.title}</span>
                  <span style={styles.itemMeta}>{d.case} • {d.date}</span>
                </div>
                <div style={{ 
                  ...styles.urgencyBadge, 
                  background: d.urgency === 'HIGH' ? 'rgba(255, 77, 79, 0.1)' : 'rgba(255,255,255,0.05)',
                  color: d.urgency === 'HIGH' ? '#ff4d4f' : 'var(--text-muted)'
                }}>
                  {d.urgency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <UserCheck size={20} color="var(--primary-cyan)" />
            <h3 style={styles.cardTitle}>Autorizaciones Pendientes</h3>
          </div>
          <div style={styles.list}>
            {pendingDecisions.map(p => (
              <div key={p.id} style={styles.listItem}>
                <div style={styles.listInfo}>
                  <span style={styles.itemTitle}>{p.type}</span>
                  <span style={styles.itemMeta}>Solicita: {p.requester}</span>
                </div>
                <button style={styles.reviewBtn}>Revisar <ChevronRight size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.legalSection}>
        <div className="glass-panel" style={styles.legalCard}>
          <div style={styles.cardHeader}>
            <Scale size={20} color="var(--primary-blue)" />
            <h3 style={styles.cardTitle}>Asistente de Calificación Legal</h3>
          </div>
          <div style={styles.legalContent}>
            <p style={styles.legalText}>Basado en los hechos de la causa <strong>{activeCase?.cuij}</strong>, se sugiere la siguiente calificación:</p>
            <div style={styles.suggestionBox}>
              <h4 style={styles.suggestionTitle}>Homicidio Calificado por el uso de arma de fuego</h4>
              <p style={styles.suggestionMeta}>Art. 79 y 41 bis del Código Penal Argentino</p>
              <div style={styles.tagGroup}>
                <span style={styles.tag}>Pena: 10-33 años</span>
                <span style={styles.tag}>Prisión Preventiva: Probable</span>
              </div>
            </div>
            <button style={styles.actionBtn}>
              <FileText size={18} />
              Redactar Requerimiento Imputativo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    height: '100%',
  },
  topGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  listInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  itemMeta: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  urgencyBadge: {
    fontSize: '10px',
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: '4px',
  },
  reviewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'var(--primary-cyan)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  legalSection: {
    flex: 1,
  },
  legalCard: {
    height: '100%',
    padding: '24px',
  },
  legalContent: {
    marginTop: '16px',
  },
  legalText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  suggestionBox: {
    background: 'rgba(0,0,0,0.2)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(0,212,255,0.1)',
    marginBottom: '24px',
  },
  suggestionTitle: {
    margin: 0,
    fontSize: '18px',
    color: 'var(--text-main)',
  },
  suggestionMeta: {
    fontSize: '13px',
    color: 'var(--primary-cyan)',
    margin: '4px 0 12px 0',
  },
  tagGroup: {
    display: 'flex',
    gap: '8px',
  },
  tag: {
    fontSize: '11px',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 10px',
    borderRadius: '4px',
    color: 'var(--text-muted)',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)',
  }
};

export default FiscalDashboard;
