import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User, Key, KeyRound, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const Login = () => {
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Offline/demo mode — bypass auth
      setStep('2fa');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Credenciales inválidas. Verifique usuario y contraseña.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Correo no confirmado. Revise su bandeja de entrada.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error de conexión. Verifique su red.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    // In demo mode, any 6-digit code works
    if (totpCode.length === 6) {
      navigate('/dashboard');
    } else {
      setError('Ingrese un código de 6 dígitos.');
    }
  };
  const handleGuestAccess = () => {
    localStorage.setItem('sigic_guest_session', 'true');
    window.location.href = '/dashboard';
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel animate-fade-in" style={styles.card}>
        
        <div style={styles.header}>
          <ShieldAlert size={48} color="var(--primary-cyan)" style={{ filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.8))' }} />
          <h1 style={styles.title}>SIGIC</h1>
          <p style={styles.subtitle}>Sistema Integral de Gestión e Investigación Criminal</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {!isSupabaseConfigured() && (
          <div style={styles.demoBox}>
            🔓 Modo Demo — Sin conexión a base de datos
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleLogin} style={styles.form} className="animate-fade-in">
            <div style={styles.inputGroup}>
              <User size={18} style={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="Email institucional" 
                style={styles.input} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <Lock size={18} style={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                style={styles.input} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <Loader2 size={18} className="animate-spin" /> Autenticando...
                </span>
              ) : (
                'Ingresar al Sistema'
              )}
            </button>
            <div style={styles.links}>
              <a href="#" style={styles.link}>¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FA} style={styles.form} className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <KeyRound size={32} color="var(--primary-cyan)" style={{ margin: '0 auto 10px' }}/>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Ingresa el código de 6 dígitos de tu aplicación de autenticación (TOTP).
              </p>
            </div>
            <div style={styles.inputGroup}>
              <Key size={18} style={styles.inputIcon} />
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }} 
                required 
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            
            <button type="submit" style={styles.button}>
              Verificar Código
            </button>
            <div style={styles.links}>
              <a href="#" style={styles.link}>Usar código de respaldo</a>
            </div>
          </form>
        )}

        <div style={styles.footer}>
          <button 
            type="button" 
            onClick={handleGuestAccess}
            style={styles.guestBtn}
          >
            Acceso de Cortesía (Modo Demo)
          </button>
          <span style={styles.securityBadge}>🔒 Cifrado AES-256 | TLS 1.3</span>
          <span style={styles.securityBadge}>Nivel de Acceso Restringido</span>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '30px',
  },
  header: {
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '32px',
    color: 'var(--text-main)',
    margin: 0,
    textShadow: '0 0 10px rgba(255,255,255,0.2)',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--primary-cyan)',
    margin: 0,
    fontWeight: 500 as const,
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    position: 'relative' as const,
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 44px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)',
    color: 'var(--text-main)',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600 as const,
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
    transition: 'all 0.2s',
  },
  errorBox: {
    background: 'rgba(255, 77, 79, 0.1)',
    border: '1px solid rgba(255, 77, 79, 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ff4d4f',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  demoBox: {
    background: 'rgba(250, 173, 20, 0.1)',
    border: '1px solid rgba(250, 173, 20, 0.3)',
    borderRadius: '8px',
    padding: '10px 16px',
    color: '#faad14',
    fontSize: '13px',
    textAlign: 'center' as const,
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  link: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  footer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
  },
  securityBadge: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    background: 'rgba(0,0,0,0.4)',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  guestBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--primary-cyan)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
    transition: 'all 0.2s',
  }
};

export default Login;
