// call by starting the app -> add a glyph without path add diagram without data + empty frequenzy
// after moving the cursor on the glyph add path + meta data
var axesLength = height/6
var center_x = width/3
var center_y = height/4
var svg1
var ft_name = ["Temperature (C°)", "Wind Speed (km/h)", "Rainfall Sum (mm)", "Snowfall Sum (cm)", "Rel. Humidity (%)"]
var adjustTextForFeatureNames = [[-width/20,-height/90],[0,0],[0,height/50],[-width/7,height/50],[-width/7.5,0]]
var adjustTextForFeatureValues = [[[width/350,-height/80],[width/320,height/60]],[[width/50,height/90],[-width/60,height/50]],
                                [[width/350,height/35],[-width/50,height/200]],[[-width/40,height/50],[-width/150,-height/100]],[[-width/40,-height/80],[width/150,0]]]
var featuresTextColors = ["#FF0000", "#27AE60", "#2980B9", "#7D3C98", "#A52A2A"]
var min_max_values = [[minTemperature,maxTemperature],[minWindSpeed,maxWindSpeed],[minRainFall,maxRainFall],
                     [minSnowFall,maxSnowFall],[minRelativeHumidity,maxRelativeHumidity]]

//set feature Text
function setText(_svg1, pos_x, pos_y, font_size, ft_name,color,id) {
    _svg1.append("text")
            .attr("id", id)
            .attr("x", pos_x)
            .attr("y", pos_y)
            .text(ft_name)
            .attr("font-size",font_size)
            .style("fill", color)
}

function startGlyphModelVisualization() {

    svg1 = d3.select(document.getElementById("data_vis1"))
    .attr('width',(width))
    .attr('height',((height)/2))
    .style("background",'#f5f5f5')
    let radialScale = d3.scaleLinear()
                .domain([0,10])
                .range([0,axesLength])

    let glyphCircleRadius = [2,4,6,8,10]

    glyphCircleRadius.forEach(t =>
    svg1.append("circle")
                .attr("cx", center_x)
                .attr("cy", center_y)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("r", radialScale(t)))

    // set text depending on the screen size !
    var h1 = height/33
    var h2 = height/42
    var textSize = height/60

    setText(svg1, width/5,height/24,h1+"px","Glyph Representation","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/24,h1+"px","Weather Data","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/13,h2+"px","District.:","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6,h2+"px","Daily.:","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+(height/25),textSize +"px","Rainfall Sum :","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+2*(height/25),textSize +"px","Snowfall Sum :","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+3*(height/25),textSize +"px","Wind Speed max. :","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+4*(height/25),h2+"px","Hourly.:","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+5*(height/25),textSize +"px","Temperature :","#000000","_text")
    setText(svg1, width/(3/2) + (width/20),height/6+6*(height/25),textSize +"px","Rel. Humidity :","#000000","_text")

    //set Axes
    for(var i = 0; i < numberOfFeatures; i++) {
        var angle = (3/2) * Math.PI + (2 * Math.PI * i / numberOfFeatures)
        svg1.append('line')
                .attr("id", "-replacetext")
                .attr('x1', center_x )
                .attr('y1', center_y )
                .attr('x2', axesLength * Math.cos(angle) + center_x )
                .attr('y2', axesLength * Math.sin(angle) + center_y )
                .attr('stroke', 'black')
                .attr('stroke-width', "1")
        
        var maxDisAxesCos = axesLength * Math.cos(angle) + center_x
        var maxDisAxesSin = axesLength * Math.sin(angle) + center_y
        setText(svg1, maxDisAxesCos + adjustTextForFeatureNames[i][0], maxDisAxesSin
                + adjustTextForFeatureNames[i][1], height/60 +"px",ft_name[i],"#000000") //feature names
        setText(svg1, center_x + adjustTextForFeatureValues[i][0][0], center_y 
                + adjustTextForFeatureValues[i][0][1],height/70 +"px",min_max_values[i][0]+"",featuresTextColors[i]) //minValue
        setText(svg1, maxDisAxesCos + adjustTextForFeatureValues[i][1][0], maxDisAxesSin 
                + adjustTextForFeatureValues[i][1][1],height/70 +"px",min_max_values[i][1]+"",featuresTextColors[i]) //maxValue
    }
}

function setModelPath(scaleValues,d,districtDict) { //showGlyphPathAndData
    svg1.selectAll("path").remove()
    svg1.selectAll("#replacetext").remove()

    let radialScale2 = d3.scaleLinear()
    .domain([0,glyphRadius])
    .range([0,axesLength])

    var lineGenerator = d3.line()
    svg1.append('path')
        .attr("d",function(d) {
            var pathData = []
            for(var i = 0; i < numberOfFeatures; i++) {
                var angle = (3/2)*Math.PI + (2 * Math.PI * i / numberOfFeatures)
                pathData.push([radialScale2(scaleValues[i]) * Math.cos(angle) + center_x,radialScale2(scaleValues[i]) * Math.sin(angle) + center_y])
            }
            pathData.push(pathData[0]) //connect the path stroke by adding the first element to the last
            return lineGenerator(pathData)
        })
        .attr("stroke-width", 1)
        .attr("stroke", "red")
        .attr("fill",  "yellow")
        .attr("opacity", 0.85)
    
    districtDict.map(function(elems) {
        
        if (elems.features == d.path[0]['__data__']) {
            var textSize = height/60
            var h3 = height/50
            setText(svg1, width/(3/2) + (width/20),height/13 +0.8*(height/20),h3+"px",elems.features.properties.GEN +"","#FF0000","replacetext")
            setText(svg1, width/(3/2) + (width/4.5) ,height/6+(height/25),textSize +"px",elems.weatherData.daily.rain_sum[0].toFixed(3) + " mm","#FF0000","replacetext")
            setText(svg1, width/(3/2) + (width/4.5),height/6+2*(height/25),textSize +"px",elems.weatherData.daily.snowfall_sum[0].toFixed(3) + " cm","#FF0000","replacetext")
            setText(svg1, width/(3/2) + (width/4.5),height/6+5*(height/25),textSize +"px",elems.weatherData.hourly.temperature_2m[0].toFixed(3) + " C°","#FF0000","replacetext")
            setText(svg1, width/(3/2) + (width/4.5),height/6+3*(height/25),textSize +"px",elems.weatherData.daily.windspeed_10m_max[0].toFixed(3) + " km/h","#FF0000","replacetext")
            setText(svg1, width/(3/2) + (width/4.5),height/6+6*(height/25),textSize +"px",elems.weatherData.hourly.relativehumidity_2m[0].toFixed(3) + " %","#FF0000","replacetext")
        }
    })
}
