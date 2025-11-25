import { type Termin, addTermin, editTermin, getTermine } from "../termine-api.js";
import { getKategorien } from "../category-api.js";

let editTerminData: Termin | null = null;

async function loadEditData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;

    const token = localStorage.getItem("jwt");
    const termine = await getTermine(token!);
    editTerminData = termine.find(t => t._id === id) ?? null;

    if (editTerminData) {
        (document.querySelector("#edit-title") as HTMLInputElement).value = editTerminData.title;
        (document.querySelector("#edit-location") as HTMLInputElement).value = editTerminData.location;
        (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value = editTerminData.mitnehmen ?? "";
        (document.querySelector("#edit-date") as HTMLInputElement).value = editTerminData.date?.split("T")[0] ?? "";
    }
}

async function loadCategories() {
    const select = document.querySelector('#category') as HTMLSelectElement;
    const token = localStorage.getItem("jwt");
    const kategorien = await getKategorien(token);

    for (const k of kategorien) {
        const opt = document.createElement('option');
        opt.value = k._id!;
        opt.textContent = k.name;
        select.appendChild(opt);
    }

    if (editTerminData) {
        select.value = editTerminData.kategorieId ?? "";
    }
}

document.querySelector('form')!.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = (document.querySelector("#edit-title") as HTMLInputElement).value;
    const location = (document.querySelector("#edit-location") as HTMLInputElement).value;
    const mitnehmen = (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value;
    const date = (document.querySelector("#edit-date") as HTMLInputElement).value;
    const categorySelect = document.querySelector('#category') as HTMLSelectElement;
    const categoryId = categorySelect.value;
    const token = localStorage.getItem("jwt");

    if (editTerminData) {
        editTerminData.title = title;
        editTerminData.location = location;
        editTerminData.mitnehmen = mitnehmen;
        editTerminData.date = date ? new Date(date).toISOString() : undefined;
        editTerminData.kategorieId = categoryId;

        try {
            await editTermin(token, editTerminData);
        } catch (error) {
            console.error("Fehler beim Bearbeiten:", error);
            alert("Fehler beim Bearbeiten: " + error);
            return;
        }
        
    } else {
        const newEvent: Termin = {
            title,
            location,
            mitnehmen: mitnehmen || undefined,
            date: date ? new Date(date).toISOString() : undefined,
            kategorieId: categoryId
        };
        try {
            await addTermin(token!, newEvent);
        } catch (error) {
            console.error("Fehler beim Erstellen:", error);
            alert("Fehler beim Erstellen: " + error);
            return;
        }
    }

    window.location.href = "./agenda.html";
});

await loadCategories();
await loadEditData();
