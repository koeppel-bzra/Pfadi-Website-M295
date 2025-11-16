import { initializeProgrammDb, programmDb } from "../schema/programm";

export async function initializeData() {
    await initializeProgrammDb()
}