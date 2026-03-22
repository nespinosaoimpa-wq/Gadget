import { useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Settings,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import type { Notification } from '../../store/notificationStore';

const NotificationCenter = () => {
  const { notifications, fetchNotifications, markAsRead, subscribeToNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = subscribeToNotifications();
    return () => unsubscribe();
  }, [fetchNotifications, subscribeToNotifications]);

  const getIcon = (type: string, severity: string) => {
    if (severity === 'CRITICAL') return <ShieldAlert size={18} color="var(--accent-red)" />;
    if (severity === 'WARNING') return <AlertTriangle size={18} color="#faad14" />;
    switch (type) {
      case 'ALERTA': return <Zap size={18} color="var(--primary-cyan)" />;
      case 'TAREA': return <CheckCircle size={18} color="var(--accent-green)" />;
      default: return <Info size={18} color="var(--primary-blue)" />;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleInfo}>
          <h2 style={styles.title}>Centro de Notificaciones Críticas</h2>
          <p style={styles.subtitle}>Alertas operacionales y eventos de sistema en tiempo real</p>
        </div>
        <button style={styles.settingsBtn}><Settings size={18} /></button>
      </header>

      <div style={styles.main}>
        <div className="glass-panel" style={styles.notificationList}>
          {notifications.length === 0 ? (
            <div style={styles.empty}>
              <Bell size={48} color="rgba(255,255,255,0.05)" />
              <p>No hay notificaciones recientes.</p>
            </div>
          ) : (
            notifications.map((n: Notification) => (
              <div 
                key={n.id} 
                style={{
                  ...styles.notificationItem,
                  background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(0,212,255,0.03)',
                  borderLeft: `4px solid ${n.severity === 'CRITICAL' ? 'var(--accent-red)' : n.read ? 'transparent' : 'var(--primary-cyan)'}`
                }}
                className="animate-fade-in"
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div style={styles.iconBox}>
                  {getIcon(n.type, n.severity)}
                </div>
                <div style={styles.content}>
                  <div style={styles.itemHeader}>
                    <span style={styles.itemTitle}>{n.title}</span>
                    <span style={styles.itemDate}>{new Date(n.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p style={styles.itemMessage}>{n.message}</p>
                </div>
                {!n.read && <div style={styles.unreadDot} />}
                <button style={styles.closeBtn} onClick={(e) => { e.stopPropagation(); /* Clear logic */ }}><X size={14} /></button>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Statistics */}
        <div style={styles.sidebar}>
          <div className="glass-panel" style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Estado del Sistema</h3>
            <div style={styles.statusRow}>
              <span>Supabase Realtime</span>
              <div style={styles.statusBadge}><div style={styles.onlineDot} /> Activo</div>
            </div>
            <div style={styles.statusRow}>
              <span>Canal de Alertas</span>
              <div style={styles.statusBadge}><div style={styles.onlineDot} /> Escuchando</div>
            </div>
          </div>

          <div className="glass-panel" style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Configuración de Alertas</h3>
            <div style={styles.configList}>
              <ConfigToggle label="Detección de Patrones" active />
              <ConfigToggle label="Movimientos en Causa" active />
              <ConfigToggle label="Ingresos a Perímetro" />
              <ConfigToggle label="Nuevos Allanamientos" active />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfigToggle = ({ label, active }: any) => (
  <div style={styles.toggleRow}>
    <span style={{ fontSize: '12px', color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</span>
    <div style={{ 
      width: '32px', 
      height: '16px', 
      borderRadius: '10px', 
      background: active ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.1)',
      position: 'relative' as const,
      cursor: 'pointer'
    }}>
      <div style={{ 
        width: '12px', 
        height: '12px', 
        borderRadius: '50%', 
        background: '#fff',
        position: 'absolute' as const,
        top: '2px',
        left: active ? '18px' : '2px',
        transition: 'all 0.2s'
      }} />
    </div>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    height: '100%',
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
    color: 'var(--text-main)',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  settingsBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    flex: 1,
    minHeight: 0,
  },
  notificationList: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: 'var(--text-muted)',
  },
  notificationItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.2s',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  itemDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  itemMessage: {
    margin: 0,
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: 1.4,
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--primary-cyan)',
    position: 'absolute' as const,
    right: '40px',
    top: '20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    opacity: 0.5,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  sideCard: {
    padding: '20px',
  },
  sideTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: 'var(--text-main)',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '8px',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '8px',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--accent-green)',
    fontWeight: 600,
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-green)',
    boxShadow: '0 0 6px var(--accent-green)',
  },
  configList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
};

export default NotificationCenter;
