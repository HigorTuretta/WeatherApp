import {
  updateImage,
  updateBackgroundImage,
  getImageScr,
} from "./app/utils/updateWeatherImage.js";
import moment from "moment-timezone";

//Variaveis e seleção de objetos
const apiKey = "22e966f689b50d30020f27ef9d990ccd";
const cityTemp = document.getElementById("cityTemperature");
const weatherDescription = document.getElementById("weather-description");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const windTax = document.getElementById("wind-tax");
const moistureTax = document.getElementById("moisture-tax");
const visibilityTax = document.getElementById("visibility-tax");
const cityInput = document.querySelector(".city-input");

const airQuality = document.getElementById("air-quality");
const airQualityMetric = document.getElementById("air-quality-metric");
const airPm25 = document.getElementById("pm25-value");
const airPm10 = document.getElementById("pm10-value");
const airSo = document.getElementById("so-value");
const airNo = document.getElementById("no-value");
const airO2 = document.getElementById("o2-value");
const airCo = document.getElementById("co-value");

const sunRise = document.querySelector(".sunrise-time");
const sunSet = document.querySelector(".sunset-time");

const pinLocation = document.querySelector(".locale > svg");

//chama as funções apos a conclusão do corregamento da DOM
document.addEventListener("DOMContentLoaded", function () {
  inputCitySizeAdjust();
  showWeatherData("Muriaé");
});

//Funções
const getWeatherData = async (city) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiURL);
  const data = await res.json();
  return data;
};

const getAirData = async (lat, lon) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const res = await fetch(apiURL);
  const data = await res.json();

  return data;
};

const getForecastData = async (lat, lon) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
  const res = await fetch(apiURL);
  const data = await res.json();
  return data;
};

const showWeatherData = async (city) => {
  const data = await getWeatherData(city);

  let visibility = data.visibility / 1000;
  if (!Number.isInteger(visibility)) {
    visibility = visibility.toFixed(2);
  }
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  const sunRiseTime = moment
    .utc(data.sys.sunrise, "X")
    .add(data.timezone, "seconds")
    .format("HH:mm a");
  const sunSetTime = moment
    .utc(data.sys.sunset, "X")
    .add(data.timezone, "seconds")
    .format("HH:mm a");

  cityTemp.innerHTML = parseInt(data.main.temp);
  weatherDescription.innerHTML = data.weather[0].description;
  tempMin.innerHTML = `${Math.round(data.main.temp_min)}º`;
  tempMax.innerHTML = `${Math.round(data.main.temp_max)}º`;
  updateImage(data.weather[0].icon, "weather-img");
  updateBackgroundImage(data.weather[0].icon);
  windTax.innerHTML = `${data.wind.speed}<span> km/h</span>`;
  moistureTax.innerHTML = `${data.main.humidity}<span> %</span>`;
  visibilityTax.innerHTML = `${visibility}<span> km</span>`;

  sunRise.innerHTML = sunRiseTime;
  sunSet.innerHTML = sunSetTime;

  showAirData(lat, lon);
  showForecastData(lat, lon);
};
//eventos
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = cityInput.value;
    showWeatherData(city);
  }
});

cityInput.addEventListener("blur", (event) => {
  if (cityInput.value == "" || cityInput.value == null) {
    cityInput.style.width = "0%";
  }
});

pinLocation.addEventListener("click", (event) => {
  cityInput.value = "";
  cityInput.focus();
  cityInput.style.width = "55%";
});

const showAirData = async (lat, lon) => {
  const data = await getAirData(lat, lon);
  const airMetric = data.list[0].main.aqi;
  let metricText;
  let colorText;
  switch (airMetric) {
    case 1:
      metricText = "Boa";
      colorText = "#87ebcd";
      break;
    case 2:
      metricText = "Razoável";
      colorText = "#93eb87";
      break;
    case 3:
      metricText = "Moderada";
      colorText = "#ebe987";
      break;
    case 4:
      metricText = "Ruim";
      colorText = "#ebb487";
      break;
    case 5:
      metricText = "Muito Ruim";
      colorText = "#eb8787";
      break;
    default:
      metricText = "Indisponível";
      colorText = "#d61b1b";
      break;
  }

  airQuality.innerHTML = metricText;
  airQuality.style.color = colorText;
  airQualityMetric.innerHTML = airMetric;
  airPm25.innerHTML = data.list[0].components.pm2_5;
  airPm10.innerHTML = data.list[0].components.pm10;
  airO2.innerHTML = data.list[0].components.o3;
  airNo.innerHTML = data.list[0].components.no2;
  airCo.innerHTML = data.list[0].components.co;
  airSo.innerHTML = data.list[0].components.so2;
};

const showForecastData = async (lat, lon) => {
  const data = await getForecastData(lat, lon);
  const weekArea = document.querySelector('.week-block')

  weekArea.innerHTML = '';

  const forecast = {};
  const today = new Date().getDay();
  const weekDays = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  data.list.forEach((item) => {
    const date = new Date(item.dt_txt);
    const diaSemana = weekDays[date.getDay()];

    if (!forecast[diaSemana] && date.getDay() !== today) {
      forecast[diaSemana] = {
        descricao: item.weather[0].description,
        icon: item.weather[0].icon,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
      };
    }
  });

  const sortedForecast = {};
  let dayIndex = today + 1;
  for (let i = 0; i < 5; i++) {
    if (dayIndex === 7) {
      dayIndex = 0;
    }
    const diaSemana = weekDays[dayIndex];
    sortedForecast[diaSemana === weekDays[today + 1] ? "Amanhã" : diaSemana] =
      forecast[diaSemana];
    dayIndex++;
  }

  for (const day in sortedForecast) {
    let dayHTML = ` <div class="day-of-week">
                      <div class="dow-title">${day}</div>
                      <div class="dow-img">
                        <img id="weather-img-tomorrow" src="${getImageScr(sortedForecast[day].icon)}" alt="">
                        <span class="tooltip-text">${sortedForecast[day].descricao}</span>
                      </div>
                      <div class="dow-temp">
                        <span id="day1-tempMax" >${Math.round(sortedForecast[day].tempMax)}º</span>
                        <span id="day1-tempMin">${Math.round(sortedForecast[day].tempMin)}º</span>
                      </div>
                    </div>`
    
    weekArea.innerHTML += dayHTML;
}

};

//Atualiza o tamanho do input do nome da cidade dinamicamente
function inputCitySizeAdjust() {
  cityInput.addEventListener("input", function () {
    this.style.width = this.value.length * 8 + "px";
  });
}
