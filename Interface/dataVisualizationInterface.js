// interface for data visualization - called if the cursor enters a glyph


function startGlyphInformationVisualization(currentGlyphScaleValues,summedFrequencies,d,objectData,weatherData) {
    
    for(var i = 0; i < objectData.length; i++) {
        if(objectData[i] == d) { //check if the weather data belongs to the current object
            var currentGlyphWeatherData = weatherData[i]
            //isplayPathValues(currentGlyphScaleValues)

            //displayTimeDomainData(summedFrequencies)
            return
        }
    }
}
