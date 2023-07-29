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
        .text("Cases");
    

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -70)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Total Jobs Lost");

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

    // Add colors for regions
    const regioncolors = d3.scaleOrdinal()
        .domain([...new Set(data.map(d => d.Region))])
        .range(d3.schemeCategory10);

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
        .attr("fill", function(d) {
            return regioncolors(d.Region)
        })
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
          
    // Add State Codes to each circle
    svg.selectAll(".statecode")
        .data(data)
        .enter()
        .append("text")
        .attr("font-size", 10)
        .attr("fill", "white")
        .attr("x", function(d) {
            return xScale(+d.cases);
        })
        .attr("y", function(d) {
            return yScale(+d["Total Job Loss Index"]);
        })
        .style("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(function(d) {
            return d["State Code"];
        });

    //Create legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20, 20)");
      
    
    const regions = [...new Set(data.map(d => d.Region))];
    const legendItems = legend.selectAll(".legend-item")
        .data(regions)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");
      
    legendItems.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 4)
        .attr("fill", regioncolors);
      
    legendItems.append("text")
        .attr("x", 25)
        .attr("y", 10)
        .style("fill", regioncolors)
        .style("font-size", "12px") 
        .attr("alignment-baseline", "middle")
        .text(d => d);
    
    // Add a title for the legend
    legend.append("text")
        .attr("x", 7)
        .attr("y", -8)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Region");

    //Add annotations
    const annotations = [{
        x: xScale(data.find(d => d.state === "California").cases) - 5,
        y: yScale(data.find(d => d.state === "California")["Total Job Loss Index"]) + 10,
        note: {
            label: "California had the most ...",
            bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
            title: "California",
            orientation: "middle",
            align: "left"
        },
        type: d3.annotationCallout,
        dx: -100,
        dy: 100
    },
    {
        x: xScale(data.find(d => d.state === "Idaho").cases)+ 5,
        y: yScale(data.find(d => d.state === "Idaho")["Total Job Loss Index"]),
        note: {
            label: "Idaho ...",
            bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
            title: "Idaho",
            orientation: "middle",
            align: "left"
        },
        type: d3.annotationCallout,
        dx: 50,
        dy: 20
    },
    {
        x: xScale(data.find(d => d.state === "Utah").cases)+ 5,
        y: yScale(data.find(d => d.state === "Utah")["Total Job Loss Index"]),
        note: {
            label: "Utah ...",
            bgPadding: {"top":15,"left":10,"right":10,"bottom":10},
            title: "Utah",
            orientation: "middle",
            align: "left"
        },
        type: d3.annotationCallout,
        dx: 50,
        dy: 20
    }
    ]

    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);


}