/*
Glyph parameter :
(1)
    Hourly : temperature - current time
    Extreme Temperatures in Germany ever :
    Extreme Maximum : 40,3 °C  / Extreme Minimum : -45,9 °C 
    -> Scaling from -15 to 35 < - > (average annnual temperature (2021) = approx. 9,3 °C)
(2)
    Daily : (km/h) wind speed - maximum speed 10 meter above ground (can be changed into hourly)
    -> Scaling from 0 to 30 kmh (each data above 100 kmh belongs to 100kmh)  (average approx. 15km/h)
(3)
    (The amount of rainfall is indicated in liters per square meter (l/m2), which exactly corresponds to millimeters of precipitation (mm)) (2021 - 801 mm in Germany)
    Daily :	(mm) Sum of daily rain
    -> Scaling from 0 to 10 mm (each data above 10 mm belongs to max. 10 mm)
(4)
    Daily : (cm) sum of daily snow fall
    -> Scaling from 0 to 20 cm (each data above 20 cm belongs to max. 20 cm)
(5)
    Relative humidity is choosen hourly - current time
    -> Scaling from 60 % to 100 %  (each data below 60 % belongs to min) 
*/

var c =0;
// The average of each unit should represent the middle of each glypgh-axes / feature
// Example average of yearly precipitation in Germany from 2012 - 2021 : approx .: 740 mm per year -> average rain per day is 2,03 mm.
// Thus maxRainFall = 4.1 -> Every rainfall sum above 4.1 mm belongs to max 4.1 mm

const minTemperature = -15; // °C
const maxTemperature = 35; // °C
const maxWindSpeed = 30; // km/h
const maxRainFall = 4.06; //mm
const maxSnowFall = 5; //cm
const minRelativeHumidity = 60; //%

function scaleParameter(minDomain,maxDomain,value) {
    run2pixels = d3.scaleLinear()
        .domain([minDomain, maxDomain]) // weather data border values
        .range([0, glyphRadius]) // unit: glyph radius length
    return run2pixels(value)
}

function glyphsWeatherDataInterface(districtWeatherData) {

    var glyphData = []
    //console.log(districtWeatherData)
    //1. paramter temperature:
    var tempValue = districtWeatherData.hourly.temperature_2m[0]
    tempValue = (tempValue > maxTemperature) ? (maxTemperature) : ((tempValue < minTemperature) ? (minTemperature) : (tempValue))
    glyphData[0] = scaleParameter(minTemperature,maxTemperature,tempValue)

    //2. parameter wind speed:
    var windSpeed = districtWeatherData.daily.windspeed_10m_max[0]
    windSpeed = (windSpeed > maxWindSpeed) ? (maxWindSpeed) : (windSpeed)
    glyphData[1] = scaleParameter(0,maxWindSpeed,windSpeed)

    //3. parameter rainfall:
    var rainfall = districtWeatherData.daily.rain_sum[0]
    rainfall = (rainfall > maxRainFall) ? (maxRainFall) : (rainfall)
    glyphData[2] = scaleParameter(0,maxRainFall,rainfall)

    //4. parameter snowfall:
    var snowfall = districtWeatherData.daily.snowfall_sum[0]
    snowfall = (snowfall > maxSnowFall) ? (maxSnowFall) : (snowfall)
    glyphData[3] = scaleParameter(0,maxSnowFall,snowfall)

    //5. paramter temperature:
    var relativehumidity = districtWeatherData.hourly.relativehumidity_2m[0]
    relativehumidity = (relativehumidity < minRelativeHumidity) ? (minRelativeHumidity) : (relativehumidity)
    glyphData[4] = scaleParameter(minRelativeHumidity,100,relativehumidity)
    return glyphData
}