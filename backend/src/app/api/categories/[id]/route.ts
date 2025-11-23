import { NextRequest } from "next/server";
import { Kategorie, kategorieDb } from "@/lib/db/schema/categories";
import { verifyToken } from "@/lib/jwt/jwt-generator";
import { getJwtHeader } from "@/lib/jwt/jwt-auth";

declare type PathParams = { params: Promise<{ id: string }> };

/**
 * GET /api/categories/:id
 * 
 * Ruft eine einzelne Kategorie ab (KEINE Authentifizierung nötig)
 * 
 * Erfolg (200): Kategorie-Details
 * Fehler:
 * - 404: Kategorie nicht gefunden
 */
export async function GET(request: NextRequest, context: PathParams) {
    const { id } = await context.params;
    const termin = await kategorieDb().findOneAsync({ _id: id });

    if (termin) {
        return Response.json(termin, { status: 200 });
    }

    return Response.json(
         { message: 'Termin nicht gefunden' },
         { status: 404 },
    )
}

/**
 * DELETE /api/categories/:id
 * 
 * Löscht eine Kategorie
 * Authentifizierung: Erforderlich
 * 
 * Erfolg (200): "Kategorie gelöscht"
 * Fehler:
 * - 401: Unauthorized
 * - 404: Kategorie nicht gefunden
 */
export async function DELETE(request: NextRequest, context: PathParams) {
    // Authentifizierung erforderlich
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params;
    // removeAsync gibt die Anzahl der gelöschten Dokumente zurück
    const numRemoved = await kategorieDb().removeAsync({ _id: id }, { });

    if (numRemoved > 0) {
        return Response.json(
            { message: 'Kategorie gelöscht' },
            { status: 200 },
        )
    }

    return Response.json(
        { message: 'Kategorie nicht gefunden' }, 
        { status: 404 },
    )
}

/**
 * PUT /api/categories/:id
 * 
 * Aktualisiert eine Kategorie
 * Authentifizierung: Erforderlich
 * 
 * Anfrage:
 * {
 *   "name": "Neuer Name",
 *   "farben": ["rot"]
 * }
 * 
 * Erfolg (200): "Kategorie angepasst"
 * Fehler:
 * - 400: Ungültige Daten
 * - 401: Unauthorized
 * - 404: Kategorie nicht gefunden
 */
export async function PUT(request: NextRequest, context: PathParams) {
    // Authentifizierung erforderlich
    const jwtToken = getJwtHeader(request)
    const payload = await verifyToken(jwtToken)
    const _userId = payload._userId as string

    if (!_userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Validiere neue Daten
    const body = await request.json();
    const parsed = Kategorie.safeParse(body);

    if (!parsed.success) {
        return Response.json(
            { message: "Ungültige Daten", errors: parsed.error.format() },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Aktualisiere nur die gesendeten Felder
    const result = await kategorieDb().updateAsync(
        {_id: id},
        {$set: data},
        {}
    );

    if (result.numAffected > 0) {
        return Response.json(
            {message: 'Kategorie angepasst'},
            {status: 200},
        );
    }

    return Response.json(
        {message: "Termin nicht gefunden"},
        {status: 404}
    );

}