-- SIGIC: Intelligence Module Setup (Phase 7 - Dynamic Persistence)
-- Execute this in the Supabase SQL Editor

-- 1. Table for Intelligence Entities (Nodes)
CREATE TABLE IF NOT EXISTS intelligence_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- PERSONA, ORGANIZACION, VEHICULO, UBICACION, etc.
    label TEXT NOT NULL,
    source TEXT,
    classification TEXT DEFAULT 'RESERVADO',
    data JSONB DEFAULT '{}', -- specific fields based on entityType
    metadata JSONB DEFAULT '{}', -- investigationPhase, priority, neighborhood
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table for Intelligence Relationships (Edges)
CREATE TABLE IF NOT EXISTS intelligence_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES intelligence_entities(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES intelligence_entities(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- MIEMBRO_DE, UBICADO_EN, ASOCIADO_CON, etc.
    confidence DOUBLE PRECISION DEFAULT 1.0,
    source_info TEXT,
    date_detected DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_entities_type ON intelligence_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_rel_source ON intelligence_relationships(source_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON intelligence_relationships(target_id);

-- 4. Enable RLS
ALTER TABLE intelligence_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_relationships ENABLE ROW LEVEL SECURITY;

-- 5. Basic Policies (Allow all to authenticated users for now)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'intelligence_entities' AND policyname = 'allow_authenticated_all') THEN
    CREATE POLICY "allow_authenticated_all" ON intelligence_entities FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'intelligence_relationships' AND policyname = 'allow_authenticated_all') THEN
    CREATE POLICY "allow_authenticated_all" ON intelligence_relationships FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- 6. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_intelligence_entities_modtime
    BEFORE UPDATE ON intelligence_entities
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- 7. Realtime Enablement
BEGIN;
  -- If publication exists, add tables. If not, create it.
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE intelligence_entities, intelligence_relationships;
    ELSE
      CREATE PUBLICATION supabase_realtime FOR TABLE intelligence_entities, intelligence_relationships;
    END IF;
  END $$;
COMMIT;
