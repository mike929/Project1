/* **********************************************************************************
 * Favorite Cities - 
 * This module allows you to add, delete, modify and list favorite cities for 
 * our weather dashboard app.
 * These cities are used to determine the location of wjere you want to get the
 * information.  The idea is you are travelling to one of these cities
 * and you want to know the weather and things to do when you get there like
 * good places to eat, bands that are playing, hot spots etc.
 ********************************************************************************** */

// Use strict to keep things sane and not crap code
"use strict";
/*global $:false, jQuery:false */
/*global document:false */
/*global console:false */
/*global alert:false */
/*global firebase:false */

// Firebase

// Initialize Firebase
var config = {
    apiKey: PAUL_FBWEATHER_APIKEY,
    authDomain: "weatherdashboard-47786.firebaseapp.com",
    databaseURL: "https://weatherdashboard-47786.firebaseio.com",
    projectId: "weatherdashboard-47786",
    storageBucket: "",
    messagingSenderId: "587470309487"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
let database = firebase.database();

// Reference where all favorites  are stored
let favoritesRef = database.ref("/favorite_cities");
let favorites = []; // array of objects for all the favorite cities

// Helper functiion for AJAX calls
function httpGet(requestURL, aCallback) {
    $.ajax({
        url: requestURL,
        method: 'GET',
        dataType: 'JSON',
        success: function (result) {
            console.log(result);
            aCallback(result.data);
        },
        error: function (err) {
            console.log('error:' + err);
            errorRender(err);
        }
    });
}

// handle errors when retrieving from AJAX
function errorRender(err) {
    console.log(`Error: ${err.statusText}`);
    alert(`Error: ${err.statusText}`);

    $("#errorMessage").html(`${err.statusText}`);
}

// render the HTML for the array
function favoritesRender(favorites) {

    $("#favorites-table-data").empty();

    for (let i in favorites) {
        let favoriteObj = favorites[i];

        let newRow = $(`<tr id="${favoriteObj.ref}" data-key="${favoriteObj.key}">`).append(
            $("<td>").text(favoriteObj.city),
            $("<td>").text(favoriteObj.state),
            $("<td>").text(favoriteObj.zipCode),
            $("<td>").text(favoriteObj.apiKeyWeather),
            $("<td>").text(favoriteObj.apiKeyPlaces),
            $("<td>").html(`<button class="delete" data-key="${favoriteObj.key}">Delete</button>`),
            $("<td>").html(`<button class="update" data-key="${favoriteObj.key}">Edit</button>`)
        );

        // Append the new row to the table
        $("#favorites-table-data").append(newRow);
    }
}

// remove a favorite from the array based on key
function favoriteRemoveFromArray(favorites, key) {
    for (let i in favorites) {
        if (favorites[i].key === key) {
            let removed = favorites.splice(i, 1);
        }
    }
}

// Add to firebase DB
function favoriteAdd(favoriteObj) {
    // Add object to firebase to the database
    favoritesRef.push(favoriteObj);
}

// Delete from firebase DB
function favoriteDelete(key) {
    // Delete object from firebase
    let favoriteRef = favoritesRef.child(key);
    favoriteRef.remove();
}

// Wait for doc to be ready
$(document).ready(function () {

    // Add a new favorite
    $("#add-favorite-btn").on("click", function (event) {
        event.preventDefault();

        // Grab user input

        // Validate user Input

        let favoriteObj = {
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zipCode: $("#zipCode").val(),
            apiKeyWeather: $("#apiKeyWeather").val().trim(),
            apiKeyPlaces: $("#apiKeyPlaces").val().trim()
        };

        // Store It
        favoriteAdd(favoriteObj);

        // Clear text-boxes
        $("#city").val("");
        $("#state").val("");
        $("#zipCode").val("");
        $("#apiKeyWeather").val("");
        $("#apiKeyPlaces").val("");
    });

    // Delete 
    $(document.body).on("click", ".delete", function () {
        var key = $(this).attr("data-key");

        // Delete  from firebase
        favoriteDelete(key);

        // Remove from the memory datastore array 
        favoriteRemoveFromArray(favorites, key);

        // re-render fav list
        favoritesRender(favorites);

    });

    // Each time a favorite is added to DB, add it to the list
    favoritesRef.on("child_added", function (snap) {
        let favoriteObj = snap.val();
        favoriteObj.key = snap.key;

        // Add to the memory datastore array 
        favorites.push(favoriteObj);

        // re-render fav list
        favoritesRender(favorites);
    });

}); // (document).ready