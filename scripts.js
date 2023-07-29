async function chart1() {
    // data
    const data = await d3.csv("https://afifshomali.github.io/data/final.csv");

    // setting up canvas for chart
    const margins = { top: 10, right: 10, bottom: 50, left: 100 };
    const width = 1000 - margins.left - margins.right;
    const height = 1000 - margins.top - margins.bottom;

    const svg = d3.select("#chart1").append("svg")
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .append("g")
        .attr("transform", "translate("+ margins.left +", "+ margins.top +")");


    
    // Adding axes
    const xScale = d3.scaleLog()
        .domain([5000, 2500000])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([-50000, 750000])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(0, 872)")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Adding axes titles
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .style("text-anchor", "middle")
        .text("Total Jobs Lost");
    

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -70)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Cases");

    // Add invisble tooltip
    const tooltip = d3.select("#main")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "grey")
        .style("padding", "5")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "80px")

    // Add Data & tooltip functionality
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(+d.cases);
        })
        .attr("cy", function(d) {
            return yScale(+d["Total Job Loss Index"])
        })
        .attr("r", 5)
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(
              `<p>State: ${d.state}<br>
               <p>Cases: ${d.cases}<br>
               <p>Deaths: ${Math.round(d.deaths)}<br>
               <p>Job Loss Rate: ${Math.round(d["low_income_worker_job_loss_rate"] * 100 * 100)/ 100}%<br>
               <p>Total Job Losses: ${d["Total Job Loss Index"]}<br>
               <p>Population: ${d.Population}</p>`
            )
              .style("left", (event.pageX+10) + "px")
              .style("top", (event.pageY) + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
          });
    


}