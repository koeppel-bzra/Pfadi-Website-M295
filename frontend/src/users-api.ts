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

export function saveJwt(token: string) {
    localStorage.setItem("jwt", token);
}

export function getJwt(): string | null {
    return localStorage.getItem("jwt");
}

export function saveUsername(username: string) {
    localStorage.setItem("username", username);
}

export function getUsername(): string | null {
    return localStorage.getItem("username");
}

export function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
}
