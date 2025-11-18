import { type Termin, addTermin } from "../termine-api.js";
import { getKategorien } from "../category-api.js";

async function createEditView() {
    const title = (document.querySelector("#edit-title") as HTMLInputElement).value;
    const location = (document.querySelector("#edit-location") as HTMLInputElement).value;
    const mitnehmen = (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value;
    const date = (document.querySelector("#edit-date") as HTMLInputElement).value;

    const categorySelect = document.querySelector('#category') as HTMLSelectElement;
    const categoryId = categorySelect.value;

    const token = localStorage.getItem("jwt-token");

    const newTermin: Termin = {
        title,
        location,
        mitnehmen: mitnehmen || undefined,
        date: date ? new Date(date).toISOString() : undefined,
        kategorieId: categoryId
    };

    await addTermin(token!, newTermin);
    document.location.href = "./agenda.html";
}

async function loadCategories() {
    const select = document.querySelector('#category') as HTMLSelectElement;
    const kategorien = await getKategorien();

    for (const k of kategorien) { // Kategorien werden im Foor Loop ausgegeben
        const opt = document.createElement('option'); // Erstellt ein neues Option Element
        opt.value = k._id!;
        opt.textContent = k.name;
        select.appendChild(opt);
    }
}

await loadCategories();

document.querySelector('form')!.addEventListener("submit", (e) => {
    e.preventDefault();
    createEditView();
});

// Zuerst werden die Kategorien geladen, damit sie im Select Element angezeigt werden können. 
// Danach wird der Event Listener für das Formular hinzugefügt, um die Erstellung eines neuen Termins zu handhaben.