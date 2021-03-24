var city = "";
var searchCity = $("#city-input")
var searchBtn = $("#search-btn")
var inputSwitch; 
const apiKey = "5a2c99614ab6e6f319b1c6d71933e13f";
var searchHistoryArray = [];
var todaysDate = moment().format ("MM/D/YYYY")


$("#search-btn").on("click", function () {
    event.preventDefault();


    if (searchCity.val() === "") {
        console.log("Search button pressed, but no city inputed")
    } else {
        inputSwitch = true;
        showWeather();
    }
})

function showWeather(){
    event.preventDefault();

    if (inputSwitch) {
        cityName = searchCity.val();
    } else {
        cityName = listCity; 
    }

    $("#header-row").empty();
    $("#current-weather-info").empty();
    $("#forecast-header").empty();
    $("#forecast-row").empty();

    var currentWeatherQueryUrl = 
    "https://api.openweathermap.org/data/2.5/weather?q=" +
     cityName + 
    "&units=imperial&appid=" + 
    apiKey

    $.ajax({
        url: currentWeatherQueryUrl,
        method:"GET",
    }).then(function(response){
        console.log(response)
        cityName = response.name 

        if (response) {
            if (searchHistoryArray.includes(cityName)===false){
                populateSearchField();
            }
        } else {
            alert("Please enter a valid city nane");
        }
        cityNameAndDate = $("<h4>").text(response.name + ' ' + "(" + todaysDate + ")");
        $("#header-row").append(cityNameAndDate);
        currentTempEl = $("<p>").text(
            "Temperature: " + Math.round(response.main.temp) + "°F"
        );
        currentHumidityEl = $("<p>").text(
            "Humidity: " + response.main.humidity + "%"
        );
        currentWindEl = $("<p>").text(
            "Wind Speed: " + Math.round(response.wind.speed) + "MPH"
        );

        $("#current-weather-info").append(
            currentTempEl,
            currentHumidityEl, 
            currentWindEl
        );
    })
}

function populateSearchField(){
    $("#search-history").empty();
    searchHistoryArray.push(cityName);

    for (let i=0; i<searchHistoryArray.length; i++){
        var searchTerm = $("<li>").text(searchHistoryArray[i]);
        searchTerm.addClass("list-group-item");
        $("#search-history").prepend(searchTerm);
    }
}
