var farenheit;
var celsius;

function calculateCelsius(){
  celsius = ((farenheit - 32)* 5/9).toFixed();
}

function switchTempFormat(){
  if($("#switch").html() === "°C"){
    calculateCelsius();
    $(".value").html(celsius);
  } else {
    $(".value").html(farenheit);
  }
}

$(document).ready(function(){
  
  if (navigator.geolocation) { 
    navigator.geolocation.getCurrentPosition(function(position) { //Getting location
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
   
//     var x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(showPosition);
//   } else { 
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }
    
// function showPosition(position) {
//     x.innerHTML="Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude;
// }

      $.ajax({
        type: "GET",
        url: "https://api.darksky.net/forecast/94aaecbfef6d8d2885bebd3b1512da6f/"+latitude+","+longitude,
        dataType: "jsonp"
        }).done(function(data) {
          var obj = [data];
        
          function skycons() {
            var skycons = new Skycons({"color": "black", "resizeClear": true});
            skycons.add(document.getElementById("icon"), obj[0].currently.icon);
            skycons.play();
          }
          
          skycons();
        
          farenheit = (obj[0].currently.temperature).toFixed();
        
          $(".key").append(obj[0].currently.summary); 
          calculateCelsius();
          $("#switch").html("°C");
          $(".value").append(celsius);//Implementing data
          $("#switch").click(function(){
            if($("#switch").html() === "°F"){
              $("#switch").html("°C");
              switchTempFormat();
            } else {
              $("#switch").html("°F");
              switchTempFormat();
            }
          });
          
      });
    });
  };
  
  
});