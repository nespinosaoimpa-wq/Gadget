import { TrendingUp, AlertTriangle, ShieldCheck, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Ene', homicidios: 12, robos: 45, narco: 30 },
  { name: 'Feb', homicidios: 15, robos: 50, narco: 34 },
  { name: 'Mar', homicidios: 10, robos: 40, narco: 28 },
  { name: 'Abr', homicidios: 18, robos: 55, narco: 40 },
  { name: 'May', homicidios: 23, robos: 60, narco: 45 },
  { name: 'Jun', homicidios: 14, robos: 48, narco: 38 },
];

const pieData = [
  { name: 'Narcotráfico', value: 35 },
  { name: 'Homicidios', value: 18 },
  { name: 'Robos', value: 25 },
  { name: 'Delitos Complejos', value: 12 },
  { name: 'Otros', value: 10 },
];
const COLORS = ['var(--primary-cyan)', 'var(--accent-red)', 'var(--accent-yellow)', 'var(--primary-blue)', '#8884d8'];

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel Ejecutivo</h1>
        <div style={styles.dateInfo}>Actualizado: {new Date().toLocaleDateString()}</div>
      </div>

      <div style={styles.kpiGrid}>
        <KPICard title="Causas Activas" value="147" trend="+12%" icon={<ShieldCheck size={24} color="var(--primary-cyan)" />} />
        <KPICard title="Homicidios" value="23" trend="-5%" trendColor="var(--accent-green)" icon={<AlertTriangle size={24} color="var(--accent-red)" />} />
        <KPICard title="Operativos" value="56" trend="+8%" icon={<ZapIcon />} />
        <KPICard title="Detenidos" value="89" trend="+15%" icon={<Users size={24} color="var(--primary-blue)" />} />
      </div>

      <div style={styles.chartsGrid}>
        <div className="glass-panel" style={{...styles.chartCard, flex: 2}}>
          <h3 style={styles.cardTitle}>Evolución de Delitos Registrados</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorNarco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-cyan)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-cyan)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: 'var(--glass-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="narco" stroke="var(--primary-cyan)" fillOpacity={1} fill="url(#colorNarco)" />
                <Area type="monotone" dataKey="homicidios" stroke="var(--accent-red)" fillOpacity={1} fill="url(#colorHom)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{...styles.chartCard, flex: 1}}>
          <h3 style={styles.cardTitle}>Distribución por Delito</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: 'var(--glass-border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted components
const KPICard = ({ title, value, trend, icon, trendColor = 'var(--text-muted)' }: any) => (
  <div className="glass-panel" style={styles.kpiCard}>
    <div style={styles.kpiHeader}>
      <h3 style={styles.kpiTitle}>{title}</h3>
      <div style={styles.iconBox}>{icon}</div>
    </div>
    <div style={styles.kpiBody}>
      <div style={styles.kpiValue}>{value}</div>
      <div style={{...styles.kpiTrend, color: trendColor}}>
        <TrendingUp size={14} /> {trend} vs mes anterior
      </div>
    </div>
  </div>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

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
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    color: 'var(--text-main)',
    margin: 0,
  },
  dateInfo: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
  },
  kpiCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiTitle: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    margin: 0,
    fontWeight: 500,
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  kpiTrend: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  chartsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap' as const,
  },
  chartCard: {
    padding: '24px',
    minWidth: '350px',
  },
  cardTitle: {
    fontSize: '18px',
    color: 'var(--text-main)',
    margin: 0,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  }
};

export default Dashboard;
