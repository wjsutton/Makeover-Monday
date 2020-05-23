async function drawBars() {

    // 1. Access data
    var dataset = await d3.csv("mom_2020w14_us_results_pivot_men.csv")
    
    const xAccessor = d => d.year

    const stackGenerator = d3.stack().keys(dataset.columns.slice(1))
    const layers = stackGenerator(dataset)
    const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))]
    
    // 2. Create chart dimensions
    const width = 400
    let dimensions = {
        width: width,
        height: width * 1,
        margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50,
        },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    
    // 3. Draw canvas
    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
    
    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left
        }px, ${
            dimensions.margin.top
        }px)`)
    
    // 4. Create scales
    const xScale = d3.scaleBand()
        .domain(dataset.map(xAccessor))
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain(extent).nice()
        .range([dimensions.boundedHeight, dimensions.margin.top])
    

    const colors = {
        "paid_work_avg_time_hours":"#445E93", 
        "unpaid_work_avg_time_hours":"#7EB2DD"
    }
    const text_colors = {
        "paid_work_avg_time_hours": "white", 
        "unpaid_work_avg_time_hours": "black"
    }

    // 5. Draw data
    const bars = bounds.selectAll()
        .data(layers)
        .join("g")
        .attr("class","layer")
        .attr("fill", layer => {return colors[layer.key]})
        .selectAll("rect")
        .data(layer => layer)
        .join("rect")
        .attr("x", sequence => {return xScale(sequence.data.year)})
        .attr("width", xScale.bandwidth())
        .attr("y", sequence => yScale(sequence[1]))
        .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))
    
    var formatDataLabels = d3.format(".1f")
    const barLabel = bounds.selectAll(".text") 
    .data(layers)
    .join("g")
    .attr("class","layer")
    .attr("fill", layer => {return text_colors[layer.key]})
        .selectAll("text")
        .data(layer => layer)
        .join("text")
        .attr("class","label")
        .attr("x", (sequence => {return xScale(sequence.data.year) + 4}  ))
        .attr("y", sequence => yScale(sequence[1]) + 15)
        .text(sequence => formatDataLabels(sequence[1] - sequence[0]))
        .style("font-size", "0.8em")   

    // 6. Draw periphals
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    
    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1.2em")
        .text("Year")
        .style("text-transform", "capitalize")

    const Title = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.top-dimensions.boundedHeight)
        .attr("fill", "black")
        .style("font-size", "1.5em")
        .text("Men")
        .style("text-transform", "capitalize")
    
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
    
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
        

    const yAxisLabel = yAxis.append("text")
        .attr("x", -(dimensions.boundedHeight / 2)+30)
        .attr("y", -20)
        .attr("fill", "black")
        .style("font-size", "1.2em")
        .text("Hours Worked")
        .style("text-transform", "capitalize")
        .attr("transform", "rotate(-90)")
    
    // 7. Interactions
    
    bars.on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)
    
    function onMouseEnter(datum) {
        d3.select(this).style("fill", "#FF9955");
    }

    function onMouseLeave(datum) {
        d3.select(this).style("fill", layer => {return colors[layer.key]});
    }

}
drawBars()