document.getElementById("name").addEventListener("keyup", function(event) {
    document.getElementById("submit").setAttribute("disabled", "disabled");

    document.getElementById("name").value = document.getElementById("name").value.replace(/ /g,"_")

    let len = document.getElementById("name").value.split("").length
    console.log(len)
    if (len > 2) {
        axios.get("https://api.temss.tech/v1/search/" + document.getElementById("name").value)
            .then(function (response) {
                let arena = response.data.arenas;
                for (let i = 0; i < arena.length; i++) {
                    let allow = arena[i][0] == document.getElementById("name").value.replace(/ /g,"_");
                    console.log(allow);
                }
                document.getElementById("submit").removeAttribute("disabled");
            });
    }
});

document.getElementById("submit").addEventListener("click", function(event) {
    localStorage.setItem('new_name', document.getElementById("name").value);
    window.location.href = "/create_map/editor";
});