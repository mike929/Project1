function searchWeatherInArea(lat, long) {

    // Querying the weather api for the selected city 
     var apiKey = "94aaecbfef6d8d2885bebd3b1512da6f";
     var exclude = "?exclude=minutely,alerts,flags";
     var unit = "?units=si";
     var url = "https://api.darksky.net/forecast/" + apiKey + "/" + lat + "," + long + exclude + unit;

    //get darksky api data
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function (weatherData) { 
        console.log(weatherData);

        //icon information 
        var icon = weatherData.daily.temperature;
        //weather description
        var description = weatherData.daily.summary;
        //change background image
        //temperature
        var temperature = weatherData.daily.temperature;
        // Printing the entire object to console

        // Constructing HTML containing all the weather data 
        //   var cityName = $("<h1>").text(response.name);
        //   var weatherURL = $("<a>").attr("href", response.url).append(cityName);
        //   var trackerCount = $("<h2>").text(response.tracker_count + " tracking the various weather patterns.");

        $("#weatherData").empty();
        $("#weatherData").html(`icon: ${icon}, description: ${description}, temperature: ${temperature}`); 
        // format all the HTML inside this div
        $(weatherData)
      }
    });
  }
    

  // Event handler for user clicking the select-weather button.
  $("#select-city").on("click", function(event) {
    // Preventing the button from trying to submit the form.
    event.preventDefault();
    // Storing the weather data.
    var inputWeather = $("#city-input")


    // Running the searchWeatherInArea function;
    searchWeatherInArea(33.7, 84.3);

  });

  function getWeather(lat, long){

    searchWeatherInArea(lat, long);

  }

   // Array of daily weather classes
   const dailyWeatherClass = [{
    day: 1, 
    humidity: 0.85,  // %
    chanceOfRain: 0.92, //%
    wind: 5.14,
    summary: "Rain today through Thursday, with high temperatures rising to 61°F on Monday.",
    icon: "rain",
    lowTemp: "53.25",
    highTemp: "53.12",

    day: 2, 
    humidity: 0.9,  // %
    chanceOfRain: 0.93, //%
    wind: 18.22,
    summary: "Breezy throughout the day and rain starting in the afternoon.",
    icon: "rain",
    lowTemp: "54.31",
    highTemp: "58.39",

    day: 3, 
    humidity: 0.86,  // %
    chanceOfRain: 0.97, //%
    wind: 14.3,
    summary: "Rain and breezy until afternoon.",
    icon: "rain",
    lowTemp: "50.88",
    highTemp: "54.8",

    day: 4, 
    humidity: 0.79,  // %
    chanceOfRain: 0.22, //%
    wind: 0.44,
    summary: "Mostly cloudy throughout the day.",
    icon: "partly-cloudy-day",
    lowTemp: "53.52",
    highTemp: "57.07",

    day: 5, 
    humidity: 0.79,  // %
    chanceOfRain: 0.22, //%
    wind: 3.76,
    summary: "Overcast throughout the day.",
    icon: "cloudy",
    lowTemp: "53.95",
    highTemp: "60.07",

    day: 6, 
    humidity: 0.81,  // %
    chanceOfRain: 0.49, //%
    wind: 5.29,
    summary: "Mostly cloudy until evening.",
    icon: "partly-cloudy-day",
    lowTemp: "49.35",
    highTemp: "56.26",

    day: 7, 
    humidity: 0.81,  // %
    chanceOfRain: 0.49, //%
    wind: 5.29,
    summary: "Partly cloudy starting in the afternoon, continuing until evening.",
    icon: "partly-cloudy-day",
    lowTemp: "48.03",
    highTemp: "60.53",
}];


