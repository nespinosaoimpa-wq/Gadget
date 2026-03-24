-- EJECUTAR EN SUPABASE SQL EDITOR
-- SCRIPT ROBUSTO V2 (Fase 6 Integración)

-- 1. Asegurar tabla de Casos (debe existir)
-- Si la tabla 'cases' no tiene 'id', este script fallará informando el problema real.

-- 2. Tablas de Workflow y Tareas
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template TEXT NOT NULL DEFAULT 'INVESTIGACION_GENERAL',
  status TEXT NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columna case_id en workflows
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workflows' AND column_name='case_id') THEN
    ALTER TABLE workflows ADD COLUMN case_id UUID REFERENCES cases(id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS workflow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'PENDIENTE', 
  assigned_to TEXT,
  priority TEXT DEFAULT 'MEDIA',
  due_date TIMESTAMPTZ,
  position INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'SISTEMA',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'INFO',
  read BOOLEAN DEFAULT false,
  user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Evidencia de Campo (Field Ops)
CREATE TABLE IF NOT EXISTS field_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, 
  narrative TEXT,
  geo_lat DOUBLE PRECISION,
  geo_lng DOUBLE PRECISION,
  hash TEXT,
  captured_by TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columna case_id en field_evidence
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='field_evidence' AND column_name='case_id') THEN
    ALTER TABLE field_evidence ADD COLUMN case_id UUID REFERENCES cases(id);
  END IF;
END $$;

-- 5. Índices
CREATE INDEX IF NOT EXISTS idx_tasks_workflow ON workflow_tasks(workflow_id);
CREATE INDEX IF NOT EXISTS idx_field_evidence_case ON field_evidence(case_id);

-- 6. RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_evidence ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Políticas (con nombres únicos para evitar colisiones)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workflows' AND policyname = 'p6_allow_all') THEN
    CREATE POLICY "p6_allow_all" ON workflows FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workflow_tasks' AND policyname = 'p6_allow_all') THEN
    CREATE POLICY "p6_allow_all" ON workflow_tasks FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'p6_allow_all') THEN
    CREATE POLICY "p6_allow_all" ON notifications FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'field_evidence' AND policyname = 'p6_allow_all') THEN
    CREATE POLICY "p6_allow_all" ON field_evidence FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- 7. Realtime (Usamos sentencias que no fallan si ya existen)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE notifications, workflow_tasks;
COMMIT;
