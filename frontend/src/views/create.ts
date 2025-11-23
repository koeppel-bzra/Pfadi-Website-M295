/**
 * Create/Edit Event View Handler
 * 
 * Diese Datei verwaltet sowohl das Erstellen als auch das Bearbeiten von Events.
 * 
 * URL-Parameter:
 * - ?id=<event-id>  : Bearbeitet das Event mit dieser ID
 * - Ohne Parameter  : Erstellt ein neues Event
 * 
 * Funktionalität:
 * 1. Lädt Kategorien aus Backend für die Dropdown-Liste
 * 2. Falls Bearbeitungsmodus: Lädt existierende Event-Daten
 * 3. Ermöglicht Benutzer, Event-Details einzugeben
 * 4. Speichert als neues Event oder aktualisiert existierendes Event
 */

import { type Termin, addTermin, editTermin, getTermine } from "../termine-api.js";
import { getKategorien } from "../category-api.js";

/**
 * Speichert die Daten des Termin, der bearbeitet wird (falls vorhanden)
 * null wenn neuer Termin erstellt wird
 */
let editTerminData: Termin | null = null;

/**
 * Lädt die Event-Daten vom Backend, wenn ein Event bearbeitet wird
 * 
 * Prüft URL-Parameter nach ?id=<event-id>
 * Falls gefunden: Sucht diesen Termin in der Liste und füllt das Formular damit
 * Falls nicht gefunden: Erstellt einen neuen Termin
 */
async function loadEditData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;

    // Ruft alle Events des Benutzers ab
    const token = localStorage.getItem("jwt");
    const termine = await getTermine(token!);
    
    // Sucht das Event mit dieser ID
    editTerminData = termine.find(t => t._id === id) ?? null;

    // Füllt Formular-Felder mit bestehenden Daten
    if (editTerminData) {
        (document.querySelector("#edit-title") as HTMLInputElement).value = editTerminData.title;
        (document.querySelector("#edit-location") as HTMLInputElement).value = editTerminData.location;
        (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value = editTerminData.mitnehmen ?? "";
        // Extrahiert nur das Datum aus dem ISO-String (z.B. "2024-01-15" aus "2024-01-15T10:00:00Z")
        (document.querySelector("#edit-date") as HTMLInputElement).value = editTerminData.date?.split("T")[0] ?? "";
    }
}

/**
 * Lädt alle verfügbaren Kategorien und füllt das Kategorie-Dropdown
 */
async function loadCategories() {
    const select = document.querySelector('#category') as HTMLSelectElement;
    const token = localStorage.getItem("jwt");
    const kategorien = await getKategorien(token);

    // Erstellt Option-Elemente für jede Kategorie
    for (const k of kategorien) {
        const opt = document.createElement('option');
        opt.value = k._id!;
        opt.textContent = k.name;
        select.appendChild(opt);
    }

    // Falls wir ein Event bearbeiten: Wählt die richtige Kategorie
    if (editTerminData) {
        select.value = editTerminData.kategorieId ?? "";
    }
}

/**
 * Event-Listener für das Formular (beim Absenden)
 * 
 * Unterscheidet zwischen zwei Modi:
 * 1. Bearbeitungsmodus: Aktualisiert bestehenden Termin
 * 2. Erstellungsmodus: Erstellt neuen Termin
 * 
 * Danach: Leitet zur Agenda zurück
 */
document.querySelector('form')!.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extrahiert alle Eingabewerte aus dem Formular
    const title = (document.querySelector("#edit-title") as HTMLInputElement).value;
    const location = (document.querySelector("#edit-location") as HTMLInputElement).value;
    const mitnehmen = (document.querySelector("#edit-mitnehmen") as HTMLInputElement).value;
    const date = (document.querySelector("#edit-date") as HTMLInputElement).value;
    const categorySelect = document.querySelector('#category') as HTMLSelectElement;
    const categoryId = categorySelect.value;
    const token = localStorage.getItem("jwt");

    console.log("🔍 DEBUG create event:", { title, location, date, categoryId, token, editTerminData });

    // BEARBEITUNGSMODUS: Event aktualisieren
    if (editTerminData) {
        editTerminData.title = title;
        editTerminData.location = location;
        editTerminData.mitnehmen = mitnehmen;
        // Konvertiert HTML-Input-Datum in ISO-Format (UTC)
        editTerminData.date = date ? new Date(date).toISOString() : undefined;
        editTerminData.kategorieId = categoryId;

        console.log("📝 Bearbeite Event:", editTerminData);
        try {
            await editTermin(token, editTerminData);
            console.log("✅ Event aktualisiert");
        } catch (error) {
            console.error("❌ Fehler beim Bearbeiten:", error);
            alert("Fehler beim Bearbeiten: " + error);
            return;
        }
        
    } else {
        // ERSTELLUNGSMODUS: Neues Event erstellen
        const newEvent: Termin = {
            title,
            location,
            // Nur setzen wenn nicht leer (optional field)
            mitnehmen: mitnehmen || undefined,
            date: date ? new Date(date).toISOString() : undefined,
            kategorieId: categoryId
        };
        console.log("➕ Erstelle neues Event:", newEvent);
        try {
            const result = await addTermin(token!, newEvent);
            console.log("✅ Event erstellt:", result);
        } catch (error) {
            console.error("❌ Fehler beim Erstellen:", error);
            alert("Fehler beim Erstellen: " + error);
            return;
        }
    }

    // Leitet zurück zur Agenda
    window.location.href = "./agenda.html";
});

// --- INITIALISIERUNG ---
await loadCategories();
await loadEditData();
