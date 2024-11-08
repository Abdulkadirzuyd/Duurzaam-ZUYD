fetch("data/data.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip header row

        // Data structures for charts
        const yearData = {}; // KG per year
        const wasteTypeData = {}; // KG per waste type
        const wasteTypeYearData = {}; // KG per waste type by year

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

                // Process waste type by year for filter functionality
                if (!wasteTypeYearData[afvalsoort]) {
                    wasteTypeYearData[afvalsoort] = {};
                }
                wasteTypeYearData[afvalsoort][year] = (wasteTypeYearData[afvalsoort][year] || 0) + kg;
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
        const yearChart = new Chart(yearCtx, {
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
                layout: { padding: { top: 60, left: 50 } },
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Create Waste Type chart (initial state)
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
                layout: { padding: { top: 60, left: 50} },
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
            option.text = wasteType;
            wasteTypeSelect.appendChild(option);
        });

        // Update Waste Type chart based on selected waste type from dropdown
        wasteTypeSelect.addEventListener('change', (event) => {
            const selectedWasteType = event.target.value;
            updateWasteTypeYearData(selectedWasteType);
        });

        // Function to update Waste Type chart based on selected waste type
        function updateWasteTypeYearData(selectedType) {
            const selectedTypeYearData = wasteTypeYearData[selectedType];
            const years = Object.keys(selectedTypeYearData);
            const data = years.map(year => selectedTypeYearData[year]);

            // Update the chart with filtered data
            wasteTypeChart.data.labels = years;
            wasteTypeChart.data.datasets[0].data = data;
            wasteTypeChart.data.datasets[0].label = `KG Collected for ${selectedType} by Year`;
            wasteTypeChart.update();
        }
    })
    .catch(error => console.error("Error loading CSV:", error));
