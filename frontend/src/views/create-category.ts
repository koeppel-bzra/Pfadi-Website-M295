import { addKategorie, type Kategorie } from "../category-api.js";

async function createEditView() {
    const name = (document.querySelector('#edit-name') as HTMLInputElement).value
    const farbe = (document.querySelector('#edit-color') as HTMLSelectElement).value

    const farben = [farbe] as Kategorie['farben']

    const token = localStorage.getItem("jwt-token");

    const newKategorie: Kategorie = {
        name,
        farben
    };
    
    await addKategorie(token, newKategorie)
    document.location.href = "./agenda.html";
    console.log(newKategorie.farben) // Zum Testen
}


document.querySelector('form')!.addEventListener("submit", (e) => {
    e.preventDefault();
    createEditView();
});


