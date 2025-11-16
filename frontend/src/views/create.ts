import { type Termin, addTermin } from "../termine-api.js";

async function createEditView() {
    const title = document.querySelector<HTMLInputElement>("#edit-title")!.value;
    const location = document.querySelector<HTMLInputElement>("#edit-location")!.value;
    const mitnehmen = document.querySelector<HTMLInputElement>("#edit-mitnehmen")!.value;
    const date = document.querySelector<HTMLInputElement>("#edit-date")!.value;

    const token = localStorage.getItem("jwt-token");
    const newTermin: Termin = {
        title: title,
        location: location,
        mitnehmen: mitnehmen || undefined,
        date: date ? new Date(date).toISOString() : undefined,
    };

    await addTermin(token, newTermin);
    document.location.href = "./agenda.html";

}

document.querySelector('form')!.addEventListener("submit", (e) => {
    e.preventDefault();
    createEditView();
});