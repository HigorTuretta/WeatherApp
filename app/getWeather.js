import { updateSVG } from "./utils/updateweatherImage";

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

//chama as funções apos a conclusão do corregamento da DOM
document.addEventListener("DOMContentLoaded", function () {
  inputCitySizeAdjust();
  cityInput.value = "Muriaé, MG";
  showWeatherData("Muriaé");
});

//Funções
const getWeatherData = async (city) => {
  const apiweatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiweatherURL);
  const data = await res.json();
  return data;
};

const getAirData = async (lat, lon) => {
  const apiAirURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const res = await fetch(apiAirURL);
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

  cityTemp.innerHTML = parseInt(data.main.temp);
  weatherDescription.innerHTML = data.weather[0].description;
  tempMin.innerHTML = parseInt(data.main.temp_min);
  tempMax.innerHTML = parseInt(data.main.temp_max);
  updateSVG(data.weather[0].icon, "svg-container");
  windTax.innerHTML = `${data.wind.speed}<span> km/h</span>`;
  moistureTax.innerHTML = `${data.main.humidity}<span> %</span>`;
  visibilityTax.innerHTML = `${visibility}<span> km</span>`;

  showAirData(lat, lon);
};
//eventos
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = cityInput.value;
    showWeatherData(city);
  }
});

const showAirData = async (lat, lon) => {
  const data = await getAirData(lat, lon);
  const airMetric = data.list[0].main.aqi;
  let metricText;
  switch (airMetric) {
    case 1:
      metricText = "Boa";
      break;
    case 2:
      metricText = "Razoável";
      break;
    case 3:
      metricText = "Moderada";
      break;
    case 4:
      metricText = "Ruim";
      break;
    case 5:
      metricText = "Muito Ruim";
      break;
    default:
      metricText = "Indisponível";
      break;
  }

  airQuality.innerHTML = metricText;
  airQualityMetric.innerHTML = airMetric;
  airPm25.innerHTML = data.list[0].components.pm2_5;
  airPm10.innerHTML = data.list[0].components.pm10;
  airO2.innerHTML = data.list[0].components.o3;
  airNo.innerHTML = data.list[0].components.no2;
  airCo.innerHTML = data.list[0].components.co;
  airSo.innerHTML = data.list[0].components.so2;
};

//Atualiza o tamanho do input do nome da cidade dinamicamente
function inputCitySizeAdjust() {
  cityInput.addEventListener("input", function () {
    this.style.width = this.value.length * 8 + "px";
  });
}
