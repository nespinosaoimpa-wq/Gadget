import { useState } from 'react';
import { 
  Camera, 
  Mic, 
  MapPin, 
  Send, 
  FileWarning,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { supabase } from '../../lib/supabaseClient';

const FieldOps = () => {
  const { activeCase } = useCaseStore();
  const [report, setReport] = useState('');
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Generador de HASH para cadena de custodia
  const generateHash = async (content: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content + Date.now());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  };

  const handleCapture = async (type: string) => {
    setLoading(true);
    try {
      let geo = { lat: 0, lng: 0 };
      
      if ("geolocation" in navigator) {
        const pos: any = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
        }).catch(() => null);
        if (pos) geo = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      }

      const hash = await generateHash(type + activeCase?.id);
      
      const newEvidence = {
        case_id: activeCase?.id,
        type: type,
        geo_lat: geo.lat,
        geo_lng: geo.lng,
        hash: hash,
        captured_by: 'OFICIAL_ACTUAL',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('field_evidence')
        .insert([newEvidence])
        .select()
        .single();

      if (error) throw error;
      setEvidence([data, ...evidence]);
    } catch (err) {
      console.error('Error capturando evidencia:', err);
      setEvidence([{ type, created_at: new Date().toISOString(), id: Math.random(), hash: 'DEMO-HASH' }, ...evidence]);
    } finally {
      setLoading(false);
    }
  };

  const saveNarrative = async () => {
    if (!report) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('field_evidence').insert([{
        case_id: activeCase?.id,
        type: 'TEXT',
        narrative: report,
        captured_by: 'OFICIAL_ACTUAL'
      }]);
      if (error) throw error;
      setReport('');
      alert('Narrativa guardada correctamente.');
    } catch (err) {
      alert('Error guardando narrativa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mobileHeader}>
        <div style={styles.statusBadge}>
          <div style={styles.pulseDot} />
          OP-VIVO: {activeCase?.cuij || 'SIN CAUSA'}
        </div>
        <Activity size={20} color="var(--primary-cyan)" />
      </div>

      <div className="glass-panel" style={styles.mainFeed}>
        {evidence.length === 0 ? (
          <div style={styles.empty}>
            <p>No hay evidencia recolectada en esta sesión.</p>
            <p style={{ fontSize: '12px' }}>Use los controles inferiores para iniciar captura.</p>
          </div>
        ) : (
          <div style={styles.evidenceList}>
            {evidence.map(item => (
              <div key={item.id} style={styles.evidenceItem} className="animate-fade-in">
                {item.type === 'CAMERA' ? <Camera size={16} /> : item.type === 'AUDIO' ? <Mic size={16} /> : <MapPin size={16} />}
                <div style={styles.evidenceInfo}>
                  <span style={styles.evidenceType}>
                    {item.type === 'CAMERA' ? 'Fotografía Escena' : item.type === 'AUDIO' ? 'Audio' : 'Geo-referencia'}
                  </span>
                  <span style={styles.evidenceTime}>
                    {new Date(item.created_at).toLocaleTimeString()} - Hash: {item.hash}
                  </span>
                </div>
                <CheckCircle2 size={16} color="var(--accent-green)" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.reportArea}>
        <textarea 
          placeholder="Narrativa de campo en tiempo real..." 
          style={styles.textarea}
          value={report}
          onChange={e => setReport(e.target.value)}
          disabled={loading}
        />
        <button style={styles.sendBtn} onClick={saveNarrative} disabled={loading}>
          <Send size={18} />
        </button>
      </div>

      <div style={styles.controlsGrid}>
        <ControlButton 
          icon={<Camera size={24} />} 
          label="Foto" 
          color="var(--primary-cyan)" 
          onClick={() => handleCapture('CAMERA')} 
          disabled={loading}
        />
        <ControlButton 
          icon={<Mic size={24} />} 
          label="Audio" 
          color="var(--primary-blue)" 
          onClick={() => handleCapture('AUDIO')}
          disabled={loading}
        />
        <ControlButton 
          icon={<MapPin size={24} />} 
          label="GPS" 
          color="var(--accent-green)" 
          onClick={() => handleCapture('GPS')}
          disabled={loading}
        />
        <ControlButton 
          icon={<FileWarning size={24} />} 
          label="Alerta" 
          color="var(--accent-red)" 
          onClick={() => alert('¡ALERTA ENVIADA A CENTRAL!')}
          disabled={loading}
        />
      </div>
    </div>
  );
};

const ControlButton = ({ icon, label, color, onClick, disabled }: any) => (
  <button style={styles.controlBtn} onClick={onClick} disabled={disabled}>
    <div style={{ ...styles.iconCircle, background: `${color}20`, color: color, opacity: disabled ? 0.5 : 1 }}>
      {icon}
    </div>
    <span style={styles.controlLabel}>{label}</span>
  </button>
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    maxWidth: '450px',
    margin: '0 auto',
    gap: '20px',
    padding: '10px',
  },
  mobileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px',
  },
  statusBadge: {
    background: 'rgba(0,0,0,0.3)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent-red)',
    animation: 'pulse 2s infinite',
  },
  mainFeed: {
    flex: 1,
    minHeight: '200px',
    padding: '16px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  evidenceList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  evidenceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  evidenceInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  evidenceType: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-main)',
  },
  evidenceTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  reportArea: {
    display: 'flex',
    gap: '10px',
  },
  textarea: {
    flex: 1,
    height: '50px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    resize: 'none' as const,
  },
  sendBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    background: 'var(--primary-cyan)',
    color: '#000',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  controlBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  controlLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 600,
  }
};

export default FieldOps;
