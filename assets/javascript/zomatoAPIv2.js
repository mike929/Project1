// zomato api key: 0873254cb6494b6d3d3851a49e152e4c

// initial query: - need to get city id code
// https://developers.zomato.com/api/v2.1/locations?query=Atlanta

// second query: - returns restaurant info etc..
//https://developers.zomato.com/api/v2.1/location_details?entity_id=288&entity_type=city


//https://developers.zomato.com/api/v2.1/locations?query=Atlanta&apikey=0873254cb6494b6d3d3851a49e152e4c

var userCitySearch = "Atlanta";
var apiKey = "0873254cb6494b6d3d3851a49e152e4c"

var queryURL1 ="https://developers.zomato.com/api/v2.1/locations?query=" + userCitySearch + "&apikey=" + apiKey

$.ajax({
    url: queryURL1,
    method: "GET"
  }).then(function(locationResponse) {
    console.log(locationResponse);
  });
