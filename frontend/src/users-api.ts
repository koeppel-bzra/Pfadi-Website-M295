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

    return response.json(); // { username, token }
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

    return response.json(); // { username, token }
}

export async function updateProfile(username: string, password?: string) {
    const token = getJwt();
    if (!token) throw new Error("Not authenticated");

    const body: any = { username };
    if (password) {
        body.password = password;
    }

    const response = await fetch(`${environment.apiRoot}/users/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error("Profile update failed");

    return response.json();
}

/**
 * Speichert einen JWT-Token im localStorage
 * 
 * Der Token wird verwendet, um API-Anfragen zu authentifizieren
 * (in den Authorization-Header als "Bearer {token}" eingefügt)
 * 
 * @param token - Der JWT-Token vom Backend
 */
export function saveJwt(token: string) {
    localStorage.setItem("jwt", token);
}

/**
 * Ruft den gespeicherten JWT-Token aus dem localStorage ab
 * 
 * Wird von allen API-Funktionen verwendet, um den Token
 * im Authorization-Header zu senden
 * 
 * @returns JWT-Token oder null, wenn nicht angemeldet
 */
export function getJwt(): string | null {
    return localStorage.getItem("jwt");
}

/**
 * Speichert den Benutzernamen im localStorage
 * 
 * Wird in der UI zur Anzeige des aktuellen Benutzers verwendet
 * 
 * @param username - Der Benutzername
 */
export function saveUsername(username: string) {
    localStorage.setItem("username", username);
}

/**
 * Ruft den gespeicherten Benutzernamen aus dem localStorage ab
 * 
 * Wird in der UI und zur Überprüfung des Login-Status verwendet
 * 
 * @returns Benutzername oder null, wenn nicht angemeldet
 */
export function getUsername(): string | null {
    return localStorage.getItem("username");
}

/**
 * Löscht alle Authentifizierungsdaten aus dem localStorage
 * 
 * Wird aufgerufen, wenn sich ein Benutzer abmeldet
 * Dies löscht sowohl den JWT-Token als auch den Benutzernamen
 */
export function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
}
