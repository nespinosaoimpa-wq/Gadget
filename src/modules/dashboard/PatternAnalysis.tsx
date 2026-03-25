import { Zap, ShieldAlert } from 'lucide-react';

interface PatternAlert {
  id: string;
  type: 'CONFLICT' | 'SPIKE' | 'EXPANSION';
  title: string;
  description: string;
  probability: 'HIGH' | 'MEDIUM' | 'LOW';
  impactZone: string;
}

const PatternAnalysis: React.FC = () => {
  const alerts: PatternAlert[] = [
    {
      id: 'a1',
      type: 'CONFLICT',
      title: 'Riesgo de Enfrentamiento: Sector San Pantaleón',
      description: 'Detección de movimientos inusuales de "La Negrada" hacia perímetros controlados por "Los de Siempre". Análisis de telefonía indica coordinaciones tácticas.',
      probability: 'HIGH',
      impactZone: 'San Pantaleón / Barranquitas'
    },
    {
      id: 'a2',
      type: 'SPIKE',
      title: 'Anomalía de Microtráfico: Recreo Norte',
      description: 'Incremento del 40% en incidencias nocturnas reportadas vía 911 en los últimos 7 días. Patrón correlacionado con el Clan Leguizamón.',
      probability: 'MEDIUM',
      impactZone: 'Castañaduy 6800'
    }
  ];

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <ShieldAlert size={20} color="var(--primary-cyan)" />
        <h3 style={styles.title}>Motor de Predicción SIGIC</h3>
      </div>
      <div style={styles.alertList}>
        {alerts.map(alert => (
          <div key={alert.id} style={{...styles.alertCard, borderLeft: `4px solid ${alert.probability === 'HIGH' ? 'var(--accent-red)' : 'var(--accent-yellow)'}`}}>
            <div style={styles.alertTop}>
              <span style={styles.alertTitle}>{alert.title}</span>
              <span className={`badge ${alert.probability === 'HIGH' ? 'badge-red' : 'badge-yellow'}`} style={{fontSize: '0.6rem'}}>
                Prob: {alert.probability}
              </span>
            </div>
            <p style={styles.alertText}>{alert.description}</p>
            <div style={styles.alertFooter}>
              <Zap size={12} /> Zona de Impacto: {alert.impactZone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-bright)'
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px'
  },
  alertCard: {
    background: 'rgba(255,255,255,0.02)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  alertTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  alertTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    maxWidth: '200px'
  },
  alertText: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4'
  },
  alertFooter: {
    fontSize: '0.7rem',
    color: 'var(--primary-cyan)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '600'
  }
};

export default PatternAnalysis;
