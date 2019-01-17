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
/*global localStorage:false */

// User info hardcode - when auth added, use real user info
const userID = "team9";

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
let favoritesDBRef = database.ref(`/favorite_cities/${userID}`);
let favorites = []; // array of objects for all the favorite cities
// Template Object/Class for what a favorite place in tge array holds
let ItemFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    key: "", // database key for update, delete or getting new from DB
    lat: "", // from google API and stored
    lng: "", // from google API and stored
    editMode: false // helper mode to tell whether user is editing this item
};
// Template Object/Class for what a favorite place in DB holds (i.e. snapshot.val())
let DBFavoritePlace = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: "",
    lng: ""
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
 * Local Storage Management
 * These are used to store and retrieve things from local storage
 * The main thing this is used for is to pass data from the pages within out application
 * ====================================================================================================
 */

// save last one for later retrieval
function saveKeyToLocalStorage(key) {
    localStorage.setItem("favoriteKey", key);
}

// get whatever is in local storage for later retrieval
function getKeyFromLocalStorage() {
    return localStorage.getItem("favoriteKey");
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
            aCallback(result);
        },
        error: function (err) {
            console.log('error:' + err);
            errCallback(err);
        }
    });
}

/*
 * Google Places API to get lat long
 * ====================================================================================================
 */
const PAUL_GOOGLE_APIKEY = "AIzaSyCLRBB75clINkYZNewdGEBcxcLn9QOXUCw";

function getLatLongForPlace(favoritePlace, aCallback, errCallback) {
    let address = `${favoritePlace.address}${favoritePlace.city}${favoritePlace.state}${favoritePlace.zipCode}`;

    address = address.split(" ").join("+"); // replace spaces with plus for query

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${PAUL_GOOGLE_APIKEY}`;

    httpGet(url, function (geoData) {
        console.log(geoData);
        console.log(geoData.results[0].formatted_address);
        console.log(geoData.results[0].geometry.location.lat);
        console.log(geoData.results[0].geometry.location.lng);

        let newDataForAddress = {};
        newDataForAddress.formatted_address = geoData.results[0].formatted_address;
        newDataForAddress.lat = geoData.results[0].geometry.location.lat;
        newDataForAddress.lng = geoData.results[0].geometry.location.lng;

        aCallback(newDataForAddress);

    }, errCallback);
}

/*
 * Dark Sky Weather API
 * This means that you're converting UNIX timestamps to local times incorrectly.
 * For each UNIX timestamp, there is a corresponding local time for each and every different timezone.
 *  For example, the UNIX time 1466892000 corresponds to 6PM (18:00) in New York, 10PM (22:00) GMT,
 *  and midnight (00:00) of the following day in Amsterdam. When converting UNIX 
 * timestamps to local times, always use the timezone property of the API response,
 *  so that your software knows which timezone is the right one.
 * ====================================================================================================
 */
const PAUL_DARKSKY_APIKEY = "889d321b7d461f9aa8d4a951f2e163b6";
// Current Weather Object Class - just to show what is being passed
const currentWeatherClass = {
    day: 0, // need to find date format and convert
    timeZone: 0, // need to find date format and convert
    currentTemp: 0.0,
    feelsLike: 0.0,
    humidity: 0.0, // %
    chanceOfRain: 0.0, //%
    wind: 0.0,
    summary: "",
    icon: ""
};
// Array of daily weather classes
const dailyWeatherClass = [{
    day: 0, // need to find date format and convert
    timeZone: 0, // need to find date format and convert
    humidity: 0.0, // %
    chanceOfRain: 0.0, //%
    wind: 0.0,
    summary: "",
    icon: "",
    lowTemp: "",
    highTemp: ""
}];

function getWeatherDB(geoLocation, aCallback, errCallback) {
    let currentWeather = {};
    let dailyWeather = [];
    
    const exclude = "?exclude=minutely,alerts,flags";
    const unit = "?units=si";
    const CORSFix = "https://cors-anywhere.herokuapp.com/";
    
    let url = `${CORSFix}https://api.darksky.net/forecast/${PAUL_DARKSKY_APIKEY}/${geoLocation.lat},${geoLocation.lng}${exclude}${unit}`;
    
    httpGet(url, function (weatherData) {
        console.log(weatherData);
    
        currentWeather = {};
        currentWeather.day = weatherData.currently.time;
        currentWeather.timeZone = weatherData.timezone;
        currentWeather.currentTemp = weatherData.currently.temperature;
        currentWeather.feelsLike = weatherData.currently.apparentTemperature;
        currentWeather.humidity = weatherData.currently.humidity;
        currentWeather.chanceOfRain = weatherData.currently.precipProbability;
        currentWeather.wind = weatherData.currently.windSpeed;
        currentWeather.summary = weatherData.currently.summary;
        currentWeather.icon = weatherData.currently.icon;
    
        dailyWeather = [];
        dailyWeather.length = 0; // prevent leaks
    
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
        aCallback(currentWeather, dailyWeather);

    }, errCallback);
}