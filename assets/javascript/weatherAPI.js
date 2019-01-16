function searchWeatherInArea(lat, long, aCallback) {
  const CORSFix = "https://cors-anywhere.herokuapp.com/";


  // Querying the weather api for the selected city 
  var apiKey = "94aaecbfef6d8d2885bebd3b1512da6f";
  var exclude = "?exclude=minutely,alerts,flags";
  var unit = "?units=si";
  // var url = "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + exclude + unit;
  let url = `https://api.darksky.net/forecast/${apiKey}/${lat},${long}${exclude}${unit}`;

  //get darksky api data
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function (weatherData) {
      let dailyWeather = [];
      let dayWeather = {};
      for (let i in weatherData.daily.data) {

        dayWeather.day = weatherData.daily.data[i].time;
        dayWeather.timeZone = weatherData.timezone;
        dayWeather.humidity = weatherData.daily.data[i].humidity;
        dayWeather.chanceOfRain = weatherData.daily.data[i].precipProbability;
        dayWeather.wind = weatherData.daily.data[i].windSpeed;
        dayWeather.summary = weatherData.daily.data[i].summary;
        dayWeather.icon = weatherData.daily.data[i].icon;
        dayWeather.lowTemp = weatherData.daily.data[i].temperatureLow;
        dayWeather.highTemp = weatherData.daily.data[i].temperatureHigh;

        dailyWeather.push(dayWeather)
    }

      aCallback(dayWeather);
    }
  });
}

function getWeatherAPI(lat, long) {

  searchWeatherInArea(lat, long, testGetWeatherCallback);

}


