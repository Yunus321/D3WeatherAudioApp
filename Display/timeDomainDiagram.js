//variables
var margin = {top: height/8, right: width/8, bottom: height/15, left: width/10},
_width = width - margin.left - margin.right,
_height = (height/2) - margin.top - margin.bottom;
var svg2
var x = d3.scaleLinear()
    .domain([0, 2200])
    .range([0, _width])

var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([_height, 0])

function setText(_svg1, pos_x, pos_y, font_size, ft_name,color,id) {
    _svg1.append("text")
        .attr("id", id)
        .attr("x", pos_x)
        .attr("y", pos_y)
        .text(ft_name)
        .attr("font-size",font_size)
        .style("fill", color)
}

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

    var h1 = height/33
    var textSize = height/61

    setText(svg2, width/4,-height/10,h1+"px","Frequency Visualization","#000000","_text")
    setText(svg2, 0,-height/22,textSize+"px","Frequency (Hz) :","#000000","_text")
    setText(svg2, 0,-height/42,textSize+"px","Amplitude (max.) :","#000000","_text")
    setText(svg2, -width/18,-height/120,height/80+"px","Amplitude (normalized)","#000000","_text")
    setText(svg2, width/1.38,height/2.9,height/80+"px","Time frame 50 ms","#000000","_text")

    setText(svg2, (width/7.2),-height/15,textSize+"px","Temperature ","#000000","_text")
    setText(svg2, 2*(width/7.2),-height/15,textSize+"px","Wind Speed","#000000","_text")
    setText(svg2, 3*(width/7.2),-height/15,textSize+"px","Rainfall Sum","#000000","_text")
    setText(svg2, 4*(width/7.2),-height/15,textSize+"px","Snowfall Sum","#000000","_text")
    setText(svg2, 5*(width/7.2),-height/15,textSize+"px","Rel. Humidity","#000000","_text")

    setText(svg2, (width/7.2) + (width/32),-height/22,textSize+"px",frequencies[0],"#000000","_text")
    setText(svg2, 2*(width/7.2)+ (width/32),-height/22,textSize+"px",frequencies[1],"#000000","_text")
    setText(svg2, 3*(width/7.2)+ (width/32),-height/22,textSize+"px",frequencies[2],"#000000","_text")
    setText(svg2, 4*(width/7.2)+ (width/32),-height/22,textSize+"px",frequencies[3],"#000000","_text")
    setText(svg2, 5*(width/7.2)+ (width/32),-height/22,textSize+"px",frequencies[4],"#000000","_text")
}

function setTimeDomainDiagram(currentGlyphScaleValues,summedFrequencies) {
    calcAmplitude = d3.scaleLinear()
    .domain([0, glyphRadius])
    .range([0, 1])
    var data = []
    svg2.selectAll("#replace").remove()
    for (var i = 0; i < 2200; i++) {  // 44100 samples represents 1 second. 44100 / 2205 = 50 -> thus time frame is 50 ms
        data.push({x:i, y:summedFrequencies[i]})
    }
    var textSize = height/61
    setText(svg2, (width/7.2) + (width/32),-height/42,textSize+"px",calcAmplitude(currentGlyphScaleValues[0]).toFixed(3),"#FF0000","replace")
    setText(svg2, 2*(width/7.2) + (width/32),-height/42,textSize+"px",calcAmplitude(currentGlyphScaleValues[1]).toFixed(3),"#FF0000","replace")
    setText(svg2, 3*(width/7.2) + (width/32),-height/42,textSize+"px",calcAmplitude(currentGlyphScaleValues[2]).toFixed(3),"#FF0000","replace")
    setText(svg2, 4*(width/7.2) + (width/32),-height/42,textSize+"px",calcAmplitude(currentGlyphScaleValues[3]).toFixed(3),"#FF0000","replace")
    setText(svg2, 5*(width/7.2) + (width/32),-height/42,textSize+"px",calcAmplitude(currentGlyphScaleValues[4]).toFixed(3),"#FF0000","replace")

    svg2.selectAll("circle").remove()
    svg2
    .selectAll("freq")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d){ return x(d.x) })
      .attr("cy", function(d){ return y(d.y) })
      .attr("r", 1)
      .attr('fill', '#FF0000')
}