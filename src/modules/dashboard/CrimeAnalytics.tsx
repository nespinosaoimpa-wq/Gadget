import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend
} from 'recharts';
import { Download, Filter, Calendar as CalendarIcon, Map as MapIcon, Shield } from 'lucide-react';

const CrimeAnalytics = () => {
  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleInfo}>
          <h2 style={styles.title}>Analítica de Inteligencia Criminal</h2>
          <p style={styles.subtitle}>Análisis correlacional y tendencias históricas multivariables</p>
        </div>
        <div style={styles.actions}>
          <button style={styles.filterBtn}><Filter size={16} /> Filtrar</button>
          <button style={styles.exportBtn}><Download size={16} /> Exportar Reporte</button>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div className="glass-panel" style={styles.chartBoxFull}>
          <div style={styles.boxHeader}>
            <h3 style={styles.boxTitle}>Evolución Temporal de Delitos de Alto Impacto</h3>
            <div style={styles.timeRange}>Últimos 12 Meses</div>
          </div>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorNarco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHomicidio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area 
                  type="monotone" 
                  dataKey="Narcotráfico" 
                  stroke="var(--accent-green)" 
                  fillOpacity={1} 
                  fill="url(#colorNarco)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Homicidios" 
                  stroke="var(--accent-red)" 
                  fillOpacity={1} 
                  fill="url(#colorHomicidio)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div className="glass-panel" style={styles.chartBox}>
          <h3 style={styles.boxTitle}>Distribución Geográfica por Barrio</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barrioData} layout="vertical">
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} hide />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary-cyan)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={styles.metricsList}>
          <h3 style={styles.boxTitle}>Correlaciones de Red Criminal</h3>
          {[
            { label: 'Relación Arma/Droga', value: '84%', icon: <Shield size={16} color="var(--accent-green)" /> },
            { label: 'Incidencia Nocturna', value: '62%', icon: <CalendarIcon size={16} color="var(--primary-blue)" /> },
            { label: 'Concentración Macrocentro', value: '45%', icon: <MapIcon size={16} color="var(--accent-red)" /> },
          ].map((item, i) => (
            <div key={i} style={styles.metricItem}>
              <div style={styles.metricIcon}>{item.icon}</div>
              <span style={styles.metricLabel}>{item.label}</span>
              <span style={styles.metricValue}>{item.value}</span>
            </div>
          ))}
          <div style={styles.aiInsight}>
            <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic' }}>
              <strong>AI INSIGHT:</strong> Se detecta un incremento del 15% en la actividad de bandas en zona norte relacionado al desplazamiento de liderazgos tras allanamientos recientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const trendData = [
  { name: 'Ene', Narcotráfico: 40, Homicidios: 24 },
  { name: 'Feb', Narcotráfico: 30, Homicidios: 13 },
  { name: 'Mar', Narcotráfico: 20, Homicidios: 98 },
  { name: 'Abr', Narcotráfico: 27, Homicidios: 39 },
  { name: 'May', Narcotráfico: 18, Homicidios: 48 },
  { name: 'Jun', Narcotráfico: 23, Homicidios: 38 },
  { name: 'Jul', Narcotráfico: 34, Homicidios: 43 },
];

const barrioData = [
  { name: 'Empalme Graneros', value: 85 },
  { name: 'Ludueña', value: 72 },
  { name: 'Las Flores', value: 64 },
  { name: 'Tablada', value: 58 },
  { name: 'Centro', value: 31 },
];

const styles = {
  container: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: 'var(--primary-cyan)',
    fontWeight: 700,
  },
  subtitle: {
    margin: '4px 0 0 0',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontSize: '14px',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    background: 'var(--primary-cyan)',
    border: 'none',
    color: '#000',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  chartBoxFull: {
    padding: '24px',
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  boxTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--text-main)',
    fontWeight: 600,
  },
  timeRange: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  chartBox: {
    padding: '24px',
  },
  metricsList: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  metricIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    flex: 1,
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  aiInsight: {
    marginTop: '10px',
    padding: '16px',
    background: 'rgba(0, 212, 255, 0.05)',
    borderLeft: '4px solid var(--primary-cyan)',
    borderRadius: '4px',
    color: 'var(--primary-cyan)',
  }
};

export default CrimeAnalytics;
