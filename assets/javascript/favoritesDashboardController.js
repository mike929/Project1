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

// Render the card deck for each day - across the top
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
        var skycons = new Skycons({"color": "red"});
        skycons.add("icon", Skycons.PARTLY_CLOUDY_DAY);
        skycons.play();
        $(`#weatherDataWeek`).append(newDay);
        
    }
}

// Right now this renders the next 7 days
// but it should probably get a feature to pass in the next 12 hours
function weatherTableRender(weatherDataRows) {
    // Note Table ID is: $("#daysWeather-table") in case I need to overwrite whole table

    $("#selectedDateRangeTable").html(`Weather For Next 7 Days
    <small class="float-right">
    <button type="button" class="swap">
        Swap
    </button>`);

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

// Render the current weather in th weather card
// This is use when no days are selected to show the weather for
function currentWeatherRender(weatherCurrent) {

    $("#selectedDateRangeDetails").html(`Current Weather
    <small class="float-right">
    <button type="button" class="swap">
        Swap
    </button>`);

    $(`#detailedWeatherData`).empty();
    let newRow;

    // Compute Day of Weak from day in object
    let convertedDate = moment.unix(weatherCurrent.day);
    let dayOfWeek = convertedDate.format('dddd');
    convertedDate = convertedDate.format("MM-DD-YYYY");

    newRow = $(`<div data-day="${dayOfWeek}">`).append(
        $("<div>").text(`Day: ${dayOfWeek}`),
        $("<div>").text(`Temperature: ${weatherCurrent.currentTemp}`),
        $("<div>").text(`Feels Like: ${weatherCurrent.feelsLike}`),
        $("<div>").text(`Rain: ${weatherCurrent.chanceOfRain}`),
        $("<div>").text(`Humidity: ${weatherCurrent.humidity}`),
        $("<div>").text(`Wind: ${weatherCurrent.wind}`),
        $("<div>").text(`${weatherCurrent.summary}`)
    );
    $(`#detailedWeatherData`).append(newRow);
}

// show current slected days weather
function selectedDayWeatherRender(daysWeather) {

    $("#selectedDateRangeDetails").html(`Selected Days Weather
    <small class="float-right">
    <button type="button" class="swap">
        Swap
    </button>`);

    $(`#detailedWeatherData`).empty();
    let newRow;

    // Compute Day of Weak from day in object
    let convertedDate = moment.unix(daysWeather.day);
    let dayOfWeek = convertedDate.format('dddd');
    convertedDate = convertedDate.format("MM-DD");
    let lowTemp = daysWeather.lowTemp.toFixed(0);
    let highTemp = daysWeather.highTemp.toFixed(0);

    if (daysWeather.icon.indexOf('partly') >= 0) {
        caption = "Partly Cloudy";
    } else {
        caption = daysWeather.icon;
    }

    newRow = $(`<div data-day="${daysWeather.day}">`).append(
        $("<div>").text(`${dayOfWeek}`),
        $("<div>").text(`Low: ${lowTemp}`),
        $("<div>").text(`High: ${highTemp}`),
        $("<div>").text(`Rain: ${daysWeather.chanceOfRain}`),
        $("<div>").text(`Humidity: ${daysWeather.humidity}`),
        $("<div>").text(`Wind: ${daysWeather.wind}`),
        $("<div>").text(`Summary: ${daysWeather.summary}`)
    );

    $(`#detailedWeatherData`).append(newRow);
}

// manage the data when it comes back from weather - testing data returned
function testGetWeatherCallback(weatherArray) {
    console.log(weatherArray);
}

// render the HTML for the dropdown selector from the the array into the table
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
// It takes in the database key for the place and uses that
// to get the data and render it
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

            getWeatherDB(geoLocation, function (weatherNow, weatherArray) {
                dailyWeather = weatherArray.slice();
                currentWeather = weatherNow;

                // Render Weekly
                weatherDailyRender(dailyWeather);
                weatherTableRender(dailyWeather);
                currentWeatherRender(currentWeather);
            }, errorRender);

            // getWeatherAPI(geoLocation.lat, geoLocation.lng, testGetWeatherCallback);

            // Call places api
            getPlaceInfo(favoriteFB);
        }
    });
}

// Handle rendering of the cards to flip them and show fron or back
function cardFlipRender(showingFront, cardTag) {

    $(`${cardTag}`).toggleClass('is-flipped');
    if (showingFront) {
        $(`${cardTag} .back`).show();
        $(`${cardTag} .front`).hide();
        return (false);
    } else {
        $(`${cardTag} .front`).show();
        $(`${cardTag} .back`).hide();
        return (true);
    }
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

    // Select a day from the icons and display more detail for that day
    $(document.body).on("click", ".weatherDay", function () {

        var index = $(this).attr("data-index");
        var day = $(this).attr("data-day");
        var temp = $(this).attr("data-temp");

        selectedDayWeatherRender(dailyWeather[index]);
    });

    // This section handles places card rotation for front and back
    let placesShowingFront = true;
    $('#placesCard .front').show();
    $('#placesCard .back').hide();
    $(document.body).on("click", '#placesCard', function () {
        placesShowingFront = cardFlipRender(placesShowingFront, '#placesCard');
    });

    // This section handles weather card rotation for front and back
    let weatherShowingFront = true;
    $('#weatherCard .front').show();
    $('#weatherCard .back').hide();
    $(document.body).on("click", '#weatherCard', function () {
        weatherShowingFront = cardFlipRender(weatherShowingFront, '#weatherCard');
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