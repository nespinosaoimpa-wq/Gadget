import { useState } from 'react';
import { 
  Zap, 
  Workflow, 
  ShieldCheck, 
  Smartphone, 
  Scale, 
  BarChart3, 
  Search, 
  Newspaper, 
  Bell 
} from 'lucide-react';
import WorkflowBoard from './WorkflowBoard';
import RaidWizard from './RaidWizard';
import FieldOps from './FieldOps';
import FiscalDashboard from './FiscalDashboard';
import AnalystToolkit from './AnalystToolkit';
import OsintSearch from './OsintSearch';
import PressGenerator from './PressGenerator';
import NotificationCenter from './NotificationCenter';

type AutomationTab = 'WORKFLOW' | 'RAIDS' | 'FIELD' | 'FISCAL' | 'ANALYST' | 'OSINT' | 'PRESS' | 'ALERTS';

const AutomationModule = () => {
  const [activeTab, setActiveTab] = useState<AutomationTab>('WORKFLOW');

  const tabs: { id: AutomationTab; label: string; icon: any }[] = [
    { id: 'WORKFLOW', label: 'Workflows', icon: <Workflow size={18} /> },
    { id: 'RAIDS', label: 'Allanamientos', icon: <ShieldCheck size={18} /> },
    { id: 'FIELD', label: 'Tareas de Calle', icon: <Smartphone size={18} /> },
    { id: 'FISCAL', label: 'Fiscalía', icon: <Scale size={18} /> },
    { id: 'ANALYST', label: 'Analista', icon: <BarChart3 size={18} /> },
    { id: 'OSINT', label: 'OSINT', icon: <Search size={18} /> },
    { id: 'PRESS', label: 'Prensa', icon: <Newspaper size={18} /> },
    { id: 'ALERTS', label: 'Alertas', icon: <Bell size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'WORKFLOW':
        return <WorkflowBoard />;
      case 'RAIDS':
        return <RaidWizard />;
      case 'FIELD':
        return <FieldOps />;
      case 'FISCAL':
        return <FiscalDashboard />;
      case 'ANALYST':
        return <AnalystToolkit />;
      case 'OSINT':
        return <OsintSearch />;
      case 'PRESS':
        return <PressGenerator />;
      case 'ALERTS':
        return <NotificationCenter />;
      default:
        return (
          <div style={styles.placeholder}>
            <Zap size={48} color="var(--primary-cyan)" />
            <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p>Módulo planificado para Fase 5</p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleArea}>
          <Zap size={24} color="var(--primary-cyan)" />
          <h1 style={styles.title}>Centro de Automatización e Inteligencia Operacional</h1>
        </div>
        <div style={styles.tabBar}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    gap: '24px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    color: 'var(--text-main)',
    margin: 0,
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.02)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    width: 'fit-content',
    overflowX: 'auto' as const,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  activeTab: {
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--primary-cyan)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '16px',
    color: 'var(--text-muted)',
    textAlign: 'center' as const,
  }
};

export default AutomationModule;
