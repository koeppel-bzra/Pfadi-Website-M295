import { login, saveJwt, saveUsername } from "../users-api.ts";


document.querySelector('.submit-btn')?.addEventListener('click', async () => {

    const inputs = document.querySelectorAll('input');
    const username = (inputs[0] as HTMLInputElement).value;
    const password = (inputs[1] as HTMLInputElement).value;

    try {
        const result = await login(username, password);
        saveJwt(result.token);
        saveUsername(result.username);
        alert("Login erfolgreich!");
        window.location.href = "../index.html";
    } catch (e) {
        alert("Login fehlgeschlagen.");
    }
});
