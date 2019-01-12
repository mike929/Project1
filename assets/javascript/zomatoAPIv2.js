// zomato api key: 0873254cb6494b6d3d3851a49e152e4c

// initial sample query: - need to get city id code
//https://developers.zomato.com/api/v2.1/locations?query=Atlanta&apikey=0873254cb6494b6d3d3851a49e152e4c


// second sample query: - returns restaurant info etc..
 // https://developers.zomato.com/api/v2.1/location_details?entity_id=288&entity_type=city&apikey=0873254cb6494b6d3d3851a49e152e4c

 var apiKey = "0873254cb6494b6d3d3851a49e152e4c"
var userCitySearch = "Atlanta";

var queryURL1 ="https://developers.zomato.com/api/v2.1/locations?query=" + userCitySearch + "&apikey=" + apiKey

$.ajax({
    url: queryURL1,
    method: "GET"
  }).then(function(zomatoResponse) {

    var cityId = zomatoResponse.location_suggestions[0].city_id;
    var cityStateName = zomatoResponse.location_suggestions[0].title;
    var entityType = zomatoResponse.location_suggestions[0].entity_type;
    var lat = zomatoResponse.location_suggestions[0].latitute;
    var long = zomatoResponse.location_suggestions[0].longitude;

    var parameters = {
        cityId: cityId,
        cityStateName: cityStateName,
        entityType: entityType,
        lat: lat,
        long: long
    }
    console.log(parameters)
  });




