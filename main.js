
// variables
var width = window.innerWidth-20;
var height = window.innerHeight-20;
var svgWidth = 900;
const numberOfFeatures = 5;
var projection;
var objectData = [];
var urls = [];


//source : © GeoBasis-DE / BKG 2013 (Data changed) - visualize the map by a geojson file
//load data and set in the D3 js interface
d3.json('/Json_data/landkreise_simplify200.geojson').then(function(ger) {

    projection = d3.geoMercator()
        .center([10.5,53.2]) //long & lat of center of the card
        .scale([4700])
        .rotate([0,0,0]);

    geoGenerator = d3.geoPath().projection(projection);

    var svg = d3.select('svg')
    .attr('width', svgWidth)
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
        .translateExtent([[0,0], [width -1100,height]]) //sets the border of the map

    function handleZoom(e) {
        const {transform} = e
        d3.select("g")
        .attr("transform", transform)
    }

    d3.select("svg")
        .call(zoom);

    var circle = d3.select("g").selectAll('circle')
    setCircles(circle, ger)
    
    var line = d3.select("g").selectAll('line')
    setAxes(line,ger,numberOfFeatures)

    var _path = d3.select("g").selectAll('paths')
    
    function wait(ms) {
        var start = Date.now(),
        now = start;
        while(now - start < ms) {
            now = Date.now();
        }
    }
    
    console.log("url", urls.length)
    var requests = urls.map(url => fetch(url));

    for(var i = 0; i < urls.length; i++) {
        requests[i] = fetch(urls[i])
        wait(15) //wait synchron to avoid Error by loading the api data
    }

    //Asynchron fetching of data. In case of success the weather data takes around 3 seconds to display the data
    Promise.all(requests).then(responses => Promise.all(responses.map(r => r.json())))
        .then(function(weatherData) {
            //console.log(weatherData)
            setPath(_path,ger,weatherData,objectData,numberOfFeatures)
        })
    
});