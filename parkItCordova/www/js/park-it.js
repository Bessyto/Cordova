/*
* Bessy Torres-Miller
* Kianna Dyck
* 05/03/2018
* park-it.js
* This page defines a function that creates a google map.
*/

var storage;

$("document").ready(init);

function init()
{
    //third parameter has to do with event bubbling and
    //capturing; use false for backward compatibility
    document.addEventListener('deviceready', onDeviceReady, false);
    storage= window.localStorage;
}

function onDeviceReady()
{
    // Load the cuurent stylesheet, depending on the device
    // var node = document.createElement('link');
    // node.setAttribute('rel', 'stylesheet');
    // node.setAttribute('type', 'text/css');

    if (cordova.platformid == 'ios') {
        //node.setAttribute('href', 'css/park-it-ios.css');

        $('head').append('<link rel="stylesheet" href="css/park-it-ios.css" type="text/css" />');


        // prevent status bar from overlaying web view
        window.StatusBar.overlaysWebView(false);
        window.StatusBar.styleDefault();
    } else {
        // default code
       // node.setAttribute('href', 'css/park-it-android.css');

        $('head').append('<link rel="stylesheet" href="css/park-it-android.css" type="text/css" />');
        window.StatusBar.backgroundColorByHexString("#1565C0");
    }

    // What is happening here?
    $('head').appendChild(node);
}

function initMap()
{
    // Center location in map
    var grc = {lat: 47.313582, lng: -122.1800072};

    // Add a map to map div
    var mapDiv = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: grc
    });

    // Point of interest inside map
    // var marker = new google.maps.Marker({
    //     position: grc,
    //     map: mapDiv
    // });
}

$("#park").click(function () {
   //alert("Set parking location");
    setParkingLocation();
});

$("#retrieve").click(function () {
    alert("Get parking location");
});

$("#gotIt").click(function () {
    $("#instructions").hide();
});

function setParkingLocation() {
    navigator.geolocation.getCurrentPosition(setParkingLocationSuccess,
        setParkingLocationError, {enableHighAccuracy:true});
}

function setParkingLocationSuccess(position){
    latitude = position.coords.latitude;
    storage.setItem("parkedLatitude", latitude);

    //Add statement to storage the longitude
    longitude = position.coords.longitude;
    storage.setItem("parkedLongitude", longitude);

    //Display an alert that shows the latitude and longitude
    //Use navigator.notification.alert(msg)
    navigator.notification.alert("Parking Location Saved. (Latitude: " + latitude + ", Longitude: " + longitude + ")");

    showParkingLocation();
}

function setParkingLocationError(error) {
    navigator.notification.alert("Error Code: " + error.code
    + "\nError Message: " + error.message);
}


function showParkingLocation() {
    // navigator.notification.alert("You are parked at Lat: "
    // + storage.getItem("parkedLatitude")
    // + ", Long: " + storage.getItem("parkedLongitude"));

    // hide directions and instructions
    $("#instructions").hide();
    $("#directions").hide();

    // Create an object to store our latitude and longitude
    var latLong = new google.maps.LatLng(latitude, longitude);

    // Create a new map object
    var map = new google.maps.Map(document.getElementById('map'));

    //set the zoom on the map
    map.setZoom(16);

    //set center of the map
    map.setCenter(latLong);

    //set marker of map
    var marker = new google.maps.Marker({
        position: latLong,
        map: map
    });
}


function getParkingLocation() {
    navigator.geolocation.getCurrentPosition(getParkingLocationSuccess,
        getParkingLocationError, {enableHighAccuracy: true});
}

/* Takes a position object that defines and sets four variables to retrieve the location. */
function getParkingLocationSuccess(position) {
    // current latitude and longitude comes from position object
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;

    // parked latitude and longitude come from storage object
    parkedLatitude = storage.getItem("parkedLatitude");
    parkedLongitude = storage.getItem("parkedLongitude");

    // shows route on map
    showDirections();
}

function showDirections() {
    // responsible for drawing the directions, both on the map and as a list in the directions div
    var dRenderer = new google.maps.DirectionsRenderer;

    // calculates the route between the endpoints on the map
    var dService = new google.maps.DirectionsService;

    var curLatLong = new google.maps.LatLng(currentLatitude, currentLongitude);
    var parkedLatLong = new google.maps.LatLng(parkedLatitude, parkedLongitude);
    var map = new google.maps.Map(document.getElementById("map"));

    map.setZoom(16);
    map.setCenter(curLatLong);

    dRenderer.setMap(map);

    dService.route({
        origin: curLatLong,
        destination: parkedLatLong,
        travelMode: 'DRIVING'

    }, function(response, status) {
            if (status == 'OK') {
                dRenderer.setDirections(response);
                $('#directions').html('');
                dRenderer.setPanel(document.getElementById('directions'));
            } else {
                navigator.notification.alert("Directions failed: " + status);
            }
        });

    $('#map').show();
    $('#directions').show();
    $('#instructions').hide();
}

function getParkingLocationError(error) {
    navigator.notification.alert("Error Code: " + error.code +
    "\nError Message: " + error.message);
}