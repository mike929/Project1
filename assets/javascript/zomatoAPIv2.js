// zomato api key: 0873254cb6494b6d3d3851a49e152e4c

// initial sample query: - need to get city id code
//https://developers.zomato.com/api/v2.1/locations?query=Atlanta&apikey=0873254cb6494b6d3d3851a49e152e4c


// second sample query: - returns restaurant info etc..
 // https://developers.zomato.com/api/v2.1/location_details?entity_id=288&entity_type=city&apikey=0873254cb6494b6d3d3851a49e152e4c

var apiKey = "0873254cb6494b6d3d3851a49e152e4c"
var userCitySearch = "Atlanta";
//global variables
var cityId = "";
var cityStateName = "";
var entityType = "";
var entityId = "";
var lat = "";
var long = "";

var queryURL1 ="https://developers.zomato.com/api/v2.1/locations?query=" + userCitySearch + "&apikey=" + apiKey
function locationInfoCall(){
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
        console.log(parameters)
        console.log(entityType)
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
    locationInfoCall();
    console.log("Type: " + entityType)
  var queryURL2 = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + entityType + "&apikey=" + apiKey
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function(zomatoResponse2) {
      console.log(zomatoResponse2)
  });
}//end foodInfoCall function







