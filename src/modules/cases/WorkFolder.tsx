import { useState, useMemo } from 'react';
import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { 
  FileText, MessageSquare, 
  Search, Plus, Upload, Maximize2, Info 
} from 'lucide-react';

interface WorkFolderProps {
  // _caseId might be used later for filtering sources
}

const WorkFolder = ({}: WorkFolderProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Mock data for the file tree (NotebookLM Sources)
  const treeItems = useMemo(() => ({
    root: { index: 'root', isFolder: true, children: ['folder1', 'folder2', 'folder3'], data: 'Carpeta de Trabajo' },
    folder1: { index: 'folder1', isFolder: true, children: ['file1', 'file2'], data: 'Actuaciones Iniciales' },
    file1: { index: 'file1', isFolder: false, data: 'Acta_Procedimiento_001.pdf' },
    file2: { index: 'file2', isFolder: false, data: 'Denuncia_Web_123.pdf' },
    folder2: { index: 'folder2', isFolder: true, children: ['file3', 'file4'], data: 'Pericias y Evidencias' },
    file3: { index: 'file3', isFolder: false, data: 'Informe_Balistico_04.docx' },
    file4: { index: 'file4', isFolder: false, data: 'Fotos_Lugar_Hecho.zip' },
    folder3: { index: 'folder3', isFolder: true, children: ['file5'], data: 'Documentos Generados' },
    file5: { index: 'file5', isFolder: false, data: 'Orden_Allanamiento.docx' },
  }), []);

  const dataProvider = useMemo(() => new StaticTreeDataProvider(treeItems, (item, newName) => ({ ...item, data: newName })), [treeItems]);

  return (
    <div style={styles.container}>
      {/* 3-Panel Layout */}
      <div style={styles.layout}>
        
        {/* Panel 1: Sources (Library) */}
        <div style={styles.panelSources}>
          <div style={styles.panelHeader}>
            <div style={styles.headerTitle}>
              <Plus size={16} /> FUENTES
            </div>
            <div style={styles.headerActions}>
              <button style={styles.iconBtn}><Upload size={14} /></button>
            </div>
          </div>
          <div style={styles.searchContainer}>
            <Search size={14} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar fuentes..." 
              style={styles.searchInput} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <div style={styles.treeContainer}>
            <UncontrolledTreeEnvironment
              dataProvider={dataProvider}
              getItemTitle={item => item.data}
              viewState={{}}
              onFocusItem={item => setSelectedItem(item.index as string)}
              canDragAndDrop={true}
              canReorderItems={true}
            >
              <Tree treeId="sources-tree" rootItem="root" treeLabel="Fuentes de la Causa" />
            </UncontrolledTreeEnvironment>
          </div>
        </div>

        {/* Panel 2: Content Viewer (Center) */}
        <div style={styles.panelContent}>
          <div style={styles.panelHeader}>
            <div style={styles.headerTitle}>
              {selectedItem ? treeItems[selectedItem as keyof typeof treeItems]?.data : 'Seleccionar Fuente'}
            </div>
            <div style={styles.headerActions}>
              <button style={styles.iconBtn}><Maximize2 size={14} /></button>
            </div>
          </div>
          
          <div style={styles.contentBody}>
            {!selectedItem ? (
              <div style={styles.emptyState}>
                <FileText size={64} style={{ opacity: 0.1, marginBottom: '20px' }} />
                <h3>Análisis de Fuentes de Investigación</h3>
                <p>Seleccione un documento del panel izquierdo para visualizar su contenido, extraer datos y vincularlo a la causa.</p>
                <div style={styles.tipBox}>
                  <Info size={16} />
                  <span>Tip: Puede arrastrar documentos entre carpetas para organizar su IPP.</span>
                </div>
              </div>
            ) : (
              <div style={styles.viewerPlaceholder}>
                <div className="glass-panel" style={styles.docSimulator}>
                  <div style={styles.docHeader}>
                    <div style={styles.docLineSm} />
                    <div style={styles.docLineLg} />
                  </div>
                  <div style={styles.docContent}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} style={{ marginBottom: '15px' }}>
                        <div style={{...styles.docLineMd, width: `${Math.random() * 40 + 60}%`}} />
                        <div style={{...styles.docLineSm, width: '90%'}} />
                        <div style={{...styles.docLineSm, width: '95%'}} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Intelligence (Right) */}
        <div style={styles.panelIntelligence}>
          <div style={styles.panelHeader}>
            <div style={styles.headerTitle}>
              <MessageSquare size={16} /> HALLAZGOS Y NOTAS
            </div>
          </div>
          <div style={styles.intelligenceBody}>
            <div style={styles.notesSection}>
              <label style={styles.notesLabel}>Anotaciones del Investigador</label>
              <textarea 
                placeholder="Escriba aquí los puntos clave, discrepancias o vínculos hallados en este documento..." 
                style={styles.notesInput}
              />
            </div>
            
            <div style={styles.extractionSection}>
              <label style={styles.notesLabel}>Entidades Extraídas</label>
              <div style={styles.tagList}>
                <span style={styles.tag}>DNI 23.444.111</span>
                <span style={styles.tag}>Calle Mendoza 1200</span>
                <span style={styles.tag}>Patente GHK-492</span>
              </div>
              <button style={styles.extraBtn}>
                <Plus size={14} /> Vincular Entidad
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '700px',
    width: '100%',
    overflow: 'hidden',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr 300px',
    height: '100%',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  panelSources: {
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.2)',
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.1)',
  },
  panelIntelligence: {
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    background: 'rgba(0,0,0,0.2)',
  },
  panelHeader: {
    padding: '12px 16px',
    height: '48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(255,255,255,0.02)',
  },
  headerTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  headerActions: {
    display: 'flex',
    gap: '4px',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    '&:hover': { background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }
  },
  searchContainer: {
    padding: '10px 12px',
    position: 'relative' as const,
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '22px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '6px',
    padding: '6px 10px 6px 30px',
    color: 'var(--text-main)',
    fontSize: '12px',
    outline: 'none',
  },
  treeContainer: {
    flex: 1,
    padding: '0 8px',
    overflowY: 'auto' as const,
    // Customizing the react-complex-tree styles (done via CSS classes usually, but styles here too)
  },
  contentBody: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
  },
  tipBox: {
    marginTop: '30px',
    padding: '12px 20px',
    borderRadius: '8px',
    background: 'rgba(0,212,255,0.05)',
    border: '1px solid rgba(0,212,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: 'var(--primary-cyan)',
    maxWidth: '400px',
  },
  viewerPlaceholder: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto' as const,
    height: '100%',
  },
  docSimulator: {
    width: '100%',
    maxWidth: '700px',
    background: '#fff',
    minHeight: '800px',
    padding: '60px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    color: '#333',
  },
  docHeader: {
    borderBottom: '2px solid #ddd',
    paddingBottom: '20px',
    marginBottom: '40px',
  },
  docLineLg: { height: '12px', background: '#eee', borderRadius: '4px', width: '60%', marginBottom: '10px' },
  docLineMd: { height: '8px', background: '#f5f5f5', borderRadius: '4px', width: '40%', marginBottom: '8px' },
  docLineSm: { height: '6px', background: '#fafafa', borderRadius: '4px', width: '100%', marginBottom: '6px' },
  docContent: {
    textAlign: 'justify' as const,
  },
  intelligenceBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
    gap: '24px',
  },
  notesSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  notesLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
  },
  notesInput: {
    width: '100%',
    height: '250px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: 'var(--text-main)',
    fontSize: '13px',
    outline: 'none',
    resize: 'none' as const,
    lineHeight: '1.6',
  },
  extractionSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  tagList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  tag: {
    fontSize: '12px',
    padding: '6px 10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '4px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    '&:hover': { borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }
  },
  extraBtn: {
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.2)',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '4px',
    '&:hover': { color: 'var(--primary-cyan)', borderColor: 'var(--primary-cyan)' }
  }
};

export default WorkFolder;
