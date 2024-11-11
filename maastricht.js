fetch("data/data.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip header row

        // Data structures for Maastricht charts
        const yearData = {};
        const wasteTypeData = {};
        const wasteTypeYearlyData = {};

        const uniqueWasteTypes = new Set();

        // Process CSV rows
        rows.forEach(row => {
            const columns = row.split(';');
            //const location = columns[4];
            const naam =columns[1];
            const uitvoerDatum = columns[5];
            const kg = parseFloat(columns[6]);
            const afvalsoort = columns[13];

            // Filter for Maastricht data only
            if (naam === "Brusselseweg") {
                const year = uitvoerDatum.slice(-4);
                yearData[year] = (yearData[year] || 0) + kg;

                wasteTypeData[afvalsoort] = (wasteTypeData[afvalsoort] || 0) + kg;

                if (!wasteTypeYearlyData[afvalsoort]) {
                    wasteTypeYearlyData[afvalsoort] = {};
                }
                wasteTypeYearlyData[afvalsoort][year] = (wasteTypeYearlyData[afvalsoort][year] || 0) + kg;

                uniqueWasteTypes.add(afvalsoort);
            }
        });

        // Populate Maastricht chart data and dropdown menu dynamically
        const yearLabels = Object.keys(yearData);
        const yearValues = Object.values(yearData);

        const wasteTypeLabels = Object.keys(wasteTypeData);
        const wasteTypeValues = Object.values(wasteTypeData);

        // Yearly Total KG chart for Maastricht
        const ctx1 = document.getElementById('maastrichtYearlyChart').getContext('2d');
        const yearlyChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: yearLabels,
                datasets: [{
                    label: 'Totale KG per Jaar in Maastricht',
                    data: yearValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Totale KG'
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

        // Waste Type KG chart for Maastricht
        const ctx2 = document.getElementById('maastrichtWasteTypeChart').getContext('2d');
        const wasteTypeChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: wasteTypeLabels,
                datasets: [{
                    label: 'KG per Afvalsoort in Maastricht',
                    data: wasteTypeValues,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Totale KG'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Afvalsoort'
                        }
                    }
                }
            }
        });

        // Populate and handle dropdown for Maastricht waste types
        const wasteTypeSelect = document.getElementById('wasteTypeSelect');
        uniqueWasteTypes.forEach(wasteType => {
            const option = document.createElement('option');
            option.value = wasteType;
            option.textContent = wasteType;
            wasteTypeSelect.appendChild(option);
        });

        wasteTypeSelect.addEventListener('change', (event) => {
            const selectedWasteType = event.target.value;

            if (selectedWasteType && wasteTypeYearlyData[selectedWasteType]) {
                const selectedWasteTypeYearlyData = wasteTypeYearlyData[selectedWasteType];
                const selectedWasteTypeYears = Object.keys(selectedWasteTypeYearlyData);
                const selectedWasteTypeValues = selectedWasteTypeYears.map(year => selectedWasteTypeYearlyData[year]);

                wasteTypeChart.data.labels = selectedWasteTypeYears;
                wasteTypeChart.data.datasets[0].data = selectedWasteTypeValues;
                wasteTypeChart.update();
            }
        });
    });
