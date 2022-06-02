var myMap;
var locations;

function initMap() {

    //gets location data from JSON file and loads it into an array
    $.getJSON("locations.json", function (data) {
        locations = data.map(function(location) {
            return location.location;
        });
    });

    //inserts new Google Map into DOM
    myMap = new google.maps.Map(document.getElementById('map'), {center: {lat: 0, lng: 0}, zoom: 3});

    //static location coordinates to check against (Chicago, IL)
    var location1 = new google.maps.LatLng(41.8781, -87.6298);

    //performs checks when map returns to 'idle' state
    google.maps.event.addListener(myMap, 'idle', function() {
        checkInBounds(location1);  
        checkZoomLevel();     
    });

    //creates a marker for each location found in the locations.json file
    for(var i = 0; i < locations.length; i++) {
        addMarker(locations[i]);
    }
}

//checks and prints whether the location is in the map's current bounds
function checkInBounds(location) {
    var inBounds = false;

    if(myMap.getBounds().contains(location)) {
        inBounds = true;
    }

    console.log("In Bounds = " + inBounds);
}

//checks and prints the map's current zoom level
function checkZoomLevel() {
    var zoom = myMap.getZoom();
    console.log("Zoom Level = " + zoom);
}

function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: myMap
    });
}

//forces ajax requests to run synchronously
$.ajaxSetup({
    async: false
});