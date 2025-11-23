/**
 * Frontend API wrapper für Event-/Termin-Management
 * 
 * Dieses Modul verwaltet die Kommunikation mit dem Backend für:
 * - Abrufen aller Events des aktuellen Benutzers
 * - Erstellen neuer Events
 * - Bearbeiten existierender Events
 * - Löschen von Events
 * 
 * WICHTIG: Der Backend filtert automatisch:
 * - Normale Benutzer sehen nur ihre eigenen Events
 * - Admin-Benutzer sehen alle Events im System
 */

export const environment = { apiRoot: 'http://localhost:3000/api' };

/**
 * Termin (Event) Datentyp
 * 
 * - _id: Eindeutige Datenbank-ID (wird vom Backend generiert)
 * - title: Titel des Events
 * - location: Ort/Lokation des Events
 * - mitnehmen: Material/Gegenstände zum Mitnehmen (optional)
 * - date: Zeitstempel des Events (optional)
 * - kategorieId: ID der zugewiesenen Kategorie (optional)
 */
export type Termin = {
    _id?: string;
    _userId?: string;
    title: string;
    location: string;
    mitnehmen?: string;
    date?: string;
    kategorieId?: string;
    username?: string; // optionaler Anzeige-Name des Erstellers (vom Backend angereichert)
};

/**
 * Ruft alle Events ab, die der aktuelle Benutzer sehen darf
 * 
 * - Normale Benutzer: Sehen nur ihre eigenen Events
 * - Admin-Benutzer: Sehen alle Events im System
 * 
 * Die Filterung findet auf dem Backend statt (sichere Variante)
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @returns Promise mit Array aller Events
 * @throws Error wenn Backend nicht erreichbar
 */
export async function getTermine(token: string): Promise<Termin[]> {
    console.log("📡 getTermine called with token:", token ? "✓ present" : "✗ null");
    try {
        const request = await fetch(`${environment.apiRoot}/programm`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Backend extrahiert _userId aus Token
            },
            method: 'GET',
        });

        if (!request.ok) {
            console.error("❌ getTermine error:", request.status, request.statusText);
            throw new Error(`HTTP ${request.status}`);
        }

        const result = await request.json();
        console.log("✅ getTermine success, count:", result.length);
        return result;
    } catch (error) {
        console.error("❌ getTermine failed:", error);
        throw error;
    }
}

/**
 * Erstellt ein neues Event
 * 
 * Der Backend setzt automatisch die _userId basierend auf dem JWT-Token
 * Das Frontend kann diese nicht selbst setzen (Sicherheit)
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param termin - Event-Objekt mit title, location, date, etc.
 * @returns Promise mit dem erstellten Event (inkl. _id vom Backend)
 * @throws Error wenn Validierung fehlschlägt oder Backend-Fehler
 */
export async function addTermin(token: string, termin: Termin): Promise<Termin> {
    console.log("📡 addTermin called:", { title: termin.title, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/programm`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'POST',
            body: JSON.stringify(termin),
        });

        if (!request.ok) {
            const errorData = await request.json();
            console.error("❌ addTermin error:", request.status, errorData);
            throw new Error(`HTTP ${request.status}: ${errorData.message || errorData}`);
        }

        const result = await request.json();
        console.log("✅ addTermin success:", result);
        return result;
    } catch (error) {
        console.error("❌ addTermin failed:", error);
        throw error;
    }
}

/**
 * Bearbeitet ein existierendes Event
 * 
 * Der Backend überprüft:
 * - Ist der Benutzer angemeldet? (JWT-Token)
 * - Ist es sein Event? (Ownership-Check)
 * - Oder ist er Admin? (Admin können alle Events bearbeiten)
 * 
 * Unerlaubte Änderungen werden mit 403 Forbidden abgelehnt
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param termin - Event-Objekt mit _id und Änderungen
 * @returns Promise mit dem aktualisierten Event
 * @throws Error bei 403 (nicht berechtigt) oder anderen Fehlern
 */
export async function editTermin(token: string, termin: Termin): Promise<Termin> {
    console.log("📡 editTermin called:", { terminId: termin._id, title: termin.title, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/programm/${termin._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Backend vergleicht _userId mit Termin-Besitzer
            },
            method: 'PUT',
            body: JSON.stringify(termin),
        });

        if (!request.ok) {
            const errorData = await request.json();
            console.error("❌ editTermin error:", request.status, errorData);
            throw new Error(`HTTP ${request.status}: ${errorData.message || errorData}`);
        }

        const result = await request.json();
        console.log("✅ editTermin success:", result);
        return result;
    } catch (error) {
        console.error("❌ editTermin failed:", error);
        throw error;
    }
}

/**
 * Löscht ein existierendes Event
 * 
 * Der Backend überprüft:
 * - Ist der Benutzer angemeldet?
 * - Gehört das Event ihm? (oder ist er Admin)
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param id - Die _id des zu löschenden Events
 * @returns Promise mit HTTP-Statuscode (200 = Erfolg, 403 = Nicht berechtigt, 404 = Nicht gefunden)
 */
export async function deleteTermin(token: string, id: string): Promise<number> {
    console.log("📡 deleteTermin called:", { terminId: id, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/programm/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: 'DELETE',
        });

        console.log("✅ deleteTermin status:", request.status);
        return request.status;
    } catch (error) {
        console.error("❌ deleteTermin failed:", error);
        throw error;
    }
}