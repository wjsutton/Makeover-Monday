async function drawBars() {

    // 1. Access data
    var dataset = await d3.csv("music_pivot.csv")
    
    const xAccessor = d => d.year

    const stackGenerator = d3.stack().keys(dataset.columns.slice(1))
    const layers = stackGenerator(dataset)
    const extent = [0, d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))]
    
    // 2. Create chart dimensions
    const width = 620
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 60,
        },
    }
    const legend_height = 100

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


    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", legend_height)

    // Define the div for the tooltip
    const tooltip = d3.select("#tooltip")
    
    // 4. Create scales
    const xScale = d3.scaleBand()
        .domain(dataset.map(xAccessor))
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
    
    const yScale = d3.scaleLinear()
        .domain(extent).nice()
        .range([dimensions.boundedHeight, dimensions.margin.top])

const colors = {
    "8_track":"#7bd74a",
    "cassettes":"#76D7C4",
    "cds":"#3587A4",
    "digital_downloads_and_ringtones":"#976391",
    "other":"#dace8c",
    "streaming" :"#8C198C",
    "vinyl":"#289900" 
}
//#8C198C
//#5C2751
const areaGenerator = d3.area()
  .x(sequence => xScale(sequence.data.year))
  .y0(sequence => yScale(sequence[0]))
  .y1(sequence => yScale(sequence[1]));

    // 5. Draw data
    const bars = bounds.selectAll()
        .data(layers)
        .join("path")
        .attr("class","layer")
        .attr("fill", layer => {return colors[layer.key]})
        .attr("d", layer => areaGenerator(layer))
        
    // 6. Draw periphals
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        .tickValues(xScale.domain().filter((d, i) => d % 5 === 3));
    
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

    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .tickFormat(function (d) {return "$" + d/1000 + "B";})
        
    
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)

    const yAxisLabel = yAxis.append("text")
        .attr("x", -(dimensions.boundedHeight / 2)+90)
        .attr("y", -40)
        .attr("fill", "black")
        .style("font-size", "1.2em")
        .text("2017 Dollars, adjusted for inflation")
        .attr("transform", "rotate(-90)")

    const Source = xAxis.append("text")
        .attr("x", dimensions.boundedWidth - 30)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "12px")
        .text("Source: RIAA")
        .style("text-transform", "capitalize")

    // 7. Interactions
    
    bars.on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)
    
    console.log(dataset[0].year)
    console.table(dataset[0].year)

    function onMouseEnter(datum) {
        d3.select(this).style("fill", "#d3d3d3");
        tooltip.select("#count")
        .data(dataset)
        .text(function(d) { return d; })
        //.text(datum.x0)
        //    .text(dataset[0].year)
        //    .text('10')
//console.log(datum)
//console.log(dataset)
//console.log(x)
console.log(function(d) { return d; })

const x = xScale(datum.x0)
      + (xScale(datum.x1) - xScale(datum.x0)) / 2
      + dimensions.margin.left
    const y = yScale(yAccessor(datum))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

        tooltip.style("opacity", 1)
    }

    function onMouseLeave(datum) {
        d3.select(this).style("fill", layer => {return colors[layer.key]});
        tooltip.style("opacity", 0)
    }
/*
    .on('mouseover', d => {
        div
          .transition()
          .duration(200)
          .style('opacity', 0.9);
        div
          .html(formatTime(d.date) + '<br/>' + d.close)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
      })
*/

    // Data Labels
    bounds.append("text").attr("x", 40).attr("y", 210).text("VINYL").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 10).attr("y", 282).text("8 TRACK").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 170).attr("y", 172).text("CASETTES").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 270).attr("y", 210).text("COMPACT DISCS").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 400).attr("y", 280).text("DOWNLOADS").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 400).attr("y", 295).text("& RINGTONES").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 490).attr("y", 305).text("STREAMING").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
    bounds.append("text").attr("x", 450).attr("y", 208).text("OTHER").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black").attr("font-weight","bold")
 

  // Legend
  /*
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*0 + (dimensions.boundedWidth/14)).attr("y",0).style("fill", "#289900")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*2 + (dimensions.boundedWidth/14)).attr("y",0).style("fill", "#7bd74a")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*4 + (dimensions.boundedWidth/14)).attr("y",0).style("fill", "#76D7C4")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*6 + (dimensions.boundedWidth/14)).attr("y",0).style("fill", "#3587A4")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*1 + (dimensions.boundedWidth/14)).attr("y",30).style("fill", "#976391")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*3 + (dimensions.boundedWidth/14)).attr("y",30).style("fill", "#8C198C")
    legend.append("rect").attr("height",20).attr("width",20).attr("x",(dimensions.boundedWidth/7)*5 + (dimensions.boundedWidth/14)).attr("y",30).style("fill", "#dace8c")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*0 + (dimensions.boundedWidth/14) +22).attr("y", 12).text("Vinyl").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*2 + (dimensions.boundedWidth/14) +22).attr("y", 12).text("8 Track").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*4 + (dimensions.boundedWidth/14) +22).attr("y", 12).text("Casettes").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*6 + (dimensions.boundedWidth/14) +22).attr("y", 12).text("CDs").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*1 + (dimensions.boundedWidth/14) +22).attr("y", 42).text("Downloads & Ringtones").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*3 + (dimensions.boundedWidth/14) +22).attr("y", 42).text("Streaming").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
    legend.append("text").attr("x", (dimensions.boundedWidth/7)*5 + (dimensions.boundedWidth/14) +22).attr("y", 42).text("Other").style("font-size", "12px").attr("alignment-baseline","middle").attr("fill", "black")
*/



}
drawBars()