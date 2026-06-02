-- Paketi usluga — podsekcije + paketi (CMS)
-- Pokreni u Supabase SQL Editoru. Ako imaš staru verziju, pokreni i supabase-packages-migrate-subsections.sql

-- =========================
-- Tablice
-- =========================

CREATE TABLE IF NOT EXISTS packages_page_settings (
  id UUID PRIMARY KEY DEFAULT 'a0000000-0000-0000-0000-000000000001'::uuid,
  page_title TEXT NOT NULL DEFAULT 'Paketi usluga',
  page_description TEXT NOT NULL DEFAULT '',
  combo_title TEXT NOT NULL DEFAULT 'Web + društvene mreže',
  combo_description TEXT NOT NULL DEFAULT '',
  combo_button_text TEXT NOT NULL DEFAULT 'Zatraži kombiniranu ponudu',
  combo_package_key VARCHAR(50) NOT NULL DEFAULT 'web-social',
  combo_booking_label TEXT NOT NULL DEFAULT 'Web + društvene mreže',
  combo_enabled BOOLEAN NOT NULL DEFAULT true,
  footer_note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS package_subsections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES package_subsections(id) ON DELETE CASCADE,
  package_key VARCHAR(50) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  price TEXT NOT NULL DEFAULT '',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  show_in_booking BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_package_subsections_sort ON package_subsections(sort_order);
CREATE INDEX IF NOT EXISTS idx_service_packages_section ON service_packages(section_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_service_packages_published ON service_packages(is_published);

-- =========================
-- RLS
-- =========================

ALTER TABLE packages_page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_subsections ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "packages_page_settings_select" ON packages_page_settings;
DROP POLICY IF EXISTS "packages_page_settings_insert" ON packages_page_settings;
DROP POLICY IF EXISTS "packages_page_settings_update" ON packages_page_settings;
DROP POLICY IF EXISTS "packages_page_settings_delete" ON packages_page_settings;
CREATE POLICY "packages_page_settings_select" ON packages_page_settings FOR SELECT USING (true);
CREATE POLICY "packages_page_settings_insert" ON packages_page_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "packages_page_settings_update" ON packages_page_settings FOR UPDATE USING (true);
CREATE POLICY "packages_page_settings_delete" ON packages_page_settings FOR DELETE USING (true);

DROP POLICY IF EXISTS "package_subsections_select" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_insert" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_update" ON package_subsections;
DROP POLICY IF EXISTS "package_subsections_delete" ON package_subsections;
CREATE POLICY "package_subsections_select" ON package_subsections FOR SELECT USING (true);
CREATE POLICY "package_subsections_insert" ON package_subsections FOR INSERT WITH CHECK (true);
CREATE POLICY "package_subsections_update" ON package_subsections FOR UPDATE USING (true);
CREATE POLICY "package_subsections_delete" ON package_subsections FOR DELETE USING (true);

DROP POLICY IF EXISTS "service_packages_select" ON service_packages;
DROP POLICY IF EXISTS "service_packages_insert" ON service_packages;
DROP POLICY IF EXISTS "service_packages_update" ON service_packages;
DROP POLICY IF EXISTS "service_packages_delete" ON service_packages;
CREATE POLICY "service_packages_select" ON service_packages FOR SELECT USING (true);
CREATE POLICY "service_packages_insert" ON service_packages FOR INSERT WITH CHECK (true);
CREATE POLICY "service_packages_update" ON service_packages FOR UPDATE USING (true);
CREATE POLICY "service_packages_delete" ON service_packages FOR DELETE USING (true);

-- =========================
-- Postavke glavne sekcije
-- =========================

INSERT INTO packages_page_settings (
  id, page_title, page_description,
  combo_title, combo_description, combo_button_text,
  combo_package_key, combo_booking_label, combo_enabled, footer_note
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Paketi usluga',
  'Jasna struktura, transparentne cijene. Svaki paket prilagođavamo vašim stvarnim potrebama.',
  'Web + društvene mreže',
  'Najbolji rezultati dolaze kada su web stranica i društvene mreže usklađeni. Zato nudimo i kombinirane pakete za tvrtke koje žele kompletnu digitalnu prisutnost.',
  'Zatraži kombiniranu ponudu',
  'web-social',
  'Web + društvene mreže',
  true,
  'Paketi su polazna točka. Svaki projekt prilagođavamo stvarnim potrebama i ciljevima klijenta.'
)
ON CONFLICT (id) DO UPDATE SET
  page_title = EXCLUDED.page_title,
  page_description = EXCLUDED.page_description,
  combo_title = EXCLUDED.combo_title,
  combo_description = EXCLUDED.combo_description,
  combo_button_text = EXCLUDED.combo_button_text,
  combo_package_key = EXCLUDED.combo_package_key,
  combo_booking_label = EXCLUDED.combo_booking_label,
  combo_enabled = EXCLUDED.combo_enabled,
  footer_note = EXCLUDED.footer_note,
  updated_at = TIMEZONE('utc', NOW());

-- =========================
-- Podsekcije + paketi (početni sadržaj)
-- =========================

INSERT INTO package_subsections (id, title, description, sort_order, is_published) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Web paketi',
  '',
  1,
  true
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Društvene mreže',
  'Preuzimamo planiranje, izradu i objavu sadržaja kako biste se vi mogli fokusirati na posao.',
  2,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  updated_at = TIMEZONE('utc', NOW());

INSERT INTO service_packages (section_id, package_key, name, description, features, price, is_popular, sort_order, is_published, show_in_booking) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'start', 'START WEB', 'Za lokalne obrtnike i uslužne biznise kojima treba profesionalna web stranica bez komplikacija.',
    ARRAY['1–3 stranice (Naslovna, Usluge, Kontakt)', 'Moderan i čist dizajn', 'Prilagodba za mobitele, tablete i računala', 'Kontakt forma i gumb za poziv ili WhatsApp', 'Osnovna SEO struktura i optimizacija brzine'],
    'Od 490 €', false, 1, true, true),
  ('b0000000-0000-0000-0000-000000000001', 'upiti', 'WEB KOJI DONOSI UPITE', 'Za lokalne biznise koji žele da im se klijenti aktivno javljaju putem web stranice.',
    ARRAY['Sve iz paketa START WEB', '4–6 stranica s jasnom strukturom sadržaja', 'Dizajn i raspored usmjeren na upite i kontakt', 'Tekstovi prilagođeni lokalnoj publici i uslugama', 'Osnovna on-page SEO optimizacija', 'Integracija Google Mapsa i recenzija (po potrebi)', 'Savjetovanje oko sadržaja i strukture weba'],
    'Od 890 €', true, 2, true, true),
  ('b0000000-0000-0000-0000-000000000001', 'custom', 'CUSTOM WEB', 'Za biznise kojima treba potpuno prilagođena web stranica i jača online prisutnost.',
    ARRAY['Sve iz paketa WEB KOJI DONOSI UPITE', 'Potpuno prilagođen dizajn (bez gotovih predložaka)', 'Napredna struktura stranica i sadržaja', 'Dodatne landing sekcije po potrebi', 'Integracije (online rezervacije, napredne forme, CRM, newsletter i slično)', 'Individualna suradnja 1-na-1 kroz cijeli projekt'],
    'Od 1.600 €', false, 3, true, true),
  ('b0000000-0000-0000-0000-000000000002', 'start-social', 'START SOCIAL', 'Za lokalne biznise koji žele redovnu i profesionalnu prisutnost na društvenim mrežama.',
    ARRAY['8 objava mjesečno', 'Dizajn objava i osnovni copywriting', 'Plan objava za cijeli mjesec', 'Objava sadržaja na 1 platformi', 'Osnovna optimizacija profila', 'Mjesečni pregled aktivnosti'],
    'Od 290 € / mj', false, 1, true, true),
  ('b0000000-0000-0000-0000-000000000002', 'growth-social', 'GROWTH SOCIAL', 'Za biznise koji žele aktivnije graditi prisutnost i privlačiti nove klijente.',
    ARRAY['Sve iz paketa START SOCIAL', '12–16 objava mjesečno', 'Reels / kratki video sadržaj', 'Profesionalni copywriting', 'Upravljanje komentarima i porukama', 'Objava na više platformi', 'Mjesečni izvještaj i prijedlozi za rast'],
    'Od 490 € / mj', true, 2, true, true),
  ('b0000000-0000-0000-0000-000000000002', 'content-partner', 'CONTENT PARTNER', 'Za tvrtke koje žele prepustiti cijelu komunikaciju i sadržaj stručnjaku.',
    ARRAY['Sve iz paketa GROWTH SOCIAL', '20+ objava mjesečno', 'Napredna content strategija', 'Više video sadržaja', 'Redovite konzultacije', 'Planiranje kampanja i promocija', 'Prioritetna podrška', 'Individualni pristup'],
    'Od 890 € / mj', false, 3, true, true)
  ON CONFLICT (package_key) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    price = EXCLUDED.price,
    is_popular = EXCLUDED.is_popular,
    sort_order = EXCLUDED.sort_order,
    is_published = EXCLUDED.is_published,
    show_in_booking = EXCLUDED.show_in_booking,
    updated_at = TIMEZONE('utc', NOW());
