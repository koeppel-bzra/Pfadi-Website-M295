import Datastore from '@seald-io/nedb';
import {z} from 'zod';
import { userDb } from './user';

/**
 * Zod Schema für ein Programm/Ereignis
 * 
 * Felder:
 * - _id: Eindeutige Event-ID (auto-generiert)
 * - kategorieId: Welche Kategorie hat dieses Event (z.B. "Lager", "Training")
 * - _userId: Wer hat dieses Event erstellt (Link zu User ID)
 * - title: Name des Events (z.B. "Lager Sommer 2025")
 * - location: Ort des Events (z.B. "Gommiswald")
 * - mitnehmen: Was zum Mitnehmen ist (z.B. "Schlafsack, Zelt")
 * - date: Datum/Zeit des Events (ISO 8601 Format)
 * 
 * Die meisten Felder sind optional (_userId wird vom Server gesetzt)
 */
export const Programm = z.object({
    _id: z.string().optional(),
    kategorieId: z.string().optional(),
    _userId: z.string().optional(),    // Besitzer des Events (wichtig für Ownership-Checks!)
    title: z.string(),
    location: z.string(),
    mitnehmen: z.string().optional(),
    date: z.string().nullable().optional(),
})

// TypeScript Type extrahieren
export declare type ProgrammModel = z.infer<typeof Programm>;

/**
 * Singleton Pattern für Programm-Datenbank
 * Es gibt nur EINE Instanz für alle Events
 */
let nedb: Datastore<ProgrammModel> | null = null

/**
 * Gibt die Programm/Events-Datenbank zurück
 * Datei: ./data/programm.db
 */
export function programmDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/programm.db',
            autoload: true,
        } )
    }
    return nedb
}

/**
 * Initialisiert die Programm-Datenbank beim App-Start
 */
export async function initializeProgrammDb() {
    await programmDb().autoloadPromise;
}