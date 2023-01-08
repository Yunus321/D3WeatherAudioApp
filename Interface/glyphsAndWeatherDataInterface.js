/*
Glyph parameter :
(1)
    Hourly : temperature - current time
    Extreme Temperatures in Germany ever :
    Extreme Maximum : 41,2 °C  / Extreme Minimum : -37,8 °C between 1930 and 2022
    -> Scaling from -20 to 
(2)
    Daily : (km/h) wind speed - maximum speed 10 meter above ground
    Average max. 22,3 km/h between 1981 and 2000.
    -> Scaling from 0 to 30 kmh
(3)
    (The amount of rainfall is indicated in liters per square meter (l/m2), which exactly corresponds to millimeters of precipitation (mm)) (2021 - 801 mm in Germany)
    Daily :	(mm) average annual precipitation since 2000 is approx. 800 mm ->  approx. 2,2 mm daily. Thus max is choosen 5 mm
    -> Scaling from 0 to 5 mm
(4)
    Daily (cm) :  sum of daily snow fall
    -> Scaling from 0 to 5 cm
(5)
    Relative humidity % : current time
    -> Scaling from 70 % to 95 %  
*/

const minTemperature = -20 // °C
const maxTemperature = 41.2 // °C
const minWindSpeed = 0 // km/h
const maxWindSpeed = 30 // km/h
const minRainFall = 0 // mm
const maxRainFall = 5 //mm
const minSnowFall = 0 //cm
const maxSnowFall = 5 //cm
const minRelativeHumidity = 70 //%
const maxRelativeHumidity = 95 //%

function scaleParameter(minDomain,maxDomain,value) {

    run2pixels = d3.scaleLinear()
        .domain([minDomain, maxDomain]) // weather data border values
        .range([0, glyphRadius]) // unit: glyph radius length
    return run2pixels(value)
}

function glyphsWeatherDataInterface(districtWeatherData) {
    //get Data form the cuurent time for temperature and rel. humidity !
    var currentHour = date.getHours()
    var glyphData = []

    //1. paramter temperature:
    var tempValue = districtWeatherData.hourly.temperature_2m[currentHour]
    tempValue = (tempValue > maxTemperature) ? (maxTemperature) : ((tempValue < minTemperature) ? (minTemperature) : (tempValue))
    glyphData[0] = scaleParameter(minTemperature,maxTemperature,tempValue)

    //2. parameter wind speed:
    var windSpeed = districtWeatherData.daily.windspeed_10m_max[0] // use index 0 for the current day !
    windSpeed = (windSpeed > maxWindSpeed) ? (maxWindSpeed) : (windSpeed)
    glyphData[1] = scaleParameter(0,maxWindSpeed,windSpeed)

    //3. parameter rainfall:
    var rainfall = districtWeatherData.daily.rain_sum[0]
    rainfall = (rainfall > maxRainFall) ? (maxRainFall) : (rainfall)
    glyphData[2] = scaleParameter(0,maxRainFall,rainfall)

    //4. parameter snowfall:
    var snowfall = districtWeatherData.daily.snowfall_sum[0]
    snowfall = (snowfall > maxSnowFall) ? (maxSnowFall) : (snowfall)
    glyphData[3] = scaleParameter(minSnowFall,maxSnowFall,snowfall)

    //5. paramter rel. humidity:
    var relativehumidity = districtWeatherData.hourly.relativehumidity_2m[currentHour]
    relativehumidity = (relativehumidity > maxRelativeHumidity) ? (maxRelativeHumidity) : ((relativehumidity < minRelativeHumidity) ? (minRelativeHumidity) : (relativehumidity))
    glyphData[4] = scaleParameter(minRelativeHumidity,maxRelativeHumidity,relativehumidity)
    return glyphData
}