// Define cloud positions (relative to the container)
const clouds = [
    { id: 'cloud-1' }, { id: 'cloud-2' }, { id: 'cloud-3' }
];

// Append clouds
const cloudsContainer = d3.select("#clouds-container");

cloudsContainer.selectAll(".cloud")
    .data(clouds)
    .enter()
    .append("div")
    .attr("class", "cloud")
    .on("click", function() {
        alert("Cloud clicked! Functionality coming soon.");
    });

// Define tree structure (positions for tree trunks)
const trees = [
    { id: 'tree-heerlen', name: 'Heerlen' }, // First tree represents Heerlen
    { id: 'tree-Sittard', name: 'Sittard' },
    { id: 'tree-Maastricht', name: 'Maastricht' }
];

const treeArea = d3.select("#tree-area");

trees.forEach((tree, index) => {
    const treeDiv = treeArea.append("div")
        .attr("class", "tree")
        .attr("id", tree.id)  // Assign unique ID to each tree
          

    treeDiv.append("div")
        .attr("class", "tree-name")
        .text(tree.name);
    
    treeDiv.append("div").attr("class", "tree-trunk");


     if (tree.name === "Heerlen") {
            treeDiv.on("click", function() {
                window.location.href = "heerlen.html";
            });
        }
        
    if (tree.name === "Sittard") {
            treeDiv.on("click", function() {
                window.location.href = "sittard.html";
            });
        }
    if (tree.name === "Maastricht") {
            treeDiv.on("click", function() {
                window.location.href = "maastricht.html";
            });
        }
                

    // Add leaves (relative to tree trunk)
    treeDiv.selectAll(".leaf")
        .data(d3.range(16))  // 12 leaves per tree
        .enter()
        .append("div")
        .attr("class", "leaf")
        .style("position", "absolute")  // Ensure leaves are positioned absolutely
        .style("left", (d, i) => `${(i % 4) * 35 - 40}px`)  // Custom positioning
        .style("top", (d, i) => `${Math.floor(i / 4) * 35 - 100}px`);

    // Append trash bags directly to the tree div
    treeDiv.selectAll(`.trash-bag`)
        .data(d3.range(5))  // 5 trash bags per tree
        .enter()
        .append("div")
        .attr("class", "trash-bag")
        .attr("id", (d) => `${tree.id}-trashbag-${d}`)  // Assign unique ID to each trash bag
        .style("position", "absolute")  // Position absolute for random placement
        .style("bottom", () => `${Math.floor(Math.random() * 5)}px`)  // Random vertical positioning
        .style("left", () => `${Math.floor(Math.random() * 100) - 30}px`);  // Random horizontal positioning
});
