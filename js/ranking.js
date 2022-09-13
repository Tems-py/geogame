axios.get("https://api.temss.tech/v1/ranking/50")
    .then(function (response) {
        console.log(response.data);
        let ranking = response.data;
        for (let i=0; i<ranking.length; i++) {
            document.getElementById("ranking").innerHTML += `<tr><td>${i+1}</td><td><img src="${ranking[i][5]}" alt="avatar" width=20px> <a href="/user?id=${ranking[i][1]}">${ranking[i][4]}</a> </td><td>${ranking[i][3]}</td><td>${ranking[i][2] / 1000}</td></tr>`;
        }
    });