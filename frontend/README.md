# Frontend - Pfadi-Website

Single-Page-Application (SPA) mit Vite und TypeScript. Verwaltet UI und API-Kommunikation.

## Quick Start

Frontend läuft auf `http://localhost:8100`

## Projekt-Struktur

```
frontend/
├── pages/                    # HTML-Seiten
│   ├── agenda.html          # Hauptseite (Ereignisse)
│   ├── login.html           # Login
│   ├── register.html        # Registrierung
│   ├── profile.html         # Profil bearbeiten
│   ├── create.html          # Ereignis erstellen
│   └── create-category.html # Kategorie erstellen
├── src/                     # TypeScript Code
│   ├── users-api.ts         # Login, Register, Profile API
│   ├── category-api.ts      # Categories API
│   ├── termine-api.ts       # Events API
│   ├── auth-status.ts       # Auth Display
│   └── views/               # View Logic
└── styles/                  # CSS Styles
```

## Authentifizierung

- Token wird in `localStorage` unter `jwt` gespeichert
- Username wird unter `username` gespeichert
- Automatischer Auth-Header bei API-Anfragen

## Seiten

| Seite           | Funktion                  | Auth erforderlich |
| --------------- | ------------------------- | ----------------- |
| Login           | Benutzer anmelden         | Nein              |
| Register        | Neuen Account erstellen   | Nein              |
| Agenda          | Ereignisse anzeigen       | Ja                |
| Profile         | Username/Passwort ändern | Ja                |
| Create Event    | Ereignis erstellen        | Ja                |
| Create Category | Kategorie erstellen       | Ja                |

## Funktionen

- ✅ Benutzer-Authentifizierung (Login/Register)
- ✅ Profil-Verwaltung (Username, Passwort)
- ✅ Ereignisse erstellen/bearbeiten/löschen
- ✅ Kategorien verwalten
- ✅ Admin-Modus (sieht alle Ereignisse)
- ✅ Responsive Design

## API Integration

Siehe `backend/README.md` für alle API-Endpoints.

Wichtige Funktionen:

- `login(username, password)` - Anmelden
- `register(username, password)` - Registrieren
- `updateProfile(username, password?)` - Profil ändern
- `getProgramm()` - Ereignisse laden
- `getCategories()` - Kategorien laden

## Styling

- Globale Styles in `styles/index.css`
- Navigation in `styles/navigation.css`
- Forms in `styles/register.css`
- Auth-Status in `styles/auth-status.css`

Design:

- Primär: Grün (Buttons)
- Sekundär: Blau (Profile Link)
- Akzent: Rot (Logout)
