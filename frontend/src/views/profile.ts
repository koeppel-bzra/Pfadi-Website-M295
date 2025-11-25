/**
 * Profile View Handler
 * 
 * Diese Datei verwaltet die Profil-Bearbeitung-Seite der Anwendung.
 * Der Benutzer kann hier seinen Benutzernamen und sein Passwort ändern.
 * Das Passwort ist optional - wenn leer, wird nur der Benutzername aktualisiert.
 */

import { updateProfile, saveUsername, getUsername } from "../users-api.ts";

document.addEventListener('DOMContentLoaded', () => {
    // Pre-fill username from localStorage
    const inputs = document.querySelectorAll('input');
    const usernameInput = inputs[0] as HTMLInputElement;
    const savedUsername = getUsername();
    
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }
});

/**
 * Event-Listener für den Submit-Button
 * 
 * Dieser Code wird ausgeführt, wenn der Benutzer auf den "Speichern"-Button klickt.
 * 
 * Ablauf:
 * 1. Extrahiert Username, Passwort und Passwort-Wiederholung aus Input-Feldern
 * 2. Wenn Passwort angegeben: Prüft, ob beide Passwörter gleich sind
 * 3. Sendet Update-Anfrage an Backend mit Authorization-Header
 * 4. Speichert den neuen Username im localStorage
 * 5. Zeigt Erfolgs-Alert
 * 6. Leitet zur Agenda um
 * 7. Bei Fehler: Zeigt Fehler-Alert
 */
document.querySelector('.submit-btn')?.addEventListener('click', async () => {

    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;
    const passwordRepeat = (inputs[2] as HTMLInputElement).value;

    // Validierung: Wenn Passwort angegeben, müssen beide Passwörter identisch sein
    if (password && password !== passwordRepeat) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    try {
        // Sendet Update-Anfrage an Backend mit Authorization-Header
        // Optional wird auch das neue Passwort gesendet (wenn angegeben)
        const result = await updateProfile(username, password || undefined);
        
        // Speichert den neuen Username
        saveUsername(result.username || username);
        
        alert("Profil aktualisiert!");
        
        // Leitet zur Agenda um
        window.location.href = "../index.html";
    } catch (e) {
        // Zeigt Fehlermeldung bei fehlgeschlagener Aktualisierung
        alert("Profil-Update fehlgeschlagen.");
    }
});
