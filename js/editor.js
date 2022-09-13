// login
if (!localStorage.getItem("token")) {
    window.location.href = "/not_logged";
}

// popup stuff
if (localStorage.getItem("close_popup") == "true") {
    document.getElementById("popup").style.display = "none";
}

document.getElementById("close_popup").addEventListener("click", function(event) {
    localStorage.setItem('close_popup', "true");
    document.getElementById("popup").style.display = "none";
});

// hud, locations, etc.

let name = localStorage.getItem("new_name");
let locations = [];

document.getElementById("name").innerHTML = name;

function locations_update(){
    document.getElementById("list").innerHTML = "";
    for (let i = 0; i < locations.length; i++) {
        document.getElementById("list").innerHTML += `<tr><td>${i}<td/><td>${locations[i]}<td/><td> <input type="button" value="Usun" onclick="remove_location(${i})"><td/></tr>`;
    }
}

function remove_location(i){
    locations.pop(i);
    locations_update();
}


document.getElementById("confirm").addEventListener("click", function(){
    locations.push([panorama.getPosition().lat(), panorama.getPosition().lng()]);
    locations_update();
});

// switch stuff

let mode = true;

document.getElementById("switch").addEventListener("click", function(){
    if (!mode) {
        mode = true;
        document.getElementById("pano").style.display = "none";
        document.getElementById("map").style.display = "block";
    } else {
        mode = false;
        document.getElementById("pano").style.display = "block";
        document.getElementById("map").style.display = "none";
    }
});


// map stuff

let marker = null;

function initMap(){
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            enableCloseButton: false,
            addressControl: false,
            motionTracking: false,
            position: { lat: 51.792267, lng: 19.420408 },
            pov: {heading: 210, pitch: 10},
        }
    );
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.792267, lng: 19.420408 },
        zoom: 17,
        streetViewControl: false,
    });

    marker = new google.maps.Marker({
        position: { lat: 51.792267, lng: 19.420408 },
        map: map,
    });

    map.addListener("click", (event) => {
        let location = event;

        marker.setMap(null);
        marker = new google.maps.Marker({
            position: location.latLng,
            map
        });

        panorama.setPosition({ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() });
    });

    loop();
}

window.initMap = initMap;

function loop(){
    marker.setMap(null);

    marker = new google.maps.Marker({
        position: { lat: panorama.getPosition().lat(), lng: panorama.getPosition().lng() },
        map: map,
    });

    setTimeout(loop, 500);
}

