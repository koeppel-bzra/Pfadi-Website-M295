import Datastore from '@seald-io/nedb'
import { z } from 'zod'

/**
 * Zod Schema für User-Validierung
 * 
 * Felder:
 * - _id: Eindeutige ID (wird von DB auto-generiert, optional bei Input)
 * - username: Benutzer-Name (z.B. "admin" oder "testuser")
 * - passwordHash: Gehashtes Passwort (NIEMALS Plaintext speichern!)
 * - role: "admin" oder "user" (admin sieht alle Events, user nur seine eigenen)
 * 
 * Zod sorgt dafür dass nur valide Daten akzeptiert werden
 */
export const User = z.object({
    _id: z.string().optional(),
    username: z.string(),
    passwordHash: z.string(),
    role: z.enum(['admin', 'user']).default('user'),
});

// TypeScript Type aus dem Zod Schema extrahieren
export declare type UserModel = z.infer<typeof User>

/**
 * Singleton-Pattern für NeDB Datastore
 * Es gibt nur EINE Datenbank-Instanz für alle User
 * 
 * WICHTIG: Diese Pattern verhindert mehrfaches Öffnen der gleichen DB
 */
let nedb: Datastore<UserModel> | null = null

/**
 * Gibt die User-Datenbank zurück (oder erstellt sie beim ersten Mal)
 * 
 * Die Datenbank wird gespeichert in: ./data/user.db
 * autoload: true = beim Starten automatisch alle Dokumente laden
 */
export function userDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/user.db',
            autoload: true
        } )
    }
    return nedb
}

/**
 * Initialisiert die User-Datenbank
 * Wartet bis alle Dokumente geladen sind (async)
 * 
 * Wird in db-initializer.ts beim App-Start aufgerufen
 */
export async function initializeUserdb() {
    await userDb().autoloadPromise
}