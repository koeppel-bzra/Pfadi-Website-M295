import Datastore from '@seald-io/nedb';
import { z } from 'zod';

export const Kategorie = z.object({
    _id: z.string().optional(),
    name: z.string(),
})


export declare type KategorieModel = z.infer<typeof Kategorie>;

let nedb: Datastore<KategorieModel> | null = null

export function kategorieDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/categories.db',
            autoload: true,
        } )
    }
    return nedb;
}

export async function initializeKategorieDb() {
    await kategorieDb().autoloadPromise;
}