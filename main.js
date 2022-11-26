// variables
var width = window.innerWidth-20;
var height = window.innerHeight-20;

//source : © GeoBasis-DE / BKG 2013 (Data changed) - visualize the map by hrough a geojson file
//load data and set in the D3 js interface
d3.json('/Json_data/landkreise_simplify200.geojson').then(function(ger) {

    var projection = d3.geoMercator()
        .center([10.5,53.2]) //long & lat of center of the card
        .scale([4700])
        .rotate([0,0,0]);

    geoGenerator = d3.geoPath().projection(projection);

    //define canvas of d3
    var svg = d3.select('svg')
    .attr('width', width -1100)
    .attr('height', height)
    .style('background-color','#C0C0C0');

    svg.append('g')
        .selectAll('path')  //drawing a path for each features
        .data(ger.features)
        .enter()
        .append('path')
        .attr('d', geoGenerator)
        .attr('fill', '#58D68D')
        .attr('stroke', '#000')
        .attr('stroke-width', '0.5px')

    var zoom = d3.zoom()
        .on("zoom", handleZoom)
        .scaleExtent([1,40]) //Zoom size
        .translateExtent([[0,0], [width -1110,height]]); //sets the border of the map

    function handleZoom(e) {
        const {transform} = e;
        d3.select("g")
        .attr("transform", transform);
    }

    d3.select("svg")
        .call(zoom);

    var circle = d3.select("g").selectAll('circle');
    setCircles(circle, ger);
    
});