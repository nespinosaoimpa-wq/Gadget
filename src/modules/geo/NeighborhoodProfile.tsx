import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import type { GeoZone } from '../../types/geoTypes';

interface NeighborhoodProfileProps {
  zone: GeoZone;
  onClose: () => void;
}

const NeighborhoodProfile: React.FC<NeighborhoodProfileProps> = ({ zone, onClose }) => {
  return (
    <div className="glass-panel animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <Shield size={20} className="text-cyan" />
          <h2 style={styles.title}>{zone.name}</h2>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={18} />
        </button>
      </div>

      <div style={styles.content}>
        {/* Risk Status */}
        <div style={{...styles.badge, background: zone.color + '22', color: zone.color, border: `1px solid ${zone.color}44`}}>
          <AlertTriangle size={14} />
          <span>ESTADO: {zone.type === 'ZONA_CALIENTE' ? 'ALTO RIESGO / CONFLICTO' : 'MONITOREO TACTICO'}</span>
        </div>

        {/* Narrative Context */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><Users size={16} /> Contexto de Violencia</h3>
          <p style={styles.text}>
            {zone.metadata?.contexto || `Sector bajo análisis por disputas territoriales vinculadas al microtráfico. Influencia predominante de ${zone.metadata?.banda || 'Organización no Identificada'}.`}
          </p>
        </div>

        {/* Intelligence Data */}
        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <MapPin size={16} className="text-muted" />
            <div style={styles.infoLabel}>Puntos Críticos</div>
            <div style={styles.infoValue}>{zone.metadata?.puntosCriticos || 'No mapeados'}</div>
          </div>
          <div style={styles.infoCard}>
            <TrendingUp size={16} className="text-muted" />
            <div style={styles.infoLabel}>Prioridad</div>
            <div style={styles.infoValue}>{zone.metadata?.prioridad || 'GENERAL'}</div>
          </div>
          <div style={styles.infoCard}>
            <Calendar size={16} className="text-muted" />
            <div style={styles.infoLabel}>Último Hito</div>
            <div style={styles.infoValue}>{zone.metadata?.ultimoHito || 'Identificación'}</div>
          </div>
        </div>

        {/* Predictive Note */}
        <div style={styles.predictionBox}>
          <div style={styles.predictionHeader}>
            <TrendingUp size={14} color="var(--primary-cyan)" />
            <span style={styles.predictionTitle}>Deducción de Patrones</span>
          </div>
          <p style={styles.predictionText}>
            Se observa una convergencia de incidentes en horarios nocturnos coincidente con el recambio de guardias en puntos de acopio identificados. Probabilidad de escalada: MEDIA.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '320px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 3000,
    background: 'rgba(10, 12, 20, 0.95)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-bright)'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.65rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '0.5px'
  },
  section: {
    marginTop: '5px'
  },
  sectionTitle: {
    fontSize: '0.85rem',
    color: 'var(--primary-cyan)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 0 8px 0',
    fontWeight: '600'
  },
  text: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    lineHeight: '1.5',
    margin: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  infoCard: {
    padding: '10px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  infoLabel: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    marginTop: '4px'
  },
  infoValue: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-bright)'
  },
  predictionBox: {
    padding: '12px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 212, 255, 0.1)'
  },
  predictionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px'
  },
  predictionTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--primary-cyan)',
    textTransform: 'uppercase' as const
  },
  predictionText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    margin: 0,
    fontStyle: 'italic'
  }
};

export default NeighborhoodProfile;
