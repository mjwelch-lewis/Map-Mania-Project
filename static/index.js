var myMap;
var locations;
var names;
var currentLocation = 0;
var score = 0;
var won = false;

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
    var close = document.getElementsByClassName("close")[0];
    var scoreboard = document.getElementById("scoreboard");
    var scoreValue = document.getElementById("score");

    //displays instructions modal when page loads
    modal.style.display = "block";
    
    //closes the instructions modal when the user clicks the X
    close.onclick = function() {
        modal.style.display = "none";
    }

    //activates cheat to win automatically
    scoreboard.ondblclick = function() {
        triggerWin();
    }

    //performs checks when map returns to 'idle' state
    google.maps.event.addListener(myMap, 'idle', function() {
        if(checkInBounds(locations[currentLocation]) == true && checkZoomLevel() >= 11) {
            score += 5;
            scoreValue.value = score;
            addMarker(locations[currentLocation]);
            alert("Location discovered: " + names[currentLocation]);
            setTimeout(function(){myMap.setZoom(10)}, 1000);
            currentLocation++;
            if(currentLocation > locations.length) {
                triggerWin();
            }
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

function triggerWin() {
    //reveals all undiscovered locations if cheat is used
    if(won == false) {
        while(currentLocation < locations.length) {
            addMarker(locations[currentLocation])
            currentLocation++;
        }
        document.getElementById("score").value = 45;
    }
    alert("You found all 9 of Matt's favorite locations! Refresh the page to play again!");
    won = true;
}

//forces ajax requests to run synchronously
$.ajaxSetup({
    async: false
});