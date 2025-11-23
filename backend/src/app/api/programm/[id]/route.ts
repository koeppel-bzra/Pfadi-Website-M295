import { NextRequest } from "next/server";
import { Programm, programmDb } from "@/lib/db/schema/programm"
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";

/**
 * PathParams für Dynamic Routes
 * [id] bedeutet dass die URL einen Parameter hat (z.B. /api/programm/123)
 */
declare type PathParams = { params: Promise<{ id: string }> };

/**
 * GET /api/programm/:id
 * 
 * Ruft ein einzelnes Event ab
 * 
 * Authentifizierung: Erforderlich
 * 
 * Ownership-Check: 
 * - Admin: Darf alle einsehen
 * - User: Darf nur seine eigenen einsehen
 * 
 * Erfolg (200): Event-Details
 * Fehler:
 * - 401: Unauthorized
 * - 403: Forbidden (nicht dein Event)
 * - 404: Event nicht gefunden
 */
export async function GET(request: NextRequest, context: PathParams) {
    // Authentifizierung
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string
    const role = payload.role as string | undefined
    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Hole Event-ID aus URL (/api/programm/:id)
    const { id } = await context.params;
    const termin = await programmDb().findOneAsync({ _id: id });

    if (!termin) {
        return Response.json({ message: 'Termin nicht gefunden' }, { status: 404 })
    }

    // SICHERHEIT: Benutzer darf nur seine eigenen einsehen (oder Admin sieht alles)
    if (termin._userId !== _userId && role !== "admin") {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    return Response.json(termin, { status: 200 })

}

/**
 * DELETE /api/programm/:id
 * 
 * Löscht ein Event
 * 
 * Authentifizierung: Erforderlich
 * 
 * Ownership-Check:
 * - Admin: Kann alle löschen
 * - User: Kann nur seine eigenen löschen
 * 
 * Erfolg (200): "Termin gelöscht"
 * Fehler:
 * - 401: Unauthorized
 * - 403: Forbidden (nicht dein Event)
 * - 404: Event nicht gefunden
 */
export async function DELETE(request: NextRequest, context: PathParams) {
    // Authentifizierung
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string
    const role = payload.role as string | undefined
    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Hole Event-ID aus URL
    const { id } = await context.params;
    const termin = await programmDb().findOneAsync({ _id: id });

    if (!termin) {
        return Response.json({ message: 'Termin nicht gefunden' }, { status: 404 })
    }

    // SICHERHEIT: Ownership-Check
    if (termin._userId !== _userId && role !== "admin") {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Lösche das Event
    await programmDb().removeAsync({ _id: id }, {});

    return Response.json({ message: 'Termin gelöscht' }, { status: 200 })

}

/**
 * PUT /api/programm/:id
 * 
 * Aktualisiert ein existierendes Event
 * 
 * Authentifizierung: Erforderlich
 * 
 * Ownership-Check:
 * - Admin: Kann alle bearbeiten
 * - User: Kann nur seine eigenen bearbeiten
 * 
 * Anfrage: Beliebige Felder von Event (nur die werden aktualisiert)
 * {
 *   "title": "Neuer Titel",
 *   "date": "2025-08-01T00:00:00Z"
 * }
 * 
 * Erfolg (200): "Ereignis angepasst"
 * Fehler:
 * - 400: Ungültige Daten
 * - 401: Unauthorized
 * - 403: Forbidden (nicht dein Event)
 * - 404: Event nicht gefunden
 */
export async function PUT(request: NextRequest, context: PathParams) {
    // Authentifizierung
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string
    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Hole Event-ID
    const { id } = await context.params
    
    // Prüfe ob Event existiert
    const termin = await programmDb().findOneAsync({ _id: id });
    if (!termin) {
        return Response.json({ message: 'Termin nicht gefunden' }, { status: 404 })
    }
    
    // SICHERHEIT: Ownership-Check
    const role = payload.role as string | undefined
    if (termin._userId !== _userId && role !== "admin") {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Validiere neue Daten
    const body = await request.json();
    const parsed = Programm.safeParse(body);

    if (!parsed.success) {
        return Response.json(
            { message: "Ungültige Daten", errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Aktualisiere nur die gesendeten Felder (nicht das ganze Dokument!)
    // $set bedeutet: setze NUR diese Felder, alles andere bleibt unverändert
    const result = await programmDb().updateAsync(
        {_id: id},
        {$set: data},
        {}
    );

    if (result.numAffected > 0) {
        return Response.json(
            {message: 'Ereignis angepasst'},
            {status: 200},
        );
    }

    return Response.json(
        {message: "Termin nicht gefunden"},
        {status: 404}
    );

}