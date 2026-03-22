import { useState } from 'react';
import { useCaseStore } from '../../store/caseStore';
import { getStatusColor, getClassificationIcon } from './caseHelpers';
import { Search, Plus, Filter, LayoutGrid, List as ListIcon, MoreHorizontal, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CaseList = () => {
  const { cases } = useCaseStore();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.cuij.includes(search)
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Investigaciones en Curso</h1>
          <p style={styles.subtitle}>{cases.length} causas activas en el sistema</p>
        </div>
        
        <div style={styles.actions}>
          <div style={styles.searchBox}>
            <Search size={18} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar por CUIJ o Carátula..." 
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={styles.viewToggle}>
            <button 
              onClick={() => setViewMode('list')}
              style={{...styles.toggleBtn, background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent'}}
            >
              <ListIcon size={18} color={viewMode === 'list' ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              style={{...styles.toggleBtn, background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent'}}
            >
              <LayoutGrid size={18} color={viewMode === 'grid' ? 'var(--primary-cyan)' : 'var(--text-muted)'} />
            </button>
          </div>

          <button style={styles.filterBtn}>
            <Filter size={18} /> Filtros
          </button>
          
          <button style={styles.createBtn} onClick={() => navigate('/causas/nuevo')}>
            <Plus size={18} /> Nueva Causa
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="glass-panel" style={styles.listContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadTr}>
                <th style={styles.th}>Clasif.</th>
                <th style={styles.th}>CUIJ</th>
                <th style={styles.th}>Carátula / Título</th>
                <th style={styles.th}>Delito</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Fiscal / Fiscalía</th>
                <th style={styles.th}>Inicio</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => (
                <tr key={c.id} style={styles.tr} onClick={() => navigate(`/causas/${c.id}`)}>
                  <td style={styles.td}>
                    <span title={c.classification} style={{ fontSize: '18px', cursor: 'help' }}>
                      {getClassificationIcon(c.classification)}
                    </span>
                  </td>
                  <td style={{...styles.td, fontWeight: 600, color: 'var(--primary-cyan)'}}>{c.cuij}</td>
                  <td style={styles.td}>
                    <div style={styles.caseInfo}>
                      <span style={styles.caseTitle}>{c.title}</span>
                      <span style={styles.caseDesc}>{c.description.substring(0, 60)}...</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{c.type}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.statusCell}>
                      <span style={{...styles.statusDot, background: getStatusColor(c.status)}}></span>
                      <span style={{ color: getStatusColor(c.status), fontSize: '13px', fontWeight: 500 }}>{c.status}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.fiscalCell}>
                      <span>{c.fiscal}</span>
                      <small style={{ color: 'var(--text-muted)', display: 'block' }}>{c.fiscalia}</small>
                    </div>
                  </td>
                  <td style={{...styles.td, color: 'var(--text-muted)'}}>{c.startDate}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button style={styles.iconAction} onClick={(e) => { e.stopPropagation(); navigate(`/causas/${c.id}`); }}>
                        <Eye size={18} />
                      </button>
                      <button style={styles.iconAction} onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.gridContainer}>
          {filteredCases.map((c) => (
            <div 
              key={c.id} 
              className="glass-panel" 
              style={styles.card}
              onClick={() => navigate(`/causas/${c.id}`)}
            >
              <div style={styles.cardHeader}>
                <span title={c.classification} style={{ fontSize: '20px' }}>{getClassificationIcon(c.classification)}</span>
                <span style={styles.cardStatus}>{c.status}</span>
              </div>
              <h3 style={styles.cardTitle}>{c.title}</h3>
              <p style={styles.cardCuij}>{c.cuij}</p>
              <p style={styles.cardDesc}>{c.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.typeBadge}>{c.type}</span>
                <span style={styles.cardDate}>{c.startDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '20px',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    fontSize: '28px',
    color: 'var(--text-main)',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: '4px 0 0 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  searchBox: {
    position: 'relative' as const,
    minWidth: '280px',
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
    padding: '10px 12px 10px 40px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    outline: 'none',
  },
  viewToggle: {
    display: 'flex',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  toggleBtn: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontWeight: 500,
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-blue))',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
  },
  listContainer: {
    overflow: 'hidden',
    padding: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    textAlign: 'left' as const,
  },
  theadTr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
  },
  th: {
    padding: '16px 20px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    '&:hover': {
      background: 'rgba(255,255,255,0.02)',
    }
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: 'var(--text-main)',
    verticalAlign: 'middle',
  },
  caseInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  caseTitle: {
    fontWeight: 500,
    display: 'block',
  },
  caseDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  typeBadge: {
    padding: '4px 10px',
    borderRadius: '4px',
    background: 'rgba(0, 212, 255, 0.1)',
    color: 'var(--primary-cyan)',
    fontSize: '11px',
    fontWeight: 600,
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  fiscalCell: {
    lineHeight: '1.2',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  iconAction: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '6px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      color: 'var(--text-main)',
      background: 'rgba(255,255,255,0.1)',
    }
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    padding: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  cardStatus: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontSize: '18px',
    margin: '0 0 4px 0',
    color: 'var(--text-main)',
  },
  cardCuij: {
    fontSize: '13px',
    color: 'var(--primary-cyan)',
    fontWeight: 600,
    margin: '0 0 12px 0',
  },
  cardDesc: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '16px',
  },
  cardDate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  }
};

export default CaseList;
