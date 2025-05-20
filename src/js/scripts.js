// Diagram
window.onload = function () {
    fetchData();
};

// Hämtning av data
async function fetchData() {
    const url = "https://studenter.miun.se/~mallar/dt211g/";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        // Filtrera kurser
        const courseData = json
            .filter(item => item.typ === "kurs")
            .sort((a, b) => b.antagna + b.reserver - (a.antagna + a.reserver))
            .slice(0, 6);

        // Skapa stapeldiagram
        new Chart(document.getElementById("barChart"),
            {
                type: "bar",
                data: {
                    labels: courseData.map(kurs => kurs.namn),
                    datasets: [{
                        label: "Totalt antal sökande",
                        data: courseData.map(kurs => kurs.antagna + kurs.reserver),
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                }
            });

        // Filtrera program
        const programData = json
            .filter(item => item.typ === "program")
            .sort((a, b) => b.antagna + b.reserver - (a.antagna + a.reserver))
            .slice(0, 5);

        // Skapa cirkeldiagram
        new Chart(document.getElementById("pieChart"),
            {
                type: "pie",
                data: {
                    labels: programData.map(program => program.namn),
                    datasets: [{
                        label: "Totalt antal sökande",
                        data: programData.map(program => program.antagna + program.reserver),
                        backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF"
                    ]
                    }]
                }
            });
    } catch (error) {
        console.error(error);
    }
};

// Karta