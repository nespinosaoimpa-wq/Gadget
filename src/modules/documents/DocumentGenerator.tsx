import { useState } from 'react';
import { FileText, Download, Check, RefreshCw, FileCheck } from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
// import PizZip from 'pizzip';
// import Docxtemplater from 'docxtemplater';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Safely initialize pdfMake fonts to prevent production crashes
try {
  (pdfMake as any).vfs = 
    pdfFonts?.pdfMake?.vfs || 
    (pdfFonts as any)?.vfs || 
    (window as any)?.pdfMake?.vfs || 
    {};
} catch (error) {
  console.error('Failed to initialize pdfMake fonts:', error);
}

const templates = [
  { id: 'allanamiento', name: 'Solicitud de Allanamiento', type: 'Judicial', art: '166-169 CPP-SF' },
  { id: 'imputativa', name: 'Requerimiento Imputativo', type: 'Penal', art: 'Requerimiento cargos' },
  { id: 'oficio_renaper', name: 'Oficio RENAPER (Identidad)', type: 'Investigación', art: 'Validación' },
  { id: 'justicia', name: 'Oficio Judicial General', type: 'Comunicación', art: 'Comunicaciones' },
  { id: 'policia', name: 'Directiva Policial', type: 'Operativo', art: 'Instrucción' },
  { id: 'detencion', name: 'Acta de Detención / Lectura Derechos', type: 'Garantías', art: 'Procedimiento' },
  { id: 'informe', name: 'Informe de Estado de Causa', type: 'Interno', art: 'Gestión' },
];

const DocumentGenerator = () => {
  const { activeCase, cases } = useCaseStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Use the first case as default if activeCase is not set (for demo/placeholder)
  const currentCase = activeCase || cases[0];

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    
    // Simulating document processing for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    setGenerated(true);
    
    setTimeout(() => setGenerated(false), 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Generador de Documentos Judiciales</h1>
        <p style={styles.subtitle}>Seleccione un modelo para auto-completar con datos de la causa: <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{currentCase?.cuij}</span></p>
      </div>

      <div style={styles.mainGrid}>
        {/* Templates Selection */}
        <div className="glass-panel" style={styles.templatesPanel}>
          <h3 style={styles.cardTitle}>Modelos Disponibles</h3>
          <div style={styles.templateList}>
            {templates.map(t => (
              <div 
                key={t.id} 
                style={{
                  ...styles.templateItem,
                  borderColor: selectedTemplate === t.id ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.05)',
                  background: selectedTemplate === t.id ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)'
                }}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <div style={styles.templateIcon}>
                  <FileText size={20} color={selectedTemplate === t.id ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
                </div>
                <div style={styles.templateInfo}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{t.name}</span>
                  <div style={styles.templateMeta}>
                    <span style={styles.metaBadge}>{t.type}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.art}</span>
                  </div>
                </div>
                {selectedTemplate === t.id && <Check size={18} color="var(--primary-cyan)" />}
              </div>
            ))}
          </div>
        </div>

        {/* Configuration & Actions */}
        <div style={styles.actionsColumn}>
          <div className="glass-panel" style={styles.configCard}>
            <h3 style={styles.cardTitle}>Datos Automáticos</h3>
            <div style={styles.dataPreview}>
              <DataItem label="CUIJ" value={currentCase?.cuij} />
              <DataItem label="Fiscal" value={currentCase?.fiscal} />
              <DataItem label="Delito" value={currentCase?.type} />
              <DataItem label="Fecha" value={new Date().toLocaleDateString()} />
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Observaciones adicionales</label>
              <textarea placeholder="Agregar detalles específicos para este documento..." style={styles.textarea} />
            </div>

            <button 
              style={{
                ...styles.generateBtn,
                opacity: selectedTemplate ? 1 : 0.5,
                cursor: selectedTemplate ? 'pointer' : 'not-allowed'
              }}
              onClick={handleGenerate}
              disabled={!selectedTemplate || isGenerating}
            >
              {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <FileCheck size={18} />}
              {isGenerating ? 'Generando...' : 'Generar Documento'}
            </button>
          </div>

          {generated && (
            <div className="glass-panel animate-fade-in" style={styles.downloadCard}>
              <div style={styles.downloadHeader}>
                <div style={styles.successIcon}><Check size={20} /></div>
                <div>
                  <h4 style={{ margin: 0 }}>¡Documento Listo!</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Modelo: {templates.find(t=>t.id===selectedTemplate)?.name}</p>
                </div>
              </div>
              <div style={styles.downloadActions}>
                <button style={styles.downloadBtn}><Download size={16} /> Descargar DOCX</button>
                <button style={{...styles.downloadBtn, background: 'rgba(255,100,100,0.1)', color: 'var(--accent-red)', borderColor: 'rgba(255,100,100,0.2)'}}><Download size={16} /> Descargar PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataItem = ({ label, value }: any) => (
  <div style={styles.dataItem}>
    <span style={styles.dataLabel}>{label}:</span>
    <span style={styles.dataValue}>{value}</span>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    fontSize: '28px',
    color: 'var(--text-main)',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: '4px 0 0 0',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  templatesPanel: {
    padding: '24px',
  },
  cardTitle: {
    fontSize: '18px',
    color: 'var(--text-main)',
    margin: '0 0 20px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  templateList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  templateItem: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s',
  },
  templateIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  templateMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metaBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
  },
  actionsColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  configCard: {
    padding: '24px',
  },
  dataPreview: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    padding: '16px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  dataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  dataLabel: {
    color: 'var(--text-muted)',
  },
  dataValue: {
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
  },
  generateBtn: {
    width: '100%',
    marginTop: '20px',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    fontWeight: 600,
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
  },
  downloadCard: {
    padding: '20px',
    border: '1px solid rgba(0, 255, 100, 0.2)',
    background: 'rgba(0, 255, 100, 0.02)',
  },
  downloadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  successIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadActions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  downloadBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-main)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }
};

export default DocumentGenerator;
