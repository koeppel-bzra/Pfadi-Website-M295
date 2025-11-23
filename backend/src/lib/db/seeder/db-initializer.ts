import bcrypt from "bcryptjs";
import { initializeProgrammDb, programmDb } from "../schema/programm";
import { initializeUserdb, userDb } from "../schema/user";

/**
 * Initialisiert alle Datenbanken beim App-Start
 * 
 * Diese Funktion wird in instrumentation.ts aufgerufen
 * 
 * Was sie macht:
 * 1. Laden alle DB Dateien (programm.db, user.db, etc.)
 * 2. Wenn die User-DB leer ist: Erstellt den Standard-Admin-User
 * 
 * Der Admin-User:
 * - Username: admin
 * - Password: user1234
 * - Role: admin (sieht alle Events)
 * 
 * WICHTIG: Passwords werden mit bcrypt gehashed
 * Das Plaintext-Passwort wird NIEMALS gespeichert!
 */
export async function initializeData() {
    // Starte alle Datenbanken
    await initializeProgrammDb();
    await initializeUserdb();

    // Zähle die Anzahl der existierenden User
    const count = await userDb().countAsync({});
    
    // Nur wenn KEINE User existieren (neue Installation): Erstelle Admin
    if (count === 0) {
        const password = 'user1234';
        // Hash das Passwort mit bcrypt (Rounds: 10 = Balance zwischen Sicherheit und Speed)
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Füge Admin-User zur DB hinzu
        await userDb().insertAsync({
            username: 'admin',
            passwordHash: passwordHash,
            role: 'admin'
        });
    }
}