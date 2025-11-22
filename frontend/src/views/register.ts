import { register, saveJwt, saveUsername } from "../users-api.ts";

document.querySelector('.submit-btn')?.addEventListener('click', async () => {

    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;
    const passwordRepeat = (inputs[2] as HTMLInputElement).value;

    if (password !== passwordRepeat) {
        alert("Passwörter stimmen nicht überein!");
        return;
    }

    try {
        const result = await register(username, password);
        saveJwt(result.jwt);
        saveUsername(result.username);
        alert("Registriert!");
        window.location.href = "./login.html";
    } catch (e) {
        alert("Registrierung fehlgeschlagen.");
    }
});
