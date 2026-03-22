import { useState } from 'react';
import { 
  Newspaper, 
  Send, 
  Download, 
  Eye, 
  Globe, 
  FileText, 
  Trophy,
  Share2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';

const PressGenerator = () => {
  const { activeCase } = useCaseStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('INTERNO');
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const content = reportType === 'PRENSA' 
        ? `COMUNICADO OFICIAL - MPA ROSARIO\nEn el marco de la investigación CUIJ ${activeCase?.cuij}, se llevaron a cabo 12 allanamientos coordinados...`
        : `INFORME RESERVADO - INTELIGENCIA\nSe detectaron nexos de tercer orden entre el objetivo y la banda de 'Los Monos' a partir de cruces de celdas...`;
      setGeneratedContent(content);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainGrid}>
        {/* Configuration */}
        <div className="glass-panel" style={styles.configCard}>
          <div style={styles.cardHeader}>
            <Newspaper size={20} color="var(--primary-cyan)" />
            <h3 style={styles.cardTitle}>Configuración de Reporte</h3>
          </div>
          <div style={styles.options}>
            <label style={styles.label}>Tipo de Destinatario</label>
            <div style={styles.typeGrid}>
              <button 
                style={{ ...styles.typeBtn, border: reportType === 'INTERNO' ? '1px solid var(--primary-cyan)' : '1px solid transparent' }}
                onClick={() => setReportType('INTERNO')}
              >
                <FileText size={18} />
                <span>Uso Interno</span>
              </button>
              <button 
                style={{ ...styles.typeBtn, border: reportType === 'PRENSA' ? '1px solid var(--primary-cyan)' : '1px solid transparent' }}
                onClick={() => setReportType('PRENSA')}
              >
                <Globe size={18} />
                <span>Prensa / Público</span>
              </button>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Incluir Logros / Hitos</label>
              <div style={styles.checkItem}>
                <input type="checkbox" defaultChecked />
                <span>Secuestros de Armas/Estupefacientes</span>
              </div>
              <div style={styles.checkItem}>
                <input type="checkbox" defaultChecked />
                <span>Detenciones Clave</span>
              </div>
              <div style={styles.checkItem}>
                <input type="checkbox" />
                <span>Detalles de Inteligencia (Reservado)</span>
              </div>
            </div>

            <button style={styles.generateBtn} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {isGenerating ? 'Generando con AI...' : 'Generar Parte Oficial'}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="glass-panel" style={styles.previewCard}>
          <div style={styles.cardHeader}>
            <Eye size={18} color="var(--primary-blue)" />
            <h3 style={styles.cardTitle}>Vista Previa del Parte</h3>
          </div>
          <div style={styles.previewArea}>
            {generatedContent ? (
              <div className="animate-fade-in" style={styles.content}>
                <div style={styles.reportHeader}>
                  <img src="/logo-mpa.png" alt="MPA Logo" style={styles.logoMock} />
                  <div style={{ textAlign: 'right' }}>
                    <p style={styles.dateText}>{new Date().toLocaleDateString()}</p>
                    <p style={styles.refCode}>REF: SIGIC-REP-{Math.random().toString(16).slice(2,8).toUpperCase()}</p>
                  </div>
                </div>
                <pre style={styles.pre}>{generatedContent}</pre>
                <div style={styles.reportFooter}>
                  <p>Fiscalía General de Rosario</p>
                  <p>Secretaría de Inteligencia Criminal</p>
                </div>
              </div>
            ) : (
              <div style={styles.emptyPreview}>
                <Newspaper size={48} color="rgba(255,255,255,0.05)" />
                <p>El reporte generado aparecerá aquí.</p>
              </div>
            )}
          </div>
          {generatedContent && (
            <div style={styles.previewActions}>
              <button style={styles.actionBtn}><Download size={16} /> Descargar PDF</button>
              <button style={styles.actionBtn}><Share2 size={16} /> Enviar a WhatsApp Pública</button>
            </div>
          )}
        </div>
      </div>

      {/* Narrative Library */}
      <div className="glass-panel" style={styles.historyCard}>
        <div style={styles.cardHeader}>
          <Trophy size={18} color="var(--accent-green)" />
          <h3 style={styles.cardTitle}>Biblioteca de Narrativas y Casos de Éxito</h3>
        </div>
        <div style={styles.historyList}>
          <HistoryItem title="Golpe a la logística de 'Los Monos'" date="20 Mar 2026" type="PRENSA" />
          <HistoryItem title="Identificación de nexos internacionales" date="18 Mar 2026" type="INTERNO" />
          <HistoryItem title="Resumen anual delitos complejos" date="15 Mar 2026" type="PUBLICO" />
        </div>
      </div>
    </div>
  );
};

const HistoryItem = ({ title, date, type }: any) => (
  <div style={styles.historyItem}>
    <CheckCircle2 size={16} color="var(--accent-green)" />
    <div style={styles.historyInfo}>
      <span style={styles.historyTitle}>{title}</span>
      <span style={styles.historyMeta}>{date} • {type}</span>
    </div>
    <button style={styles.viewBtn}>Ver</button>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    height: '100%',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    flex: 1,
    minHeight: 0,
  },
  configCard: {
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
  },
  options: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  typeBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    cursor: 'pointer',
    color: 'var(--text-main)',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  generateBtn: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
  },
  previewCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '24px',
  },
  previewArea: {
    flex: 1,
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '16px',
    padding: '30px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  emptyPreview: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  content: {
    background: '#fff',
    color: '#333',
    padding: '40px',
    borderRadius: '4px',
    minHeight: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
  },
  logoMock: {
    height: '40px',
    filter: 'grayscale(1)',
  },
  dateText: {
    margin: 0,
    fontSize: '12px',
    fontWeight: 700,
  },
  refCode: {
    margin: 0,
    fontSize: '10px',
    color: '#666',
  },
  pre: {
    whiteSpace: 'pre-wrap' as const,
    fontFamily: 'serif',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  reportFooter: {
    marginTop: '40px',
    borderTop: '1px solid #ccc',
    paddingTop: '10px',
    fontSize: '12px',
    textAlign: 'center' as const,
    fontWeight: 700,
  },
  previewActions: {
    marginTop: '20px',
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  historyCard: {
    padding: '24px',
  },
  historyList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  historyInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  historyTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  historyMeta: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  viewBtn: {
    fontSize: '12px',
    color: 'var(--primary-cyan)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }
};

export default PressGenerator;
