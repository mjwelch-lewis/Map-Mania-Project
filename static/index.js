var myMap;
var locations;
var names;
var currentLocation = 0;
var score = 0;

function initMap() {

    //gets location data from JSON file and loads it into an array
    $.getJSON("locations.json", function (data) {
        locations = data.map(function(location) {
            return location.location;
        });
        names = data.map(function(location) {
            return location.name;
        });
    });

    //inserts new Google Map into DOM
    myMap = new google.maps.Map(document.getElementById('map'), {center: {lat: 41.75, lng: -87.75}, zoom: 10});

    var modal = document.getElementById("instructions-modal");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";
    
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }

    //performs checks when map returns to 'idle' state
    google.maps.event.addListener(myMap, 'idle', function() {
        if(checkInBounds(locations[currentLocation]) == true && checkZoomLevel() >= 16) {
            alert("Location discovered: " + names[currentLocation]);
            score += 5;
            document.getElementById("score").value = score;
            addMarker(locations[currentLocation]);
            currentLocation++;
        }
    });
}

//returns true or false and prints a hint based on whether the location is within the map's current bounds
function checkInBounds(location) {
    var inBounds = false;

    if(myMap.getBounds().contains(location)) {
        inBounds = true;
    }

    if(inBounds) {
        document.getElementById("hint").value = "You're getting warmer!";
    }
    else {
        document.getElementById("hint").value = "You're getting colder!";
    }
    console.log("In Bounds = " + inBounds);
    return inBounds;
}

//checks, returns, and prints the map's current zoom level
function checkZoomLevel() {
    var zoom = myMap.getZoom();
    console.log("Zoom Level = " + zoom);
    return zoom;
}

//creates a new marker for a location
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        label: names[currentLocation],
        map: myMap
    });
    
}

//forces ajax requests to run synchronously
$.ajaxSetup({
    async: false
});