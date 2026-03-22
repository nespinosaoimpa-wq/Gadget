import { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';

const RaidWizard = () => {
  const { activeCase } = useCaseStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    targetAddress: '',
    targetDetails: '',
    suspects: [] as string[],
    objectives: [] as string[],
    urgency: 'NORMAL',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={styles.stepContent} className="animate-fade-in">
            <h3 style={styles.stepTitle}>1. Localización del Objetivo</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección del Domicilio</label>
              <div style={styles.inputWrapper}>
                <MapPin size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Ej: Bv. Seguí 2400, Rosario" 
                  style={styles.input}
                  value={formData.targetAddress}
                  onChange={e => setFormData({...formData, targetAddress: e.target.value})}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Descripción del lugar (Fachada, accesos)</label>
              <textarea 
                placeholder="Ej: Portón negro, planta alta, cámaras de seguridad visibles..." 
                style={styles.textarea}
                value={formData.targetDetails}
                onChange={e => setFormData({...formData, targetDetails: e.target.value})}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={styles.stepContent} className="animate-fade-in">
            <h3 style={styles.stepTitle}>2. Sujetos y Objetivos</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Sujetos Identificados (POLE)</label>
              <div style={styles.chipContainer}>
                {activeCase?.persons.map((p, i) => (
                  <label key={i} style={styles.chip}>
                    <input type="checkbox" />
                    <span>{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Elementos a Secuestrar</label>
              <div style={styles.checkGrid}>
                {['Estupefacientes', 'Armas de Fuego', 'Dinero en Efectivo', 'Dispositivos Electrónicos', 'Vehículos', 'Documentación'].map(item => (
                  <label key={item} style={styles.checkItem}>
                    <input type="checkbox" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={styles.stepContent} className="animate-fade-in">
            <h3 style={styles.stepTitle}>3. Justificación y Fundamentos</h3>
            <div style={styles.alertBox}>
              <AlertTriangle size={20} />
              <span>Se incluirán automáticamente las pruebas recolectadas en la causa: <strong>{activeCase?.cuij}</strong></span>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fundamentación de la Medida (Art. 166 CPP-SF)</label>
              <textarea placeholder="Resumen de la investigación que motiva el pedido..." style={styles.textarea} />
            </div>
          </div >
        );
      case 4:
        return (
          <div className="animate-fade-in" style={{ ...styles.stepContent, textAlign: 'center' }}>
            <CheckCircle2 size={64} color="var(--accent-green)" style={{ marginBottom: '20px' }} />
            <h3 style={styles.stepTitle}>¡Listo para Generar!</h3>
            <p style={{ color: 'var(--text-muted)' }}>La solicitud de allanamiento ha sido procesada con éxito.</p>
            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}><span>Objetivo:</span> <strong>{formData.targetAddress}</strong></div>
              <div style={styles.summaryRow}><span>Causa:</span> <strong>{activeCase?.cuij}</strong></div>
              <div style={styles.summaryRow}><span>Fiscalía:</span> <strong>{activeCase?.fiscalia || 'Homicidios'}</strong></div>
            </div>
            <button style={styles.downloadBtn}>
              <FileText size={18} />
              Generar Orden PDF Oficial
            </button>
          </div>
        );
    }
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.wizardHeader}>
        <div style={styles.iconBox}><ShieldCheck size={24} color="var(--primary-cyan)" /></div>
        <div style={styles.headerText}>
          <h2 style={styles.title}>Asistente de Solicitud de Allanamiento</h2>
          <div style={styles.stepper}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ ...styles.stepIndicator, background: step >= s ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.main}>
        {renderStep()}
      </div>

      <div style={styles.footer}>
        <button onClick={prevStep} style={{ ...styles.navBtn, visibility: step === 1 ? 'hidden' : 'visible' }}>
          <ChevronLeft size={18} /> Anterior
        </button>
        {step < 4 ? (
          <button onClick={nextStep} style={styles.primaryBtn}>
            Siguiente <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={() => setStep(1)} style={styles.navBtn}>
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
  },
  wizardHeader: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '20px',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(0,212,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: 'var(--text-main)',
  },
  stepper: {
    display: 'flex',
    gap: '4px',
    marginTop: '10px',
  },
  stepIndicator: {
    height: '4px',
    flex: 1,
    borderRadius: '2px',
    transition: 'all 0.3s',
  },
  main: {
    minHeight: '300px',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  stepTitle: {
    margin: 0,
    fontSize: '18px',
    color: 'var(--primary-cyan)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(0,0,0,0.2)',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  input: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    fontSize: '13px',
    color: 'var(--text-main)',
  },
  checkGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(250, 173, 20, 0.1)',
    border: '1px solid rgba(250, 173, 20, 0.3)',
    borderRadius: '10px',
    color: '#faad14',
    fontSize: '14px',
  },
  summaryCard: {
    background: 'rgba(0,0,0,0.2)',
    padding: '20px',
    borderRadius: '12px',
    margin: '24px 0',
    textAlign: 'left' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: '8px',
    background: 'var(--primary-cyan)',
    border: 'none',
    color: '#000',
    fontWeight: 600,
    cursor: 'pointer',
  },
  downloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 32px',
    borderRadius: '10px',
    background: 'var(--accent-green)',
    color: '#000',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 255, 100, 0.2)',
  }
};

export default RaidWizard;
