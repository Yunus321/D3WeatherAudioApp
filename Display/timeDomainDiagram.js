var margin = {top: height/12, right: width/12, bottom: height/12, left: width/12}, //hier margin relativ zu screen in prozent arbeiten !
_width = width - margin.left - margin.right,
_height = (height/2) - margin.top - margin.bottom;

var svg2
var x = d3.scaleLinear()
    .domain([0, 1500])
    .range([0, _width])

var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([_height, 0])


function startTimeDomainDiagram() {

svg2 = d3.select(document.getElementById("data_vis2"))
.attr('width',(width))
.attr('height',((height)/2))
.style("background",'#f5f5f5')
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")")

svg2
    .append('g')
    .attr("transform", "translate(0," + _height + ")")
    .call(d3.axisBottom(x))


svg2
    .append('g')
    .call(d3.axisLeft(y))
}

function setTimeDomainDiagram(summedFrequencies) {
    var data = []
    for (var i = 0; i < 1500; i++) {
        data.push({x:i, y:summedFrequencies[i]})
    }
    svg2.selectAll("circle").remove()
    svg2
    .selectAll("whatever")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d){ return x(d.x) })
      .attr("cy", function(d){ return y(d.y) })
      .attr("r", 1)
}