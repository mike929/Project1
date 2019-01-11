/* **********************************************************************************
 * Favorite Places - 
 * This module allows you to add, delete, modify and list favorite cities for 
 * our weather dashboard app.
 * These cities are used to determine the location of where you want to get the
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
const PAUL_FB_APIKEY = "AIzaSyC1rPD9yqt2-9mk-T2WEwmFAc4uzYYr1UI";

// Initialize Firebase
var config = {
    apiKey: PAUL_FB_APIKEY,
    authDomain: "weatherdashboard-47786.firebaseapp.com",
    databaseURL: "https://weatherdashboard-47786.firebaseio.com",
    projectId: "weatherdashboard-47786",
    storageBucket: "",
    messagingSenderId: "587470309487"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
let database = firebase.database();

// Reference where all favorites  are stored in DB
let favoritesDBRef = database.ref("/favorite_cities");
let favorites = []; // array of objects for all the favorite cities
// Template Object/Class for what a favorite place in tge array holds
let ItemFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    key: "", // database key for update, delete or getting new from DB
    editMode: false // helper mode to tell whether user is editing this item
};
// Template Object/Class for what a favorite place in DB holds (i.e. snapshot.val())
let DBFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
};

/*
 * Model Functionlity - NO HTML Renderring belongs here - pure model
 * ====================================================================================================
 */

// Get specific item by key from firebase DB
function favoriteGet(key, aCallback) {
    favoritesDBRef.child(key).once('value', function (snap) {
        aCallback(snap.val());
    });
}

// Add to firebase DB
function favoriteAdd(favoritePlace) {
    // Add object to firebase to the database
    favoritesDBRef.push(favoritePlace);
}

// Update item firebase DB
function favoriteUpdate(key, favoritePlace) {
    // Add object to firebase to the database
    let favoriteRef = favoritesDBRef.child(key);

    favoriteRef.set(favoritePlace);
}

// Delete from firebase DB
function favoriteDelete(key) {
    // Delete object from firebase
    let favoriteRef = favoritesDBRef.child(key);
    favoriteRef.remove();
}

// Get all favortie places in any order  
function favoritesGet(aCallback) {
    let favorites = [];

    favoritesDBRef.on("value", function (snap) {
        snap.forEach(child => {
            let favorite = child.val();
            favorite.key = child.key;

            favorites.push(favorite);
        });
        aCallback(favorites);
    });
}

// get list of favorites places ordered by name
function favoritesGetByName(aCallback) {
    let favorites = [];

    favoritesDBRef.orderByChild("name").on("value", function (snap) {
        snap.forEach(child => {
            let favorite = child.val();
            favorite.key = child.key;
            favorite.editMode = false; // Tells whether this should be renderred in edit mode

            favorites.push(favorite);
        });
        aCallback(favorites);
    });
}

/*
 * In memory data managment 
 * These are the functions that manage the data stored in memory in the array
 * The database stores the persistent data.  The in memory array holds all that database data
 * plus other trasient and calculated data.  That in memory data is used by the view controller
 * to render the data on the pages.  Its a feeble attempt at MVC separation of responsibilites
 * ====================================================================================================
 */

// change one items update mode 
// when hitting 'edit' it goes into update mode
// after hitting 'update' or 'cancel' it goes into non-update mode
function arrayItemUpdateMode(index, favorites, editMode) {
    favorites[index].editMode = editMode;
}

// remove a favorite from the array based on key
function arrayItemRemove(favorites, index) {
    let removed = favorites.splice(index, 1);
}

// remove a favorite from the array based on key
function arrayItemGet(favorites, index) {
    return (favorites[index]);
}

// Helper functiion for AJAX calls
function httpGet(requestURL, aCallback, errCallback) {
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
            errCallback(err);
        }
    });
}

/*
 * HTML Controller (i.e. renderring functionality)
 * ====================================================================================================
 */

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
                $("<td>").html(`<input id="${favoritePlace.key}-name" type="text" value="${favoritePlace.name}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-address" type="text" value="${favoritePlace.address}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-city" type="text" value="${favoritePlace.city}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-state" type="text" value="${favoritePlace.state}"></input>`),
                $("<td>").html(`<input id="${favoritePlace.key}-zipCode" type="text" value="${favoritePlace.zipCode}"></input>`),
                $("<td>").html(`<button class="delete" data-key="${favoritePlace.key}" data-index="${i}">Delete</button>`),
                $("<td>").html(`<button class="update" data-key="${favoritePlace.key}" data-index="${i}">Update</button><button class="cancel" data-key="${favoritePlace.key}" data-index="${i}">Cancel</button>`)
            );
        } else {
            newRow = $(`<tr id="${favoritePlace.key}" data-key="${favoritePlace.key}" data-index="${i}"">`).append(
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

        // Grab user input

        // Validate user Input

        let favoritePlace = {
            name: $("#name").val().trim(),
            address: $("#address").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zipCode: $("#zipCode").val(),
        };

        // Store It
        favoriteAdd(favoritePlace);

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
        let favoritePlace = arrayItemGet(index);
        console.log(favoritePlace);

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
        arrayItemRemove(favorites, index);

        // re-render fav list
        favoritesRender(favorites);
    });

    // Edit a row 
    $(document.body).on("click", ".edit", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        arrayItemUpdateMode(index, favorites, true);
        favoritesRender(favorites);
    });

    // Cancel editting a row 
    $(document.body).on("click", ".cancel", function () {
        var index = $(this).attr("data-index");
        var key = $(this).attr("data-key");

        arrayItemUpdateMode(index, favorites, false);
        favoritesRender(favorites);
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
        favorites[index] = favoritePlace;

        // Update in firebase
        favoriteUpdate(key, favoritePlace);

        // change display to not editting
        arrayItemUpdateMode(index, favorites, false);
        favoritesRender(favorites);
    });

    // MAIN Start
    // Populate this list of favorite places in the database
    favoritesGet(function (favoritePlaces) {

        // render fav list
        favoritesRender(favoritePlaces);
    });

}); // (document).ready