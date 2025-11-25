export const environment = { apiRoot: 'http://localhost:3000/api' };

export type Termin = {
    _id?: string;
    _userId?: string;
    title: string;
    location: string;
    mitnehmen?: string;
    date?: string;
    kategorieId?: string;
    username?: string;
};

export async function getTermine(token: string): Promise<Termin[]> {
    const request = await fetch(`${environment.apiRoot}/programm`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'GET',
    });
    return request.json();
}

export async function addTermin(token: string, termin: Termin): Promise<Termin> {
    const request = await fetch(`${environment.apiRoot}/programm`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify(termin),
    });

    if (!request.ok) {
        const errorData = await request.json().catch(() => ({}));
        throw new Error(`HTTP ${request.status}: ${errorData.message || request.statusText}`);
    }

    return request.json();
}

export async function editTermin(token: string, termin: Termin): Promise<Termin> {
    const request = await fetch(`${environment.apiRoot}/programm/${termin._id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify(termin),
    });

    if (!request.ok) {
        const errorData = await request.json().catch(() => ({}));
        throw new Error(`HTTP ${request.status}: ${errorData.message || request.statusText}`);
    }

    return request.json();
}

export async function deleteTermin(token: string, id: string): Promise<number> {
    const request = await fetch(`${environment.apiRoot}/programm/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'DELETE',
    });

    return request.status;
}