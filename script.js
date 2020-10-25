'use strict';
var globalMap;
var chosenRestaurant;
var service;

const menuButton = document.querySelector('.menu-button');
let menuOpen = false;
menuButton.addEventListener('click', () => {
  if(!menuOpen) {
    menuButton.classList.add('open');
    menuOpen = true;
    document.getElementById("nav").classList.toggle('open');
    
  } else {
    menuButton.classList.remove('open');
    menuOpen = false;
    document.getElementById("nav").classList.toggle('open');
  }
})


/**
 * @return {undefined}
 */

/**
 * @param {!NodeList} results
 * @param {?} result
 * @return {undefined}
 */




/**
 * @param {!Object} place
 * @return {undefined}
 */


/**
 * @return {undefined}
 */

function handleLocationError(location) {
  console.log("There was an error at", location)
}

/**
 * @return {undefined}
 */
function getRestaurant() {
  console.log("testing");
  var map = new google.maps.Map(document.getElementById("map"), {
    center : {
      lat: 0,
      lng: 0
    },
    zoom : 10
  });

  var infoWindow = new google.maps.InfoWindow({
    map : map
  });

  if (navigator.geolocation) {
    console.log("Current geolocation", navigator.geolocation)

    navigator.geolocation.getCurrentPosition(function(tweet) {
      console.log("Tweet coords:" + tweet.coords);
      var latlng = {
        lat : tweet.coords.latitude,
        lng : tweet.coords.longitude
      };

      infoWindow.setPosition(latlng);
      infoWindow.setContent("You are here");
      map.setCenter(latlng);
      var marker = new google.maps.Marker({
        position: latlng,
        map,
        title: "your current location"
      });
      globalMap = map;

      var res = new google.maps.places.PlacesService(map);
      service = res;
      globalMap = map;
      res.nearbySearch({
        location : latlng,
        radius : 1500,
        types : ["restaurant"]
      }, callback);

     
    });
  } else {
    // No Geolocation Found
    // Punch on psuedo coordinates

    handleLocationError("No navigator geolocation")
  }

  
};

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
     var randomRestaurant = Math.floor(Math.random()*results.length)
    
    createMarker(results[randomRestaurant]);
    displayRestaurant(results[randomRestaurant]);
  }
}

function createMarker(place) {
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();
  
  var latlng = {
    //lat:40.7484,
    //lng:73.9857

    lat:place.geometry.location.lat(),
    lng:place.geometry.location.lng()

  };

  var marker = new google.maps.Marker({
  position: latlng,
  title: "restaurant found"
  });

  marker.setMap(globalMap);
}

function displayRestaurant(place) {
  console.log(place);
  document.getElementById('resName').innerHTML = place.name;
  document.getElementById('resRating').innerHTML = "Rating: " + place.rating + " / 5 from " + place.user_ratings_total + " total ratings";
  document.getElementById('resAddress').innerHTML = place.vicinity;

  if (place.price_level == undefined){document.getElementById('resPriceLvl').innerHTML = "Unknown Price Level"}
  else{
    document.getElementById('resPriceLvl').innerHTML = "Price level: " + place.price_level + " / 5";
  }


  var request = {
    placeId: place.place_id
  };
  var service = new google.maps.places.PlacesService(globalMap);
  service.getDetails(request, function(pleece, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let review of pleece.reviews){
                document.getElementById("resReviews").innerHTML += `<div>Author: ${review.author_name}</div>
                                <em>${review.text}</em>
                                <div>Rating: ${review.rating} star(s)</div><br>`;
      }
    }
  });
}
