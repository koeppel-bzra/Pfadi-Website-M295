import { getTermine, deleteTermin, type Termin } from "../termine-api.js";

let termine: Termin[] = []; // Array, das alle Termine speichert



// Sortierfunktionen

function aufsteigendSortieren() {
    termine.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function absteigendSortieren() {
    termine.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


// Löscht einen Termin in Db und lokal
async function terminLoeschen(termin: Termin) {
    const token = localStorage.getItem("jwt-token"); 
    await deleteTermin(token, termin._id);           

    
    termine = termine.filter(t => t._id !== termin._id);

    renderAgenda(); // UI aktualisieren
}



// Event Listener für Sortier-Buttons

document.querySelector("#aufsteigend")!.addEventListener("click", () => {
    aufsteigendSortieren();
    renderAgenda();
});

document.querySelector("#absteigend")!.addEventListener("click", () => {
    absteigendSortieren();
    renderAgenda();
});



// Termine laden

async function loadTermine() {
    const token = localStorage.getItem("jwt-token");
    termine = await getTermine(token); // Termine vom Backend holen
}



// Termine rendern

async function renderAgenda() {
    const list = document.querySelector("#data");
    list.innerHTML = "";

    // Alle Termine in die Liste einfügen
    for (const termin of termine) {
        list.innerHTML += `
            <li class="termin-item" data-id="${termin._id}">
                <h3>${termin.title}</h3>
                <p id="datum">Datum: ${new Date(termin.date).toLocaleDateString("de-CH")}</p>
                <button class="delete-button" data-id="${termin._id}">Termin löschen</button>
            </li>
        `;
    }


    list.addEventListener("click", (evt) => {
        const target = evt.target as HTMLElement;
        const item = target.closest('.termin-item') as HTMLElement;
        if (!item) return;

        const id = item.dataset.id!;

        if (target.classList.contains('delete-button')) {
            const termin = termine.find(t => t._id === id);
            if (termin && confirm("Willst du diesen Termin wirklich löschen?")) { // Confirm ähnlich wie alert, aber mit Ja/Nein
                terminLoeschen(termin);
            }
            return;
        }

        // Detailansicht anzeigen
        renderDetail(id);
    });
}



// Detailansicht rendern

async function renderDetail(id: string) {
    const termin = termine.find(t => t._id === id);
    if (!termin) return;

    const detailDiv = document.querySelector("#detail");
    const date = new Date(termin.date).toLocaleDateString("de-CH");

    detailDiv.innerHTML = `
        <li class="termin-detail">
            <h3>${termin.title} am ${date}</h3>
            <p>Ort: ${termin.location}</p>
            <p>Mitnehmen: ${termin.mitnehmen}</p>
            <p>Datum: ${date}</p>
        </li>
    `;
}

// -------------------- Initialisierung --------------------

await loadTermine();
renderAgenda();
console.log("Termine geladen:", termine);
