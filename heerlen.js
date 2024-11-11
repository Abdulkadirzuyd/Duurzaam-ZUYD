// Fetch data and process it
fetch("data/data.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip header row

        // Data structures for charts
        const yearData = {}; // KG per year
        const wasteTypeData = {}; // KG per waste type
        const wasteTypeYearlyData = {}; // Yearly data per waste type
        const uniqueWasteTypes = new Set(); // Set for unique waste types

        // Process CSV rows
        rows.forEach(row => {
            const columns = row.split(';');
            const location = columns[4]; // Woonplaats
            const uitvoerDatum = columns[5]; // Uitvoerdatum
            const kg = parseFloat(columns[6]); // KG
            const afvalsoort = columns[13]; // Afvalsoort

            // Filter for Heerlen data only
            if (location === "HEERLEN") {
                // Process yearly data for Yearly Total KG chart
                const year = uitvoerDatum.slice(-4); // Extract year
                yearData[year] = (yearData[year] || 0) + kg;

                // Process waste type data for Waste Type chart
                wasteTypeData[afvalsoort] = (wasteTypeData[afvalsoort] || 0) + kg;

                // Process yearly data for each waste type
                if (!wasteTypeYearlyData[afvalsoort]) {
                    wasteTypeYearlyData[afvalsoort] = {};
                }
                wasteTypeYearlyData[afvalsoort][year] = (wasteTypeYearlyData[afvalsoort][year] || 0) + kg;

                // Add unique waste types to the set
                uniqueWasteTypes.add(afvalsoort);
            }
        });

        // Prepare data for Yearly Total KG chart
        const yearLabels = Object.keys(yearData);
        const yearValues = Object.values(yearData);

        // Prepare data for Waste Type chart
        const wasteTypeLabels = Object.keys(wasteTypeData);
        const wasteTypeValues = Object.values(wasteTypeData);

        // Jaarlijkse KG chart
        const ctx1 = document.getElementById('yearlyChart').getContext('2d');
        const yearlyChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: yearLabels,
                datasets: [{
                    label: 'Totale KG per Jaar in Heerlen',
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

        // Afvalsoort chart
        const ctx2 = document.getElementById('wasteTypeChart').getContext('2d');
        const wasteTypeChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: wasteTypeLabels,
                datasets: [{
                    label: 'KG per Afvalsoort in Heerlen',
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

        // Handle selection of waste type from dropdown
        const wasteTypeSelect = document.getElementById('wasteTypeSelect');

        // Dynamically populate dropdown with unique waste types
        uniqueWasteTypes.forEach(wasteType => {
            const option = document.createElement('option');
            option.value = wasteType;
            option.textContent = wasteType;
            wasteTypeSelect.appendChild(option);
        });

        // Event listener for dropdown change
        wasteTypeSelect.addEventListener('change', (event) => {
            const selectedWasteType = event.target.value;

            // If a valid waste type is selected, update the chart with yearly data for that type
            if (selectedWasteType && wasteTypeYearlyData[selectedWasteType]) {
                const selectedWasteTypeYearlyData = wasteTypeYearlyData[selectedWasteType];
                const selectedWasteTypeYears = Object.keys(selectedWasteTypeYearlyData);
                const selectedWasteTypeValues = selectedWasteTypeYears.map(year => selectedWasteTypeYearlyData[year]);

                // Update the waste type chart with the new data
                wasteTypeChart.data.labels = selectedWasteTypeYears;
                wasteTypeChart.data.datasets[0].data = selectedWasteTypeValues;
                wasteTypeChart.update();
            }
        });
    });
