var city = "";
var searchCity = $("#city-input")
var searchBtn = $("#search-btn")

$("#search-btn").on("click", function () {
    event.preventDefault();


    if (searchCity.val() === "") {
        console.log("Search button pressed, but no city inputed")
    } else {
        inputSwitch = true;
        showWeather();
    }
})

