/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */
let favoritePlaces = []; // array of objects for all the favorite cities
let dailyWeather = []; // array of objects for all the current daily weather
let currentWeather = {}; // currentWeatherInSelectedAreas

// handle errors when retrieving from AJAX
function errorRender(err) {
    console.log(`Error: ${err.statusText}`);
    alert(`Error: ${err.statusText}`);

    $("#errorMessage").html(`${err.statusText}`);
}

/*
 * Renderring weather data for now while waiting on Kelsie
 * ====================================================================================================
 */
function doesExist(stringTpFind, insideStr) {
    // Do work
    var str = "Hello world, welcome to the universe.";
    if (insideStr.indexOf(stringTpFind) > 0) {
        return true;
    } else {
        return false;
    }
}

// Render the cards for each day
function weatherDailyRender(dailyWeather) {

    $(`#weatherDataWeek`).empty();
    let newDay;

    // need to get todays date from moments
    for (let i in dailyWeather) {

        // Compute Day of Weak from day in object
        let convertedDate = moment.unix(dailyWeather[i].day);
        let dayOfWeek = convertedDate.format('dddd');
        convertedDate = convertedDate.format("MM-DD");
        let lowTemp = dailyWeather[i].lowTemp.toFixed(0);
        let highTemp = dailyWeather[i].highTemp.toFixed(0);

        console.log(dailyWeather[i].icon);
        let caption = "Normal";

        if (dailyWeather[i].icon.indexOf('partly') >= 0) {
            caption = "Partly Cloudy";
        } else {
            caption = dailyWeather[i].icon;
        }

        newDay = $(`<div data-index="${i}" data-day="${dayOfWeek}" class="key weatherDay">`).append(
            $(`<div>`).text(convertedDate),
            $(`<kbd>`).text(dayOfWeek),
            $(`<span class="value">${lowTemp} / ${highTemp}</div>`),
            $(`<span>`).attr("id", "switch"),
            $(`<canvas width="54px" height="54px" id="icon"></canvas>`),
            $(`<div class="sound temperature">${caption}</div>`)
        );

        $(`#weatherDataWeek`).append(newDay);
    }
}

// renderr one days weather - hourly (for now do days)
function selectedDaysWeatherRender(weatherDataRows) {
    // Note Table ID is: $("#daysWeather-table") in case I need to overwrite whole table
    $("#selectedDateRange").text("Weather For Next 7 Days / Soon to be hourly");

    $(`#weatherDataDay`).empty();
    for (let i in weatherDataRows) {

        // Compute Day of Weak from day in object
        let convertedDate = moment.unix(weatherDataRows[i].day);
        let dayOfWeek = convertedDate.format('dddd');
        convertedDate = convertedDate.format("MM-DD");
        let lowTemp = weatherDataRows[i].lowTemp.toFixed(0);
        let highTemp = weatherDataRows[i].highTemp.toFixed(0);

        if (weatherDataRows[i].icon.indexOf('partly') >= 0) {
            caption = "Partly Cloudy";
        } else {
            caption = weatherDataRows[i].icon;
        }

        let newRow;

        newRow = $(`<tr data-day="${weatherDataRows[i].day}">`).append(
            $("<td>").text(`${dayOfWeek}`),
            $("<td>").text(`${lowTemp}`),
            $("<td>").text(`${highTemp}`),
            $("<td>").text(`${weatherDataRows[i].chanceOfRain}`),
            $("<td>").text(`${weatherDataRows[i].humidity}`),
            $("<td>").text(`${weatherDataRows[i].wind}`),
            $("<td>").text(`${weatherDataRows[i].summary}`)
        );
        $(`#weatherDataDay`).append(newRow);
    }
}

// 
function currentWeatherRender(weatherCurrent) {

    $(`#weatherCurrent`).empty();
    let newRow;

    newRow = $(`<div data-day="${weatherCurrent.day}">`).append(
        $("<td>").text(`${weatherCurrent.day}`),
        $("<td>").text(`${weatherCurrent.lowTemp}`),
        $("<td>").text(`${weatherCurrent.highTemp}`),
        $("<td>").text(`${weatherCurrent.chanceOfRain}`),
        $("<td>").text(`${weatherCurrent.humidity}`),
        $("<td>").text(`${weatherCurrent.wind}`),
        $("<td>").text(`${weatherCurrent.summary}`)
    );
    $(`#weatherCurrent`).append(newRow);
}

function testGetWeatherCallback(weatherArray) {
    console.log(weatherArray);
}

// render the HTML from the the array into the table
function favoritesDropdwnRender(favorites) {

    $("#favorites-dropdown").empty();
    let newRow;

    for (let i in favorites) {
        let favoritePlace = favorites[i];
        newRow = $(`<li class="dropdown-item" id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">${favoritePlace.name}</li>`);

        // Append the new row to the table
        $("#favorites-dropdown").append(newRow);

    }
}

// Handle renderring for the favoritie the user has chosen
function currentFavoriteHandler(key) {
    favoriteGet(key, function (favoriteFB) {
        console.log(favoriteFB);

        // do not try to do anything if it wasnt found
        if (favoriteFB != null) {
            // render the name in the text field so you know
            $("#dataPull").val(favoriteFB.name);

            let geoLocation = {};
            geoLocation.lat = favoriteFB.lat;
            geoLocation.lng = favoriteFB.lng;

            const exclude = "?exclude=minutely,alerts,flags";
            const unit = "?units=si";
            const CORSFix = "https://cors-anywhere.herokuapp.com/";

            let url = `${CORSFix}https://api.darksky.net/forecast/${PAUL_DARKSKY_APIKEY}/${geoLocation.lat},${geoLocation.lng}${exclude}${unit}`;

            httpGet(url, function (weatherData) {
                console.log(weatherData);

                currentWeather = {};
                currentWeather.day = weatherData.currently.time;
                currentWeather.timeZone = weatherData.timezone;
                currentWeather.currentTemp = weatherData.currently.temperature;
                currentWeather.feelsLike = weatherData.currently.apparentTemperature;
                currentWeather.humidity = weatherData.currently.humidity;
                currentWeather.chanceOfRain = weatherData.currently.precipProbability;
                currentWeather.wind = weatherData.currently.windSpeed;
                currentWeather.summary = weatherData.currently.summary;
                currentWeather.icon = weatherData.currently.icon;
                currentWeather.lowTemp = "";
                currentWeather.highTemp = "";

                dailyWeather = [];
                dailyWeather.length = 0; // prevent leaks

                for (let i = 0; i < 7; i++) {
                    let dayWeather = {};

                    dayWeather.day = weatherData.daily.data[i].time;
                    dayWeather.timeZone = weatherData.timezone;
                    dayWeather.humidity = weatherData.daily.data[i].humidity;
                    dayWeather.chanceOfRain = weatherData.daily.data[i].precipProbability;
                    dayWeather.wind = weatherData.daily.data[i].windSpeed;
                    dayWeather.summary = weatherData.daily.data[i].summary;
                    dayWeather.icon = weatherData.daily.data[i].icon;
                    dayWeather.lowTemp = weatherData.daily.data[i].temperatureLow;
                    dayWeather.highTemp = weatherData.daily.data[i].temperatureHigh;

                    dailyWeather.push(dayWeather);
                }

                // Render Weekly
                weatherDailyRender(dailyWeather);
                selectedDaysWeatherRender(dailyWeather);
            }, errorRender);

            getWeatherAPI(geoLocation.lat, geoLocation.lng, testGetWeatherCallback);

            // Call places api
            getPlaceInfo(favoriteFB);
        }
    });
}

// Wait for doc to be ready
$(document).ready(function () {

    // Select a row/favorite 
    $(document.body).on("click", "#favorites-dropdown li", function () {

        var key = $(this).attr("data-key");

        // save it for next time
        saveKeyToLocalStorage(key);

        // run the function that calls the DB and handles the result
        currentFavoriteHandler(key);
    });

    // Select a day 
    $(document.body).on("click", ".weatherDay", function () {

        var key = $(this).attr("data-index");
        var day = $(this).attr("data-day");
        var temp = $(this).attr("data-temp");

        let selectedDayWeather = {};
        selectedDayWeather.key = key;
        selectedDayWeather.day = dailyWeather[key].day;
        selectedDayWeather.lowTemp = dailyWeather[key].lowTemp;
        selectedDayWeather.highTemp = dailyWeather[key].highTemp;
        selectedDayWeather.humidity = dailyWeather[key].humidity;
        selectedDayWeather.wind = dailyWeather[key].wind;
        selectedDayWeather.summary = dailyWeather[key].summary;

        selectedDaysWeatherRender(selectedDayWeather);
    });

    let placesCard = document.querySelector('#placesCard');
    let placesShowingFront = true;
    $('#placesCard .back').hide();
    $('#placesCard .front').show();

    $(document.body).on("click", '#placesCard', function () {
        placesCard.classList.toggle('is-flipped');
        if (placesShowingFront) {
            placesShowingFront = false;
            $('#placesCard .back').show();
            $('#placesCard .front').hide();
        } else {
            placesShowingFront = true;

            $('#placesCard .front').show();
            $('#placesCard .back').hide();
        }
    });

    let weatherCard = document.querySelector('#weatherCard');
    let weatherShowingFront = true;
    $('#weatherCard .front').show();
    $('#weatherCard .back').hide();

    $(document.body).on("click", '#weatherCard', function () {
        weatherCard.classList.toggle('is-flipped');
        if (weatherShowingFront) {
            weatherShowingFront = false;
            $('#weatherCard .back').show();
            $('#weatherCard .front').hide();
        } else {
            weatherShowingFront = true;
            $('#weatherCard .front').show();
            $('#weatherCard .back').hide();
        }
    });


    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGetByName(function (favs) {
        favoritePlaces = favs; // copy the array into the global var for this context
        // render fav list
        favoritesDropdwnRender(favoritePlaces);

        // check to see if there is a value in local storage
        key = getKeyFromLocalStorage();

        if (key != undefined) {
            currentFavoriteHandler(key);
        } else {
            // if there are any favorites, populate the first on
            if (favoritePlaces.length > 0) {
                currentFavoriteHandler(favoritePlaces[0].key);
            }
        }
    });

}); // (document).ready