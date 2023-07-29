async function chart1() {
    // data
    const data = await d3.csv("https://afifshomali.github.io/data/final.csv");

    // setting up canvas for chart
    const margins = { top: 10, right: 10, bottom: 50, left: 100 };
    const width = 1500 - margins.left - margins.right;
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
        .attr("transform", "translate(0, 882)")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Scale for radius values
    const radiusScale = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.Population)) 
        .range([10, 25]); 

    // Adding axes titles
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .style("text-anchor", "middle")
        .text("Total Jobs Lost");
    

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -70)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Cases");

    // Add invisble tooltip
    const tooltip = d3.select("#chart1")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "grey")
        .style("padding", "5")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "80px")

    // Add Data & tooltip functionality
    // TODO: Add annotations For two below x axis & california & add regions so that we can color based on region 
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(+d.cases);
        })
        .attr("cy", function(d) {
            return yScale(+d["Total Job Loss Index"]);
        })
        .attr("r", function(d) {
            return radiusScale(+d.Population);
        })
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            d3.select(event.target).attr("stroke", "black")
            .attr("stroke-width", 2);

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
          .on("mouseout", (event) => {
            d3.select(event.target).attr("stroke", "none");
            tooltip.transition().duration(500).style("opacity", 0);
          });
    


}