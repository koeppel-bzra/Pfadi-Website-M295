# Pfadi-Website

Vollständige Web-Anwendung für die Pfadi-Verwaltung. Ermöglicht Benutzerverwaltung, Kategorien und Ereignisplanung.

## Übersicht

```
Pfadi-Website-M295/
├── backend/          # Node.js/Next.js API Server
├── frontend/         # Vite/TypeScript SPA
└── README.md         # Diese Datei
```

## Quick Start

## Architektur

### Backend (API Server)

- **Framework:** Next.js mit TypeScript
- **Database:** NeDB (dateibasiert)
- **Auth:** JWT Tokens (30 Tage gültig)
- **Security:** bcryptjs für Passwort-Hashing
- **Ports:** 3000

**Datenbanken:**

- `data/user.db` - Benutzer
- `data/programm.db` - Ereignisse
- `data/categories.db` - Kategorien

### Frontend (Web App)

- **Framework:** Vite + TypeScript
- **Build Tool:** Vite
- **Storage:** localStorage für Authentifizierung
- **Styling:** CSS mit responsivem Design
- **Ports:** 8100

## Features

### Authentifizierung

- ✅ Login/Registrierung
- ✅ Profil-Verwaltung (Username, Passwort)
- ✅ JWT-basiert mit 30-Tage Expiration
- ✅ Rollen: `user` (normal) und `admin`

### Benutzer-Verwaltung

- ✅ Benutzerdaten speichern
- ✅ Sicheres Passwort-Hashing
- ✅ Profile Edit mit Authorization

### Ereignisse (Programm)

- ✅ Ereignisse erstellen/bearbeiten/löschen
- ✅ Admin sieht alle, User sieht nur eigene
- ✅ Kategorisierung
- ✅ Zeitplanung (Datum + Zeit)

### Kategorien

- ✅ Kategorien verwalten
- ✅ CRUD-Operationen

## Standard-Benutzer

Nach erstem Start verfügbar:

- **Username:** `admin`
- **Passwort:** `user1234`

## API Übersicht

13 Endpoints in 3 Kategorien:

| Bereich    | Endpoints                | Auth  |
| ---------- | ------------------------ | ----- |
| Benutzer   | Login, Register, Profile | Teils |
| Kategorien | GET, POST, PUT, DELETE   | Teils |
| Ereignisse | GET, POST, PUT, DELETE   | Ja    |

Siehe `backend/README.md` für vollständige Endpoint-Liste.

## Funktionen nach User-Typ

### Normale User

- Login/Registrierung
- Eigene Ereignisse erstellen/bearbeiten/löschen
- Eigene Kategorien erstellen
- Profil bearbeiten

### Admin

- Alles vom normalen User
- Plus: Alle Ereignisse sehen und bearbeiten
- Plus: Alle Kategorien verwalten

## Technologie-Stack

| Layer    | Tech                         |
| -------- | ---------------------------- |
| Frontend | Vite, TypeScript, Fetch API  |
| Backend  | Next.js, TypeScript, Node.js |
| Database | NeDB                         |
| Auth     | JWT, bcryptjs                |
| Styling  | CSS3                         |

## Ordner-Struktur

```
backend/
├── src/
│   ├── app/api/        # API Endpoints
│   │   ├── users/      # Auth Endpoints
│   │   ├── categories/ # Categories Endpoints
│   │   └── programm/   # Events Endpoints
│   └── lib/
│       ├── db/         # Database Schemas
│       └── jwt/        # JWT Token Handling
└── data/               # Database Files

frontend/
├── pages/              # HTML Pages
├── src/
│   ├── views/          # View Logic
│   ├── *-api.ts        # API Functions
│   └── auth-status.ts  # Auth Management
└── styles/             # CSS Files
```

## Entwicklung

### Test-Account

- **Username:** `admin`
- **Passwort:** `user1234`

## Fehlerbehandlung

### Status-Codes

| Code | Bedeutung    |
| ---- | ------------ |
| 200  | OK           |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 409  | Conflict     |
| 500  | Server Error |

## Sicherheit

- Passwörter mit bcryptjs gehashed
- JWT Tokens signiert (HS256)
- Token-Expiration nach 30 Tagen
- Normale User sehen nur ihre Ereignisse
- Admin braucht Token für kritische Operationen

## Weitere Dokumentation

- `backend/README.md` - Detaillierte API-Dokumentation
- `frontend/README.md` - Frontend-Architektur und Seiten

## Lizenz

Pfadi-Website-M295
