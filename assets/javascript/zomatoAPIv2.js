// zomato api key: 0873254cb6494b6d3d3851a49e152e4c

// initial sample query: - takes city name and returns cityid code and entityType (needed for 2nd call)
//https://developers.zomato.com/api/v2.1/locations?lat=33.3&lon=-84.4&apikey=0873254cb6494b6d3d3851a49e152e4c


// second sample query: - takes api key, cityid, and entity type and returns restaurant info etc..
 // https://developers.zomato.com/api/v2.1/location_details?entity_id=288&entity_type=city&apikey=0873254cb6494b6d3d3851a49e152e4c

 //global variables
 var apiKey = "0873254cb6494b6d3d3851a49e152e4c"
 var userCitySearch = "Atlanta";
 var cityId = "";
 var cityStateName = "";
 var entityType = "";
 var entityId = "";
 
 //1st API call to zomato api - this returns city data that we need to use to call in the 
 //darksky api (lat/long).  This also returns data we need in our second api call to zomato
 // that gives us the restaurant info (we need cityID and entityType in our second call to zomato api)
 
 function locationInfoCall(lat,long,callback){
    var queryURL1 =`https://developers.zomato.com/api/v2.1/locations?lat=${lat}&lon=${long}&apikey=${apiKey}`;
     $.ajax({
         url: queryURL1,
         method: "GET"
     }).then(function(zomatoResponse) {
 
         cityId = zomatoResponse.location_suggestions[0].city_id;
         cityStateName = zomatoResponse.location_suggestions[0].title;
         entityType = zomatoResponse.location_suggestions[0].entity_type;
         entityId = zomatoResponse.location_suggestions[0].entity_id;

         var parameters = {
             cityId: cityId,
             cityStateName: cityStateName,
             entityType: entityType,
             entityId: entityId,
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
     //     zipCode: "",
    //      lat: "",
    //      lng: ""
     // };
     locationInfoCall(placeObject.lat, placeObject.lng,foodInfoCall);
 }
 
 // return lat long from city

 function foodInfoCall() {
   var queryURL2 = "https://developers.zomato.com/api/v2.1/location_details?entity_id=" + entityId + "&entity_type=" + entityType + "&apikey=" + apiKey
   $.ajax({
     url: queryURL2,
     method: "GET"
   }).then(function(zomatoResponse2) {
    $("#places-table").empty();
       for (i=0; i<5; i++) {
         var name = zomatoResponse2.best_rated_restaurant[i].restaurant.name
         var type = zomatoResponse2.best_rated_restaurant[i].restaurant.cuisines
         var price = zomatoResponse2.best_rated_restaurant[i].restaurant.price_range
         var rating = zomatoResponse2.best_rated_restaurant[i].restaurant.user_rating.aggregate_rating
         var address = zomatoResponse2.best_rated_restaurant[i].restaurant.location.address
         var restaurantTable = $("<tr>").append(
             $("<th>").text(name),
             $("<th>").text(type),
             $("<th>").text(price),
             $("<th>").text(rating),
             $("<th>").text(address),
         )
         $("#places-table").append(restaurantTable)
         console.log(address)
       } //closing for loop
   });
 };//end foodInfoCall function
 
 
 

 




