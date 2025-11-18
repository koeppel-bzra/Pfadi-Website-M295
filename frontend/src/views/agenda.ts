import { getTermine, deleteTermin, type Termin } from "../termine-api.js";
import { getKategorien } from "../category-api.js";


type Kategorie = {
  _id?: string;
  name: string;
  farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange">;
};

let termine: Termin[] = [];
let kategorien: Kategorie[] = [];


// Get Funktion für Kategorien Name
function getKategorieName(id?: string): string {
  if (!id) return "Keine";
  const k = kategorien.find((c) => c._id === id);
  return k ? k.name : "Unbekannt"; // Fragezeichen und Doppelpunkt ersetzen if-Abfrage
}

const colorMap: Record<string, string> = { // Schlüssel ist string, Wert ist string --> Wandelt die Farbnamen in CSS Farben um
  rot: "red",
  blau: "rgb(78, 146, 169)",
  grün: "rgba(15, 149, 64, 1)",
  gelb: "rgba(113, 113, 35, 1)",
  orange: "rgba(168, 115, 0, 1)"
};


// Get Funktion für Farben
function getKategorieFarbe(id: string): string {
  if (!id) return 'transperant';

  const k = kategorien.find((c) => c._id === id)

  const oldColor = k.farben[0];

  return colorMap[oldColor] ?? 'transparent';
}


// sortieren
function aufsteigendSortieren() {
  termine.sort(
    (a, b) =>
      new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
  );
}

function absteigendSortieren() {
  termine.sort(
    (a, b) =>
      new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
  );
}


// löschen methode
async function terminLoeschen(termin: Termin) {
  const token = localStorage.getItem("jwt-token");
  if (!termin._id) return;

  await deleteTermin(token!, termin._id);

  termine = termine.filter((t) => t._id !== termin._id);

  renderAgenda();
  clearDetail();
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
    const dateStr = termin.date
      ? new Date(termin.date).toLocaleDateString("de-CH")
      : "Kein Datum";

    const kName = getKategorieName(termin.kategorieId);
    const kColor = getKategorieFarbe(termin.kategorieId);

    list.innerHTML += `
      <li class="termin-item" data-id="${termin._id ?? ""}">
        <h3>${termin.title}</h3>
        <p>Datum: ${dateStr}</p>
        <div class="actions-category">
          <div class="actions">
            <button class="delete-button" data-id="${termin._id ?? ""}">Löschen</button>
            <button class="delete-button" data-id="">Bearbeiten</button>
          </div>
          <p style="background-color: ${kColor};">${kName}</p>
        </div>
      </li>
    `;
  }
}



// detailansicht
function renderDetail(id: string) {
  const termin = termine.find((t) => t._id === id);
  if (!termin) return;

  const kategorie = kategorien.find((k) => k._id === termin.kategorieId);

  const detailDiv = document.querySelector("#detail");
  if (!detailDiv) return;

  const date = termin.date
    ? new Date(termin.date).toLocaleDateString("de-CH")
    : "-";

  detailDiv.innerHTML = `
    <li class="termin-detail">
      <div class="container">
        <h3>${termin.title} am ${date}</h3>
        <button title="close" id="closeDetail" type="button">❌</button>
      </div>
      <p>Ort: ${termin.location}</p>
      <p>Mitnehmen: ${termin.mitnehmen ?? "-"}</p>
      <p>Datum: ${date}</p>
      <p>Kategorie: ${kategorie?.name ?? "-"}</p>
      <p>Farbe: ${kategorie?.farben ?? "-"}</p>
    </li>
  `;

  document.querySelector("#closeDetail")?.addEventListener("click", () => {
    clearDetail();
  });

  const elementToScrollTo = document.querySelector('.title-create');
  elementToScrollTo.scrollIntoView({ behavior: 'smooth' })
}



function clearDetail() {
  const detailDiv = document.querySelector("#detail");
  detailDiv.innerHTML = ``;
}



function renderKategorien() {
  const categoryViewValue = document.querySelector('#data-category')

  categoryViewValue.innerHTML = "";

  for (const kategorie of kategorien) {

    categoryViewValue.innerHTML += `
      <div class="category-item" data-id="${kategorie._id ?? ""}">
        <p style="background-color: ${colorMap[kategorie.farben?.[0]]}">${kategorie.name}</p>
      </div>`
  }
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
renderKategorien();

console.log("Termine geladen:", termine);
