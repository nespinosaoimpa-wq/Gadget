import { useState } from 'react';
import { 
  Search, 
  Twitter, 
  Facebook, 
  Instagram, 
  Globe, 
  Users, 
  Hash, 
  Link as LinkIcon,
  Eye,
  ExternalLink,
  Shield
} from 'lucide-react';

const OsintSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsSearching(true);
    
    // Simulate OSINT search
    setTimeout(() => {
      setResults([
        { id: 1, platform: 'Twitter', user: '@objetivo_x', text: 'Publicación reciente vinculada a zona Seguí...', date: '2h ago', risk: 'HIGH' },
        { id: 2, platform: 'Facebook', user: 'Juan Perez (Alias Toti)', text: 'Foto en evento barrial con sujetos de interés.', date: '1d ago', risk: 'MEDIUM' },
        { id: 3, platform: 'Instagram', user: 'la_mafia_ros', text: 'Historia con exhibición de armas y dinero.', date: '4h ago', risk: 'CRITICAL' },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.searchBox}>
          <Search size={20} color="var(--text-muted)" />
          <form onSubmit={handleSearch} style={{ flex: 1 }}>
            <input 
              type="text" 
              placeholder="Nombre, Alias, @usuario o #hashtag..." 
              style={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
          <button style={styles.searchBtn} onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Rastreando...' : 'Iniciar Búsqueda OSINT'}
          </button>
        </div>
        <div style={styles.platforms}>
          <PlatformIcon icon={<Twitter size={14} />} label="X/Twitter" active />
          <PlatformIcon icon={<Facebook size={14} />} label="Facebook" active />
          <PlatformIcon icon={<Instagram size={14} />} label="Instagram" active />
          <PlatformIcon icon={<Globe size={14} />} label="Web/JS" active />
        </div>
      </header>

      <div style={styles.mainGrid}>
        {/* Results List */}
        <div className="glass-panel" style={styles.resultsPanel}>
          <div style={styles.panelHeader}>
            <Eye size={18} color="var(--primary-cyan)" />
            <h3 style={styles.panelTitle}>Resultados del Monitoreo</h3>
          </div>
          <div style={styles.resultsList}>
            {results.length === 0 ? (
              <div style={styles.emptyResults}>
                <Shield size={48} color="rgba(255,255,255,0.05)" />
                <p>Ingrese un criterio de búsqueda para iniciar la recolección de fuentes abiertas.</p>
              </div>
            ) : (
              results.map(r => (
                <div key={r.id} style={styles.resultItem} className="animate-fade-in">
                  <div style={styles.resultHeader}>
                    <div style={styles.platformBadge}>{r.platform}</div>
                    <span style={styles.resultDate}>{r.date}</span>
                    <span style={{ 
                      ...styles.riskBadge, 
                      background: r.risk === 'CRITICAL' ? 'rgba(255, 100, 100, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: r.risk === 'CRITICAL' ? 'var(--accent-red)' : 'var(--text-muted)'
                    }}>
                      {r.risk}
                    </span>
                  </div>
                  <h4 style={styles.resultUser}>{r.user}</h4>
                  <p style={styles.resultText}>{r.text}</p>
                  <div style={styles.resultFooter}>
                    <button style={styles.actionLink}><LinkIcon size={12} /> Vincular a Causa</button>
                    <button style={styles.actionLink}><ExternalLink size={12} /> Ver Fuente</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div style={styles.sidebar}>
          <div className="glass-panel" style={styles.sideCard}>
            <div style={styles.panelHeader}>
              <Users size={18} color="var(--primary-blue)" />
              <h3 style={styles.panelTitle}>Red de Contactos Detectada</h3>
            </div>
            <div style={styles.networkMock}>
              {/* Mock visualization of connected profiles */}
              <div style={styles.node} />
              <div style={{ ...styles.node, left: '60px', top: '40px' }} />
              <div style={{ ...styles.node, left: '120px', top: '10px' }} />
              <div style={styles.connection} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              3 perfiles coinciden con nexos conocidos en la organización criminal bajo investigación.
            </p>
          </div>

          <div className="glass-panel" style={styles.sideCard}>
            <div style={styles.panelHeader}>
              <Hash size={18} color="var(--accent-green)" />
              <h3 style={styles.panelTitle}>Hashtags Tendencia en Zona</h3>
            </div>
            <div style={styles.tagCloud}>
              {['#RosarioInsegura', '#Balacera', '#ZonaSur', '#Justicia', '#Seguridad'].map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlatformIcon = ({ icon, label, active }: any) => (
  <div style={{ ...styles.platform, opacity: active ? 1 : 0.4 }}>
    {icon}
    <span>{label}</span>
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
    flexDirection: 'column' as const,
    gap: '16px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(0,0,0,0.3)',
    padding: '12px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  searchInput: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '16px',
    outline: 'none',
  },
  searchBtn: {
    background: 'var(--primary-cyan)',
    color: '#000',
    padding: '10px 24px',
    borderRadius: '10px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  platforms: {
    display: 'flex',
    gap: '20px',
    padding: '0 8px',
  },
  platform: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px',
    flex: 1,
    minHeight: 0,
  },
  resultsPanel: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  panelTitle: {
    margin: 0,
    fontSize: '16px',
    color: 'var(--text-main)',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  emptyResults: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    color: 'var(--text-muted)',
    textAlign: 'center' as const,
    padding: '60px 0',
  },
  resultItem: {
    padding: '16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  platformBadge: {
    fontSize: '10px',
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    color: 'var(--primary-cyan)',
  },
  resultDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    flex: 1,
  },
  riskBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 700,
  },
  resultUser: {
    margin: 0,
    fontSize: '15px',
    color: 'var(--text-main)',
  },
  resultText: {
    margin: 0,
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  resultFooter: {
    display: 'flex',
    gap: '20px',
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255,255,255,0.03)',
  },
  actionLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--primary-cyan)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  sideCard: {
    padding: '20px',
  },
  networkMock: {
    height: '100px',
    position: 'relative' as const,
    marginBottom: '16px',
  },
  node: {
    position: 'absolute' as const,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'var(--primary-blue)',
    boxShadow: '0 0 10px var(--primary-blue)',
  },
  connection: {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    width: '100px',
    height: '40px',
    borderTop: '2px solid rgba(255,255,255,0.1)',
    transform: 'rotate(20deg)',
  },
  tagCloud: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  tag: {
    fontSize: '11px',
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    color: 'var(--primary-cyan)',
    cursor: 'pointer',
  }
};

export default OsintSearch;
