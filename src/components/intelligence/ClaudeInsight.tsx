import React, { useState, useEffect } from 'react';
import { Zap, Brain, ShieldAlert, FileText, X } from 'lucide-react';

interface ClaudeInsightProps {
  entityId: string;
  entityName: string;
  onClose: () => void;
}

const ClaudeInsight: React.FC<ClaudeInsightProps> = ({ entityId, entityName, onClose }) => {
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.overlay}>
      <div className="glass-panel" style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <Brain size={24} color="var(--primary-cyan)" />
            <h3 style={{ margin: 0 }}>Claude Insight: {entityName}</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          {analyzing ? (
            <div style={styles.loading}>
              <Zap size={48} className="animate-pulse" color="var(--primary-cyan)" />
              <p>Analizando patrones de red y vínculos criminales...</p>
            </div>
          ) : (
            <div style={styles.report}>
              <div style={styles.alertBox}>
                <ShieldAlert size={20} color="var(--accent-red)" />
                <span>ALTA PROBABILIDAD DE VÍNCULO CON RED DE TRATA</span>
              </div>
              
              <div style={styles.section}>
                <h4><Brain size={16} /> Resumen de Inteligencia</h4>
                <p>
                  El perfil de <strong>{entityName}</strong> presenta una alta correlación con patrones de captación en zona norte. 
                  Se detectaron vínculos indirectos con la organización "Los de Siempre" a través de nodos de logística.
                </p>
              </div>

              <div style={styles.section}>
                <h4><FileText size={16} /> Recomendaciones Operativas</h4>
                <ul>
                  <li>Solicitar cruce telefónico con el ID <code>{entityId}</code>.</li>
                  <li>Vigilancia discreta en puntos de reunión detectados por geoposicionamiento.</li>
                  <li>Entrevistar a testigos bajo reserva en el marco del Operativo Norte.</li>
                </ul>
              </div>

              <div style={styles.footer}>
                <span style={styles.disclaimer}>
                  Análisis generado por IA basado en datos de SIGIC v1.0. No constituye prueba judicial sin verificación manual.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '600px',
    maxWidth: '90%',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 25px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  content: {
    padding: '30px',
    overflowY: 'auto' as const,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '40px 0',
    color: 'var(--text-muted)',
  },
  report: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '25px',
  },
  alertBox: {
    background: 'rgba(255, 77, 79, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 77, 79, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--accent-red)',
    fontWeight: '700',
    fontSize: '0.9rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    h4: {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '1rem',
      color: 'var(--primary-cyan)',
    },
    p: {
      margin: 0,
      fontSize: '0.95rem',
      lineHeight: '1.6',
      color: 'var(--text-main)',
    },
    ul: {
      paddingLeft: '20px',
      margin: 0,
      color: 'var(--text-main)',
      fontSize: '0.9rem',
      li: {
        marginBottom: '8px',
      }
    }
  },
  footer: {
    marginTop: '10px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  }
};

export default ClaudeInsight;
