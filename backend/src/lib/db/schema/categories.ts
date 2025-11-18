import Datastore from '@seald-io/nedb';
import { z } from 'zod';

const Farben = z.enum(["rot", "blau", "grün", "gelb", "orange"])

export const Kategorie = z.object({
    _id: z.string().optional(),
    name: z.string(),
    farben: z.array(Farben).nonempty()
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