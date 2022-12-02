

function setCircles(circle, ger) {

    circle
        .data(ger.features)
        .enter()
            .append('circle')
            .attr('d', geoGenerator)
            .attr('transform', function(d) {
                var coords = geoGenerator.centroid(d.geometry)
                var mapCoords = projection.invert(geoGenerator.centroid(d.geometry))
                urls.push(fetchWeatherData(mapCoords[1], mapCoords[0]))
                objectData.push(d)
                return "translate(" + coords + ")"})
            .attr('fill', '#E9967A')
            .attr('r', glyphRadius)
            .style("opacity", 0.6)
            .on("click", function(d) {
                /* d3.pointer(d) gets the x and y distance from the middle point of circle
                -> Largest absolute distance of x or y from the circle center [0,0] represents the volume of each tone
                -> By moving from 8px to 0px the volume of the tone increases
                */
                console.log(d)
                alert("xxxxxxx")
                var coords = d3.pointer( d )
            });
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
    var lineGenerator = d3.line();
    var objectWeatherData;
    var glyphPathScaleValues;
    
    path
        .data(ger.features)
        .enter().append('path')
        .attr("d",function(d) {
            var pathData = []
            for(var i = 0; i < objectData.length; i++) {
                if(objectData[i] == d) { //check whether the weather data belongs to the current object
                    objectWeatherData = weatherData[i]
                    glyphPathScaleValues = glyphsWeatherDataInterface(objectWeatherData)
                }
            }

            for(var i = 0; i < numbOfFeatures; i++) {
                var angle = (3/2)*Math.PI + (2 * Math.PI * i / numbOfFeatures)
                //calculate the scale factor for the glyph path in glyphAndWeatherDataInterface - 4 for the scale has been choosen for the purpose of demonstration
                pathData.push([glyphPathScaleValues[i] * Math.cos(angle) + geoGenerator.centroid(d.geometry)[0], 
                            glyphPathScaleValues[i] * Math.sin(angle) + geoGenerator.centroid(d.geometry)[1]]);
            }
            //console.log(pathData)
            pathData.push(pathData[0]) //connect the paths by adding the first element to the last
            
            return lineGenerator(pathData)
        })
        .attr("stroke-width", 0.1)
        .on("mousemove", function(d) {
            /* d3.pointer(d) gets the x and y distance from the middle point of circle
            -> Largest absolute distance of x or y from the circle center [0,0] represents the volume of each tone
            -> By moving from 8px to 0px the volume of the tone increases
            */
            //console.log(d)
            //var coords = d3.pointer( d )
        })
        .attr("stroke", "black")
        .attr("fill",  "yellow")
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
}


