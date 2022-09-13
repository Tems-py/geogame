document.getElementById("hide_bar").addEventListener("click", function() {
    document.getElementById("bar").style.display = "none";
    document.getElementById("show_bar").style.display = "block";
    document.getElementById("content").style.paddingLeft = "0px";
});

document.getElementById("show_bar").addEventListener("click", function() {
    document.getElementById("bar").style.display = "flex";
    document.getElementById("show_bar").style.display = "none";
    document.getElementById("content").style.paddingLeft = "20px";
});