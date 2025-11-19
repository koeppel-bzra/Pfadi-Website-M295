export const environment = { apiRoot: 'http://localhost:3000/api' };

export type Kategorie = {
    _id?: string;
    name: string;
    farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange" >;
};

export async function getKategorien(token: string): Promise<Kategorie[]> {
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

export async function editKategorie(token: string, category: Kategorie): Promise<Kategorie> {
    const request = await fetch(`${environment.apiRoot}/categories/${category._id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify(category),
    });
    return await request.json();
}

export async function deleteKategorie(token: string, id: string): Promise<number> {
    const request = await fetch(`${environment.apiRoot}/categories/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'DELETE',
    });

    return request.status;
}