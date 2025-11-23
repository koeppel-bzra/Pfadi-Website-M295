import Datastore from '@seald-io/nedb';
import { z } from 'zod';

/**
 * Erlaubte Farben für Kategorien
 * Diese Enum limitiert die Wahl auf 5 vordefinierte Farben
 */
const Farben = z.enum(["rot", "blau", "grün", "gelb", "orange"])

/**
 * Zod Schema für eine Kategorie
 * 
 * Felder:
 * - _id: Eindeutige Kategorie-ID (auto-generiert)
 * - name: Name der Kategorie (z.B. "Lager", "Training", "Ausflug")
 * - farben: Array mit Farben für die Anzeige (z.B. ["rot", "blau"])
 *           nonempty() = mindestens eine Farbe erforderlich!
 * 
 * Kategorien sind NICHT an einen User gebunden (öffentlich)
 * Aber nur angemeldete User können sie erstellen/editieren
 */
export const Kategorie = z.object({
    _id: z.string().optional(),
    name: z.string(),
    farben: z.array(Farben).nonempty()  // Mindestens eine Farbe erforderlich
})

// TypeScript Type extrahieren
export declare type KategorieModel = z.infer<typeof Kategorie>;

/**
 * Singleton Pattern für Kategorie-Datenbank
 */
let nedb: Datastore<KategorieModel> | null = null

/**
 * Gibt die Kategorie-Datenbank zurück
 * Datei: ./data/categories.db
 */
export function kategorieDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/categories.db',
            autoload: true,
        } )
    }
    return nedb;
}

/**
 * Initialisiert die Kategorie-Datenbank beim App-Start
 */
export async function initializeKategorieDb() {
    await kategorieDb().autoloadPromise;
}