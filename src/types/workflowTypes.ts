export type WorkflowStatus = 'PENDIENTE' | 'EN_CURSO' | 'REVISION' | 'COMPLETADO';

export interface WorkflowTask {
  id: string;
  workflow_id: string;
  title: string;
  status: WorkflowStatus;
  assigned_to?: string;
  completed_at?: string;
  position: number;
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CriminalWorkflow {
  id: string;
  case_id: string;
  template: string;
  status: WorkflowStatus;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: string[];
}
