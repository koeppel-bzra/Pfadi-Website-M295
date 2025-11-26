# Backend API - Pfadi-Website

REST API für die Pfadi-Website. Verwaltet Benutzer, Kategorien und Ereignisse.

## Quick Start

Server läuft auf `http://localhost:3000`

## Authentifizierung

Alle geschützten Endpoints benötigen JWT-Token im Header:

```
Authorization: Bearer <TOKEN>
```

Token wird bei Login/Register zurückgegeben.

## API Endpoints

### Benutzer

- `POST /api/users/login` - Anmelden
- `POST /api/users/register` - Registrieren
- `PATCH /api/users/profile` - Profil ändern (Auth erforderlich)

### Kategorien

- `GET /api/categories` - Alle abrufen
- `GET /api/categories/:id` - Eine abrufen
- `POST /api/categories` - Erstellen (Auth erforderlich)
- `PUT /api/categories/:id` - Ändern (Auth erforderlich)
- `DELETE /api/categories/:id` - Löschen (Auth erforderlich)

### Ereignisse (Programm)

- `GET /api/programm` - Alle abrufen (Auth erforderlich)
- `GET /api/programm/:id` - Eine abrufen (Auth erforderlich)
- `POST /api/programm` - Erstellen (Auth erforderlich)
- `PUT /api/programm/:id` - Ändern (Auth erforderlich)
- `DELETE /api/programm/:id` - Löschen (Auth erforderlich)

## Fehler-Codes

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

## Standard-Benutzer

Nach dem ersten Start wird automatisch erstellt:

- **Username:** `admin`
- **Passwort:** `user1234`

## Datenbank

Verwendet NeDB (dateibasiert):

- `./data/user.db` - Benutzer
- `./data/programm.db` - Ereignisse
- `./data/categories.db` - Kategorien

## Sicherheit

- Passwörter mit bcryptjs gehashed
- JWT Token verfällt nach 30 Tagen
- Normale User sehen nur ihre Ereignisse
- Admin sieht alle Ereignisse
