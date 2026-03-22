import { useState } from 'react';
import { 
  ShieldCheck, Package, History as HistoryIcon, User, MapPin,
  Plus, QrCode, Download 
} from 'lucide-react';

interface EvidenceItem {
  id: string;
  code: string;
  type: string;
  description: string;
  location: string;
  custodian: string;
  status: 'RESGUARDADO' | 'EN TRÁNSITO' | 'EN PERICIA' | 'ENTREGADO';
  timestamp: string;
}

const evidenceList: EvidenceItem[] = [
  { 
    id: '1', 
    code: 'E-24-001', 
    type: 'Arma de Fuego', 
    description: 'Pistola 9mm Bersa con cargador y 12 municiones.', 
    location: 'Depósito Judicial Central', 
    custodian: 'Cabo González, Juan', 
    status: 'RESGUARDADO',
    timestamp: '2024-03-20 09:15'
  },
  { 
    id: '2', 
    code: 'E-24-002', 
    type: 'Narcóticos', 
    description: '15 envoltorios de sustancia blanquecina (clorhidrato de cocaína).', 
    location: 'Laboratorio Químico MPA', 
    custodian: 'Dra. Méndez, Elena', 
    status: 'EN PERICIA',
    timestamp: '2024-03-21 14:30'
  },
  { 
    id: '3', 
    code: 'E-24-003', 
    type: 'Electrónico', 
    description: 'Teléfono celular Samsung S21 color negro, pantalla dañada.', 
    location: 'AIC - Informática', 
    custodian: 'Oficial Britos, Lucas', 
    status: 'EN TRÁNSITO',
    timestamp: '2024-03-22 10:00'
  },
];

const ChainOfCustody = () => {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(evidenceList[0]);

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        
        {/* Evidence List */}
        <div className="glass-panel" style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.title}>Inventario de Evidencia</h3>
            <button style={styles.addBtn}><Plus size={16} /> Registrar</button>
          </div>
          <div style={styles.list}>
            {evidenceList.map(item => (
              <div 
                key={item.id} 
                style={{
                  ...styles.item,
                  borderColor: selectedEvidence?.id === item.id ? 'var(--primary-cyan)' : 'transparent',
                  background: selectedEvidence?.id === item.id ? 'rgba(0,212,255,0.05)' : 'rgba(255,255,255,0.02)'
                }}
                onClick={() => setSelectedEvidence(item)}
              >
                <div style={styles.itemHeader}>
                  <span style={styles.itemCode}>{item.code}</span>
                  <StatusBadge status={item.status} />
                </div>
                <span style={styles.itemType}>{item.type}</span>
                <p style={styles.itemDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Chain of Custody */}
        <div className="glass-panel" style={styles.main}>
          {selectedEvidence ? (
            <div style={styles.detailView}>
              <div style={styles.detailHeader}>
                <div style={styles.headerTitle}>
                  <ShieldCheck size={28} color="var(--primary-cyan)" />
                  <div>
                    <h2 style={{ margin: 0 }}>Evidencia {selectedEvidence.code}</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{selectedEvidence.type}</span>
                  </div>
                </div>
                <div style={styles.headerActions}>
                  <button style={styles.secondaryBtn}><QrCode size={18} /> Etiqueta</button>
                  <button style={styles.secondaryBtn}><Download size={18} /> Acta CoC</button>
                  <button style={styles.primaryBtn}><HistoryIcon size={18} /> Nuevo Movimiento</button>
                </div>
              </div>

              <div style={styles.infoGrid}>
                <InfoCard icon={<Package size={18} />} label="Descripción" value={selectedEvidence.description} />
                <InfoCard icon={<MapPin size={18} />} label="Ubicación Actual" value={selectedEvidence.location} />
                <InfoCard icon={<User size={18} />} label="Responsable" value={selectedEvidence.custodian} />
                <InfoCard icon={<HistoryIcon size={18} />} label="Última Actualización" value={selectedEvidence.timestamp} />
              </div>

              <div style={styles.timelineSection}>
                <h4 style={styles.sectionTitle}>Historial de la Cadena de Custodia</h4>
                <div style={styles.timeline}>
                  <TimelineItem 
                    date="22 MAR 2024 - 10:00" 
                    user="Of. Britos, Lucas" 
                    action="Traslado a Informática" 
                    status="EN TRÁNSITO" 
                    note="Se retira de depósito para pericia forense informática."
                  />
                  <TimelineItem 
                    date="20 MAR 2024 - 11:30" 
                    user="Cabo González, Juan" 
                    action="Ingreso a Depósito" 
                    status="RESGUARDADO" 
                    note="Ingreso tras secuestro en allanamiento CUIJ 21-09."
                  />
                  <TimelineItem 
                    date="20 MAR 2024 - 09:15" 
                    user="Of. López, María" 
                    action="Secuestro / Hallazgo" 
                    status="RECUPERADO" 
                    isStart
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.empty}>Seleccione un elemento de evidencia para ver su trazabilidad.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: any = {
    'RESGUARDADO': 'var(--accent-green)',
    'EN TRÁNSITO': 'var(--primary-cyan)',
    'EN PERICIA': 'var(--primary-blue)',
    'ENTREGADO': 'var(--text-muted)'
  };
  return (
    <span style={{
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '4px',
      background: 'rgba(255,255,255,0.05)',
      color: colors[status] || 'var(--text-muted)',
      fontWeight: 600,
      border: `1px solid ${colors[status]}44`
    }}>{status}</span>
  );
};

const InfoCard = ({ icon, label, value }: any) => (
  <div style={styles.infoCard}>
    <div style={styles.infoIcon}>{icon}</div>
    <div style={styles.infoText}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  </div>
);

const TimelineItem = ({ date, user, action, note, isStart }: any) => (
  <div style={{...styles.timelineItem, borderLeftColor: isStart ? 'transparent' : 'rgba(255,255,255,0.1)'}}>
    <div style={styles.timelineDot} />
    <div style={styles.timelineContent}>
      <div style={styles.timelineHeader}>
        <span style={styles.timelineDate}>{date}</span>
        <span style={{ fontSize: '11px', color: 'var(--primary-cyan)', fontWeight: 600 }}>{action}</span>
      </div>
      <div style={styles.timelineUser}>
        <User size={12} /> {user}
      </div>
      {note && <p style={styles.timelineNote}>{note}</p>}
    </div>
  </div>
);

const styles = {
  container: {
    padding: '0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    height: '600px',
  },
  sidebar: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: '16px',
    margin: 0,
    color: 'var(--text-main)',
  },
  addBtn: {
    background: 'rgba(0,212,255,0.1)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '6px',
    padding: '4px 10px',
    color: 'var(--primary-cyan)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  item: {
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  itemCode: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  itemType: {
    fontSize: '12px',
    color: 'var(--primary-cyan)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '6px',
  },
  itemDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  main: {
    padding: '24px',
    overflowY: 'auto' as const,
  },
  detailView: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  infoCard: {
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    padding: '8px',
    borderRadius: '8px',
    background: 'rgba(0,212,255,0.05)',
    color: 'var(--primary-cyan)',
  },
  infoText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  infoLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-main)',
  },
  timelineSection: {
    marginTop: '10px',
  },
  sectionTitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    marginBottom: '20px',
  },
  timeline: {
    paddingLeft: '10px',
  },
  timelineItem: {
    paddingLeft: '24px',
    paddingBottom: '24px',
    borderLeft: '2px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
  },
  timelineDot: {
    position: 'absolute' as const,
    left: '-7px',
    top: '0',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--primary-cyan)',
    border: '3px solid #111',
    boxShadow: '0 0 0 2px rgba(0,212,255,0.2)',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  timelineHeader: {
    display: 'flex',
    gap: '12px',
    alignItems: 'baseline',
  },
  timelineDate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  timelineUser: {
    fontSize: '12px',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  timelineNote: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '6px',
    borderLeft: '2px solid var(--primary-cyan)',
  },
  empty: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
  }
};

export default ChainOfCustody;
