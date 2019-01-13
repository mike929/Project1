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
        var icon = weatherData.currently.temperature;
        //weather description
        var description = weatherData.currently.summary;
        //change background image
        //temperature
        var temperature = weatherData.currently.temperature;
        // Printing the entire object to console

        // Constructing HTML containing all the weather data 
        //   var cityName = $("<h1>").text(response.name);
        //   var weatherURL = $("<a>").attr("href", response.url).append(cityName);
        //   var trackerCount = $("<h2>").text(response.tracker_count + " tracking the various weather patterns.");

        $("#weatherData").empty();
        $("#weatherData").html(`icon: ${icon}, description: ${description}, temperature: ${temperature}`); 
        // format all the HTML inside this div
      }
    });
  }
    

  // Event handler for user clicking the select-weather button.
  $("#select-city").on("click", function(event) {
    // Preventing the button from trying to submit the form.
    event.preventDefault();
    // Storing the weather data.
    var inputWeather = $("#city-input");

    // Running the searchWeatherInArea function;
    searchWeatherInArea(33.7, 84.3);

  });

  function getWeather(lat, long){

    searchWeatherInArea(lat, long);

  }


