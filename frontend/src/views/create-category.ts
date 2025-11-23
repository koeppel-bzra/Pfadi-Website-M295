/**
 * Create/Edit Category View Handler
 * 
 * Diese Datei verwaltet sowohl das Erstellen als auch das Bearbeiten von Kategorien.
 * 
 * URL-Parameter:
 * - ?id=<category-id>  : Bearbeitet die Kategorie mit dieser ID
 * - Ohne Parameter     : Erstellt eine neue Kategorie
 * 
 * Funktionalität:
 * 1. Falls Bearbeitungsmodus: Lädt existierende Kategorie-Daten
 * 2. Ermöglicht Benutzer, Kategorie-Name und Farbe einzugeben
 * 3. Speichert als neue Kategorie oder aktualisiert existierende
 */

import { addKategorie, editKategorie, getKategorien, type Kategorie } from "../category-api.js";

/**
 * Speichert die Daten der Kategorie, die bearbeitet wird (falls vorhanden)
 * null wenn neue Kategorie erstellt wird
 */
let editKategorieData: Kategorie | null = null;

/**
 * Lädt die Kategorie-Daten vom Backend, wenn eine Kategorie bearbeitet wird
 * 
 * Prüft URL-Parameter nach ?id=<category-id>
 * Falls gefunden: Sucht diese Kategorie in der Liste und füllt das Formular damit
 * Falls nicht gefunden: Erstellt eine neue Kategorie
 */
async function loadEditData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;

    // Ruft alle Kategorien ab (öffentlich, keine Auth nötig)
    const token = localStorage.getItem("jwt");
    const kategorien = await getKategorien(token);
    
    // Sucht die Kategorie mit dieser ID
    editKategorieData = kategorien.find(k => k._id === id) ?? null;

    // Füllt Formular-Felder mit bestehenden Daten
    if (editKategorieData) {
        (document.querySelector("#edit-name") as HTMLInputElement).value = editKategorieData.name;
        // Verwendet die erste Farbe aus dem Array (vereinfacht: nur 1 Farbe pro Kategorie)
        (document.querySelector("#edit-color") as HTMLSelectElement).value = editKategorieData.farben[0];
    }
}

/**
 * Erstellt oder aktualisiert eine Kategorie basierend auf dem Modus
 * 
 * Unterscheidet zwischen zwei Modi:
 * 1. Bearbeitungsmodus: Aktualisiert bestehende Kategorie
 * 2. Erstellungsmodus: Erstellt neue Kategorie
 * 
 * Danach: Leitet zur Agenda zurück
 */
async function createEditView() {
    const name = (document.querySelector('#edit-name') as HTMLInputElement).value;
    const farbe = (document.querySelector('#edit-color') as HTMLSelectElement).value;

    // Erstellt Farben-Array mit einer Farbe
    const farben = [farbe] as Kategorie['farben'];
    const token = localStorage.getItem("jwt");

    console.log("🔍 DEBUG createEditView:", { name, farbe, token });

    if (editKategorieData && editKategorieData._id) {
        // BEARBEITUNGSMODUS: Kategorie aktualisieren
        editKategorieData.name = name;
        editKategorieData.farben = farben;
        console.log("📝 Bearbeite Kategorie:", editKategorieData);
        await editKategorie(token, editKategorieData);
    } else {
        // ERSTELLUNGSMODUS: Neue Kategorie erstellen
        const newKategorie: Kategorie = { name, farben };
        console.log("➕ Erstelle neue Kategorie:", newKategorie);
        try {
            const result = await addKategorie(token, newKategorie);
            console.log("✅ Kategorie erstellt:", result);
        } catch (error) {
            console.error("❌ Fehler beim Erstellen:", error);
            alert("Fehler beim Erstellen der Kategorie: " + error);
            return;
        }
    }

    // Leitet zurück zur Agenda
    window.location.href = "./agenda.html";
}

/**
 * Event-Listener für das Formular (beim Absenden)
 */
document.querySelector('form')!.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createEditView();
});

// --- INITIALISIERUNG ---
await loadEditData();
