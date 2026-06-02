# Sabo Studio - Web Stranice i Aplikacije

Moderna web stranica za Sabo Studio s Aurora background animacijom i kompletnim CMS sustavom.

## 🚀 Pokretanje projekta

### 1. Instalacija dependencies

```bash
npm install
```

### 2. Supabase konfiguracija

1. Kreirajte novi projekt na [Supabase](https://supabase.com)
2. Idite u SQL Editor i zalijepite sadržaj iz `supabase-schema.sql` datoteke
3. Kreirajte `.env` datoteku u root direktoriju:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Pokretanje development servera

```bash
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

## 📁 Struktura projekta

```
src/
├── components/          # React komponente
│   ├── Aurora.jsx      # Aurora background animacija
│   ├── Hero.jsx        # Hero sekcija
│   ├── WhyWebsites.jsx # Sekcija zašto su potrebne web stranice
│   ├── WhatWeDo.jsx    # Sekcija što radimo
│   ├── Process.jsx     # Proces izrade
│   ├── AppointmentBooking.jsx # Rezervacija termina
│   ├── Projects.jsx    # Projekti s Bounce Cards animacijom
│   ├── Testimonials.jsx # Iskustva klijenata
│   ├── FAQ.jsx         # FAQ sekcija
│   └── Layout.jsx      # Layout komponenta
├── pages/              # Stranice
│   ├── Home.jsx        # Početna stranica
│   ├── ProjectDetail.jsx # Detalji projekta
│   └── Admin.jsx       # Admin CMS panel
├── lib/                # Utility funkcije
│   └── supabase.js     # Supabase klijent
└── main.jsx            # Entry point
```

## 🎨 Funkcionalnosti

### Hero Sekcija
- Naziv i motto
- Gumb za rezervaciju Zoom poziva
- Mini kartice (Brzina, Kvaliteta, Zadovoljstvo klijenta, Sigurnost)
- Veće kartice s statistikama (broj klijenata, industrija, zadovoljstvo)

### Sekcije
- **Zašto su potrebne web stranice** - Objašnjenje digitalne transformacije s karticama
- **Što radimo** - 6 kartica s našim uslugama
- **Proces izrade** - 4 koraka procesa
- **Rezervacija termina** - Kalendar s odabirom datuma i vremena
- **Projekti** - Bounce Cards animacija s projektima
- **Iskustva klijenata** - Testimonials kartice
- **FAQ** - Accordion s čestim pitanjima

### Admin CMS
- **Projekti** - Dodavanje, uređivanje i brisanje projekata
- **Rezervacije** - Pregled svih rezervacija
- **Radno vrijeme** - Postavljanje radnog vremena (utječe na dostupnost termina)

## 🗄️ Baze podataka

Projekt koristi Supabase s sljedećim tablicama:
- `projects` - Projekti
- `testimonials` - Iskustva klijenata
- `faqs` - Česta pitanja
- `appointments` - Rezervacije termina
- `working_hours` - Radno vrijeme
- `audit_requests` - Zahtjevi za besplatnu analizu
- `packages_page_settings` - Glavni tekstovi sekcije paketa
- `package_subsections` - Podsekcije (naslov + opis), svaka s vlastitim paketima
- `service_packages` - Pojedinačni paketi unutar podsekcije

SQL schema se nalazi u `supabase-schema.sql` datoteki.

**Paketi usluga (CMS):**
- Nova instalacija: pokreni `supabase-packages.sql`
- Ako imaš staru verziju (s `section_type`): pokreni `supabase-packages-migrate-subsections.sql`
- U adminu → **Paketi** → **Dodaj novu podsekciju**, zatim **Dodaj paket u ovu podsekciju**

## 📧 Email Obavijesti

Za postavljanje email obavijesti kada netko rezervira poziv ili zatraži analizu:
- **Brzi vodič (bez CLI-ja)**: [QUICK_SETUP.md](./QUICK_SETUP.md) ⚡
- **Detaljni vodič**: [EMAIL_SETUP.md](./EMAIL_SETUP.md)

## 🎭 Animacije

Projekt koristi:
- **Aurora** - WebGL background animacija
- **Bounce Cards** - 3D hover efekti za projekte
- **Framer Motion** - Za sve animacije i tranzicije

## 🎨 Dizajn

- Sve ikonice su u crvenoj boji (#dc2626)
- Svaka sekcija je kartica na Aurora pozadini
- Responzivan dizajn za sve uređaje
- Tamna tema s transparentnim karticama

## 📝 Build za produkciju

```bash
npm run build
```

Build će biti u `dist/` direktoriju.

## 🔧 Tehnologije

- React 18
- Vite
- Supabase
- Framer Motion
- OGL (WebGL)
- React Router
- date-fns
- lucide-react

## 📄 Licenca

Privatni projekt za Sabo Studio.

