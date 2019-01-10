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
    let newRow;

    for (let i in favorites) {
        let favoriteObj = favorites[i];

        if (favoriteObj.editMode) {
            newRow = $(`<tr id="${favoriteObj.key}" data-key="${favoriteObj.key}" data-index="${i}">`).append(
                $("<td>").html(`<input id="${favoriteObj.key}-name" type="text" value="${favoriteObj.name}"></input>`),
                $("<td>").html(`<input id="${favoriteObj.key}-address" type="text" value="${favoriteObj.address}"></input>`),
                $("<td>").html(`<input id="${favoriteObj.key}-city" type="text" value="${favoriteObj.city}"></input>`),
                $("<td>").html(`<input id="${favoriteObj.key}-state" type="text" value="${favoriteObj.state}"></input>`),
                $("<td>").html(`<input id="${favoriteObj.key}-zipCode" type="text" value="${favoriteObj.zipCode}"></input>`),
                $("<td>").html(`<button class="delete" data-key="${favoriteObj.key}" data-index="${i}">Delete</button>`),
                $("<td>").html(`<button class="update" data-key="${favoriteObj.key}" data-index="${i}">Update</button><button class="cancel" data-key="${favoriteObj.key}" data-index="${i}">Cancel</button>`)
            );
        } else {
            newRow = $(`<tr id="${favoriteObj.key}" data-key="${favoriteObj.key}" data-index="${i}"">`).append(
                $("<td>").text(`${favoriteObj.name}`),
                $("<td>").text(`${favoriteObj.address}`),
                $("<td>").text(`${favoriteObj.city}`),
                $("<td>").text(`${favoriteObj.state}`),
                $("<td>").text(`${favoriteObj.zipCode}`),
                $("<td>").html(`<button class="delete" data-key="${favoriteObj.key}" data-index="${i}">Delete</button>`),
                $("<td>").html(`<button class="edit" data-key="${favoriteObj.key}" data-index="${i}">Edit</button>`)
            );
        }
        // Append the new row to the table
        $("#favorites-table-data").append(newRow);
    }
}

// change one items update mode 
// when hitting 'edit' it goes into update mode
// after hitting 'update' or 'cancel' it goes into non-update mode
function itemUpdateEditMode(index, favorites, editMode) {
    favorites[index].editMode = editMode;

    favoritesRender(favorites);
}

// remove a favorite from the array based on key
function favoriteRemoveFromArray(favorites, index) {
    let removed = favorites.splice(index, 1);
}

// Get item firebase DB
function favoriteGet(key, aCallback) {
    favoritesRef.child(key).once('value', function (snap) {
        aCallback(snap.val());
    });
}


// Add to firebase DB
function favoriteAdd(favoriteObj) {
    // Add object to firebase to the database
    favoritesRef.push(favoriteObj);
}

// Update item firebase DB
function favoriteUpdate(key, favoriteObj) {
    // Add object to firebase to the database
    let favoriteRef = favoritesRef.child(key);

    favoriteRef.set(favoriteObj);
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
            name: $("#name").val().trim(),
            address: $("#address").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zipCode: $("#zipCode").val(),
        };

        // Store It
        favoriteAdd(favoriteObj);

        // Clear text-boxes
        $("#name").val("");
        $("#address").val("");
        $("#city").val("");
        $("#state").val("");
        $("#zipCode").val("");
    });

    // Select a row/favorite 
    $(document.body).on("click", "#favorites-table-data tr", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        // get the one clicked from array in memory
        let favorite = favorites[index];
        console.log(favorite);

        // Show the one clicked - get it from FB
        favoriteGet(key, function (favoriteFB) {
            console.log(favoriteFB);
        });

        // Show the weather, places, map for this favorite
        // Go to the dashboard with the place selected

    });

    // Delete 
    $(document.body).on("click", ".delete", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        // Delete  from firebase
        favoriteDelete(key);

        // Remove from the memory datastore array 
        favoriteRemoveFromArray(favorites, index);

        // re-render fav list
        favoritesRender(favorites);

    });

    // Edit a row 
    $(document.body).on("click", ".edit", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        itemUpdateEditMode(index, favorites, true);
    });

    // Cancel edittin a row 
    $(document.body).on("click", ".cancel", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        itemUpdateEditMode(index, favorites, false);
    });

    // Update 
    $(document.body).on("click", ".update", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        let favoriteObj = {
            name: $(`#${key}-name`).val().trim(),
            address: $(`#${key}-address`).val().trim(),
            city: $(`#${key}-city`).val().trim(),
            state: $(`#${key}-state`).val().trim(),
            zipCode: $(`#${key}-zipCode`).val(),
        };
        favoriteObj.key = key;
        favorites[index] = favoriteObj;

        // Update in firebase
        favoriteUpdate(key, favoriteObj);

        // change display to not editting
        itemUpdateEditMode(index, favorites, false);
    });

    // Each time a favorite is added to DB, add it to the list
    favoritesRef.on("child_added", function (snap) {
        let favoriteObj = snap.val();
        favoriteObj.key = snap.key;

        // Add to the memory datastore array 
        favoriteObj.editMode = false; // Tells whether this should be renderred in edit mode
        favorites.push(favoriteObj);

        // re-render fav list
        favoritesRender(favorites);
    });

}); // (document).ready