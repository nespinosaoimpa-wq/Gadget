import { useState } from 'react';
import { useGeoStore } from '../../store/geoStore';
import { Plus, Target, Shield, AlertCircle, Edit2, Search } from 'lucide-react';

const ZoneManager = () => {
  const { zones, updateZone } = useGeoStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredZones = zones.filter(z => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Zonas de Inteligencia</h3>
        <button className="primary-btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          <Plus size={14} /> Nueva Zona
        </button>
      </div>

      <div className="search-box" style={{ marginBottom: '15px' }}>
        <Search size={14} />
        <input 
          type="text" 
          placeholder="Buscar zona..." 
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.zoneList}>
        {filteredZones.map(zone => (
          <div key={zone.id} style={{ ...styles.zoneCard, borderLeft: `4px solid ${zone.color}` }}>
            <div style={styles.zoneInfo}>
              <div style={styles.zoneName}>{zone.name}</div>
              <div style={styles.zoneMeta}>
                <span style={styles.typeBadge}>{zone.type}</span>
                {zone.metadata?.banda && (
                  <span style={styles.orgBadge}>{zone.metadata.banda}</span>
                )}
              </div>
            </div>
            <div style={styles.zoneActions}>
              <button 
                onClick={() => updateZone(zone.id, { active: !zone.active })}
                style={{ ...styles.actionBtn, color: zone.active ? 'var(--primary-cyan)' : 'var(--text-muted)' }}
              >
                <Shield size={16} />
              </button>
              <button style={styles.actionBtn}><Edit2 size={16} /></button>
            </div>
          </div>
        ))}

        {filteredZones.length === 0 && (
          <div style={styles.empty}>
            <Target size={32} style={{ opacity: 0.2, marginBottom: '10px' }} />
            <p>No se encontraron zonas cargadas.</p>
          </div>
        )}
      </div>

      <div className="glass-panel" style={styles.alertBox}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertCircle size={18} className="text-yellow" />
          <div style={{ fontSize: '0.8rem' }}>
            <strong>Alerta de Proximidad</strong>
            <p style={{ margin: '4px 0 0 0', opacity: 0.7 }}>
              Se detectaron 3 incidentes nuevos en la Zona Caliente Microcentro en las últimas 48hs.
            </p>
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
    gap: '15px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    margin: 0
  },
  zoneList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  zoneCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  zoneInfo: {
    flex: 1
  },
  zoneName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-bright)',
    marginBottom: '4px'
  },
  zoneMeta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  typeBadge: {
    fontSize: '0.65rem',
    padding: '1px 6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    color: 'var(--text-muted)'
  },
  orgBadge: {
    fontSize: '0.65rem',
    padding: '1px 6px',
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--primary-cyan)',
    borderRadius: '4px'
  },
  zoneActions: {
    display: 'flex',
    gap: '8px'
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center'
  },
  empty: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: '0.85rem'
  },
  alertBox: {
    padding: '15px',
    borderLeft: '4px solid var(--accent-yellow)',
    marginTop: '10px'
  }
};

export default ZoneManager;
