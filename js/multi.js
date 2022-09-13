let map, panorama;
let user_id;
let game_id;
let players = [];
let location_pano;
let socket;
let isEventAdded = false


if (!localStorage.getItem('token')){
    user_id = prompt("Wpisz swoją nazwę")
} else {
    let bodyFormData = new FormData();
    bodyFormData.append("token", localStorage.getItem("token"));

    axios.post("https://api.temss.tech/v1/discord/", bodyFormData)
    .then(function (response) {
        console.log(response);
        return;
    })
}



socket = io.connect('https://socket.temss.tech/');


if (window.location.search.includes("?game_id=")) {
    game_id = window.location.search.split("?game_id=")[1];
}


socket.on('connect', function() {
    console.log('connected');
});

document.getElementById("link").addEventListener("click", function(){
    navigator.clipboard.writeText(`${window.location.href}?game_id=${game_id}`)
    alert("Link copied to clipboard");
});


socket.on('message', function(msg) {
    console.log(msg);
    let code = msg[0];
    let message = ""
    for (let i = 1; i < msg.length; i++) {
        message += msg[i];
    }

    if (code === '1') { // created game, add player to game
        if (!game_id) game_id = message;

        socket.send(`4${game_id}|${user_id}`)
        socket.send(`3${game_id}`)
    }

    if (code === '2') { // player list
        players = x = message.split("|");
        for (let i=0; i<x.length; i++) {
            players[i] = { id: x[i], points: -1 };
        }

        if (players[0]['id'] === user_id && !isEventAdded) {
            isEventAdded = true;
            document.getElementById("start").style.visibility = "visible";
            document.getElementById("start").style.display = "flex";
            document.getElementById("start").addEventListener("click", function() {
                socket.send(`7${game_id}|${user_id}`);
            });
        }

        update_players();
        socket.send(`5${game_id}`)
    }

    if (code === "3") { // location
        location_pano = [Number(message.split("|")[0]), Number(message.split("|")[1])];
        console.log(location_pano);
    }

    if (code === "6") { // start game
        if (players[0]['id'] === user_id) {
            document.getElementById("start").style.display = "none";
            document.getElementById("next").style.display = "flex";
        }
        block = false;
        setLocation();
        document.getElementById("submit").addEventListener("click", function() {
            socket.send(`9${game_id}|${user_id}|${markers[0].getPosition().lat()}|${markers[0].getPosition().lng()}`);
            block = true;

            const mark = new google.maps.Marker({
                position: { lat: location_pano[0], lng: location_pano[1] },
                map,
            });
            markers.push(mark);
            const line = new google.maps.Polyline({
                path: [
                    { lat: markers[0].getPosition().lat(), lng: markers[0].getPosition().lng() },
                    { lat: location_pano[0], lng: location_pano[1] }
                ],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                map: map
            });
            markers.push(line);
        });
    }

    if (code === "8") { // players finished
        let id_ = message.split("|")[0];
        let points = message.split("|")[1];
        for (let i = 0; i < players.length; i++) {
            if (players[i]['id'] === id_) {
                players[i]['points'] = points;
            }
        }
        update_players();
    }
    if (code === '4') {
        panorama.setPosition({ lat: 0, lng: 0 });

        block = true;
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        for (let i = 0; i < players.length; i++) {
            players[i]['points'] = -1;
        }

        document.getElementById("pano").style.visibility = "hidden";
        location_pano = [Number(message.split("|")[0]), Number(message.split("|")[1])];
    }
})



function update_players(){
    document.getElementById("players").innerHTML = "";
    for (let i = 0; i < players.length; i++) {
        document.getElementById("players").innerHTML += `<li>${players[i]['id']}: ${players[i]['points']}</li>`
    }
}

function setLocation(){
    document.getElementById("pano").style.visibility = "visible";
    panorama.setPosition({ lat: location_pano[0], lng: location_pano[1] });
}

let markers = [];
let block = true;

function initMap(){
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            enableCloseButton: false,
            addressControl: false,
            showRoadLabels: false,
            disableDefaultUI: true,
            motionTracking: false,
            position: { lat: 0, lng: 0 }
        }
    );

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0},
        zoom: 2.5,
        streetViewControl: false,
        disableDefaultUI: true,
    });

    map.addListener("click", (event) => {
        if (block) return;
        const location = event;
        const marker = new google.maps.Marker({
            position: location.latLng,
            map,
            title: location.description,
        });
        if (markers.length > 0) {
            markers[0].setMap(null);
            markers[0] = marker;
        } else {
            markers[0] = marker;
        }
    });
}



// canvas setup
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

// main loop
function loop() {
    // clear canvas
    ctx.clearRect(0, 0, width, height);

    // draw blue circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(16, 16, 16, 0.5)";
    ctx.fill();

    let x1 = width / 2;
    let y1 = height / 2;

    angle = panorama.getPov().heading;

    let x2, y2;

    for (let i = 0; i <= 25; i++) {
        length = i;

        x2 = x1 + Math.cos(Math.PI * angle / 180) * i;
        y2 = y1 + Math.sin(Math.PI * angle / 180) * i;

        // line from center to edge of circle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = Math.round((25 - i) / 3);
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.stroke();
    }
        for (let i = 0; i <= 25; i++) {
        length = i;

        x2 = x1 + Math.cos(Math.PI * (angle + 180) / 180) * i;
        y2 = y1 + Math.sin(Math.PI * (angle + 180) / 180) * i;

        // line from center to edge of circle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = Math.round((25 - i) / 3);
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.stroke();
    }

    requestAnimationFrame(loop);
}

document.getElementById("map").addEventListener("mouseover", function () {
    document.getElementById("map").style.width = "800px";
    document.getElementById("map").style.height = "600px";
})

document.getElementById("map").addEventListener("mouseleave", function () {
    document.getElementById("map").style.width = "400px";
    document.getElementById("map").style.height = "300px";
})

document.getElementById("start").addEventListener("click", function () {
   socket.send(`7${game_id}|${user_id}`);
});

document.getElementById("next").addEventListener("click", function () {
    socket.send(`1${game_id}|${user_id}`);
})

document.getElementById("back").addEventListener("click", function() {
    if (document.getElementById("pano").style.visibility === "visible") {
        setLocation();
    }
})

document.getElementById("region").addEventListener("click", function() {

});



setTimeout(loop, 200);


