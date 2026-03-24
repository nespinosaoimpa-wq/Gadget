import { useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

const ExecutiveDashboard = () => {
  const { kpis, crimeByType, crimeByZone, timeline, fetchDashboardData, loading } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <div style={styles.loader}>Cargando Inteligencia Ejecutiva...</div>;
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Panel de Control Ejecutivo SIGIC</h1>
          <p style={styles.subtitle}>Consolidado de Inteligencia Criminal y Operaciones en Tiempo Real</p>
        </div>
        <div style={styles.lastUpdate}>
          <Clock size={14} /> Actualizado: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <KPICard 
          title="Causas Activas" 
          value={kpis.activeCases.toString()} 
          icon={<Users size={20} />} 
          trend="+5%" 
          positive={false} 
        />
        <KPICard 
          title="Tasa de Resolución" 
          value={`${kpis.clearanceRate}%`} 
          icon={<CheckCircle2 size={20} />} 
          trend="+2.4%" 
          positive={true} 
        />
        <KPICard 
          title="Plazos Vencidos" 
          value={kpis.expiredDeadlines.toString()} 
          icon={<AlertCircle size={20} />} 
          trend="-12%" 
          positive={true} 
        />
        <KPICard 
          title="Ops. en Curso" 
          value={kpis.activeOperations.toString()} 
          icon={<Activity size={20} />} 
          trend="+2" 
          positive={true} 
        />
      </div>

      {/* Charts Row */}
      <div style={styles.chartRow}>
        <div className="glass-panel" style={styles.chartCardLarge}>
          <h3 style={styles.chartTitle}>Distribución de Delitos (Semestre)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crimeByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="type" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {crimeByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={styles.chartCardSmall}>
          <h3 style={styles.chartTitle}>Zonas de Calor</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={crimeByZone}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {crimeByZone.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={styles.bottomRow}>
        <div className="glass-panel" style={styles.timelineCard}>
          <h3 style={styles.chartTitle}>Actividad Reciente del Sistema</h3>
          <div style={styles.timeline}>
            {timeline.map(item => (
              <div key={item.id} style={styles.timelineItem}>
                <div style={{ ...styles.severityDot, background: getSeverityColor(item.severity) }} />
                <div style={styles.itemInfo}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemModule}>{item.module}</span>
                    <span style={styles.itemTime}>{item.date}</span>
                  </div>
                  <p style={styles.itemText}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={styles.trendCard}>
          <h3 style={styles.chartTitle}>Tendencia Semanal de Incidentes</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpis.weeklyTrend.map((val, i) => ({ day: i, val }))}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="var(--primary-cyan)" 
                  strokeWidth={3} 
                  dot={{ fill: 'var(--primary-cyan)', r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, trend, positive }: any) => (
  <div className="glass-panel" style={styles.kpiCard}>
    <div style={styles.kpiTop}>
      <div style={styles.kpiIcon}>{icon}</div>
      <div style={{ ...styles.trend, color: positive ? 'var(--accent-green)' : 'var(--accent-red)' }}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div style={styles.kpiMain}>
      <div style={styles.kpiValue}>{value}</div>
      <div style={styles.kpiLabel}>{title}</div>
    </div>
  </div>
);

const getSeverityColor = (s: string) => {
  switch (s) {
    case 'critical': return 'var(--accent-red)';
    case 'warning': return '#faad14';
    default: return 'var(--primary-cyan)';
  }
};

const COLORS = ['var(--primary-cyan)', 'var(--primary-blue)', 'var(--accent-red)', '#faad14', 'var(--accent-green)'];

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
  title: {
    margin: 0,
    fontSize: '28px',
    color: 'var(--text-main)',
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  lastUpdate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.05)',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  kpiCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary-cyan)',
  },
  trend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },
  kpiMain: {
    marginTop: '10px',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1,
  },
  kpiLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    fontWeight: 500,
  },
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  chartCardLarge: {
    padding: '24px',
  },
  chartCardSmall: {
    padding: '24px',
  },
  chartTitle: {
    margin: '0 0 20px 0',
    fontSize: '16px',
    color: 'var(--text-main)',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  timelineCard: {
    padding: '24px',
  },
  trendCard: {
    padding: '24px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    position: 'relative' as const,
  },
  severityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0,
    boxShadow: '0 0 10px currentColor',
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  itemModule: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--primary-cyan)',
  },
  itemTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  itemText: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-main)',
  },
  loader: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary-cyan)',
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '2px',
  }
};

export default ExecutiveDashboard;
