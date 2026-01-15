-- ⚠️ VAŽNO: SQL triggeri NE RADE u Supabase bez dodatnih ekstenzija
-- 
-- Ovaj SQL kod NEĆE raditi jer Supabase ne podržava http ekstenziju
-- koja je potrebna za pozivanje HTTP endpointa iz SQL triggera.
--
-- ✅ RJEŠENJE: Koristite Supabase Database Webhooks umjesto SQL triggera
--
-- Webhooks su jednostavniji, pouzdaniji i preporučeni način u Supabase.
-- Pogledajte QUICK_SETUP.md ili EMAIL_SETUP.md za detaljne upute.
--
-- Ova datoteka je ostavljena samo za referencu.
-- NE POKRENJITE OVAJ SQL KOD - NEĆE RADITI!
--

-- ═══════════════════════════════════════════════════════════════
-- NE KORISTITE OVO - SQL triggeri ne rade u Supabase!
-- ═══════════════════════════════════════════════════════════════

/*
-- SQL trigger kod (NE RADI - samo za referencu)

-- Pokušaj omogućavanja http ekstenzije (neće raditi):
-- CREATE EXTENSION IF NOT EXISTS http;

CREATE OR REPLACE FUNCTION notify_admin()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
  -- http_response tip ne postoji u Supabase!
  response http_response;  -- ❌ OVA LINIJA ĆE FAILATI
  supabase_url TEXT;
  supabase_anon_key TEXT;
BEGIN
  -- ... ostatak koda neće ni doći do ovdje zbog gore navedene greške
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

-- ═══════════════════════════════════════════════════════════════
-- UMJESTO OVOGA, KORISTITE DATABASE WEBHOOKS:
-- ═══════════════════════════════════════════════════════════════
--
-- 1. Idite u Supabase Dashboard > Database > Webhooks
-- 2. Kliknite "Create a new webhook"
-- 3. Za appointments tablicu:
--    - Name: appointment-notification
--    - Table: appointments
--    - Events: ☑ Insert
--    - HTTP Request:
--      - Method: POST
--      - URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification
--      - Headers: 
--        * Authorization: Bearer YOUR_ANON_KEY
--        * Content-Type: application/json
--      - Body: {"record": {{NEW}}, "table": "appointments"}
-- 4. Ponovite za audit_requests tablicu
--
-- Detaljne upute: Pogledajte QUICK_SETUP.md

-- Napomena: 
-- Ako http ekstenzija nije dostupna, koristite Supabase Database Webhooks umjesto triggera:
-- 1. Idite u Supabase Dashboard > Database > Webhooks
-- 2. Kreiramo webhook za appointments tablicu:
--    - Table: appointments
--    - Events: Insert
--    - HTTP Request: POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification
--    - HTTP Headers: {"Authorization": "Bearer YOUR_ANON_KEY", "Content-Type": "application/json"}
--    - HTTP Request Body: {"record": {{NEW}}, "table": "appointments"}
-- 3. Ponovite za audit_requests tablicu

