import { login, saveJwt, saveUsername } from "../users-api.ts";


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
        alert("Login fehlgeschlagen.");
    }
});
