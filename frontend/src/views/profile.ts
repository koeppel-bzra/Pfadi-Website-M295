import { updateProfile, saveUsername, getUsername } from "../users-api.ts";

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    const usernameInput = inputs[0] as HTMLInputElement;
    const savedUsername = getUsername();
    if (savedUsername) usernameInput.value = savedUsername;
});

document.querySelector('.submit-btn')?.addEventListener('click', async () => {
    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;
    const passwordRepeat = (inputs[2] as HTMLInputElement).value;

    if (password && password !== passwordRepeat) { alert("Passwörter stimmen nicht überein!"); return; }

    try {
        const result = await updateProfile(username, password || undefined);
        saveUsername(result.username || username);
        alert("Profil aktualisiert!");
        window.location.href = "../index.html";
    } catch (e) {
        alert("Profil-Update fehlgeschlagen.");
    }
});
