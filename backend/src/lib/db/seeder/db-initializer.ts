import bcrypt from "bcryptjs";
import { initializeProgrammDb, programmDb } from "../schema/programm";
import { initializeUserdb, userDb } from "../schema/user";

export async function initializeData() {
    await initializeProgrammDb();
    await initializeUserdb();

    const count = await userDb().countAsync({});
    if (count === 0) {
        const password = 'user1234';
        const passwordHash = await bcrypt.hash(password, 10);
        await userDb().insertAsync({
            username: 'admin',
            passwordHash: passwordHash,
            role: 'admin'
        });
    }
}