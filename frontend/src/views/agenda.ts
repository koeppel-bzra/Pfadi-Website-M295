import { getTermine, deleteTermin, type Termin } from "../termine-api.js";
import { getKategorien } from "../category-api.js"; // benutze exakt den Funktionsnamen, den deine API-Datei exportiert

// lokale Typen (falls du die Typen nicht aus der category-api importierst)
type Kategorie = {
  _id?: string;
  name: string;
};

let termine: Termin[] = [];
let kategorien: Kategorie[] = [];


function getKategorieName(id?: string): string {
  if (!id) return "Keine";
  const k = kategorien.find((c) => c._id === id);
  return k ? k.name : "Unbekannt";
}



// sortieren
function aufsteigendSortieren() {
  termine.sort((a, b) => (new Date(a.date ?? 0).getTime()) - (new Date(b.date ?? 0).getTime()));
}

function absteigendSortieren() {
  termine.sort((a, b) => (new Date(b.date ?? 0).getTime()) - (new Date(a.date ?? 0).getTime()));
}



// löschen methode
async function terminLoeschen(termin: Termin) {
  const token = localStorage.getItem("jwt-token");
  if (!termin._id) return;
  await deleteTermin(token!, termin._id);
  termine = termine.filter((t) => t._id !== termin._id);
  renderAgenda();
}



// ladet termine
async function loadTermine() {
  const token = localStorage.getItem("jwt-token");
  // Kategorien zuerst laden (damit getKategorieName funktioniert)
  kategorien = await getKategorien();
  termine = await getTermine(token!);
  console.log("geladene termine: ", termine);
  console.log("Geladene Kategorien: ", kategorien);
}

// rendert termine
function renderAgenda() {
  const list = document.querySelector("#data");
  if (!list) return;
  list.innerHTML = "";

  for (const termin of termine) {
    const dateStr = termin.date ? new Date(termin.date).toLocaleDateString("de-CH") : "Kein Datum";
    const kName = getKategorieName(termin.kategorieId);

    list.innerHTML += `
      <li class="termin-item" data-id="${termin._id ?? ""}">
        <h3>${termin.title}</h3>
        <p>Datum: ${dateStr}</p>
        <p>Kategorie: ${kName}</p>
        <button class="delete-button" data-id="${termin._id ?? ""}">Termin löschen</button>
      </li>
    `;
  }
}



// detailansicht
function renderDetail(id: string) {
  const termin = termine.find((t) => t._id === id);
  if (!termin) return;

  const detailDiv = document.querySelector("#detail");
  if (!detailDiv) return;

  const date = termin.date ? new Date(termin.date).toLocaleDateString("de-CH") : "Kein Datum";
  const kName = getKategorieName(termin.kategorieId);

  detailDiv.innerHTML = `
    <li class="termin-detail">
      <h3>${termin.title} am ${date}</h3>
      <p>Ort: ${termin.location}</p>
      <p>Mitnehmen: ${termin.mitnehmen ?? "-"}</p>
      <p>Datum: ${date}</p>
      <p>Kategorie: ${kName}</p>
    </li>
  `;
}


function bindUIHandlers() {
  // Sortier-Buttons
  document.querySelector("#aufsteigend")?.addEventListener("click", () => {
    aufsteigendSortieren();
    renderAgenda();
  });

  document.querySelector("#absteigend")?.addEventListener("click", () => {
    absteigendSortieren();
    renderAgenda();
  });


  // Delegation für Liste (ein Listener, nicht bei jedem Render neu)
  const list = document.querySelector("#data");
  list?.addEventListener("click", (evt) => {
    const target = evt.target as HTMLElement;
    const item = target.closest(".termin-item") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id ?? "";

    if (target.classList.contains("delete-button")) {
      const termin = termine.find((t) => t._id === id);
      if (termin && confirm("Willst du diesen Termin wirklich löschen?")) {
        terminLoeschen(termin);
      }
      return;
    }

    // Detailansicht anzeigen (kein Seitenwechsel)
    renderDetail(id);
  });
}



await loadTermine();
bindUIHandlers();
renderAgenda();
console.log("Termine geladen:", termine);
