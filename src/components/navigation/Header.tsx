import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.searchContainer}>
        <Search size={18} style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Búsqueda global por DNI, Nombre, CUIJ, Patente..." 
          style={styles.searchInput}
        />
      </div>

      <div style={styles.headerRight}>
        <button style={styles.iconButton}>
          <Bell size={20} />
          <span style={styles.badge}>3</span>
        </button>
        <button style={styles.avatarButton}>
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '70px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-card)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    borderBottom: 'var(--glass-border)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  searchContainer: {
    position: 'relative' as const,
    width: '400px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 40px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    position: 'relative' as const,
    display: 'flex',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background 0.2s, color 0.2s',
  },
  badge: {
    position: 'absolute' as const,
    top: '2px',
    right: '2px',
    background: 'var(--accent-red)',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  avatarButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Header;
