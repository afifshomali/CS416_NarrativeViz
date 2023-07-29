async function chart1() {
    const data = await d3.csv("https://afifshomali.github.io/data/final.csv");

    const margins = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 1000 - margins.left - margins.right;
    const height = 1000 - margins.top - margins.bottom;

    const svg = d3.select("#chart1").append("svg")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .append("g")
        .attr("transform", "translate("+ margins.left +", "+ margins.top +")");

    const xScale = d3.scaleLog()
        .domain([5000, 2500000])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0, 873)")
        .call(d3.axisBottom(xScale));

    const yScale = d3.scaleLinear()
        .domain([-50000, 750000])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale));



}