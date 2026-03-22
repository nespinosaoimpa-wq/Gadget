import { useState, useEffect, useMemo } from 'react';
import { useGeoStore } from '../../store/geoStore';
import { 
  Play, Pause, SkipBack, X, 
  FastForward, Timer, Calendar 
} from 'lucide-react';

const TimelinePlayer = ({ onClose }: { onClose: () => void }) => {
  const { setFilters } = useGeoStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // Days per step
  
  // Calculate date range from incidents or use default (last 30 days)
  const rangeStart = useMemo(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), []);
  const rangeEnd = useMemo(() => new Date(), []);
  
  const [currentDate, setCurrentDate] = useState(rangeStart);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDate((prev) => {
          const next = new Date(prev.getTime() + 24 * 60 * 60 * 1000 * speed);
          if (next > rangeEnd) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, rangeEnd]);

  // Sync store filter with timeline date
  useEffect(() => {
    setFilters({ 
      dateRange: [rangeStart.toISOString(), currentDate.toISOString()] 
    });
  }, [currentDate, rangeStart, setFilters]);

  const progress = ((currentDate.getTime() - rangeStart.getTime()) / (rangeEnd.getTime() - rangeStart.getTime())) * 100;

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Timer size={18} className="text-cyan" />
          <span style={styles.title}>Evolución Temporal del Delito</span>
        </div>
        <div style={styles.dateDisplay}>
          <Calendar size={14} />
          <span>{currentDate.toLocaleDateString()}</span>
          <button onClick={onClose} style={styles.closeBtn}><X size={16} /></button>
        </div>
      </div>

      <div style={styles.controlsRow}>
        <div style={styles.mainControls}>
          <button style={styles.iconBtn} onClick={() => setCurrentDate(rangeStart)}><SkipBack size={18} /></button>
          <button 
            style={styles.playBtn} 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
          </button>
          <button style={styles.iconBtn} onClick={() => setSpeed(s => s === 5 ? 1 : s + 2)}>
            <FastForward size={18} />
            <span style={{ fontSize: '0.6rem', marginLeft: '4px' }}>{speed}x</span>
          </button>
        </div>

        <div style={styles.sliderWrapper}>
          <div style={styles.sliderTrack}>
            <div style={{ ...styles.sliderProgress, width: `${progress}%` }} />
            <input 
              type="range" 
              min={rangeStart.getTime()} 
              max={rangeEnd.getTime()} 
              value={currentDate.getTime()}
              onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value)))}
              style={styles.rangeInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px'
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-bright)',
    letterSpacing: '0.5px'
  },
  dateDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.9rem',
    color: 'var(--primary-cyan)',
    fontWeight: '700',
    background: 'rgba(0, 212, 255, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    marginLeft: '5px'
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  mainControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  playBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'var(--primary-cyan)',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)',
    transition: 'transform 0.2s'
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  sliderWrapper: {
    flex: 1,
    padding: '0 10px'
  },
  sliderTrack: {
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },
  sliderProgress: {
    position: 'absolute' as const,
    left: 0,
    height: '100%',
    background: 'var(--primary-cyan)',
    borderRadius: '3px',
    boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
  },
  rangeInput: {
    width: '100%',
    position: 'absolute' as const,
    background: 'transparent',
    appearance: 'none' as const,
    outline: 'none',
    cursor: 'pointer',
    zIndex: 2,
    margin: 0
  }
};

export default TimelinePlayer;
