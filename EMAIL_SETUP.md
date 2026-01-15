# Postavljanje Email Obavijesti

Ovaj vodič objašnjava kako postaviti email obavijesti kada netko rezervira poziv ili zatraži besplatnu analizu.

**🚀 Brzi start bez CLI-ja?** Pogledajte [QUICK_SETUP.md](./QUICK_SETUP.md) za najjednostavnije rješenje!

## Opcija 1: Supabase Edge Functions + Database Webhooks (Preporučeno)

### Korak 1: Registrirajte se na Resend

1. Idite na [resend.com](https://resend.com) i kreirajte račun
2. Verificirajte svoju email adresu
3. Idite u API Keys sekciju i kreirajte novi API ključ
4. Spremite API ključ (trebat će vam kasnije)

### Korak 2: Postavite Resend Domain (Opciono)

Za produkciju, preporučujemo da verificirate svoj domen. Za testiranje možete koristiti rezend.com domen.

### Korak 3: Deploy Edge Function (Bilo koji način)

#### Opcija A: Deploy preko Supabase Dashboard (Najlakše - bez CLI-ja)

1. Otvorite Supabase Dashboard i idite na vaš projekt
2. Idite na **Edge Functions** u lijevom meniju
3. Kliknite **Create a new function** ili **+ New Function**
4. Nazovite funkciju: `send-notification`
5. U editoru, kopirajte i zalijepite cijeli sadržaj iz datoteke `supabase/functions/send-notification/index.ts`
6. Kliknite **Deploy** ili **Save**

**Napomena**: Ako ne vidite opciju za kreiranje funkcije u Dashboard-u, možete koristiti SQL Editor:
1. Idite na **SQL Editor**
2. Kreirajte novi query
3. Koristite `CREATE FUNCTION` sintaksu (ali ovo je kompliciranije, bolje koristite CLI ili manual deploy)

**Ili koristite GitHub Integration** (ako imate GitHub repo):
1. U Supabase Dashboard > Project Settings > Integrations
2. Povežite GitHub repo
3. Edge Functions će se automatski deployati kada pushnete kod

#### Opcija B: Lokalna instalacija Supabase CLI (Ako želite koristiti CLI)

**Windows (PowerShell kao Administrator):**
```powershell
# Instaliraj lokalno u projekt
npm install supabase --save-dev

# Koristi preko npx
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase functions deploy send-notification
```

**Alternativno - Preuzmi direktno (Windows):**
1. Idite na [GitHub Releases](https://github.com/supabase/cli/releases)
2. Preuzmite `supabase_windows_amd64.zip`
3. Raspakirajte i dodajte u PATH, ili koristite direktno

**Mac/Linux:**
```bash
# Instaliraj lokalno
npm install supabase --save-dev

# Koristi preko npx
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase functions deploy send-notification
```

**Ako npm install ne radi:**
- Provjerite da imate Node.js 18+ instaliran
- Pokušajte s `npm install supabase --save-dev --legacy-peer-deps`
- Ili koristite Opciju A (deploy preko Dashboard-a) - nije potreban CLI!

### Korak 7: Postavite Environment Varijable

U Supabase Dashboard:
1. Idite na **Project Settings** > **Edge Functions** > **Secrets**
2. Dodajte sljedeće secrets:
   - `RESEND_API_KEY` - Vaš Resend API ključ
   - `ADMIN_EMAIL` - Vaša email adresa gdje želite primati obavijesti

### Korak 8: Postavite Database Webhooks

U Supabase Dashboard:
1. Idite na **Database** > **Webhooks**
2. Kliknite **Create a new webhook**

**Za appointments tablicu:**
- **Name**: `appointment-notification`
- **Table**: `appointments`
- **Events**: Označite samo **Insert**
- **HTTP Request**:
  - **Method**: `POST`
  - **URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification`
  - **HTTP Headers**: Kliknite **Add header** i dodajte:
    - Key: `Authorization`, Value: `Bearer YOUR_ANON_KEY` (Pronađite ANON KEY u Settings > API)
    - Key: `Content-Type`, Value: `application/json`
  - **HTTP Request Body**: 
    ```json
    {
      "record": {{NEW}},
      "table": "appointments"
    }
    ```
    ({{NEW}} je specijalna varijabla koja sadrži novi red)

**Za audit_requests tablicu:**
- **Name**: `audit-request-notification`
- **Table**: `audit_requests`
- **Events**: Označite samo **Insert**
- **HTTP Request**:
  - **Method**: `POST`
  - **URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-notification`
  - **HTTP Headers**: Kliknite **Add header** i dodajte:
    - Key: `Authorization`, Value: `Bearer YOUR_ANON_KEY`
    - Key: `Content-Type`, Value: `application/json`
  - **HTTP Request Body**:
    ```json
    {
      "record": {{NEW}},
      "table": "audit_requests"
    }
    ```

**Napomena**: Zamijenite `YOUR_PROJECT_ID` i `YOUR_ANON_KEY` s vašim stvarnim vrijednostima.

### Korak 9: Ažurirajte Edge Function kod (opcionalno)

U `supabase/functions/send-notification/index.ts` možete promijeniti:
- **From email**: Promijenite `noreply@yourdomain.com` na vašu email adresu
- **Email template**: Prilagodite HTML template prema potrebi

## Opcija 2: Alternativni Email Servisi

Umjesto Resend-a, možete koristiti:
- **SendGrid**: Promijenite API endpoint u Edge Function
- **Mailgun**: Promijenite API endpoint u Edge Function
- **Postmark**: Promijenite API endpoint u Edge Function
- **Supabase Email (ako dostupno)**: Koristite Supabase email API direktno

## Testiranje

1. Rezervirajte test termin kroz aplikaciju
2. Provjerite svoj email inbox
3. Provjerite Edge Function logove u Supabase Dashboard > Edge Functions > send-notification > Logs

## Troubleshooting

### Problemi s instalacijom Supabase CLI

**Problem: `npm install -g supabase` ne radi**
- **Rješenje**: Koristite lokalnu instalaciju: `npm install supabase --save-dev`
- Zatim koristite: `npx supabase` umjesto `supabase`
- Ili koristite Opciju A (deploy preko Dashboard-a) - nije potreban CLI!

**Problem: Permission denied (Windows)**
- Pokrenite PowerShell ili Command Prompt kao Administrator
- Ili koristite lokalnu instalaciju bez `-g` flag-a

**Problem: Command not found nakon instalacije**
- Provjerite da je Node.js i npm instaliran: `node --version` i `npm --version`
- Ako koristite lokalnu instalaciju, koristite `npx supabase` umjesto `supabase`
- Provjerite PATH varijable (za globalnu instalaciju)

**Problem: npm install ne radi**
- Provjerite verziju Node.js (treba biti 18+): `node --version`
- Pokušajte: `npm install supabase --save-dev --legacy-peer-deps`
- Očistite npm cache: `npm cache clean --force`
- Pokušajte s yarn: `yarn add supabase --dev`

**Problem: Linkanje projekta ne radi**
- Provjerite da koristite ispravan PROJECT_ID
- Provjerite da ste ulogirani: `npx supabase login`
- Provjerite da imate dozvole za projekt

**Najlakše rješenje**: Koristite **Opciju A** (deploy preko Dashboard-a) - ne zahtijeva CLI instalaciju!

### Emaili se ne šalju
1. Provjerite da su environment varijable postavljene ispravno
2. Provjerite Edge Function logove za greške
3. Provjerite da je webhook pravilno konfiguriran
4. Provjerite da je Resend API ključ valjan

### Edge Function greške
1. Provjerite logove u Supabase Dashboard
2. Provjerite da su svi environment varijable postavljene
3. Provjerite da je Resend API ključ ispravan

### Webhook se ne pokreće
1. Provjerite da je webhook aktiviran
2. Provjerite da je table name ispravan
3. Provjerite da su eventi (Insert) označeni

## Sigurnosne Napomene

- Nikad ne dijelite vaš Resend API ključ
- Koristite environment varijable za sve osjetljive podatke
- Preporučujemo korištenje verified domaina u produkciji

