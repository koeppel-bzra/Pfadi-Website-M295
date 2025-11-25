export const environment = { apiRoot: 'http://localhost:3000/api' };

export type Kategorie = {
    _id?: string;
    name: string;
    farben: Array<'rot' | 'blau' | 'grün' | 'gelb' | 'orange'>;
};

export async function getKategorien(token: string | null): Promise<Kategorie[]> {
    const request = await fetch(`${environment.apiRoot}/categories`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!request.ok) throw new Error(`HTTP ${request.status}`);
    return request.json();
}

export async function addKategorie(token: string | null, kategorie: Kategorie): Promise<Kategorie> {
    if (!token) throw new Error('Not authenticated');

    const request = await fetch(`${environment.apiRoot}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(kategorie)
    });

    if (!request.ok) {
        const errorData = await request.json().catch(() => ({}));
        throw new Error(`HTTP ${request.status}: ${errorData.message || request.statusText}`);
    }

    return request.json();
}

export async function editKategorie(token: string | null, category: Kategorie): Promise<Kategorie> {
    if (!token) throw new Error('Not authenticated');

    const request = await fetch(`${environment.apiRoot}/categories/${category._id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'PUT',
        body: JSON.stringify(category),
    });

    if (!request.ok) {
        const errorData = await request.json().catch(() => ({}));
        throw new Error(`HTTP ${request.status}: ${errorData.message || request.statusText}`);
    }

    return request.json();
}

export async function deleteKategorie(token: string | null, id: string): Promise<number> {
    if (!token) throw new Error('Not authenticated');

    const request = await fetch(`${environment.apiRoot}/categories/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'DELETE',
    });

    return request.status;
}