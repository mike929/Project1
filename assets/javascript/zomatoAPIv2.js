// zomato api key: 0873254cb6494b6d3d3851a49e152e4c

// initial sample query: - takes city name and returns cityid code and entityType (needed for 2nd call)
//https://developers.zomato.com/api/v2.1/locations?query=Atlanta&apikey=0873254cb6494b6d3d3851a49e152e4c


// second sample query: - takes api key, cityid, and entity type and returns restaurant info etc..
 // https://developers.zomato.com/api/v2.1/location_details?entity_id=288&entity_type=city&apikey=0873254cb6494b6d3d3851a49e152e4c

 //global variables
var apiKey = "0873254cb6494b6d3d3851a49e152e4c"
var userCitySearch = "Atlanta";
var cityId = "";
var cityStateName = "";
var entityType = "";
var entityId = "";
var lat = "";
var long = "";

//1st API call to zomato api - this returns city data that we need to use to call in the 
//darksky api (lat/long).  This also returns data we need in our second api call to zomato
// that gives us the restaurant info (we need cityID and entityType in our second call to zomato api)
var queryURL1 ="https://developers.zomato.com/api/v2.1/locations?query=" + userCitySearch + "&apikey=" + apiKey
function locationInfoCall(callback){
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function(zomatoResponse) {

        cityId = zomatoResponse.location_suggestions[0].city_id;
        cityStateName = zomatoResponse.location_suggestions[0].title;
        entityType = zomatoResponse.location_suggestions[0].entity_type;
        entityId = zomatoResponse.location_suggestions[0].entity_id;
        lat = zomatoResponse.location_suggestions[0].latitude;
        long = zomatoResponse.location_suggestions[0].longitude;
        var parameters = {
            cityId: cityId,
            cityStateName: cityStateName,
            entityType: entityType,
            entityId: entityId,
            lat: lat,
            long: long
        }
        callback();
    });

}//end locationInfoCall function

// call from controller to invoke search
function getPlaceInfo(placeObject) {
    // let placeObject = {
    //     name: "",
    //     address: "",
    //     city: "",
    //     state: "",
    //     zipCode: ""
    // };
}

// return lat long from city
function getLatLong(city) {
    let geoLocation = {};

    geoLocation.lat = 33.7;
    geoLocation.long = 84.3;

    return geoLocation;

}
function foodInfoCall() {
  var queryURL2 = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + entityType + "&apikey=" + apiKey
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(zomatoResponse2) {
  });
};//end foodInfoCall function

locationInfoCall(foodInfoCall);




 




