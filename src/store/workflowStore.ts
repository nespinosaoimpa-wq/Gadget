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
  moveTask: (taskId: string, newStatus: WorkflowStatus, newOrder: number) => Promise<void>;
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
        .order('sort_order', { ascending: true });

      if (error) throw error;
      set({ tasks: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      // Fallback for demo
      if (get().tasks.length === 0) {
        set({
          tasks: [
            { id: 't1', workflow_id: workflowId, title: 'Identificación de domicilios', status: 'COMPLETADO', sort_order: 1, metadata: {} },
            { id: 't2', workflow_id: workflowId, title: 'Solicitud ante Juez de Garantías', status: 'EN_CURSO', sort_order: 2, metadata: {} },
            { id: 't3', workflow_id: workflowId, title: 'Coordinación con Fuerzas Federales', status: 'PENDIENTE', sort_order: 3, metadata: {} },
            { id: 't4', workflow_id: workflowId, title: 'Ejecución y Secuestro', status: 'PENDIENTE', sort_order: 4, metadata: {} },
          ]
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
      // Demo logic
      const newWf = {
        id: Math.random().toString(36).substr(2, 9),
        ...workflow,
        created_at: new Date().toISOString()
      } as CriminalWorkflow;
      set((state) => ({ workflows: [newWf, ...state.workflows] }));
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const { error } = await supabase
        .from('workflow_tasks')
        .update({ status, completed_at: status === 'COMPLETADO' ? new Date().toISOString() : null })
        .eq('id', taskId);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
      }));
    } catch (err: any) {
      console.error('Error updating task:', err);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
      }));
    }
  },

  moveTask: async (taskId, newStatus, newOrder) => {
    try {
      const { error } = await supabase
        .from('workflow_tasks')
        .update({ status: newStatus, sort_order: newOrder })
        .eq('id', taskId);

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === taskId ? { ...t, status: newStatus, sort_order: newOrder } : t
        ).sort((a, b) => a.sort_order - b.sort_order)
      }));
    } catch (err: any) {
      console.error('Error moving task:', err);
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === taskId ? { ...t, status: newStatus, sort_order: newOrder } : t
        ).sort((a, b) => a.sort_order - b.sort_order)
      }));
    }
  },

  addTask: async (task) => {
    try {
      const { data, error } = await supabase
        .from('workflow_tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [...state.tasks, data] }));
    } catch (err: any) {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        ...task,
        sort_order: get().tasks.length + 1
      } as WorkflowTask;
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    }
  }
}));
