/* **********************************************************************************
 * Favorite Places - 
 * This module allows you to add, delete, modify and list favorite places for 
 * our places dashboard app.
 * These places are used to determine the location of where you want to get the
 * information.  The idea is you are travelling to one of these places
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
    let favoriteDBRef = favoritesDBRef.child(key);

    favoriteDBRef.set(favoritePlace);
}

// Delete from firebase DB
function favoriteDelete(key) {
    // Delete object from firebase
    let favoriteDBRef = favoritesDBRef.child(key);
    favoriteDBRef.remove();
}

// Get all favortie places in any order  
function favoritesGet(aCallback) {

    favoritesDBRef.on("value", function (snap) {
        let favorites = [];
        favorites.length = 0;

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

    favoritesDBRef.orderByChild("name").on("value", function (snap) {
        let favorites = [];
        favorites.length = 0;

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