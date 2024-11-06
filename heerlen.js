// Load CSV data
d3.csv("data/data.csv", d3.autoType).then(data => {
    console.log("Raw Data:", data); // Debug line to check loaded data

    // Filter Heerlen data and log to inspect
    const heerlenData = data.filter(d => d[4] === 'HEERLEN');
    console.log("Filtered Heerlen Data:", heerlenData); // Debug filtered Heerlen data

    // Parse year and KG values
    const parsedData = heerlenData.map(d => {
        const year = d[5] ? d[5].split("-")[2] : "Unknown"; // Safely extract year
        return {
            year: parseInt(year, 10),
            kg: +d[6] || 0  // Ensure KG is a number
        };
    });

    console.log("Parsed Heerlen Data:", parsedData); // Debug parsed data

    // Filter parsed data for years 2020-2024
    const filteredData = parsedData.filter(d => d.year >= 2020 && d.year <= 2024);
    console.log("Filtered Data for Years 2020-2024:", filteredData); // Debug filtered data by year

    // Format data for displaying on the page
    let dataHtml = "<ul>";
    filteredData.forEach(d => {
        dataHtml += `<li>Year: ${d.year}, Total KG: ${d.kg}</li>`;
    });
    dataHtml += "</ul>";

    // Insert formatted data into the page
    document.getElementById("data").innerHTML = dataHtml;

}).catch(error => {
    console.error("Error loading CSV data:", error);
});