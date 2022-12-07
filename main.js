// variables
var width = window.innerWidth /2;
var height = window.innerHeight;
const numberOfFeatures = 5
var projection
var objectData = []
var urls = []
var glyphRadius = 12
var reducedFeatures = []
var glyphWeatherDataScaleValues = []
var ctx
var gainNode
var source = 0

console.log(window.innerWidth)
//source : © GeoBasis-DE / BKG 2013 (Data changed) - visualize the map by a geojson file
//load data and set in the D3 js interface
d3.json('/Json_data/landkreise_simplify200.geojson').then(function(ger) {
    // create instance of Audiocontext -> use in class audiocontext
    ctx = new AudioContext
    //var centerMap = projection.invert([10.125696,53.2657])
    projection = d3.geoMercator()
        //long & lat center of germany -> has to be adjusted for other screens
         .center([10.125696,53.2657])
        //map(centerMap[0],centerMap[1])
        .scale([width*4.5])
        .rotate([0,0,0])
    geoGenerator = d3.geoPath().projection(projection)

    var svg = d3.select('svg')
    .attr('width', width) //svgWidth
    .attr('height', height)
    .style('background-color','#C0C0C0')

    svg.append('g')
        .selectAll('path')  //drawing a path for each feature
        .data(ger.features)
        .enter()
        .append('path')
        .attr('d',geoGenerator)
        .attr('fill', '#58D68D')
        .attr('stroke', '#000')
        .attr('stroke-width', function(d) {
            var mapCoords = projection.invert(geoGenerator.centroid(d.geometry))
            urls.push(fetchWeatherData(mapCoords[1], mapCoords[0]))
            objectData.push(d)
            return '0.5px'
        })

    var zoom = d3.zoom()
        .on("zoom", handleZoom)
        .scaleExtent([1,20]) //Zoom size
        .translateExtent([[0,0], [width,height]]) //sets the border of the map

    function handleZoom(e) {
        const {transform} = e
        d3.select("g")
        .attr("transform", transform)
    }

    d3.select("svg")
        .call(zoom)

    var circle = d3.select("g").selectAll('circle')
    var line = d3.select("g").selectAll('line')
    var path = d3.select("g").selectAll('paths')

    function wait(ms) {
        var start = Date.now(),
        now = start
        while(now - start < ms) {
            now = Date.now()
        }
    }

    var requests = urls.map(url => fetch(url))
    for(var i = 0; i < urls.length; i++) {
        requests[i] = fetch(urls[i])
        wait(20) //time delay is synchron in order avoiding Error by loading the api data
    }

    //Asynchron fetching of data. In case of success the weather data takes around 3 seconds to display the data
    Promise.all(requests).then(responses => Promise.all(responses.map(r => r.json())))
        .then(function(weatherData) {
            // reduce glyph overlapping !!!
            ger.features = reduceGlyphs(ger)
            setAxes(line,ger,numberOfFeatures)
            setPath(path,ger,weatherData,objectData,numberOfFeatures)
            setCircles(circle, ger)
        })
    
    function reduceGlyphs(ger) {
        
        var counter = 0
        var centerArr = []
        for(var i = 0; i < ger.features.length; i++) {
            var center = geoGenerator.centroid(ger.features[i].geometry)
            if(i == 0) {
                centerArr.push(center)
            } else { 
                var posFree = true
                for(var j = 0; j < centerArr.length; j++) {
                    if ((Math.abs(center[0] - centerArr[j][0])**2 +(Math.abs(center[1] - centerArr[j][1])**2) < (((2*glyphRadius)**2)))) {
                        posFree = false
                    }
                }
                if (posFree) {
                    reducedFeatures[counter] = ger.features[i]
                    centerArr.push(center)
                    counter += 1
                }
            }
        }
        return reducedFeatures
    }
})

// Todo -> choose new center of overlapping glyphs