import { useEffect, useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  RotateCw,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useCaseStore } from '../../store/caseStore';
import type { WorkflowStatus } from '../../types/workflowTypes';

const COLUMNS: { id: WorkflowStatus; label: string; color: string }[] = [
  { id: 'PENDIENTE', label: 'Pendiente', color: 'var(--text-muted)' },
  { id: 'EN_CURSO', label: 'En Curso', color: 'var(--primary-cyan)' },
  { id: 'REVISION', label: 'Revisión', color: 'var(--primary-blue)' },
  { id: 'COMPLETADO', label: 'Completado', color: 'var(--accent-green)' },
];

const WorkflowBoard = () => {
  const { activeCase } = useCaseStore();
  const { 
    workflows, 
    tasks, 
    fetchCaseWorkflows, 
    fetchWorkflowTasks, 
    activeWorkflow, 
    setActiveWorkflow,
    moveTask,
    addTask,
    loading 
  } = useWorkflowStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState<WorkflowStatus | null>(null);

  useEffect(() => {
    if (activeCase) {
      fetchCaseWorkflows(activeCase.id);
    }
  }, [activeCase, fetchCaseWorkflows]);

  useEffect(() => {
    if (workflows.length > 0 && !activeWorkflow) {
      setActiveWorkflow(workflows[0]);
    }
  }, [workflows, activeWorkflow, setActiveWorkflow]);

  useEffect(() => {
    if (activeWorkflow) {
      fetchWorkflowTasks(activeWorkflow.id);
    }
  }, [activeWorkflow, fetchWorkflowTasks]);

  const handleMoveTask = (taskId: string, currentStatus: WorkflowStatus) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    if (currentIndex < COLUMNS.length - 1) {
      const nextStatus = COLUMNS[currentIndex + 1].id;
      moveTask(taskId, nextStatus, 0);
    }
  };

  const handleAddTask = (e: React.FormEvent, status: WorkflowStatus) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeWorkflow) return;
    
    addTask({
      workflow_id: activeWorkflow.id,
      title: newTaskTitle,
      status: status,
      metadata: {}
    });
    setNewTaskTitle('');
    setShowAddTask(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleInfo}>
          <h1 style={styles.title}>Gestión de Workflows Investigativos</h1>
          <p style={styles.subtitle}>
            Procesos activos para: <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>{activeCase?.cuij || 'Ninguna causa seleccionada'}</span>
          </p>
        </div>
        <div style={styles.controls}>
          <div style={styles.searchBar}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Buscar tarea..." style={styles.searchInput} />
          </div>
          <button style={styles.filterBtn}><Filter size={18} /> Filtros</button>
        </div>
      </header>

      {/* Workflow Tabs */}
      <div style={styles.workflowTabs}>
        {workflows.map(wf => (
          <button 
            key={wf.id}
            style={{
              ...styles.tab,
              ...(activeWorkflow?.id === wf.id ? styles.activeTab : {})
            }}
            onClick={() => setActiveWorkflow(wf)}
          >
            {wf.template}
          </button>
        ))}
        <button style={styles.addWfBtn}><Plus size={16} /> Nuevo Proceso</button>
      </div>

      {loading ? (
        <div style={styles.loaderArea}>
          <RotateCw size={32} className="animate-spin" color="var(--primary-cyan)" />
          <span>Cargando tablero...</span>
        </div>
      ) : (
        <div style={styles.board}>
          {COLUMNS.map(col => (
            <div key={col.id} style={styles.column}>
              <div style={styles.columnHeader}>
                <div style={styles.columnTitleInfo}>
                  <div style={{ ...styles.colorDot, background: col.color }} />
                  <span style={styles.columnLabel}>{col.label}</span>
                  <span style={styles.taskCount}>{tasks.filter(t => t.status === col.id).length}</span>
                </div>
                <button style={styles.colActionBtn} onClick={() => setShowAddTask(col.id)}><Plus size={16} /></button>
              </div>

              <div style={styles.taskList}>
                {showAddTask === col.id && (
                  <form onSubmit={(e) => handleAddTask(e, col.id)} style={styles.addTaskForm}>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Título de la tarea..." 
                      style={styles.addTaskInput}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onBlur={() => !newTaskTitle && setShowAddTask(null)}
                    />
                  </form>
                )}

                {tasks.filter(t => t.status === col.id).map(task => (
                  <div key={task.id} className="glass-panel" style={styles.taskCard}>
                    <div style={styles.taskTop}>
                      <span style={styles.taskType}>Tarea Táctica</span>
                      <button style={styles.taskMore}><MoreVertical size={14} /></button>
                    </div>
                    <h4 style={styles.taskTitle}>{task.title}</h4>
                    <div style={styles.taskFooter}>
                      <div style={styles.taskMeta}>
                        <Clock size={12} />
                        <span>Hace 2h</span>
                      </div>
                      <button 
                        style={styles.moveBtn}
                        onClick={() => handleMoveTask(task.id, task.status)}
                        title="Mover a la siguiente etapa"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
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
    height: '100%',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleInfo: {
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
  controls: {
    display: 'flex',
    gap: '12px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.05)',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
    width: '180px',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-main)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  workflowTabs: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '12px',
  },
  tab: {
    padding: '8px 20px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'rgba(0, 212, 255, 0.1)',
    borderColor: 'var(--primary-cyan)',
    color: 'var(--primary-cyan)',
  },
  addWfBtn: {
    padding: '8px 12px',
    borderRadius: '20px',
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.2)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  board: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    overflowX: 'auto' as const,
    paddingBottom: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    minWidth: '280px',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 4px',
  },
  columnTitleInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  columnLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-main)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  taskCount: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  colActionBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  taskList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '4px',
  },
  taskCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    cursor: 'grab',
    transition: 'transform 0.2s',
  },
  taskTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskType: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--primary-cyan)',
    background: 'rgba(0,212,255,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  taskMore: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  taskTitle: {
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.4,
    color: 'var(--text-main)',
    fontWeight: 500,
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  moveBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    borderRadius: '4px',
    padding: '4px',
    display: 'flex',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loaderArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
  },
  addTaskForm: {
    width: '100%',
  },
  addTaskInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--primary-cyan)',
    background: 'rgba(0,0,0,0.2)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
  }
};

export default WorkflowBoard;
