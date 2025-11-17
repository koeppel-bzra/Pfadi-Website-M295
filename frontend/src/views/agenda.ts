import { getTermine, type Termin } from "../termine-api.js";

let termine: Termin[] = [];

async function renderAgenda() {
    const token = localStorage.getItem("jwt-token");
    termine = await getTermine(token);

    const list = document.querySelector("#data");
    list.innerHTML = "";

    for (const termin of termine) {
        list.innerHTML += `
            <li class="termin-item">
                <h3>${termin.title}</h3>
                <p>Ort: ${termin.location}</p>
                <p>Mitnehmen: ${termin.mitnehmen}</p>
                <p>Datum: ${termin.date}</p>
                <hr>
            </li>
        `;
    }
}
renderAgenda();
