import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../../store/caseStore';
import type { Case, CaseStatus, CaseClassification } from '../../types/case';
import { ArrowLeft, Save, X, Info, Shield, Users, MapPin } from 'lucide-react';

const CaseCreate = () => {
  const navigate = useNavigate();
  const { addCase } = useCaseStore();
  
  const [formData, setFormData] = useState<Partial<Case>>({
    cuij: '',
    title: '',
    description: '',
    type: 'OTROS',
    status: 'RECIBIDA',
    classification: 'PÚBLICO',
    fiscal: '',
    fiscalia: '',
    startDate: new Date().toISOString().split('T')[0],
    persons: [],
    tags: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    } as Case;
    
    addCase(newCase);
    navigate(`/causas/${newCase.id}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <button onClick={() => navigate('/causas')} style={styles.backBtn}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={styles.title}>Nueva Investigación</h1>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => navigate('/causas')} style={styles.secondaryBtn}><X size={18} /> Cancelar</button>
          <button onClick={handleSubmit} style={styles.primaryBtn}><Save size={18} /> Guardar Causa</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formGrid}>
        {/* Left Column - Main Info */}
        <div style={styles.mainColumn}>
          <div className="glass-panel" style={styles.section}>
            <div style={styles.sectionHeader}>
              <Info size={20} color="var(--primary-cyan)" />
              <h3 style={styles.sectionTitle}>Información General</h3>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>CUIJ (Código Único de Identificación Judicial)</label>
              <input 
                type="text" 
                placeholder="00-00000000-0" 
                style={styles.input} 
                required 
                value={formData.cuij}
                onChange={e => setFormData({...formData, cuij: e.target.value})}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Carátula / Título de la Causa</label>
              <input 
                type="text" 
                placeholder="Ej: Banda de los Monos - Infracción Ley 23737" 
                style={styles.input} 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Descripción de los Hechos</label>
              <textarea 
                placeholder="Breve resumen de la investigación..." 
                style={styles.textarea}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="glass-panel" style={styles.section}>
            <div style={styles.sectionHeader}>
              <Users size={20} color="var(--primary-cyan)" />
              <h3 style={styles.sectionTitle}>Fiscalía Interviniente</h3>
            </div>
            <div style={styles.row}>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Fiscal Asignado</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={formData.fiscal}
                  onChange={e => setFormData({...formData, fiscal: e.target.value})}
                />
              </div>
              <div style={{...styles.inputGroup, flex: 1}}>
                <label style={styles.label}>Unidad Fiscal / Fiscalía</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={formData.fiscalia}
                  onChange={e => setFormData({...formData, fiscalia: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Secondary Info */}
        <div style={styles.sidebarColumn}>
          <div className="glass-panel" style={styles.section}>
            <div style={styles.sectionHeader}>
              <Shield size={20} color="var(--primary-cyan)" />
              <h3 style={styles.sectionTitle}>Clasificación y Estado</h3>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Clasificación de Seguridad</label>
              <select 
                style={styles.select}
                value={formData.classification}
                onChange={e => setFormData({...formData, classification: e.target.value as CaseClassification})}
              >
                <option value="PÚBLICO">⚪ PÚBLICO</option>
                <option value="USO INTERNO">🟢 USO INTERNO</option>
                <option value="CONFIDENCIAL">🟡 CONFIDENCIAL</option>
                <option value="RESERVADO">🟠 RESERVADO</option>
                <option value="SECRETO">🔴 SECRETO</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Tipo de Delito</label>
              <select 
                style={styles.select}
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="NARCOTRÁFICO">NARCOTRÁFICO</option>
                <option value="HOMICIDIO">HOMICIDIO</option>
                <option value="ROBO CALIFICADO">ROBO CALIFICADO</option>
                <option value="MICROTRÁFICO">MICROTRÁFICO</option>
                <option value="DELITO COMPLEJO">DELITO COMPLEJO</option>
                <option value="OTROS">OTROS</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Estado Inicial</label>
              <select 
                style={styles.select}
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as CaseStatus})}
              >
                <option value="RECIBIDA">RECIBIDA</option>
                <option value="EN INVESTIGACIÓN">EN INVESTIGACIÓN</option>
              </select>
            </div>
          </div>

          <div className="glass-panel" style={styles.section}>
            <div style={styles.sectionHeader}>
              <MapPin size={20} color="var(--primary-cyan)" />
              <h3 style={styles.sectionTitle}>Lugar del Hecho</h3>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección / Zona</label>
              <input type="text" placeholder="Ej: Bv. Seguí 3400, Rosario" style={styles.input} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    color: 'var(--text-main)',
    margin: 0,
  },
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '24px',
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  sidebarColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  section: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: '16px',
    margin: 0,
    color: 'var(--text-main)',
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
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    minHeight: '120px',
    resize: 'vertical' as const,
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    gap: '20px',
  }
};

export default CaseCreate;
