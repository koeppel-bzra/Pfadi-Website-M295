export const environment = { apiRoot: 'http://localhost:3000/api' };

export declare type Termin = {
    title: string;
    location: string;
    mitnehmen?: string;
    date?: string;
}

export async function getTermine(token: string): Promise<Termin[]> {
    const request = await fetch(`${environment.apiRoot}/programm`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    });
    const data = await request.json();
    return data;
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
    const data = await request.json();
    return data;
}