import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useGeoStore } from '../../store/geoStore';
import GeoLayers from './GeoLayers';
import GeoControls from './GeoControls';
import TimelinePlayer from './TimelinePlayer';
import ZoneManager from './ZoneManager';
import { 
  Layers, 
  Activity, 
  Clock, 
  Shield, 
  Maximize2,
  List
} from 'lucide-react';

const CrimeMap = () => {
  const { importMockGeoData } = useGeoStore();
  const [activePanel, setActivePanel] = useState<'layers' | 'filters' | 'zones' | 'stats'>('layers');
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  useEffect(() => {
    importMockGeoData();
  }, [importMockGeoData]);

  return (
    <div style={styles.container}>
      {/* Sidebar / Floating Controls */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Shield className="text-cyan" size={24} />
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>SIGIC GEO</h2>
        </div>
        
        <div style={styles.navIcons}>
          <NavBtn 
            active={activePanel === 'layers'} 
            onClick={() => setActivePanel('layers')} 
            icon={<Layers size={20} />} 
            label="Capas"
          />
          <NavBtn 
            active={activePanel === 'filters'} 
            onClick={() => setActivePanel('filters')} 
            icon={<Activity size={20} />} 
            label="Filtros"
          />
          <NavBtn 
            active={activePanel === 'zones'} 
            onClick={() => setActivePanel('zones')} 
            icon={<Maximize2 size={20} />} 
            label="Zonas"
          />
          <NavBtn 
            active={activePanel === 'stats'} 
            onClick={() => setActivePanel('stats')} 
            icon={<List size={20} />} 
            label="Listado"
          />
        </div>

        <div style={styles.panelContent}>
          {activePanel === 'layers' && <GeoControls type="layers" />}
          {activePanel === 'filters' && <GeoControls type="filters" />}
          {activePanel === 'zones' && <ZoneManager />}
          {activePanel === 'stats' && <GeoControls type="stats" />}
        </div>

        <div style={styles.sidebarFooter}>
          <button 
            className={`primary-btn ${isTimelineOpen ? 'active' : ''}`}
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            style={{ width: '100%', gap: '10px' }}
          >
            <Clock size={18} /> {isTimelineOpen ? 'Cerrar Timeline' : 'Ver Evolución'}
          </button>
        </div>
      </div>

      {/* Main Map Area */}
      <div style={styles.mapWrapper}>
        <MapContainer 
          center={[-31.633, -60.72]} 
          zoom={13} 
          style={{ height: '100%', width: '100%', background: '#0a0c14' }}
          zoomControl={false}
        >
          {/* CartoDB Dark Matter Tiles (No API key needed) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          <ZoomControl position="bottomright" />
          
          {/* Custom Geo Layers */}
          <GeoLayers />
        </MapContainer>

        {/* Timeline Overlay */}
        {isTimelineOpen && (
          <div style={styles.timelineOverlay}>
            <TimelinePlayer onClose={() => setIsTimelineOpen(false)} />
          </div>
        )}

        {/* Map Legend (Floating) */}
        <div style={styles.legend} className="glass-panel">
          <div style={styles.legendTitle}>Referencias</div>
          <LegendItem color="#ff4d4f" label="Microtráfico" />
          <LegendItem color="#faad14" label="Narcotráfico" />
          <LegendItem color="#ff4d4f" label="Homicidio" />
          <LegendItem color="#1890ff" label="Robo" />
          <LegendItem color="#722ed1" label="Amenazas" />
        </div>
      </div>
    </div>
  );
};

// Sub-components
const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    style={{
      ...styles.navBtn,
      backgroundColor: active ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
      color: active ? 'var(--primary-cyan)' : 'var(--text-muted)',
      borderBottom: active ? '2px solid var(--primary-cyan)' : '2px solid transparent'
    }}
  >
    {icon}
    <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{label}</span>
  </button>
);

const LegendItem = ({ color, label }: any) => (
  <div style={styles.legendItem}>
    <div style={{ ...styles.dot, backgroundColor: color }} />
    <span>{label}</span>
  </div>
);

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  sidebar: {
    width: '350px',
    background: 'rgba(10, 12, 20, 0.95)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
  },
  sidebarHeader: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  navIcons: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    background: 'rgba(0,0,0,0.2)',
  },
  navBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
  },
  panelContent: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px',
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative' as const,
  },
  legend: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    padding: '15px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    pointerEvents: 'none' as const,
  },
  legendTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-bright)',
    marginBottom: '5px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
  },
  timelineOverlay: {
    position: 'absolute' as const,
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    zIndex: 2000,
  }
};

export default CrimeMap;
