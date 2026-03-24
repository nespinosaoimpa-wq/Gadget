import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL ERROR CAUGHT BY BOUNDARY:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ff4d4f',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️ Error Crítico en SIGIC</h1>
          <p style={{ color: '#ccc', maxWidth: '500px', marginBottom: '20px' }}>
            Se ha producido un error inesperado que impide la carga de la aplicación. 
            Esto puede deberse a variables de entorno faltantes o un fallo en el módulo de gráficos.
          </p>
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '16px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            textAlign: 'left',
            overflow: 'auto',
            maxHeight: '200px',
            width: '100%',
            maxWidth: '600px',
            border: '1px solid rgba(255,77,79,0.2)'
          }}>
            <code style={{ color: '#ff7875' }}>{this.state.error?.toString()}</code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '12px 24px',
              background: '#1677ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Refrescar Aplicación
          </button>
        </div>
      );
    }

    return this.children;
  }
}

export default ErrorBoundary;
