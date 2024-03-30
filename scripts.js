let latlong = "";
const Kelvin = 273.15;
const Deg = "\u00B0";
function searchCityString() {
  let input = document.getElementById("searchCity").value;
  callAPI(input);
  //console.log(callResponse);
}

function callAPI(city = "new york") {
  let callResponse = "";
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=2&appid=fb1ebcfadaae262fda9f426e1a384d5e`;
  fetch(geoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      callResponse = data;

      //console.log(data[0]);

      //const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=fb1ebcfadaae262fda9f426e1a384d5e`;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=fb1ebcfadaae262fda9f426e1a384d5e`;
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          //document.getElementById("cityName").innerText = data;
          document.getElementById("cityName").innerText =
            data.name + ", " + data.sys.country;
          document.getElementById("currentTemp").innerText =
            Math.ceil(data.main.temp - Kelvin) + Deg;
          let desc = data.weather[0].description;
          desc = titleCase(desc);
          document.getElementById("weatherDescription").innerText = desc;
          document.getElementById("minimumTemp").innerText =
            "L:" + Math.floor(data.main.temp_min - Kelvin) + Deg;
          document.getElementById("maximumTemp").innerText =
            "H:" + Math.ceil(data.main.temp_max - Kelvin) + Deg;
          const sevenDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=fb1ebcfadaae262fda9f426e1a384d5e`;
          fetch(sevenDayUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              //build each element
              let item = "";
              console.log(data);
              document.getElementById("fiveDay").innerHTML = "";
              for (const key of data.list) {
                item += '<div class="forecast"><div id="forContainer"><p>';
                const d = new Date(key.dt_txt);
                let day = d.toDateString().slice(0, 3);
                let time = d.toString().slice(16, 21);

                item += day + ", " + time + "<p/>";
                let iconString =
                  "https://openweathermap.org/img/wn/" +
                  key.weather[0].icon +
                  "@2x.png";
                item += '<img id="icon" src=' + iconString + " />";
                item +=
                  "<p>" + Math.floor(key.main.temp - Kelvin) + Deg + "</p>";
                item += "</div></div>";
                document.getElementById("fiveDay").innerHTML += item;
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });

          //console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Define the API URL

  // Make a GET request
}
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}
