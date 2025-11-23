import { NextRequest  } from "next/server";
import { Programm, programmDb } from "@/lib/db/schema/programm"
import { userDb } from "@/lib/db/schema/user";
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";

/**
 * GET /api/programm
 * 
 * Ruft alle verfügbaren Events ab (abhängig von Role)
 * 
 * Authentifizierung: Erforderlich (Bearer Token im Header)
 * 
 * Rückgabe:
 * - Admin: Alle Events
 * - User: Nur seine eigenen Events
 * 
 * Erfolg (200): Array mit Events
 * Fehler:
 * - 401: Unauthorized (kein gültiger Token)
 */
export async function GET(request: NextRequest) {
    // Extrahiere Token aus Authorization Header
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string
    const role = payload.role as string | undefined

    // Wenn keine User-ID im Token: Nicht authentifiziert
    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Unterschiedliche Filter je nach Role
    // Admin: {} = keine Filter, alle Events
    // User: { _userId } = nur eigene Events
    const filter = role === 'admin' ? {} : { _userId }
    const termineInDb = await programmDb().findAsync(filter)

    // Ergänze jedes Event mit dem Benutzernamen des Erstellers
    // Damit die UI korrekt anzeigt, wer das Event erstellt hat
    const enriched = await Promise.all(
        termineInDb.map(async (t) => {
            try {
                const user = await userDb().findOneAsync({ _id: t._userId });
                return { ...t, username: user?.username ?? 'Unbekannt' };
            } catch {
                return { ...t, username: 'Unbekannt' };
            }
        })
    );

    return Response.json(enriched, {status: 200})
}

/**
 * POST /api/programm
 * 
 * Erstellt ein neues Event
 * 
 * Authentifizierung: Erforderlich
 * 
 * Anfrage: 
 * {
 *   "title": "Somerlager",
 *   "location": "Gommiswald",
 *   "kategorieId": "abc123",
 *   "date": "2025-07-01T00:00:00Z",
 *   "mitnehmen": "Zelt, Schlafsack"
 * }
 * 
 * WICHTIG: _userId wird VOM SERVER gesetzt (nicht vom Client!)
 * Dadurch können User nicht Events für andere erstellen
 * 
 * Erfolg (201): Neues Event mit _id
 * Fehler:
 * - 400: Ungültiges Format
 * - 401: Unauthorized
 */
export async function POST(request: NextRequest) {
    // Authentifizierung
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Validiere Input gegen Schema
    const { data, success } = Programm.safeParse(await request.json())

    if (!success) {
        return Response.json({ message: 'Invalides DTO Format'}, {status: 400})
    } 
    
    // SICHERHEIT: Überschreibe _userId mit Wert aus Token
    // So kann kein Client Events für andere User erstellen!
    const dataWithUserId = { ...data, _userId }

    // Speichere in DB
    const termineMitId = await programmDb().insertAsync(dataWithUserId)
    return Response.json(termineMitId, { status: 201 })
}