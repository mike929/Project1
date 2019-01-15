/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */
let favoritePlaces = []; // array of objects for all the favorite cities

// render the HTML from the the array into the table
function favoritesDropdwnRender(favorites) {

    $("#favorites-dropdown").empty();
    let newRow;

    for (let i in favorites) {
        let favoritePlace = favorites[i];

        //         <select>
        //    <option value='1'>Option1</option>
        //    <option value='2'>Option2</option>
        //    <option value='3'>Option3</option>
        //    <option value='4'>Option4</option>
        //    <option value='5'>Option5</option>
        // </select>

        newRow = $(`<li class="dropdown-item" id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">${favoritePlace.name}</li>`);

        // Append the new row to the table
        $("#favorites-dropdown").append(newRow);
    }
}

function currentFavoriteHandler(key) {
    favoriteGet(key, function (favoriteFB) {
        console.log(favoriteFB);

        // do not try to do anything if it wasnt found
        if (favoriteFB.name != undefined) {
            // render the name in the text field so you know
            $("#dataPull").val(favoriteFB.name);

            // get lat long from Justins API
            // hardcode for now
            let geoLocation = {};
            geoLocation.lat = 33.787549;
            geoLocation.long = -84.314085;

            // geoLocation = getLatLong(favoriteFB.city);

            // Call weatherAPI with lat long
            getWeather(geoLocation.lat, geoLocation.long);

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