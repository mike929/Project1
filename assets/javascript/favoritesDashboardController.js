/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */
let favoritePlaces = []; // array of objects for all the favorite cities
let dailyWeather = []; // array of objects for all the current daily weather

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

function selectedDaysWeatherRender(dayWeatherObject) {
    $("#selectedDay").text(dayWeatherObject.day);

    $(`#weatherDataDay`).empty();
    let newRow;

    newRow = $(`<tr data-day="${dayWeatherObject.day}">`).append(
        $("<td>").text(`${dayWeatherObject.currentTemp}`),
        $("<td>").text(`${dayWeatherObject.lowTemp}`),
        $("<td>").text(`${dayWeatherObject.highTemp}`),
        $("<td>").text(`${dayWeatherObject.humidity}`),
        $("<td>").text(`${dayWeatherObject.wind}`),
        $("<td>").text(`${dayWeatherObject.summary}`)
    );
    $(`#weatherDataDay`).append(newRow);

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

function currentFavoriteHandler(key) {
    favoriteGet(key, function (favoriteFB) {
        console.log(favoriteFB);

        // do not try to do anything if it wasnt found
        if (favoriteFB != null) {
            // render the name in the text field so you know
            $("#dataPull").val(favoriteFB.name);

            // get lat long from Justins API
            // hardcode for now
            let geoLocation = {};
            geoLocation.lat = favoriteFB.lat;
            geoLocation.lng = favoriteFB.lng;

            let currentWeather = {};
            let dailyWeather = [];

            let url = `https://api.darksky.net/forecast/${PAUL_DARKSKY_APIKEY}/${geoLocation.lat},${geoLocation.lng}`;

            httpGet(url, function (weatherData) {
                console.log(weatherData);

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

                //Render Weekly
                weatherDailyRender(dailyWeather);

            }, errorRender);
            // Call places api
            // getPlaceInfo(favoriteFB);
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
        selectedDayWeather.currentTemp = dailyWeather[key].currentTemp;
        selectedDayWeather.lowTemp = dailyWeather[key].lowTemp;
        selectedDayWeather.highTemp = dailyWeather[key].highTemp;
        selectedDayWeather.humidity = dailyWeather[key].humidity;
        selectedDayWeather.wind = dailyWeather[key].wind;
        selectedDayWeather.summary = dailyWeather[key].summary;

        selectedDaysWeatherRender(selectedDayWeather);
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