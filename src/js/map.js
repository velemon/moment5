// Del 2 - Karta

/**
 * @fileoverview Hanterar kart-sökningar på en inbäddad karta med hjälp av OpenStreetMap och Nominatim.
 * @module Map
 */

/**
 * Händelselyssnare för att hämta datan när HTML-dokumentet har laddats
 * och triggar funktionen initMap.
 * @listens window#DOMContentLoaded
*/
document.addEventListener("DOMContentLoaded", initMap);

/** Refererar till sökformuläret 
 * @type {HTMLFormElement} */
const form = document.querySelector("form");

/**Refererar till sökfältet 
 * @type {HTMLInputElement} */
const searchInput = document.getElementById("search");

/** Refererar till kartans iframe 
 * @type {HTMLIFrameElement} */
const mapIframe = document.querySelector("iframe");

/** Refererar till länken för att visa kartan i fullskärm genom OpenStreetMap
 * @type {HTMLAnchorElement} */
const mapLink = document.getElementById("link");

/**
 * Initierar händelselyssnare för formuläret
 * @function initMap
 */
function initMap() {
    form.addEventListener("submit", handleSearch);
}

/**
 * Lyssnar på submit-händelsen från formuläret.
 * Gör ett AJAX-anrop till Nominatim API för att hämta koordinater
 * för platsen som användaren har skrivit in.
 * @param {SubmitEvent} event - Submit-händelsen som triggas av formuläret.
 */
async function handleSearch(event) {
    // Stoppar omladdning av sidan
    event.preventDefault();

    /**
     * Hämtar användarens sökinput från sökfältet.
     * .trim() tar bort onödiga mellanslag i början/slutet av strängen.
     * @type {string}
     */
    const query = searchInput.value.trim();

    // Avbryter funktionen om sökfältet är tomt
    if (!query) return;

    try {
        /**
         * Hämtar koordinater och bounding box för platsen från Nominatim.
         * encodeURIComponent används för att göra söksträngen URL-säker.
         * @type {Response}
         */
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );

        /**
         * Resultatet från Nominatim i JSON-format.
         * Innehåller en array av matchningar (platser).
         * @type {Array<{lat: string, lon: string, boundingbox: string[]}>}
         */
        const results = await response.json();

        // Om inga träffar hittas
        if (results.length === 0) {
            alert("Ingen plats hittades!");
            return;
        }

        /**
         * Väljer den första träffen från sökresultatet.
         * @type {{lat: string, lon: string, boundingbox: string[]}}
         */
        const place = results[0];

        /** Latitude (breddgrad) för platsen
         * @type {number} */
        const lat = Number(place.lat);

        /** Longitude (längdgrad) för platsen 
         * @type {number} */
        const lon = Number(place.lon);

        /**
         * Konverterar boundingbox till nummer-array.
         * Ordningen via Nominatim: [south, north, west, east].
         * @type {number[]}
         */
        const bboxArr = place.boundingbox.map(Number);
        const bbox = `${bboxArr[2]},${bboxArr[0]},${bboxArr[3]},${bboxArr[1]}`;

        // Uppdaterar iframe och länk
        mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        mapLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;
    } catch (error) {

        // Fångar upp eventuella fel (t.ex. nätverksproblem eller API-fel)
        console.error("Fel vid hämtning av plats:", error);
    }
}