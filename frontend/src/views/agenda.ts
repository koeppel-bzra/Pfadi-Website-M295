/**
 * Agenda (Event List) View Handler
 * 
 * Diese Datei ist das Herzstück der Event-Management-Anwendung.
 * 
 * Funktionalität:
 * 1. Lädt alle Events und Kategorien vom Backend
 * 2. Zeigt Events in einer Liste an mit Sortierung (auf/absteigend)
 * 3. Ermöglicht Bearbeitung und Löschen von Events
 * 4. Zeigt Kategorie-Übersicht mit Farben und Event-Zähler
 * 5. Ermöglicht Bearbeitung und Löschen von Kategorien
 * 6. Zeigt Detail-Ansicht beim Klick auf ein Event
 */

import { getTermine, deleteTermin, type Termin, editTermin } from "../termine-api.js";
import { getKategorien, editKategorie, deleteKategorie  } from "../category-api.js";

/**
 * Kategorie Datentyp (lokal definiert, entspricht category-api.ts)
 */
type Kategorie = {
  _id?: string;
  name: string;
  farben: Array<"rot" | "blau" | "grün" | "gelb" | "orange">;
};

/**
 * Speichert alle Events des aktuellen Benutzers
 */
let termine: Termin[] = [];

/**
 * Speichert alle verfügbaren Kategorien
 */
let kategorien: Kategorie[] = [];

/**
 * Mapping von Farb-Namen zu CSS-Farben/RGB-Werten
 */
const colorMap: Record<string, string> = {
  rot: "red",
  blau: "rgb(78, 146, 169)",
  grün: "rgba(15, 149, 64, 1)",
  gelb: "rgba(113, 113, 35, 1)",
  orange: "rgba(168, 115, 0, 1)"
};

// ============================================
// HELPER-FUNKTIONEN: GET-Funktionen
// ============================================

/**
 * Sucht den Namen einer Kategorie anhand ihrer ID
 * 
 * @param id - Die Kategorie-ID (optional)
 * @returns Der Kategorie-Name oder "Keine"/"Unbekannt"
 */
function getKategorieName(id?: string): string {
  if (!id) return "Keine";
  const k = kategorien.find(c => c._id === id);
  return k ? k.name : "Unbekannt";
}

/**
 * Sucht die CSS-Farbe einer Kategorie anhand ihrer ID
 * 
 * @param id - Die Kategorie-ID
 * @returns Die RGB/CSS-Farbe oder 'transparent'
 */
function getKategorieFarbe(id: string): string {
  if (!id) return 'transparent';
  const k = kategorien.find(c => c._id === id);
  const oldColor = k?.farben?.[0];
  return colorMap[oldColor ?? ""] ?? 'transparent';
}


function aufsteigendSortieren() {
  termine.sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
}

function absteigendSortieren() {
  termine.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

// ============================================
// LÖSCH-FUNKTIONEN
// ============================================

/**
 * Löscht einen Event vom Backend und aktualisiert die UI
 * 
 * @param termin - Das zu löschende Event-Objekt
 */
async function terminLoeschen(termin: Termin) {
  const token = localStorage.getItem("jwt");
  if (!termin._id) return;

  await deleteTermin(token!, termin._id);
  
  // Entfernt Event aus lokaler Liste
  termine = termine.filter(t => t._id !== termin._id);

  // Aktualisiert alle UI-Elemente
  renderAgenda();
  renderKategorien();
  clearDetail();
}

/**
 * Löscht eine Kategorie vom Backend und aktualisiert die UI
 * 
 * @param category - Das zu löschende Kategorie-Objekt
 */
async function kategorieLöschen(category: Kategorie) {
  const token = localStorage.getItem("jwt");
  if (!category._id) return;

  await deleteKategorie(token!, category._id);
  
  // Entfernt Kategorie aus lokaler Liste
  kategorien = kategorien.filter(k => k._id !== category._id);

  // Aktualisiert alle UI-Elemente
  renderAgenda()
  renderKategorien();
  clearDetail();
}

// ============================================
// DATEN-LADEN
// ============================================

/**
 * Lädt alle Events und Kategorien vom Backend
 * Wird bei Seiten-Initialisierung aufgerufen
 */
async function loadTermine() {
  const token = localStorage.getItem("jwt");
  kategorien = await getKategorien(token);
  termine = await getTermine(token!);
}

// ============================================
// RENDERING-FUNKTIONEN
// ============================================

/**
 * Rendert die Event-Liste in #data Element
 * Zeigt Titel, Datum, Kategorie und Action-Buttons für jedes Event
 */
function renderAgenda() {
  const list = document.querySelector("#data");
  if (!list) return;

  list.innerHTML = "";

  for (const termin of termine) {
    // Formatiert Datum zu deutschem Format
    const dateStr = termin.date
      ? new Date(termin.date).toLocaleDateString("de-CH")
      : "Kein Datum";

    // Sucht Kategorie-Info
    const kName = getKategorieName(termin.kategorieId);
    const kColor = getKategorieFarbe(termin.kategorieId);

    // HTML für Event-Item
    list.innerHTML += `
      <li class="termin-item" data-id="${termin._id ?? ""}">
        <h3>${termin.title}</h3>
        <p>Datum: ${dateStr}</p>
        <p class="creator">Erstellt von: ${termin.username ?? 'Unbekannt'}</p>
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

/**
 * Rendert die Detail-Ansicht für ein Event
 * Wird aufgerufen, wenn Benutzer auf ein Event klickt
 * 
 * @param id - Die ID des anzuzeigenden Events
 */
function renderDetail(id: string) {
  const termin = termine.find(t => t._id === id);
  if (!termin) return;

  const kategorie = kategorien.find(k => k._id === termin.kategorieId);
  const detailDiv = document.querySelector("#detail");
  if (!detailDiv) return;

  // Formatiert Datum
  const date = termin.date
    ? new Date(termin.date).toLocaleDateString("de-CH")
    : "-";

  // HTML für Detail-Ansicht
  detailDiv.innerHTML = `
    <li class="termin-detail">
      <div class="container">
        <h3>${termin.title} am ${date}</h3>
        <button title="close" id="closeDetail" type="button">❌</button>
      </div>
      <p>Ort: ${termin.location}</p>
      <p>Mitnehmen: ${termin.mitnehmen ?? "-"}</p>
      <p>Erstellt von: ${termin.username ?? "-"}</p>
      <p>Datum: ${date}</p>
      <p>Kategorie: ${kategorie?.name ?? "-"}</p>
      <p>Farbe: ${kategorie?.farben ?? "-"}</p>
    </li>
  `;

  // Bindet Close-Button
  document.querySelector("#closeDetail")?.addEventListener("click", () => clearDetail());
}

/**
 * Löscht die Detail-Ansicht (versteckt den Dialog)
 */
function clearDetail() {
  const detailDiv = document.querySelector("#detail");
  if (detailDiv) detailDiv.innerHTML = "";
}

/**
 * Rendert die Kategorie-Übersicht in #data-category Element
 * Zeigt Kategorie-Namen, Event-Zähler und Action-Buttons
 */
function renderKategorien() {
  const categoryView = document.querySelector('#data-category');
  if (!categoryView) return;

  categoryView.innerHTML = "";

  for (const kategorie of kategorien) {
    // Zählt wie viele Events diese Kategorie haben
    const anzahlTermine = termine.filter(t => t.kategorieId === kategorie._id).length

    // HTML für Kategorie-Item
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

// ============================================
// EVENT-LISTENER FÜR KATEGORIEN
// ============================================

/**
 * Event-Listener für Kategorie-Listenclicks (Löschen, Bearbeiten, Detailansicht)
 */
const list = document.querySelector("#data-category");
list?.addEventListener("click", (evt) => {
    const target = evt.target as HTMLElement;
    const item = target.closest(".category-item") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id ?? "";

    // Löschen-Button geklickt
    if (target.classList.contains("delete-button")) {
      const category = kategorien.find(t => t._id === id);
      if (category && confirm("Willst du diese Kategorie wirklich löschen")) {
        kategorieLöschen(category);
      }
      return;
    }

    // Bearbeiten-Button geklickt
    if (target.classList.contains("edit-button")) {
      const id = item.dataset.id;
      if (id) {
        // Leitet zur Create-Category-Seite mit Kategorie-ID weiter
        window.location.href = `create-category.html?id=${id}`
      }
    }

    renderDetail(id);
    renderKategorien();
});

// ============================================
// EVENT-LISTENER FÜR UI BINDING
// ============================================

/**
 * Bindet alle UI-Interaktionen für Events:
 * - Sortier-Buttons
 * - Event-Löschen und Bearbeiten
 * - Detail-Ansicht
 */
function bindUIHandlers() {
  // Aufsteigend-Sortierung
  document.querySelector("#aufsteigend")?.addEventListener("click", () => {
    aufsteigendSortieren();
    renderAgenda();
  });

  // Absteigend-Sortierung
  document.querySelector("#absteigend")?.addEventListener("click", () => {
    absteigendSortieren();
    renderAgenda();
  });

  // Event-Listen-Klicks (Löschen, Bearbeiten, Detail-Ansicht)
  const list = document.querySelector("#data");
  list?.addEventListener("click", (evt) => {
    const target = evt.target as HTMLElement;
    const item = target.closest(".termin-item") as HTMLElement | null;
    if (!item) return;

    const id = item.dataset.id ?? "";

    // Löschen-Button geklickt
    if (target.classList.contains("delete-button")) {
      const termin = termine.find(t => t._id === id);
      if (termin && confirm("Willst du diesen Termin wirklich löschen?")) {
        terminLoeschen(termin);
      }
      return;
    }

    // Bearbeiten-Button geklickt
    if (target.classList.contains("edit-button")) {
      const id = item.dataset.id;
      if (id) {
        // Leitet zur Create-Seite mit Event-ID weiter
        window.location.href = `create.html?id=${id}`
      }
    }

    // Detail-Ansicht anzeigen
    renderDetail(id);
  });
}

/**
 * Speichert Änderungen an einem Event
 * (Diese Funktion scheint nicht verwendet zu werden - kann entfernt werden)
 * 
 * @param termin - Das zu speichernde Event
 */
async function saveEditView(termin: Termin) {
  const title = (document.querySelector("#edit-title") as HTMLInputElement).value;
  const location = (document.querySelector("#edit-location") as HTMLInputElement).value;
  const mitnehmen = (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value;
  const date = (document.querySelector("#edit-date") as HTMLInputElement).value;
  const categorySelect = document.querySelector('#category') as HTMLSelectElement;
  const categoryId = categorySelect.value;
  const token = localStorage.getItem("jwt");

  termin.title = title;
  termin.location = location;
  termin.mitnehmen = mitnehmen;
  termin.date = date;
  termin.kategorieId = categoryId;

  await editTermin(token, termin);
}

// ============================================
// SEITEN-INITIALISIERUNG
// ============================================

await loadTermine();
bindUIHandlers();
renderAgenda();
renderKategorien();
console.log("Termine geladen:", termine);
