let map;
let panorama;
let markers = [];
let location2;
let block = false;

let start_time = new Date().getTime();

let data1 = new FormData();

let bodyFormData = new FormData();
bodyFormData.append("token", localStorage.getItem("token"));
axios.post("https://api.temss.tech/v1/discord/", bodyFormData)
    .then(function (response) {
        return;
    })
    .catch(function (error) {
        document.location.href = "/not_logged"
    });


function httpGet(theUrl) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false);
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
}

function initMap() {

    document.getElementById("game").addEventListener('keydown', function (event) {
        if (event.code === 'Space'){
            document.getElementById("submit").click();
        }
    });

    document.getElementById("map").addEventListener("mouseover", function () {
        document.getElementById("map").style.width = "800px";
        document.getElementById("map").style.height = "600px";
    })

    document.getElementById("map").addEventListener("mouseleave", function () {
        document.getElementById("map").style.width = "400px";
        document.getElementById("map").style.height = "300px";
    })

    document.getElementById("back").addEventListener("click", function () {
        panorama.setPosition({ lat: location2[0], lng: location2[1] });
    });

    document.getElementById("submit").addEventListener("click", function(){
        if (block) return;
        if (markers.length === 0) {
            alert("Please pick a location first!");
            return;
        }
        let location1 = [markers[0].position.lat(), markers[0].position.lng()];
        let distance = Math.sqrt(Math.pow(location1[0] - location2[0], 2) + Math.pow(location1[1] - location2[1], 2));
        distance = ((distance.toFixed(2) * 1) * 111).toFixed(0) * 1;
        let r = distance / 40000
        let points = 5000 - distance;

        console.log(Math.PI*r*r)

        if (points < 0) points = 0;
        new google.maps.Polyline({
            path: [
                { lat: location1[0], lng: location1[1] },
                { lat: location2[0], lng: location2[1] }
            ],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            map: map
        });
        new google.maps.Marker({
            position: { lat: location2[0], lng: location2[1] },
            map: map,
        })
        block = true;


        data1.append("token", localStorage.getItem("token"));
        data1.append("time", new Date().getTime() - start_time);
        data1.append("points", points);
        console.log(data1)

        axios.post("https://api.temss.tech/v1/endrun", data1)
            .then(function (response) {
                console.log("success");
                return;
            })

        alert("You have " + points + " points" + " and you are " + distance + " km away from your destination.");
    });

    let code;

    if (window.location.search.includes("mode")){
        region = window.location.search.split("mode=")[1];
        document.getElementById("region").innerHTML = "Tryb: " + region;
    }

    if (window.location.search.includes("code")){
        console.log(window.location.search);
        code = window.location.search.split("code=")[1];
        let data = httpGet(urlForApi + "v1/code/" + code);
        console.log(data)
        data = JSON.parse(data);
        location2 = [Number(data.data[0]), Number(data.data[1])];
    } else {
        let data = httpGet(urlForApi + "v1/coords/" + region);
        data = JSON.parse(data);
        console.log(data);
        location2 = [Number(data.country[0]), Number(data.country[1])];
        code = data.code;
    }
    document.getElementById("share").innerHTML = `<button id="share_btn">Udostępnij lokacje</button>`
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            enableCloseButton: false,
            addressControl: false,
            showRoadLabels: false,
            disableDefaultUI: true,
            motionTracking: false,
            position: { lat: location2[0], lng: location2[1] }
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

    document.getElementById("share_btn").addEventListener("click", function(){
       navigator.clipboard.writeText(`https://${window.location.host}/game?code=${code}`);
       alert("Link został skopiowany do schowka!");
    });

    document.getElementById("discord").addEventListener("click", function(){
       window.location.href = "https://discord.gg/YcjnF8PFN5";
    });

    document.getElementById("next").addEventListener("click", function(){
       window.location.href = window.location.pathname + '?mode=' + region;
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
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
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
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.stroke();
    }

    requestAnimationFrame(loop);
}


window.initMap = initMap;
setTimeout(loop, 200);