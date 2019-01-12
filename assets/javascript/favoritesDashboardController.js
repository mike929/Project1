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

        newRow = $(`<li class="dropdown-item" id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">${favoritePlace.name}</li>`)

        // Append the new row to the table
        $("#favorites-dropdown").append(newRow);
    }
}

// Wait for doc to be ready
$(document).ready(function () {

    // Select a row/favorite 
    $(document.body).on("click", "#favorites-dropdown li", function () {

        var key = $(this).attr("data-key");

        // Show the one clicked - get it from FB
        favoriteGet(key, function (favoriteFB) {
            console.log(favoriteFB);
            // Call weatherAPI with favoriteFB
            // getWeather(favoriteFB);

            // Call places api
            // getPlaceInfo(placeObject);

        });
    });

    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGetByName(function (favs) {
        favoritePlaces = favs; // copy the array into the global var for this context

        // render fav list
        favoritesDropdwnRender(favoritePlaces);
    });

}); // (document).ready