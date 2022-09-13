document.getElementById("search_bar").addEventListener("keyup", function(event) {
    axios.get("https://api.temss.tech/v1/search/" + document.getElementById("search_bar").value)
        .then(function (response) {
            let user = response.data.users;
            let arena = response.data.arenas;

            console.log(arena);

            document.getElementById("result_user").innerHTML = "<tr><td>Avatar</td><td>Nick</td></tr>";
            for (let i=0; i<user.length; i++) {
                document.getElementById("result_user").innerHTML += `<tr><td><img src="${user[i][1]}" width=80px alt="avatar"></td><td><a href="../user?id=${user[i][2]}">${user[i][0]}</a></td></tr>`;
            }

            document.getElementById("result_arena").innerHTML = "<tr><td>Nazwa</td><td>Ilość lokacji</td><td>Przejdź</td></tr>";
            for (let i=0; i<arena.length; i++) {
                console.log(arena[i]);
                document.getElementById("result_arena").innerHTML += `<tr><td>${arena[i][0]}</td><td>${JSON.parse(arena[i][1]).length}</td><td><a href="/play/?mode=${arena[i][0]}">🔥 Graj 🔥</a></td></tr>`;
            }
        });
});