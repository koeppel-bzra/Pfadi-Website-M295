/**
 * Frontend API wrapper für Kategorie-Management
 * 
 * Dieses Modul verwaltet die Kommunikation mit dem Backend für:
 * - Abrufen aller verfügbaren Kategorien (öffentlich, keine Auth nötig)
 * - Erstellen neuer Kategorien (nur angemeldet)
 * - Bearbeiten existierender Kategorien (nur angemeldet)
 * - Löschen von Kategorien (nur angemeldet)
 * 
 * BESONDERHEIT: GET ist öffentlich, aber POST/PUT/DELETE erfordern Authentifizierung
 */

export const environment = { apiRoot: 'http://localhost:3000/api' };

/**
 * Kategorie Datentyp
 * 
 * - _id: Eindeutige Datenbank-ID (wird vom Backend generiert)
 * - name: Anzeigename der Kategorie (z.B. "Wanderungen", "Lager")
 * - farben: Array mit 1-5 Farben zur visuellen Darstellung
 *           Erlaubte Werte: "rot", "blau", "grün", "gelb", "orange"
 */
export type Kategorie = {
    _id?: string;
    name: string;
    farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange" >;
};

/**
 * Ruft alle verfügbaren Kategorien ab
 * 
 * WICHTIG: Diese Funktion ist ÖFFENTLICH und erfordert KEINE Authentifizierung
 * Das Frontend kann die Kategorien-Liste laden, ohne angemeldet zu sein
 * Die Kategorien werden auf der Agenda angezeigt, um Events zu filtern
 * 
 * @param token - JWT-Token (wird NICHT verwendet, aber akzeptiert zur API-Konsistenz)
 * @returns Promise mit Array aller Kategorien
 */
export async function getKategorien(token: string | null): Promise<Kategorie[]> {
    console.log("📡 getKategorien called with token:", token ? "✓ present" : "✗ null");
    try {
        const request = await fetch(`${environment.apiRoot}/categories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
            // Kein Authorization-Header nötig!
        });

        if (!request.ok) {
            console.error("❌ getKategorien error:", request.status, request.statusText);
            throw new Error(`HTTP ${request.status}`);
        }

        const result = await request.json();
        console.log("✅ getKategorien success:", result);
        return result;
    } catch (error) {
        console.error("❌ getKategorien failed:", error);
        throw error;
    }
}

/**
 * Erstellt eine neue Kategorie
 * 
 * Authentifizierung: ERFORDERLICH
 * Der Backend überprüft den JWT-Token
 * 
 * Die Kategorie kann von Events verwendet werden, um visuell zu kennzeichnen,
 * um welche Art von Event es sich handelt
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param kategorie - Kategorie-Objekt mit name und farben
 * @returns Promise mit der erstellten Kategorie (inkl. _id vom Backend)
 * @throws Error wenn nicht authentifiziert oder Validierung fehlschlägt
 */
export async function addKategorie(token: string | null, kategorie: Kategorie): Promise<Kategorie> {
    if (!token) {
        throw new Error("❌ addKategorie: Kein Token vorhanden - nicht angemeldet!");
    }

    console.log("📡 addKategorie called:", { kategorie, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Authentifizierung erforderlich
            },
            body: JSON.stringify(kategorie)
        });

        if (!request.ok) {
            const errorData = await request.json();
            console.error("❌ addKategorie error:", request.status, errorData);
            throw new Error(`HTTP ${request.status}: ${errorData.message || errorData}`);
        }

        const result = await request.json();
        console.log("✅ addKategorie success:", result);
        return result;
    } catch (error) {
        console.error("❌ addKategorie failed:", error);
        throw error;
    }
}

/**
 * Bearbeitet eine existierende Kategorie
 * 
 * Authentifizierung: ERFORDERLICH
 * Der Backend überprüft den JWT-Token
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param category - Kategorie-Objekt mit _id und zu ändernden Feldern
 * @returns Promise mit der aktualisierten Kategorie
 * @throws Error bei 401 (nicht authentifiziert) oder anderen Fehlern
 */
export async function editKategorie(token: string | null, category: Kategorie): Promise<Kategorie> {
    if (!token) {
        throw new Error("❌ editKategorie: Kein Token vorhanden - nicht angemeldet!");
    }

    console.log("📡 editKategorie called:", { categoryId: category._id, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/categories/${category._id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Authentifizierung erforderlich
            },
            method: 'PUT',
            body: JSON.stringify(category),
        });

        if (!request.ok) {
            const errorData = await request.json();
            console.error("❌ editKategorie error:", request.status, errorData);
            throw new Error(`HTTP ${request.status}: ${errorData.message || errorData}`);
        }

        const result = await request.json();
        console.log("✅ editKategorie success:", result);
        return result;
    } catch (error) {
        console.error("❌ editKategorie failed:", error);
        throw error;
    }
}

/**
 * Löscht eine existierende Kategorie
 * 
 * Authentifizierung: ERFORDERLICH
 * Der Backend überprüft den JWT-Token
 * 
 * @param token - JWT-Token des aktuellen Benutzers
 * @param id - Die _id der zu löschenden Kategorie
 * @returns Promise mit HTTP-Statuscode (200 = Erfolg, 401 = Nicht authentifiziert, 404 = Nicht gefunden)
 */
export async function deleteKategorie(token: string | null, id: string): Promise<number> {
    if (!token) {
        throw new Error("❌ deleteKategorie: Kein Token vorhanden - nicht angemeldet!");
    }

    console.log("📡 deleteKategorie called:", { categoryId: id, tokenPresent: !!token });
    try {
        const request = await fetch(`${environment.apiRoot}/categories/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Authentifizierung erforderlich
            },
            method: 'DELETE',
        });

        console.log("✅ deleteKategorie status:", request.status);
        return request.status;
    } catch (error) {
        console.error("❌ deleteKategorie failed:", error);
        throw error;
    }
}