//function to display weather data for each coordinates (Open Meteo - Free Weather API)
//catches the data for representing the data

function fetchWeatherData(lat,long) {
    
    var url = 'https://api.open-meteo.com/v1/forecast?'
                + 'latitude=' + lat
                + '&longitude=' + long
                + '&hourly=temperature_2m,relativehumidity_2m'
                + '&daily=snowfall_sum,rain_sum,windspeed_10m_max,weathercode'  //weathercode WMO code - The most severe weather condition on a given day
                + '&timezone=GMT'
    return url
}




