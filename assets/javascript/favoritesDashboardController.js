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

        newRow = $(`<a class="dropdown-item" id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}" href="#">${favoritePlace.name}</a>`);
        // Append the new row to the table
        $("#favorites-dropdown").append(newRow);
    }
}

// Wait for doc to be ready
$(document).ready(function () {

    // Select a row/favorite 
    $(document.body).on("click", "#favorites-dropdown", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        // get the one clicked from array in memory
        let favoritePlace = arrayItemGet(index);
        console.log(favoritePlace);

        // Show the one clicked - get it from FB
        favoriteGet(key, function (favoriteFB) {
            console.log(favoriteFB);
        });

        // Show the weather, places, map for this favorite
        // Go to the dashboard with the place selected

    });


    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGetByName(function (favs) {
        favoritePlaces = favs; // copy the array into the global var for this context

        // render fav list
        favoritesDropdwnRender(favoritePlaces);
    });

}); // (document).ready