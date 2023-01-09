// variables
var width = window.innerWidth /2;
var height = window.innerHeight;
const numberOfFeatures = 5
const glyphRadius = 10
var projection
var urls = []
var ctx
var gainNode
var source
var date

//source : © GeoBasis-DE / BKG 2013 (Data changed) - visualize the map by a geojson file - http://opendatalab.de/projects/geojson-utilities/

d3.json('/Json_data/landkreise_simplify200.geojson').then(function(ger) {
    // create instance of Audiocontext -> use in class audiocontext
    ctx = new AudioContext
    startGlyphModelVisualization()
    startTimeDomainDiagram()

    date = new Date()

    projection = d3.geoMercator()
        .center([10.27055,53.3])
        .scale([height*4.5]) 
        .rotate([0,0,0])
    geoGenerator = d3.geoPath().projection(projection)

    var svg = d3.select(document.getElementById("data_vis"))
    .attr('width', width) 
    .attr('height', height)
    .style('background-color','#d7d7d7')

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
    
  
    var requests = [];
    async function fetchData(url) {
        const response = await fetch(url)
        return response
    }

    // Calling that async function
    for(var i = 0; i < urls.length;i++) {
        requests[i] = fetchData(urls[i])
    }
    
    //Asynchron fetching of data. In case of success the App takes around 3 seconds to display the data
    Promise.all(requests).then(responses => Promise.all(responses.map(r => r.json())))
        .then(function(weatherData) {
            var districtDict = reduceGlyphs(ger,weatherData) // reduce glyph overlapping
            setAxes(line,districtDict,numberOfFeatures) 
            setPath(path,districtDict,numberOfFeatures)
            setCircles(circle, districtDict)
        })
        .catch(error => {
            location.reload() // catch API requests error by reloading page !
        })

    function reduceGlyphs(ger,weatherData) {
        
        function calcMedian(arr1, arr2) {
            var median = []
            for(var i = 0; i < arr1.length;i++) {
                median[i] = (arr1[i] + arr2[i])/2
            }
            return median
        }

        var centerArr = []
        var districtDict = []
        for(var i = 0; i < ger.features.length; i++) {
            var center = geoGenerator.centroid(ger.features[i].geometry)
            if(i == 0) {
                centerArr.push(center)
                districtDict.push({features : ger.features[i], weatherData : weatherData[i], overlappingDistricts : []})
            } else {
                var posFree = true
                for(var j = 0; j < centerArr.length; j++) {
                    if ((Math.abs(center[0] - centerArr[j][0])**2 +(Math.abs(center[1] - centerArr[j][1])**2) < ((1.8*glyphRadius)**2))) {
                        posFree = false
                        districtDict[j].weatherData.daily.rain_sum = calcMedian(weatherData[i].daily.rain_sum, districtDict[j].weatherData.daily.rain_sum)
                        districtDict[j].weatherData.daily.snowfall_sum = calcMedian(weatherData[i].daily.snowfall_sum, 
                                                                        districtDict[j].weatherData.daily.snowfall_sum)
                        districtDict[j].weatherData.daily.windspeed_10m_max = calcMedian(weatherData[i].daily.windspeed_10m_max, 
                                                                        districtDict[j].weatherData.daily.windspeed_10m_max)
                        districtDict[j].weatherData.hourly.relativehumidity_2m = calcMedian(weatherData[i].hourly.relativehumidity_2m, 
                                                                        districtDict[j].weatherData.hourly.relativehumidity_2m)
                        districtDict[j].weatherData.hourly.temperature_2m = calcMedian(weatherData[i].hourly.temperature_2m, 
                                                                        districtDict[j].weatherData.hourly.temperature_2m)
                        districtDict[j].overlappingDistricts.push(ger.features[i])
                        break
                    }
                }
                if (posFree) {
                    districtDict.push({features : ger.features[i], weatherData : weatherData[i], overlappingDistricts : []})
                    centerArr.push(center)
                }
            }
        }
        return districtDict
    }
})
