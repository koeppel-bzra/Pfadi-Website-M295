/**
 * Login View Handler
 * 
 * Diese Datei verwaltet die Login-Seite der Anwendung.
 * Der Benutzer kann hier seinen Benutzernamen und Passwort eingeben
 * um sich anzumelden und einen JWT-Token zu erhalten.
 */

import { login, saveJwt, saveUsername } from "../users-api.ts";

/**
 * Event-Listener für den Login-Button
 * 
 * Dieser Code wird ausgeführt, wenn der Benutzer auf den "Submit"-Button klickt.
 * 
 * Ablauf:
 * 1. Extrahiert Username und Passwort aus den Input-Feldern
 * 2. Sendet sie an die users-api.login() Funktion
 * 3. Speichert den erhaltenen Token und Username im localStorage
 * 4. Zeigt Erfolgs-Alert und leitet zur Startseite um
 * 5. Bei Fehler: Zeigt Fehler-Alert
 */
document.querySelector('.submit-btn')?.addEventListener('click', async () => {

    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;

    try {
        // Sendet Login-Anfrage an Backend
        const result = await login(username, password);
        
        // Speichert Token und Username für zukünftige API-Calls
        saveJwt(result.token);
        saveUsername(result.username);

        alert("Login erfolgreich!");

        // Leitet zur Startseite um
        window.location.href = "../index.html";
    } catch (e) {
        // Zeigt Fehlermeldung bei fehlgeschlagenem Login
        // (z.B. falsches Passwort oder Username nicht gefunden)
        alert("Login fehlgeschlagen.");
    }
});
