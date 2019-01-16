/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */
let favoritePlaces = []; // array of objects for all the favorite cities

// handle errors when retrieving from AJAX
function errorRender(err) {
    console.log(`Error: ${err.statusText}`);
    alert(`Error: ${err.statusText}`);

    $("#errorMessage").html(`${err.statusText}`);
}

// render the HTML from the the array into the table
function favoritesRender(favorites) {

    $("#favorites-table-data").empty();
    let newRow;

    for (let i in favorites) {
        let favoritePlace = favorites[i];

        if (favoritePlace.editMode) {
            newRow = $(`<tr id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">`).append(
                $("<td>").html(`<button class="choose-favorite" data-key="${favoritePlace.key}" data-index="${i}">Choose</button>`),
                $("<td>").html(`<input id="${favoritePlace.key}-name" type="text" value="${favoritePlace.name}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-address" type="text" value="${favoritePlace.address}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-city" type="text" value="${favoritePlace.city}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-state" type="text" value="${favoritePlace.state}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-zipCode" type="text" value="${favoritePlace.zipCode}"></input>`),
                $("<td>").html(`<button class="delete" data-key="${favoritePlace.key}" data-index="${i}">Delete</button>`),
                $("<td>").html(`<button class="update" data-key="${favoritePlace.key}" data-index="${i}">Update</button><button class="cancel" data-key="${favoritePlace.key}" data-index="${i}">Cancel</button>`)
            );
        } else {
            newRow = $(`<tr id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}">`).append(
                $("<td>").html(`<button class="choose-favorite" data-key="${favoritePlace.key}" data-index="${i}">Choose</button>`),
                $("<td>").text(`${favoritePlace.name}`),
                $("<td>").text(`${favoritePlace.address}`),
                $("<td>").text(`${favoritePlace.city}`),
                $("<td>").text(`${favoritePlace.state}`),
                $("<td>").text(`${favoritePlace.zipCode}`),
                $("<td>").html(`<button class="delete" data-key="${favoritePlace.key}" data-index="${i}">Delete</button>`),
                $("<td>").html(`<button class="edit" data-key="${favoritePlace.key}" data-index="${i}">Edit</button>`)
            );
        }
        // Append the new row to the table
        $("#favorites-table-data").append(newRow);
    }
}

// Wait for doc to be ready
$(document).ready(function () {

    // Add a new favorite
    $("#add-favorite-btn").on("click", function (event) {
        event.preventDefault();
        // Validate user Input

        // Grab user input
        let favoritePlace = {
            name: $("#name").val().trim(),
            address: $("#address").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zipCode: $("#zipCode").val(),
        };

        // get geocode
        // Store It
        getLatLongForPlace(favoritePlace, function (newDataForAddress) {

            favoritePlace.lat = newDataForAddress.lat;
            favoritePlace.lng = newDataForAddress.lng;

            favoriteAdd(favoritePlace);

        }, errorRender);


        // Clear text-boxes
        $("#name").val("");
        $("#address").val("");
        $("#city").val("");
        $("#state").val("");
        $("#zipCode").val("");
    });

    // Close and go back to favorites page
    $(document.body).on("click", ".button-close-page", function () {
        // switch page to dashboard
        window.location.href = "index.html";
    });

    // Select a row/favorite 
    $(document.body).on("click", ".choose-favorite", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        // Save the key to local storage for use on home page to pass back to dashboard
        saveKeyToLocalStorage(key);

        // * The following lines ar e just for testing
        // * ==============================================
        // get the one clicked from array in memory
        let favoritePlace = arrayItemGet(index);
        console.log(favoritePlace);

        // Show the one clicked - get it from FB
        favoriteGet(key, function (favoriteFB) {
            console.log(favoriteFB);
        });

        // Show the weather, places, map for this favorite
        // Go to the dashboard with the place selected

        // * END TEST CODE - this is where real app code starts 
        // * ==============================================

        // switch page to dashboard
        window.location.href = "index.html";

    });

    // Delete 
    $(document.body).on("click", ".delete", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        // Delete  from firebase
        favoriteDelete(key);

        favoritesGet(function (favoritePlaces) {
            // re-render fav list
            favoritesRender(favoritePlaces);
        });
    });

    // Edit a row 
    $(document.body).on("click", ".edit", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        favoritePlaces[index].editMode = true;
        favoritesRender(favoritePlaces);
    });

    // Cancel editting a row 
    $(document.body).on("click", ".cancel", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        favoritePlaces[index].editMode = false;
        favoritesRender(favoritePlaces);
    });

    // Update 
    $(document.body).on("click", ".update", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        let favoritePlace = {
            name: $(`#${key}-name`).val().trim(),
            address: $(`#${key}-address`).val().trim(),
            city: $(`#${key}-city`).val().trim(),
            state: $(`#${key}-state`).val().trim(),
            zipCode: $(`#${key}-zipCode`).val(),
        };
        favoritePlace.key = key;
        favoritePlace.editMode = false;

        getLatLongForPlace(favoritePlace, function (newDataForAddress) {

            favoritePlace.lat = newDataForAddress.lat;
            favoritePlace.lng = newDataForAddress.lng;

            favoritePlaces[index] = favoritePlace;

            // Update in firebase
            favoriteUpdate(key, favoritePlace);
    
            // re-render
            favoritesRender(favoritePlaces);
                
        }, errCallback);

    });

    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGet(function (favs) {
        favoritePlaces = favs; // copy the array into the global var for this context

        // render fav list
        favoritesRender(favoritePlaces);
    });

}); // (document).ready