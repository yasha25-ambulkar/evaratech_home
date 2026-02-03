-- EvaraTech Water Monitoring Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Assets Table
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pump', 'sump', 'tank', 'bore', 'govt')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity TEXT,
  specifications TEXT,
  maintenance_info TEXT,
  status TEXT DEFAULT 'Normal',
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipelines Table
CREATE TABLE IF NOT EXISTS pipelines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('main', 'distribution', 'bore')),
  capacity TEXT,
  maintenance_info TEXT,
  status TEXT DEFAULT 'Normal',
  color TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_pipelines_type ON pipelines(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipelines_updated_at ON pipelines;
CREATE TRIGGER update_pipelines_updated_at
    BEFORE UPDATE ON pipelines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on assets"
  ON assets FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on pipelines"
  ON pipelines FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert on assets"
  ON assets FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on assets"
  ON assets FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on pipelines"
  ON pipelines FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on pipelines"
  ON pipelines FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Comments for documentation
COMMENT ON TABLE assets IS 'Stores all water infrastructure assets (pumps, sumps, tanks, borewells)';
COMMENT ON TABLE pipelines IS 'Stores pipeline network data with GeoJSON coordinates';
COMMENT ON COLUMN assets.latitude IS 'Latitude coordinate (decimal degrees)';
COMMENT ON COLUMN assets.longitude IS 'Longitude coordinate (decimal degrees)';
COMMENT ON COLUMN pipelines.coordinates IS 'Array of [latitude, longitude] pairs in GeoJSON format';
