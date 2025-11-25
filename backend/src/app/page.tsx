export default function Home() {
  return (<>
    <header><h1>API Definition</h1></header>
    <section>
      <header>
        <h2>Programm OBI <code>/api/programm</code></h2>
      </header>
      <p>Um die API zu verwenden, schreib <code>/api/programm</code> in die Adresszeile mit den Methoden POST, GET, DELETE, PUT und PATCH.</p>
      <hr />
      <article>
        <header>
          <h4>Methode: GET <code>/api/programm</code></h4>
        </header>
        <p>Gibt alle verfügbaren Ereignisse zurück. Rückgabewert: <code>Promise&lt;Termin[]&gt;</code></p>
        <code>
          <pre>{`
      export async function getTermine(token: string): Promise<Termin[]> {
        const request = await fetch('http:ocalhost:8100/api/programm', {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        });
        return request.json();
      }

      Beispiel-Rückgabe (JSON):
      [
        { "id": "1", "title": "Lagerfeuerabend", "date": "2025-07-12T19:00:00Z", "location": "Pfadiheim", "description": "Gemütliches Beisammensein" },
        { "id": "2", "title": "Wanderung", "date": "2025-07-19T09:00:00Z", "location": "Bergwald", "description": "Tageswanderung" }
      ]
          `}</pre>
        </code>

        <hr />

        <header>
          <h4>Methode: POST <code>/api/programm</code></h4>
        </header>
        <p>Erstellt ein neues Ereignis. Body: JSON mit den Feldern des Termins. Rückgabewert: <code>Promise&lt;Termin&gt;</code> (das neu erstellte Objekt)</p>
        <code>
          <pre>{`
      export async function createTermin(payload: Partial<Termin>): Promise<Termin> {
        const request = await fetch('http:ocalhost:8100/api/programm', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return request.json();
      }

      Beispiel-Request-Body:
      { "title": "Zeltlager", "date": "2025-08-01T10:00:00Z", "location": "Campingplatz", "description": "Mehrtägiges Zeltlager" }

      Beispiel-Rückgabe (JSON):
      { "id": "3", "title": "Zeltlager", "date": "2025-08-01T10:00:00Z", "location": "Campingplatz", "description": "Mehrtägiges Zeltlager" }
          `}</pre>
        </code>

        <hr />

        <header>
          <h4>Methode: DELETE <code>/api/programm/:id</code></h4>
        </header>
        <p>Löscht ein Ereignis per ID. Endpoint: <code>/api/programm/{'{id}'}</code>. Rückgabewert: <code>Promise&lt;void&gt;</code> (häufig 204 No Content)</p>
        <code>
          <pre>{`
      export async function deleteTermin(id: string): Promise<void> {
        await fetch(\`http:ocalhost:8100/api/programm/\${id}\`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      Beispiel: DELETE /api/programm/3
      Antwort: 204 No Content oder 200 OK mit leerem Body
          `}</pre>
        </code>

        <hr />

        <header>
          <h4>Methode: PUT <code>/api/programm/:id</code></h4>
        </header>
        <p>Ersetzt ein komplettes Ereignis (vollständiges Update) per ID. Rückgabewert: <code>Promise&lt;Termin&gt;</code> (das ersetzte Objekt)</p>
        <code>
          <pre>{`
      export async function replaceTermin(id: string, fullPayload: Termin): Promise<Termin> {
        const request = await fetch(\`http:ocalhost:8100/api/programm/\${id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
        });
        return request.json();
      }

      Beispiel-Request-Body (vollständig):
      { "title": "Lager neu", "date": "2025-07-12T19:00:00Z", "location": "Neuer Ort", "description": "Aktualisierte Beschreibung" }

      Beispiel-Rückgabe (JSON):
      { "id": "1", "title": "Lager neu", "date": "2025-07-12T19:00:00Z", "location": "Neuer Ort", "description": "Aktualisierte Beschreibung" }
          `}</pre>
        </code>

        <hr />

        <header>
          <h4>Methode: PATCH <code>/api/programm/:id</code></h4>
        </header>
        <p>Patcht ein Ereignis nur zum Teil (nur geänderte Felder senden). Rückgabewert: <code>Promise&lt;Termin&gt;</code> (das aktualisierte Objekt)</p>
        <code>
          <pre>{`
      export async function updateTermin(id: string, partialPayload: Partial<Termin>): Promise<Termin> {
        const request = await fetch(\`http:ocalhost:8100/api/programm/\${id}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partialPayload),
        });
        return request.json();
      }

      Beispiel-Request-Body (teilweise):
      { "location": "Pfadihaus" }

      Beispiel-Rückgabe (JSON):
      { "id": "2", "title": "Wanderung", "date": "2025-07-19T09:00:00Z", "location": "Pfadihaus", "description": "Tageswanderung" }
          `}</pre>
        </code>

        <hr />

        <p>Kurzes Beispiel: GET benutzen und Ergebnis loggen</p>
        <code>
          <pre>{`
      export async function getTermineAndLog(): Promise<void> {
        const request = await fetch('http:ocalhost:8100/api/programm', {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        });
         const data: Termin[] = await request.json();
      }

      Beispiel-Konsolenausgabe:
      [
        { id: "1", title: "Lagerfeuerabend", date: "2025-07-12T19:00:00Z", location: "Pfadiheim", description: "Gemütliches Beisammensein" },
        { id: "2", title: "Wanderung", date: "2025-07-19T09:00:00Z", location: "Bergwald", description: "Tageswanderung" }
      ]
          `}</pre>
        </code>
      </article>
    </section>
  </>);
}
