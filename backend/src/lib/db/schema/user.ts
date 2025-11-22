import Datastore from '@seald-io/nedb'
import { z } from 'zod'

export const User = z.object({
    _id: z.string().optional(),
    username: z.string(),
    passwordHash: z.string(),
    role: z.enum(['admin', 'user']).default('user'),
});

export declare type UserModel = z.infer<typeof User>

let nedb: Datastore<UserModel> | null = null

export function userDb() {
    if (!nedb) {
        nedb = new Datastore( {
            filename: './data/user.db',
            autoload: true
        } )
    }
    return nedb
}

export async function initializeUserdb() {
    await userDb().autoloadPromise
}