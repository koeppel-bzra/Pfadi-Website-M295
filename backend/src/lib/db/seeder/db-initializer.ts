import { initializeProgrammDb, programmDb } from "../schema/programm";
import { initializeKategorieDb, kategorieDb } from "../schema/categories";

export async function initializeData() {
    await initializeProgrammDb()
    await initializeKategorieDb()

    const dbEmpty = await kategorieDb().countAsync({ }) === 0

    if (dbEmpty) {
        await kategorieDb().insertAsync( {
            name: "Lager"
        }) 
    }
}