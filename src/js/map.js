// Del 2 - Karta

/**
 * Initierar händelselyssnare när hela dokumentet har laddats
 * och hämtar element som form, input och iframe.
 */
document.addEventListener("DOMContentLoaded", () => {
    /** refererar till sökformuläret 
     * @type {HTMLFormElement} */
    const form = document.querySelector("form");
    /** refererar till sökfältet 
     * @type {HTMLInputElement} */
    const searchInput = document.getElementById("search");
    /** refererar till kartans iframe 
     * @type {HTMLIFrameElement} */
    const mapIframe = document.querySelector("iframe");
    /** refererar till länken för att visa kartan i fullskärm genom OpenStreetMap
     * @type {HTMLAnchorElement}  */
    const mapLink = document.getElementById("link");

    /**
     * Lyssnar på submit-händelsen från formuläret.
     * Gör ett AJAX-anrop till Nominatim API för att hämta koordinater
     * för platsen som användaren har skrivit in.
     * @param {SubmitEvent} event - Submit-händelsen som triggas av formuläret.
     */
    form.addEventListener("submit", async (event) => {

        //Stoppar omladdning av sidan
        event.preventDefault();

        /**
        * Hämtar användarens sökinput från sökfältet.
        * .trim() tar bort onödiga mellanslag i början/slutet av strängen.
        * @type {string}
        */
        const query = searchInput.value.trim();

        //Avbryter funktionen om sökfältet är tomt
        if (!query) return;

        try {
            /**
             * Hämtar koordinater och bounding box för platsen från Nominatim.
             * encodeURIComponent används för att göra söksträngen URL-säker.
             * @type {Response}
             */
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
                {
                    headers: {
                        "User-Agent": "my-app (https://cerulean-crisp-9fd3b5.netlify.app/karta)",
                        "Referer": window.location.href
                    }
                }
            );

            /**
             * Resultatet från Nominatim i JSON-format.
             * Innehåller en array av matchningar (platser).
             * @type {{lat: string, lon: string, boundingbox: string[]}[]}
             */
            const results = await response.json();

            //Om inga träffar hittas
            if (results.length === 0) {
                alert("Ingen plats hittades!");
                return;
            }

            /**
             * Väljer den första träffen från sökresultatet.
             * @type {{lat: string, lon: string, boundingbox: string[]}}
             */
            const place = results[0];
            /** latitude (breddgrad) för platsen
             * @type {number}  */
            const lat = Number(place.lat);
            /** longitude (längdgrad) för platsen 
             * @type {number} */
            const lon = Number(place.lon);

            /**
              * Konverterar boundingbox till nummer-array.
              * Ordningen via Nominatim: [south, north, west, east].
              * @type {number[]}
              */
            const bboxArr = place.boundingbox.map(Number);
            const padding = 0.01;
            const bbox = `${bboxArr[2]},${bboxArr[0]},${bboxArr[3]},${bboxArr[1]}`;

            //Uppdaterar iframe och länk
            mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
            mapLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

            // Fångar upp eventuella fel (t.ex. nätverksproblem eller API-fel)
        } catch (error) {
            console.error("Fel vid hämtning av plats:", error);
        }
    });
});