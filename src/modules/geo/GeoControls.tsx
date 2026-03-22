import { useGeoStore } from '../../store/geoStore';
import type { CrimeType } from '../../types/geoTypes';
import { 
  Eye, EyeOff, 
  AlertTriangle, 
  MapPin
} from 'lucide-react';

const GeoControls = ({ type }: { type: 'layers' | 'filters' | 'stats' }) => {
  const { layers, toggleLayer, filters, setFilters, incidents } = useGeoStore();

  if (type === 'layers') {
    return (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Gestión de Capas</h3>
        <div style={styles.layerList}>
          {layers.map(layer => (
            <div key={layer.id} style={styles.layerItem}>
              <div style={styles.layerInfo}>
                <span style={styles.layerName}>{layer.name}</span>
                <button 
                  onClick={() => toggleLayer(layer.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: layer.visible ? 'var(--primary-cyan)' : 'var(--text-muted)' }}
                >
                  {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {layer.visible && (
                <div style={styles.opacityControl}>
                  <label>Opacidad</label>
                  <input type="range" min="0" max="1" step="0.1" defaultValue={layer.opacity} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'filters') {
    const crimeTypes: CrimeType[] = ['HOMICIDIO', 'NARCOTRAFICO', 'ROBO', 'MICROTRAFICO', 'LESIONES', 'AMENAZAS', 'OTROS'];
    
    const toggleCrimeType = (type: CrimeType) => {
      const newTypes = filters.crimeTypes.includes(type)
        ? filters.crimeTypes.filter(t => t !== type)
        : [...filters.crimeTypes, type];
      setFilters({ crimeTypes: newTypes });
    };

    return (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Filtros Tácticos</h3>
        
        <div style={styles.filterGroup}>
          <label style={styles.label}>Tipos de Delito</label>
          <div style={styles.tagCloud}>
            {crimeTypes.map(t => (
              <button
                key={t}
                onClick={() => toggleCrimeType(t)}
                style={{
                  ...styles.tag,
                  backgroundColor: filters.crimeTypes.includes(t) ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                  borderColor: filters.crimeTypes.includes(t) ? 'var(--primary-cyan)' : 'transparent',
                  color: filters.crimeTypes.includes(t) ? 'var(--primary-cyan)' : 'var(--text-muted)'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Severidad Mínima ({filters.minSeverity})</label>
          <input 
            type="range" 
            min="1" max="5" 
            value={filters.minSeverity} 
            onChange={(e) => setFilters({ minSeverity: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Rango Temporal</label>
          <div style={styles.dateInputs}>
            <input type="date" style={styles.dateInput} />
            <input type="date" style={styles.dateInput} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Últimos Incidentes</h3>
        <div style={styles.incidentList}>
          {incidents.slice(0, 10).map(i => (
            <div key={i.id} style={styles.incidentCard} className="hover-panel">
              <div style={styles.incidentHeader}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-bright)' }}>{i.type}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(i.date).toLocaleDateString()}</span>
              </div>
              <div style={styles.incidentDesc}>{i.description}</div>
              <div style={styles.incidentFooter}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={12} className={i.severity >= 4 ? 'text-red' : 'text-muted'} />
                  Sev: {i.severity}
                </span>
                <MapPin size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '10px',
    margin: 0
  },
  layerList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px'
  },
  layerItem: {
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  layerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  layerName: {
    fontSize: '0.9rem',
    color: 'var(--text-bright)'
  },
  opacityControl: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    gap: '10px',
    color: 'var(--text-muted)'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  tagCloud: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px'
  },
  tag: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  dateInputs: {
    display: 'flex',
    gap: '10px'
  },
  dateInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.8rem',
    padding: '6px'
  },
  incidentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  incidentCard: {
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  incidentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  incidentDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4'
  },
  incidentFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  }
};

export default GeoControls;
