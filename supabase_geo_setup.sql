-- SIGIC: Geo Module Setup (Phase 7b)
-- Execute this in the Supabase SQL Editor

-- 1. Table for Geospatial Incidents
CREATE TABLE IF NOT EXISTS geo_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    type TEXT NOT NULL, -- HOMICIDIO, MICROTRAFICO, etc.
    date TIMESTAMPTZ NOT NULL,
    description TEXT,
    severity INTEGER DEFAULT 3,
    classification TEXT DEFAULT 'RESERVADO',
    case_id UUID REFERENCES cases(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table for Intelligence Zones (Jurisdictions/Polygons)
CREATE TABLE IF NOT EXISTS geo_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- ZONA_CALIENTE, TERRITORIO, etc.
    polygon JSONB NOT NULL, -- Array of [lat, lng]
    color TEXT DEFAULT '#ff4d4f',
    active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE geo_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_zones ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'geo_incidents' AND policyname = 'allow_authenticated_all') THEN
    CREATE POLICY "allow_authenticated_all" ON geo_incidents FOR ALL TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'geo_zones' AND policyname = 'allow_authenticated_all') THEN
    CREATE POLICY "allow_authenticated_all" ON geo_zones FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- 5. Realtime
BEGIN;
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE geo_incidents, geo_zones;
    ELSE
      CREATE PUBLICATION supabase_realtime FOR TABLE geo_incidents, geo_zones;
    END IF;
  END $$;
COMMIT;
