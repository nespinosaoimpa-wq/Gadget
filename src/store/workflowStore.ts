import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import type { CriminalWorkflow, WorkflowTask, WorkflowStatus } from '../types/workflowTypes';

interface WorkflowState {
  workflows: CriminalWorkflow[];
  activeWorkflow: CriminalWorkflow | null;
  tasks: WorkflowTask[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCaseWorkflows: (caseId: string) => Promise<void>;
  fetchWorkflowTasks: (workflowId: string) => Promise<void>;
  createWorkflow: (workflow: Partial<CriminalWorkflow>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: WorkflowStatus) => Promise<void>;
  moveTask: (taskId: string, newStatus: WorkflowStatus, newPosition: number) => Promise<void>;
  addTask: (task: Partial<WorkflowTask>) => Promise<void>;
  setActiveWorkflow: (workflow: CriminalWorkflow | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  activeWorkflow: null,
  tasks: [],
  loading: false,
  error: null,

  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),

  fetchCaseWorkflows: async (caseId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ workflows: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      // Fallback for demo
      if (get().workflows.length === 0) {
        set({ 
          workflows: [
            {
              id: 'workflow-1',
              case_id: caseId,
              template: 'Allanamiento',
              status: 'EN_CURSO',
              created_by: 'system',
              created_at: new Date().toISOString(),
              due_date: new Date(Date.now() + 86400000).toISOString()
            }
          ]
        });
      }
    }
  },

  fetchWorkflowTasks: async (workflowId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('workflow_tasks')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('position', { ascending: true });

      if (error) throw error;
      // Map 'position' to 'sort_order' if needed by types, or just use 'position'
      set({ tasks: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      if (get().tasks.length === 0) {
        set({
          tasks: [
            { id: 't1', workflow_id: workflowId, title: 'Identificación de domicilios', status: 'COMPLETADO', position: 1, metadata: {} },
            { id: 't2', workflow_id: workflowId, title: 'Solicitud ante Juez de Garantías', status: 'EN_PROGRESO', position: 2, metadata: {} },
            { id: 't3', workflow_id: workflowId, title: 'Coordinación con Fuerzas Federales', status: 'PENDIENTE', position: 3, metadata: {} },
            { id: 't4', workflow_id: workflowId, title: 'Ejecución y Secuestro', status: 'PENDIENTE', position: 4, metadata: {} },
          ] as any
        });
      }
    }
  },

  createWorkflow: async (workflow) => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert([workflow])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ workflows: [data, ...state.workflows] }));
    } catch (err: any) {
      console.error('Error creating workflow:', err);
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const { error } = await supabase
        .from('workflow_tasks')
        .update({ 
          status, 
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
      }));
    } catch (err: any) {
      console.error('Error updating task:', err);
    }
  },

  moveTask: async (taskId, newStatus, newPosition) => {
    try {
      const { error } = await supabase
        .from('workflow_tasks')
        .update({ 
          status: newStatus, 
          position: newPosition, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', taskId);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
        ).sort((a, b) => (a.position || 0) - (b.position || 0))
      }));
    } catch (err: any) {
      console.error('Error moving task:', err);
    }
  },

  addTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('workflow_tasks')
        .insert([{ ...task, position: get().tasks.length }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (err: any) {
      console.error('Error adding task:', err);
    }
  }
}));
