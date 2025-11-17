import { getTermine, type Termin } from "../termine-api.js";

let termine: Termin[] = [];

function aufsteigendSortieren() {
    termine.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function absteigendSortieren() {
    termine.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

document.querySelector("#aufsteigend")!.addEventListener("click", () => {
    aufsteigendSortieren();
    renderAgenda();
});

document.querySelector("#absteigend")!.addEventListener("click", () => {
    absteigendSortieren();
    renderAgenda();
});

async function loadTermine() {
    const token = localStorage.getItem("jwt-token");
    termine = await getTermine(token);
}

async function renderAgenda() {
    const list = document.querySelector("#data");
    list.innerHTML = "";

    for (const termin of termine) {
        list.innerHTML += `
            <li class="termin-item" data-id="${termin._id}">
                <h3>${termin.title}</h3>
                <p id="datum">Datum: ${new Date(termin.date).toLocaleDateString("de-CH")}</p>
            </li>
        `;
    }

    list.addEventListener("click", (evt) => {
        const item = (evt.target as Element).closest('.termin-item') as HTMLElement; // die Funktion closest sucht das nächste Element mit der Klasse .termin-item
        if (!item) return;

        const id = item.dataset.id; // dataset.id greift auf das data-id Attribut zu
        renderDetail(id);
    });
}

async function renderDetail(id: string) {
    const token = localStorage.getItem("jwt-token");
    const termin = termine.find(t => t._id === id);

    if (!termin) return;

    const detailDiv = document.querySelector("#detail");
    const date = new Date(termin.date).toLocaleDateString("de-CH")
    
    detailDiv.innerHTML = `
        <li class="termin-detail">
            <h3>${termin.title} am ${date}</h3>
            <p>Ort: ${termin.location}</p>
            <p>Mitnehmen: ${termin.mitnehmen}</p>
            <p>Datum: ${date}</p>
        </li>
    `;
}

await loadTermine(); // Await braucht es hier, damit die termine geladen sind, bevor renderAgenda aufgerufen wird.
renderAgenda();
console.log("Termine geladen:", termine);
