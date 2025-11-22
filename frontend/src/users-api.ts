export const environment = { apiRoot: 'http://localhost:3000/api' };

export async function register(username: string, password: string) {
    const response = await fetch(`${environment.apiRoot}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    if (!response.ok) throw new Error("Registration failed");

    return response.json(); // { email, jwt }
}

export async function login(username: string, password: string) {
    const response = await fetch(`${environment.apiRoot}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    if (!response.ok) throw new Error("Login failed");

    return response.json(); // { username, jwt }
}

export function saveJwt(token: string) {
    localStorage.setItem("jwt", token);
}

export function getJwt(): string | null {
    return localStorage.getItem("jwt");
}

export function saveUsername(username: string) {
    localStorage.setItem("username", username);
}

export function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
}
