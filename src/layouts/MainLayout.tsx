import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';

const MainLayout = () => {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Header />
        <main style={styles.contentArea}>
          <div className="animate-fade-in" style={{ height: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
    position: 'relative' as const,
  }
};

export default MainLayout;
