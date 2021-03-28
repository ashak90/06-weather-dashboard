$(function () {
    var searchCity = $("#city-input")
    var inputSwitch;
    const apiKey = "5a2c99614ab6e6f319b1c6d71933e13f";
    var searchHistoryArray = [];
    var todaysDate = moment().format("MM/D/YYYY")
    const numberOfDaysToForcast = 5;

    $("#search-btn").on("click", function () {
        event.preventDefault();

        if (searchCity.val() === "") {
            console.log("Search button pressed, but no city inputed")
            alert("Please enter a city name")
        } else {
            inputSwitch = true;
            showWeather();
        }
        
    })

    $(document).on("click",".list-group-item", function () {
        console.log("Previously searched city")
        inputSwitch = false;
        listCity = $(this).text();
        showWeather();
    })


    function showWeather() {
        event.preventDefault();

        if (inputSwitch) {
            cityName = searchCity.val();
        } else {
            cityName = listCity;
        }

        $("#header-row").empty();
        $("#current-weather-info").empty();
        // $("#forecast-header").empty();
        $("#forecast-row").empty();

        var currentWeatherQueryUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            cityName +
            "&units=imperial&appid=" +
            apiKey

        $.ajax({
            url: currentWeatherQueryUrl,
            method: "GET",
        }).then(function (response) {
            console.log(response)
            cityName = response.name

            if (response) {
                if (searchHistoryArray.includes(cityName) === false) {
                    populateSearchField();
                }
            } else {
                alert("Please enter a valid city nane");
            }
            cityNameAndDate = $("<h4>").text(response.name + ' ' + "(" + todaysDate + ")");
            currentCondIcon = $("<img id='current-conditions-icon'>").attr(
                "src",
                "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
            )
            $("#header-row").append(cityNameAndDate, currentCondIcon);
            
            
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

            var latitude = response.coord.lat;
            var longitude = response.coord.lon;

            var currentUVQueryUrl =
                "https://api.openweathermap.org/data/2.5/uvi?appid=" +
                apiKey +
                "&lat=" +
                latitude +
                "&lon=" +
                longitude;

            $.ajax({
                url: currentUVQueryUrl,
                method: "GET"
            }).then(function (response) {

                currentUVLabel = $("<span>").text("UV Index: ");
                currentUVBadge = $("<span>").text(response.value);
                $("#current-weather-info").append(currentUVLabel, currentUVBadge);
                console.log(response.value)
                if (response.value < 3) {
                    // green
                    currentUVBadge.addClass("uv-low");
                } else if (response.value >= 3 && response.value < 6) {
                    //yellow 
                    currentUVBadge.addClass("uv-med");
                } else if (response.value >= 6 && response.value < 8) {
                    //orange
                    currentUVBadge.addClass("uv-high")
                } else if (response.value >= 8 && response.value < 10) {
                    currentUVBadge.addClass("uv-very-high")
                } else {
                    currentUVBadge.addClass("uv-extremely-high")
                }
            });

            var forcastQueryUrl =
                "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
                latitude +
                "&lon=" +
                longitude +
                "&exclude=current,minutely,hourly&appid=" +
                apiKey;

            $.ajax({
                url: forcastQueryUrl,
                method: "GET",
            }).then(function (response) {
                $("#forecast-header").text("5-day Forecast")

                for (let i = 1; i < numberOfDaysToForcast + 1; i++) {
                    var forcastCard = $("<div class= 'card forecast card-body col-sm-2'>")

                    var forcastDayEl = $("<h5>")
                    var unixSeconds = response.daily[i].dt;
                    var unixMilliseconds = unixSeconds * 1000;
                    var forcastDateUnix = new Date(unixMilliseconds);
                    var forcastDayOfWeek = forcastDateUnix.toLocaleString("en-US", {
                        weekday: "long",
                    });

                    forcastDayEl.text(forcastDayOfWeek);

                    var forcastIndex = i*8 +4; 
                    var forcastDate = new Date(response.daily[i].dt*1000);
                    var forcastDay = forcastDate.getDate();
                    var forcastMonth = forcastDate.getMonth() + 1 ;
                    var forcastYear = forcastDate.getFullYear();
                    // var forcastDateEl = document.createElement("h5")
                    var forcastDateEl = forcastMonth + "/" + forcastDay + "/" + forcastYear;
                    console.log(forcastDateEl)

                    // forcastDayEl.append(forcastDateEl)











                    var hrLine = $("<hr />");

                    var iconPara = $("<p>");
                    var iconImg = $("<img>");
                    iconImg.attr(
                        "src",
                        "http://openweathermap.org/img/wn/" +
                        response.daily[i].weather[0].icon +
                        ".png"
                    );
                    iconPara.append(iconImg)

                    var tempInfo = $("<p>").text(
                        "Temp: " + Math.round(response.daily[i].temp.day) + "°F"
                    );

                    var humidityInfo = $("<p>").text(
                        "Humidity: " + response.daily[i].humidity + "%"
                    );

                    forcastCard.append(
                        forcastDayEl,
                        forcastDateEl,
                        hrLine,
                        iconPara,
                        tempInfo,
                        humidityInfo
                    );

                    $("#forecast-row").append(forcastCard)

                }
            })




        })
    }

    function populateSearchField() {
        $("#search-history").empty();
        searchHistoryArray.push(cityName);
        console.log("searchHistoryArray: " + searchHistoryArray);
        localStorage.setItem("Weather search history", searchHistoryArray);

        for (let i = 0; i < searchHistoryArray.length; i++) {
            var searchTerm = $("<li>").text(searchHistoryArray[i]);
            searchTerm.addClass("list-group-item");
            $("#search-history").prepend(searchTerm);
        }
    }

})