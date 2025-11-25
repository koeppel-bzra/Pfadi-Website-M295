import { addKategorie, editKategorie, getKategorien, type Kategorie } from "../category-api.js";

let editKategorieData: Kategorie | null = null;

async function loadEditData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;

    const token = localStorage.getItem("jwt");
    const kategorien = await getKategorien(token);
    editKategorieData = kategorien.find(k => k._id === id) ?? null;

    if (editKategorieData) {
        (document.querySelector("#edit-name") as HTMLInputElement).value = editKategorieData.name;
        (document.querySelector("#edit-color") as HTMLSelectElement).value = editKategorieData.farben[0];
    }
}

async function createEditView() {
    const name = (document.querySelector('#edit-name') as HTMLInputElement).value;
    const farbe = (document.querySelector('#edit-color') as HTMLSelectElement).value;
    const farben = [farbe] as Kategorie['farben'];
    const token = localStorage.getItem("jwt");

    if (editKategorieData && editKategorieData._id) {
        editKategorieData.name = name;
        editKategorieData.farben = farben;
        await editKategorie(token, editKategorieData);
    } else {
        const newKategorie: Kategorie = { name, farben };
        try {
            await addKategorie(token, newKategorie);
        } catch (error) {
            console.error("Fehler beim Erstellen:", error);
            alert("Fehler beim Erstellen der Kategorie: " + error);
            return;
        }
    }

    window.location.href = "./agenda.html";
}

document.querySelector('form')!.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createEditView();
});

await loadEditData();
