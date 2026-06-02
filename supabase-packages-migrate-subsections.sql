-- Migracija: section_type → package_subsections
-- Pokreni ako si već imao staru verziju paketa u bazi

CREATE TABLE IF NOT EXISTS package_subsections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE service_packages ADD COLUMN IF NOT EXISTS section_id UUID;

DO $$
DECLARE
  web_title TEXT := 'Web paketi';
  social_title TEXT := 'Društvene mreže';
  social_desc TEXT := '';
  web_id UUID;
  social_id UUID;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages_page_settings' AND column_name = 'web_section_title'
  ) THEN
    SELECT
      COALESCE(web_section_title, 'Web paketi'),
      COALESCE(social_section_title, 'Društvene mreže'),
      COALESCE(social_section_description, '')
    INTO web_title, social_title, social_desc
    FROM packages_page_settings
    WHERE id = 'a0000000-0000-0000-0000-000000000001';
  END IF;

  INSERT INTO package_subsections (id, title, description, sort_order, is_published)
  VALUES ('b0000000-0000-0000-0000-000000000001', web_title, '', 1, true)
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

  INSERT INTO package_subsections (id, title, description, sort_order, is_published)
  VALUES ('b0000000-0000-0000-0000-000000000002', social_title, social_desc, 2, true)
  ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

  web_id := 'b0000000-0000-0000-0000-000000000001';
  social_id := 'b0000000-0000-0000-0000-000000000002';

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_packages' AND column_name = 'section_type'
  ) THEN
    UPDATE service_packages SET section_id = web_id WHERE section_type = 'web';
    UPDATE service_packages SET section_id = social_id WHERE section_type = 'social';
  ELSE
    UPDATE service_packages SET section_id = web_id
    WHERE package_key IN ('start', 'upiti', 'custom') AND section_id IS NULL;
    UPDATE service_packages SET section_id = social_id
    WHERE package_key IN ('start-social', 'growth-social', 'content-partner') AND section_id IS NULL;
  END IF;
END $$;

ALTER TABLE packages_page_settings DROP COLUMN IF EXISTS web_section_title;
ALTER TABLE packages_page_settings DROP COLUMN IF EXISTS social_section_title;
ALTER TABLE packages_page_settings DROP COLUMN IF EXISTS social_section_description;

ALTER TABLE service_packages ALTER COLUMN section_id SET NOT NULL;

ALTER TABLE service_packages DROP CONSTRAINT IF EXISTS service_packages_section_id_fkey;
ALTER TABLE service_packages
  ADD CONSTRAINT service_packages_section_id_fkey
  FOREIGN KEY (section_id) REFERENCES package_subsections(id) ON DELETE CASCADE;

ALTER TABLE service_packages DROP COLUMN IF EXISTS section_type;

ALTER TABLE package_subsections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "package_subsections_select" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_insert" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_update" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_delete" ON package_subsections;
CREATE POLICY "package_subsections_select" ON package_subsections FOR SELECT USING (true);
CREATE POLICY "package_subsections_insert" ON package_subsections FOR INSERT WITH CHECK (true);
CREATE POLICY "package_subsections_update" ON package_subsections FOR UPDATE USING (true);
CREATE POLICY "package_subsections_delete" ON package_subsections FOR DELETE USING (true);
