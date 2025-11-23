/**
 * Register View Handler
 * 
 * Diese Datei verwaltet die Registrierungs-Seite der Anwendung.
 * Der Benutzer kann hier einen neuen Account erstellen.
 * Nach erfolgreicher Registrierung wird der Benutzer automatisch angemeldet
 * und erhält einen JWT-Token.
 */

import { register, saveJwt, saveUsername } from "../users-api.ts";

/**
 * Event-Listener für den Registrierungs-Button
 * 
 * Dieser Code wird ausgeführt, wenn der Benutzer auf den "Submit"-Button klickt.
 * 
 * Ablauf:
 * 1. Extrahiert Username, Passwort und Passwort-Wiederholung aus Input-Feldern
 * 2. Prüft, ob beide Passwörter gleich sind
 * 3. Sendet Registrierungs-Anfrage an Backend
 * 4. Speichert den erhaltenen Token und Username im localStorage (Auto-Login)
 * 5. Leitet zur Login-Seite um (Benutzer ist bereits angemeldet)
 * 6. Bei Fehler: Zeigt Fehler-Alert
 */
document.querySelector('.submit-btn')?.addEventListener('click', async () => {

    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;
    const passwordRepeat = (inputs[2] as HTMLInputElement).value;

    // Validierung: Passwörter müssen identisch sein
    if (password !== passwordRepeat) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    try {
        // Sendet Registrierungs-Anfrage an Backend
        // Backend erstellt Benutzer und gibt JWT-Token zurück (Auto-Login)
        const result = await register(username, password);
        
        // Speichert Token und Username (Benutzer ist jetzt "angemeldet")
        saveJwt(result.token);
        saveUsername(result.username);
        
        alert("Registriert!");
        
        // Leitet zur Login-Seite um
        // (Benutzer ist bereits angemeldet, könnte auch direkt zur Agenda gehen)
        window.location.href = "./login.html";
    } catch (e) {
        // Zeigt Fehlermeldung bei fehlgeschlagener Registrierung
        // (z.B. Username existiert bereits)
        alert("Registrierung fehlgeschlagen.");
    }
});
