fetch("data/data.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip header row

        // Data structures for charts
        const yearData = {}; // KG per year
        const wasteTypeData = {}; // KG per waste type

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
            }
        });

        // Prepare data for Yearly Total KG chart
        const yearLabels = Object.keys(yearData);
        const yearKgData = Object.values(yearData);

        // Prepare data for Waste Type chart
        const wasteTypeLabels = Object.keys(wasteTypeData);
        const wasteTypeKgData = Object.values(wasteTypeData);

        // Create Yearly Total KG chart
        const yearCtx = document.getElementById('yearChart').getContext('2d');
        new Chart(yearCtx, {
            type: 'bar',
            data: {
                labels: yearLabels,
                datasets: [{
                    label: 'Total KG Collected by Year',
                    data: yearKgData,
                    backgroundColor: 'black',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                layout: {
                    padding: {
                        top: 60,
                        left: 50
                    }
                },
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Populate the dropdown with waste types
        const wasteTypeSelect = document.getElementById('wasteTypeSelect');
        wasteTypeLabels.forEach(wasteType => {
            const option = document.createElement('option');
            option.value = wasteType;
            option.textContent = wasteType;
            wasteTypeSelect.appendChild(option);
        });

        // Create Waste Type chart with the selected waste type
        const wasteTypeCtx = document.getElementById('wasteTypeChart').getContext('2d');
        const wasteTypeChart = new Chart(wasteTypeCtx, {
            type: 'bar',
            data: {
                labels: wasteTypeLabels,
                datasets: [{
                    label: 'Total KG Collected by Waste Type',
                    data: wasteTypeKgData,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                layout: { padding: { top: 60, left: 50 } },
                scales: { x: { beginAtZero: true }, y: { beginAtZero: true } }
            }
        });

        // Update chart based on selected waste type
        wasteTypeSelect.addEventListener('change', (event) => {
            const selectedType = event.target.value;

            if (selectedType) {
                // Filter data by year for the selected waste type
                const selectedTypeYearData = {};
                rows.forEach(row => {
                    const columns = row.split(';');
                    const location = columns[4];
                    const uitvoerDatum = columns[5];
                    const kg = parseFloat(columns[6]);
                    const afvalsoort = columns[13];

                    if (location === "HEERLEN" && afvalsoort === selectedType) {
                        const year = uitvoerDatum.slice(-4);
                        selectedTypeYearData[year] = (selectedTypeYearData[year] || 0) + kg;
                    }
                });

                // Update the Waste Type chart
                wasteTypeChart.data.labels = Object.keys(selectedTypeYearData);
                wasteTypeChart.data.datasets[0].data = Object.values(selectedTypeYearData);
                wasteTypeChart.data.datasets[0].label = `KG Collected for ${selectedType} by Year`;
                wasteTypeChart.update();
            }
        });
    })
    .catch(error => console.error("Error loading CSV:", error));
