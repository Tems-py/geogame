let bodyFormData = new FormData();
bodyFormData.append("token", localStorage.getItem("token"));

if (!localStorage.getItem('token')){
    window.location.href = "/not_logged"
}

if (!window.location.search.includes("id") && localStorage.getItem("token")) {
    axios.post("https://api.temss.tech/v1/discord/", bodyFormData)
        .then(function (response) {
            console.log(response.data);

            document.getElementById("username").innerHTML = response.data.username;
            document.getElementById("avatar").setAttribute('src', response.data.avatar_url);
            console.log(window.location.search)

            window.location.search = "?id=" + response.data.user_id;
            
        })
        .catch(function (error) {
            console.log(error);
            
        });
} else {

    let uid = window.location.search.split("id=")[1]
    axios.get("https://api.temss.tech/v1/user/" + uid)
        .then(function (response) {
            console.log(response.data);

            document.getElementById("username").innerHTML = response.data.user[3];
            document.getElementById("avatar").setAttribute('src', response.data.user[2]);

            for (let i = 0; i < response.data.games.length; i++) {
                document.getElementById("games").innerHTML += `<tr><td>${response.data.games[i][1] / 1000} sekund</td><td>${response.data.games[i][2]}</td></tr>`;
            }

            for (let i=0; i < response.data.arenas.length; i++) {
                console.log(response.data.arenas[i])
                document.getElementById("maps").innerHTML += `<tr><td>${response.data.arenas[i][3]}</td><td>${JSON.parse(response.data.arenas[i][2]).length}</td></tr>`;
            }
        });
}
