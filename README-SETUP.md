# Supabase Setup - Koraci za povezivanje

## 1. Kreiraj Supabase Projekt

1. Idite na [https://supabase.com](https://supabase.com)
2. Kreirajte novi projekt
3. Sačekajte da se projekt inicijalizira

## 2. Pronađi Supabase Credentials

### Project URL
1. U Supabase Dashboard, idite na **Settings** (⚙️)
2. Idite na **API** sekciju
3. Kopirajte **Project URL** (npr. `https://abcdefghijklmnop.supabase.co`)

### API Key (anon public)
1. U istoj **API** sekciji
2. Pronađite **Project API keys**
3. Kopirajte **anon public** key (počinje s `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Postavi .env.local datoteku

1. Kopiraj `.env.local.example` u `.env.local`
2. Otvori `.env.local` u editoru
3. Zamijeni placeholder vrijednosti s tvojim Supabase podacima:

```env
VITE_SUPABASE_URL=https://tvoj-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=tvoj-anon-key-ovdje
```

## 4. Pokreni SQL Schema

1. Otvori Supabase Dashboard
2. Idite na **SQL Editor**
3. Otvori `supabase-schema.sql` datoteku iz ovog projekta
4. Zalijepi cijeli SQL kod u SQL Editor
5. Klikni **Run** da se izvrši

## 5. Provjeri povezivanje

1. Pokreni `npm run dev`
2. Otvori aplikaciju u pregledniku
3. Provjeri da li se projekti/testimonials učitavaju (ako ih imaš u bazi)

## Troubleshooting

- Ako vidiš greške u konzoli o Supabase, provjeri da li su URL i KEY ispravno postavljeni
- Provjeri da li su environment varijable dostupne: `console.log(import.meta.env.VITE_SUPABASE_URL)`
- Uvijek restartaj dev server nakon promjene .env.local datoteke

