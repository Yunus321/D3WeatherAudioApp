
function setCircles(circle, ger) {

    circle
        .data(ger.features)
        .enter()
            .append('circle')
            .attr('d', geoGenerator)
            .attr('transform', function(d) {
                var coords = geoGenerator.centroid(d.geometry)
                return "translate(" + coords + ")"})
            .attr('fill', '#E9967A')
            .attr('r', glyphRadius)
            .style("opacity", 0.4)
            .on("mouseenter", function(d) {
                startAudioInterface(d)
            })
            .on("mousemove", function(d) {
                var cursorPosOnGlyph = d3.pointer( d )
                calculateNewSoundVolume(cursorPosOnGlyph)
            })
            .on("mouseleave",function(d) {
                stopSound()
            })
}

function setAxes(line, ger, numbOfFeatures) {

    for(var i = 0; i < numbOfFeatures; i++) {
        var angle = (3/2)*Math.PI + (2 * Math.PI * i / numbOfFeatures)
        line
            .data(ger.features)
            .enter().append('line')
                .attr('d', geoGenerator)
                .attr('x1', function(d) { return geoGenerator.centroid(d.geometry)[0] })
                .attr('y1', function(d) { return geoGenerator.centroid(d.geometry)[1] })
                .attr('x2', function(d) { return glyphRadius * Math.cos(angle) + geoGenerator.centroid(d.geometry)[0] })
                .attr('y2', function(d) { return glyphRadius * Math.sin(angle) + geoGenerator.centroid(d.geometry)[1] })
                .attr('stroke', 'black')
                .attr('stroke-width', "0.2")
    }
}

function setPath(path,ger,weatherData, objectData, numbOfFeatures) {

    var lineGenerator = d3.line()
    var objectWeatherData
    var glyphPathScaleValues
    var counter = 0
    path
        .data(ger.features)
        .enter().append('path')
        .attr("d",function(d) {
            var pathData = []
            for(var i = 0; i < objectData.length; i++) {
                if(objectData[i] == d) { //check whether the weather data belongs to the current object
                    objectWeatherData = weatherData[i]
                    glyphPathScaleValues = glyphsWeatherDataInterface(objectWeatherData)
                    glyphWeatherDataScaleValues[counter] = glyphPathScaleValues
                    counter++
                }
            }
            for(var i = 0; i < numbOfFeatures; i++) {
                var angle = (3/2)*Math.PI + (2 * Math.PI * i / numbOfFeatures)
                //calculate the scale factor for the glyph path in glyphAndWeatherDataInterface
                pathData.push([glyphPathScaleValues[i] * Math.cos(angle) + geoGenerator.centroid(d.geometry)[0],
                            glyphPathScaleValues[i] * Math.sin(angle) + geoGenerator.centroid(d.geometry)[1]])
            }
            pathData.push(pathData[0]) //connect the paths by adding the first element to the last
            return lineGenerator(pathData)
        })
        .attr("stroke-width", 0.2)
        .attr("stroke", "red")
        .attr("fill",  "yellow")
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.9)
}


