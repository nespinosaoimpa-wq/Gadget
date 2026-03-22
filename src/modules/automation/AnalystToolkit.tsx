import { useState } from 'react';
import { 
  Upload, 
  Table, 
  FileJson, 
  PieChart, 
  Activity,
  Download,
  Database,
  ArrowRight
} from 'lucide-react';

const AnalystToolkit = () => {
  const [dragActive, setDragActive] = useState(false);

  const stats = [
    { label: 'Entidades Vinculadas', value: '124', trend: '+12%', type: 'positive' },
    { label: 'Relaciones Detectadas', value: '482', trend: '+5%', type: 'positive' },
    { label: 'Cruces Telefónicos', value: '12', trend: 'Nuevo', type: 'info' },
    { label: 'Zonas Calientes', value: '5', trend: 'Estable', type: 'neutral' },
  ];

  return (
    <div style={styles.container}>
      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className="glass-panel" style={styles.statCard}>
            <span style={styles.statLabel}>{s.label}</span>
            <div style={styles.statValueRow}>
              <span style={styles.statValue}>{s.value}</span>
              <span style={{ 
                ...styles.statTrend, 
                color: s.type === 'positive' ? 'var(--accent-green)' : 'var(--primary-cyan)' 
              }}>
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.mainGrid}>
        {/* Data Import Section */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <Database size={20} color="var(--primary-cyan)" />
            <h3 style={styles.cardTitle}>Importación de Datos</h3>
          </div>
          <div 
            style={{
              ...styles.dropZone,
              borderColor: dragActive ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.1)',
              background: dragActive ? 'rgba(0,212,255,0.05)' : 'rgba(0,0,0,0.2)'
            }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <Upload size={32} color="var(--text-muted)" />
            <p style={styles.dropText}>Arrastre reportes de telefonía, Excel o JSON</p>
            <span style={styles.dropSubtext}>Soporta formatos I2 Analyst Notebook, Maltego y Excel SIGIC</span>
            <button style={styles.browseBtn}>Buscar Archivos</button>
          </div>
          <div style={styles.formatList}>
            <div style={styles.formatItem}><FileJson size={14} /> <span>JSON Structure</span></div>
            <div style={styles.formatItem}><Table size={14} /> <span>Excel/CSV</span></div>
            <div style={styles.formatItem}><Database size={14} /> <span>SQL Dump</span></div>
          </div>
        </div>

        {/* Intelligence Visualization Preview */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <PieChart size={20} color="var(--primary-blue)" />
            <h3 style={styles.cardTitle}>Distribución de Roles en Banda</h3>
          </div>
          <div style={styles.chartPlaceholder}>
            {/* Simple CSS Chart Mockup */}
            <div style={styles.mockPie}>
              <div style={styles.pieSegment} />
            </div>
            <div style={styles.legend}>
              <LegendItem color="var(--primary-cyan)" label="Logística (45%)" />
              <LegendItem color="var(--primary-blue)" label="Ejecutores (30%)" />
              <LegendItem color="var(--accent-red)" label="Cabecillas (10%)" />
              <LegendItem color="var(--text-muted)" label="Terceros (15%)" />
            </div>
          </div>
          <button style={styles.fullReportBtn}>
            Ver Informe Analítico Completo
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel" style={styles.activityCard}>
        <div style={styles.cardHeader}>
          <Activity size={20} color="var(--accent-green)" />
          <h3 style={styles.cardTitle}>Últimos Procesos de Análisis</h3>
        </div>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Proceso</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span>Acción</span>
          </div>
          <TableRow name="Cruces Telefónicos 'Clan Los Monos'" date="2026-03-22" status="Completado" />
          <TableRow name="Análisis de Red Social 'Operativo Fénix'" date="2026-03-21" status="En Proceso" />
          <TableRow name="Extracción de Metadatos 40 imágenes" date="2026-03-20" status="Completado" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div style={styles.legendItem}>
    <div style={{ ...styles.legendColor, background: color }} />
    <span style={styles.legendLabel}>{label}</span>
  </div>
);

const TableRow = ({ name, date, status }: any) => (
  <div style={styles.tableRow}>
    <span style={styles.tableName}>{name}</span>
    <span style={styles.tableDate}>{date}</span>
    <span style={{ 
      ...styles.tableStatus,
      color: status === 'Completado' ? 'var(--accent-green)' : 'var(--primary-cyan)'
    }}>
      {status}
    </span>
    <button style={styles.tableAction}><Download size={14} /></button>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  statValueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  statTrend: {
    fontSize: '12px',
    fontWeight: 600,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--text-main)',
  },
  dropZone: {
    flex: 1,
    minHeight: '180px',
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    textAlign: 'center' as const,
    transition: 'all 0.3s',
  },
  dropText: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-main)',
  },
  dropSubtext: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  browseBtn: {
    marginTop: '10px',
    padding: '8px 20px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    fontSize: '13px',
    cursor: 'pointer',
  },
  formatList: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  formatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.02)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  chartPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    padding: '20px 0',
  },
  mockPie: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'conic-gradient(var(--primary-cyan) 0% 45%, var(--primary-blue) 45% 75%, var(--accent-red) 75% 85%, var(--text-muted) 85% 100%)',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieSegment: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--bg-card)',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  legendLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  fullReportBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px',
    background: 'rgba(0,212,255,0.1)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '10px',
    color: 'var(--primary-cyan)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  activityCard: {
    padding: '24px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 60px',
    padding: '12px',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
    fontWeight: 700,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 60px',
    padding: '16px 12px',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  tableName: {
    fontSize: '14px',
    color: 'var(--text-main)',
  },
  tableDate: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
  tableStatus: {
    fontSize: '12px',
    fontWeight: 600,
  },
  tableAction: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  }
};

export default AnalystToolkit;
