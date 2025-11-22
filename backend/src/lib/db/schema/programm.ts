import Datastore from '@seald-io/nedb';
import {z} from 'zod';
import { userDb } from './user';

export const Programm = z.object({
    _id: z.string().optional(),
    kategorieId: z.string(),
    _userId: z.string(),
    title: z.string(),
    location: z.string(),
    mitnehmen: z.string().optional(),
    date: z.string().nullable().optional(),
})

export declare type ProgrammModel = z.infer<typeof Programm>;

let nedb: Datastore<ProgrammModel> | null = null

export function programmDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/programm.db',
            autoload: true,
        } )
    }
    return nedb
}

export async function initializeProgrammDb() {
    await programmDb().autoloadPromise;
}