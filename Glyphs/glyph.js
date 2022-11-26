
/*
    scale = d3.scaleLinear()
        .domain([ 0, 100000 ])
        .range([ 0, 0.1]);
*/


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
            .attr('r', "8px")
            .style("opacity", 0.6)
            .on("mousemove", function(d) {
                /* d3.pointer(d) gets the x and y distance from the middle point of circle
                -> Largest absolute distance of x or y from the circle center [0,0] represents the volume of each tone
                -> By moving the from 8px to 0px the volume of the tone increases 
                */
                var coords = d3.pointer( d ) 
                console.log(coords) 
                console.log(d)
                //call the weather data (displayData) of each district
            });
}


//  Implementation of axes of the Glyphs
