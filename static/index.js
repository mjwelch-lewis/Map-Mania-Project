var myMap;
var myLocations;

function initMap() {
    $.getJSON("locations.json", function (locationObjects) {
        myLocations = locationObjects.map();
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

    myLocations.array.forEach(element => {
        addMarker(element);
    });
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
        position: myLocations.location,
        map: myMap
    });
}