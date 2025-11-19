import { getTermine, deleteTermin, type Termin, editTermin } from "../termine-api.js";
import { getKategorien, editKategorie, deleteKategorie  } from "../category-api.js";

type Kategorie = {
  _id?: string;
  name: string;
  farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange">;
};

let termine: Termin[] = [];
let kategorien: Kategorie[] = [];

const colorMap: Record<string, string> = {
  rot: "red",
  blau: "rgb(78, 146, 169)",
  grün: "rgba(15, 149, 64, 1)",
  gelb: "rgba(113, 113, 35, 1)",
  orange: "rgba(168, 115, 0, 1)"
};


// Get Funktionen
function getKategorieName(id?: string): string {
  if (!id) return "Keine";
  const k = kategorien.find(c => c._id === id);
  return k ? k.name : "Unbekannt";
}

function getKategorieFarbe(id: string): string {
  if (!id) return 'transparent';
  const k = kategorien.find(c => c._id === id);
  const oldColor = k?.farben?.[0];
  return colorMap[oldColor ?? ""] ?? 'transparent';
}


// Sortierung
function aufsteigendSortieren() {
  termine.sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
}

function absteigendSortieren() {
  termine.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}


// Termine löschen
async function terminLoeschen(termin: Termin) {
  const token = localStorage.getItem("jwt-token");
  if (!termin._id) return;

  await deleteTermin(token!, termin._id);
  termine = termine.filter(t => t._id !== termin._id);

  renderAgenda();
  renderKategorien();
  clearDetail();
}

async function kategorieLöschen(category: Kategorie) {
  const token = localStorage.getItem("jwt-token");
  if (!category._id) return;

  await deleteKategorie(token!, category._id);
  kategorien = kategorien.filter(k => k._id !== category._id);

  renderAgenda()
  renderKategorien();
  clearDetail();
}

// Termine laden
async function loadTermine() {
  const token = localStorage.getItem("jwt-token");
  kategorien = await getKategorien(token);
  termine = await getTermine(token!);
}

// Agenda rendern
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
            <button class="edit-button" data-id="${termin._id ?? ""}">Bearbeiten</button>
          </div>
          <p style="background-color: ${kColor};">${kName}</p>
        </div>
      </li>
    `;
  }
}

// Detailansicht
function renderDetail(id: string) {
  const termin = termine.find(t => t._id === id);
  if (!termin) return;

  const kategorie = kategorien.find(k => k._id === termin.kategorieId);
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

  document.querySelector("#closeDetail")?.addEventListener("click", () => clearDetail());
}


// Detail löschen
function clearDetail() {
  const detailDiv = document.querySelector("#detail");
  if (detailDiv) detailDiv.innerHTML = "";
}

// Kategorien rendern
function renderKategorien() {
  const categoryView = document.querySelector('#data-category');
  if (!categoryView) return;

  categoryView.innerHTML = "";



  for (const kategorie of kategorien) {
    
    const anzahlTermine = termine.filter(t => t.kategorieId === kategorie._id).length

    categoryView.innerHTML += `
      <div style="background-color: ${colorMap[kategorie.farben?.[0]]}" class="category-item" data-id="${kategorie._id ?? ""}">
        <div class="top-category">
          <p>${kategorie.name}</p>
          <p>${anzahlTermine}</p>
        </div>

        <div class="category-buttons">
          <button class="delete-button" data-id="${kategorie._id ?? ""}">Löschen</button>
          <button class="edit-button" dataid="${kategorie._id ?? ""}">Bearbeiten</button>
        </div>
      </div>
    `;
  }
}

  const list = document.querySelector("#data-category");
  list?.addEventListener("click", (evt) => {
    const target = evt.target as HTMLElement;
    const item = target.closest(".category-item") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id ?? "";

    if (target.classList.contains("delete-button")) {
      const category = kategorien.find(t => t._id === id);
      if (category && confirm("Willst du diese Kategorie wirklich löschen")) {
        kategorieLöschen(category);
      }
      return;
    }

    if (target.classList.contains("edit-button")) {
      const id = item.dataset.id;
      if (id) {
        window.location.href = `create-category.html?id=${id}` // Weiterleiten auf create.ts um es zu bearbeiten
      }
    }

    renderDetail(id);
    renderKategorien();
  });



// UI Handler binden
function bindUIHandlers() {
  document.querySelector("#aufsteigend")?.addEventListener("click", () => {
    aufsteigendSortieren();
    renderAgenda();
  });

  document.querySelector("#absteigend")?.addEventListener("click", () => {
    absteigendSortieren();
    renderAgenda();
  });



  const list = document.querySelector("#data");
  list?.addEventListener("click", (evt) => {
    const target = evt.target as HTMLElement;
    const item = target.closest(".termin-item") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id ?? "";

    if (target.classList.contains("delete-button")) {
      const termin = termine.find(t => t._id === id);
      if (termin && confirm("Willst du diesen Termin wirklich löschen?")) {
        terminLoeschen(termin);
      }
      return;
    }

    if (target.classList.contains("edit-button")) {
      const id = item.dataset.id;
      if (id) {
        window.location.href = `create.html?id=${id}` // Weiterleiten auf create.ts um es zu bearbeiten
      }
    }

    renderDetail(id);
  });
}

// Save Edit
async function saveEditView(termin: Termin) {
  const title = (document.querySelector("#edit-title") as HTMLInputElement).value;
  const location = (document.querySelector("#edit-location") as HTMLInputElement).value;
  const mitnehmen = (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value;
  const date = (document.querySelector("#edit-date") as HTMLInputElement).value;
  const categorySelect = document.querySelector('#category') as HTMLSelectElement;
  const categoryId = categorySelect.value;
  const token = localStorage.getItem("jwt-token");

  termin.title = title;
  termin.location = location;
  termin.mitnehmen = mitnehmen;
  termin.date = date;
  termin.kategorieId = categoryId;

  await editTermin(token, termin);
}


await loadTermine();
bindUIHandlers();
renderAgenda();
renderKategorien();
console.log("Termine geladen:", termine);
