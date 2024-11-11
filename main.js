// Define tree structure (positions for tree trunks)
const trees = [
    { id: 'tree-heerlen', name: 'Heerlen' },
    { id: 'tree-sittard', name: 'Sittard' },
    { id: 'tree-maastricht', name: 'Maastricht' }
];

const treeArea = d3.select("#tree-area");

trees.forEach(tree => {
    const treeDiv = treeArea.append("div")
        .attr("class", "tree")
        .attr("id", tree.id);

    treeDiv.append("div").attr("class", "tree-name").text(tree.name);
    treeDiv.append("div").attr("class", "tree-trunk");

    treeDiv.on("click", () => {
        window.location.href = `${tree.name.toLowerCase()}.html`;
    });

    treeDiv.selectAll(".leaf")
        .data(d3.range(16))
        .enter()
        .append("div")
        .attr("class", "leaf")
        .style("position", "absolute")
        .style("left", (d, i) => `${(i % 4) * 35 - 40}px`)
        .style("top", (d, i) => `${Math.floor(i / 4) * 35 - 100}px`);

    treeDiv.selectAll(".trash-bag")
        .data(d3.range(5))
        .enter()
        .append("div")
        .attr("class", "trash-bag")
        .attr("id", (d) => `${tree.id}-trashbag-${d}`)
        .style("position", "absolute")
        .style("bottom", () => `${Math.floor(Math.random() * 5)}px`)
        .style("left", () => `${Math.floor(Math.random() * 100) - 30}px`);
});


document.addEventListener("DOMContentLoaded", function() {
    // Data voor Zuyd afvalscheiding percentages
    const zuydData = {
        years: ["2020", "2021", "2022", "2023", "2024"],
        percentages: [35, 39, 41, 32, 38]
    };

    // Selecteer de context van het canvas-element
    const ctxZuyd = document.getElementById('zuydWasteSeparationTrendChart').getContext('2d');

    // Maak de lijn grafiek
    new Chart(ctxZuyd, {
        type: 'line',
        data: {
            labels: zuydData.years,  // Jaren als labels
            datasets: [{
                label: 'Afvalscheiding Zuyd (%)',
                data: zuydData.percentages,
                borderColor: 'rgba(54, 162, 235, 1)',  // Blauwe lijn
                backgroundColor: 'rgba(54, 162, 235, 0.1)',  // Meer transparante blauwe achtergrond
                fill: true,  // Vult onder de lijn
                tension: 0.1  // Licht gebogen lijn
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Afvalscheiding Percentages Zuyd (2020 - 2024)'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,  // Zet de maximale waarde van de y-as op 50
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Jaar'
                    }
                }
            }
        }
    });
});


