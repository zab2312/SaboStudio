# Brzi Vodič - Email Obavijesti (bez CLI-ja)

Ovaj vodič je za one koji ne žele ili ne mogu instalirati Supabase CLI. Deploy ćemo napraviti direktno preko Supabase Dashboard-a.

## Korak 1: Registracija na Resend

1. Idite na [resend.com](https://resend.com)
2. Registrirajte se i verificirajte email
3. Idite na **API Keys** i kreirajte novi ključ
4. **SPREMITE KLJUČ** - trebat će vam!

## Korak 2: Kreirajte Edge Function u Supabase Dashboard-u

1. Otvorite [Supabase Dashboard](https://app.supabase.com)
2. Odaberite vaš projekt
3. U lijevom meniju, kliknite na **Edge Functions**
4. Kliknite **Create a new function** ili **+ New Function**
5. Nazovite funkciju: `send-notification`
6. Otvorite datoteku `supabase/functions/send-notification/index.ts` iz ovog projekta
7. Kopirajte **CIJELI SADRŽAJ** i zalijepite u editor u Dashboard-u
8. Kliknite **Deploy** ili **Save**

## Korak 3: Postavite Secrets (Environment Varijable)

1. U Supabase Dashboard, idite na **Project Settings** (⚙️ ikona)
2. Idite na **Edge Functions** > **Secrets**
3. Kliknite **Add a new secret**
4. Dodajte dva secret-a:

   **Prvi secret:**
   - **Name**: `RESEND_API_KEY`
   - **Value**: Vaš Resend API ključ (koji ste spremili u Koraku 1)

   **Drugi secret:**
   - **Name**: `ADMIN_EMAIL`
   - **Value**: Vaša email adresa (npr. `vas.email@gmail.com`)

5. Kliknite **Save** za oba secret-a

## Korak 4: Postavite Database Webhooks

### Webhook za Rezervacije (appointments)

1. U Supabase Dashboard, idite na **Database** > **Webhooks**
2. Kliknite **Create a new webhook**
3. Ispunite:
   - **Name**: `appointment-notification`
   - **Table**: Odaberite `appointments`
   - **Events**: Označite samo **Insert** ☑️
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification`
       - Zamijenite `YOUR_PROJECT_ID` s vašim stvarnim projekt ID-om (možete ga pronaći u Settings > API > Project URL)
     - **HTTP Headers**: Kliknite **Add header**
       - Header 1: Key: `Authorization`, Value: `Bearer YOUR_ANON_KEY`
         - Pronađite ANON KEY u Settings > API > Project API keys > anon public
       - Header 2: Key: `Content-Type`, Value: `application/json`
     - **HTTP Request Body**:
       ```json
       {
         "record": {{NEW}},
         "table": "appointments"
       }
       ```
4. Kliknite **Create webhook**

### Webhook za Zahtjeve za Analizu (audit_requests)

1. Kliknite **Create a new webhook** ponovno
2. Ispunite:
   - **Name**: `audit-request-notification`
   - **Table**: Odaberite `audit_requests`
   - **Events**: Označite samo **Insert** ☑️
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification`
     - **HTTP Headers**: Isto kao gore
       - Header 1: `Authorization` = `Bearer YOUR_ANON_KEY`
       - Header 2: `Content-Type` = `application/json`
     - **HTTP Request Body**:
       ```json
       {
         "record": {{NEW}},
         "table": "audit_requests"
       }
       ```
3. Kliknite **Create webhook**

## Korak 5: Testiranje

1. Otvorite vašu aplikaciju
2. Rezervirajte test termin ili zatražite test analizu
3. Provjerite svoj email inbox
4. Ako ne dobijete email:
   - Provjerite Edge Function logove: **Edge Functions** > `send-notification` > **Logs**
   - Provjerite da su svi secrets postavljeni
   - Provjerite da su webhook-ovi aktivni

## Gdje pronaći PROJECT_ID i ANON_KEY?

1. U Supabase Dashboard, idite na **Settings** (⚙️) > **API**
2. **Project URL**: `https://abcdefghijklmnop.supabase.co`
   - `abcdefghijklmnop` je vaš PROJECT_ID
3. **Project API keys** > **anon public**: Ovo je vaš ANON_KEY

## Problem sa slanjem emaila?

Provjerite:
- ✅ Da je Resend API ključ ispravan i aktivan
- ✅ Da je ADMIN_EMAIL postavljen u secrets
- ✅ Da webhook-ovi imaju ispravan URL
- ✅ Da su header-i pravilno postavljeni (Authorization i Content-Type)
- ✅ Da je Edge Function uspješno deployana (vidite je u listi)

## Potrebna dodatna pomoć?

Pogledajte detaljniji vodič u `EMAIL_SETUP.md`

