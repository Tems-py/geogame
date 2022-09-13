let regions;

if (window.location.search.includes("mode")){
    document.getElementById("content").innerHTML = `
        <h1>Komputer</h1>
        <input type="button" value="💻" onclick="window.location.href = '/game/?mode=${window.location.search.split("mode=")[1]}'"><br>
        <h1>Telefon</h1>
        <input type="button" value="📱" onclick="window.location.href = '/mobile_view/?mode=${window.location.search.split("mode=")[1]}'"><br>
    `

} else{

    axios.get("https://api.temss.tech/v1/regions")
        .then(function (response) {
            regions = response.data.regions;
            for (let i=0; i<regions.length; i++) {
                document.getElementById("region").innerHTML += `<option value="${regions[i]}">${regions[i]}</option>`;
                document.getElementById("region2").innerHTML += `<option value="${regions[i]}">${regions[i]}</option>`;
            }
        });
}