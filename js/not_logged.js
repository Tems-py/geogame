let link = "";
axios.get("https://api.temss.tech/oauth/oauth_url")
    .then(function (response) {
        link = response.data.oauth_url;
    })

let bodyFormData = new FormData();
bodyFormData.append("token", localStorage.getItem("token"));

axios.post("https://api.temss.tech/v1/discord/", bodyFormData)
    .then(function (response) {
        window.location.href = "/"
    })
    .catch(function (error) {
        console.log(error);
    });

document.getElementById("discord").addEventListener("click", function() {
    window.location.href = link;
});