export const environment = { apiRoot: 'http://localhost:3000/api' };

export type Kategorie = {
    _id?: string;
    name: string;
    farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange" >;
};

export async function getKategorien(): Promise<Kategorie[]> {
    const request = await fetch(`${environment.apiRoot}/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    return await request.json();
}

export async function addKategorie(token: string, kategorie: Kategorie): Promise<Kategorie> {
    const request = await fetch(`${environment.apiRoot}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(kategorie)
    });

    return await request.json();
}