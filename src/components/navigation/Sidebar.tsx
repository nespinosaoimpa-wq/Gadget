import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Network, Map, FileText, Zap, Users, Settings, ShieldAlert } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Causas Penales', path: '/causas', icon: <FolderOpen size={20} /> },
    { name: 'Inteligencia Criminal', path: '/inteligencia', icon: <Network size={20} /> },
    { name: 'Geoespacial', path: '/geo', icon: <Map size={20} /> },
    { name: 'Documentos', path: '/documentos', icon: <FileText size={20} /> },
    { name: 'Automatización', path: '/automatizacion', icon: <Zap size={20} /> },
    { name: 'Grupos de Trabajo', path: '/grupos', icon: <Users size={20} /> },
    { name: 'Administración', path: '/admin', icon: <Settings size={20} /> },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <ShieldAlert size={32} color="var(--primary-cyan)" style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' }} />
        <h1 style={styles.logoText}>SIGIC</h1>
      </div>
      
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.navText}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.userProfile}>
        <div style={styles.avatar}>FM</div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>Fiscal Martínez</div>
          <div style={styles.userRole}>Nivel 1 - Fiscal</div>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'var(--bg-card)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    borderRight: 'var(--glass-border)',
    boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
  },
  logoContainer: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: 'var(--glass-border)',
  },
  logoText: {
    fontSize: '24px',
    color: 'var(--primary-cyan)',
    margin: 0,
    textShadow: '0 0 10px rgba(0,212,255,0.3)',
  },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    overflowY: 'auto' as const,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--primary-cyan)',
    borderRight: '3px solid var(--primary-cyan)',
  },
  icon: {
    marginRight: '12px',
    display: 'flex',
  },
  navText: {
    fontSize: '15px',
    fontWeight: 500,
  },
  userProfile: {
    padding: '16px',
    borderTop: 'var(--glass-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--primary-cyan)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  userRole: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  }
};

export default Sidebar;
