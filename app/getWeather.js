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
  console.log(data);
  return data;
};

const showWeatherData = async (city) => {
  const data = await getWeatherData(city);

  let visibility = data.visibility / 1000;
  if (!Number.isInteger(visibility)) {
    visibility = visibility.toFixed(2);
  }

  cityTemp.innerHTML = parseInt(data.main.temp);
  weatherDescription.innerHTML = data.weather[0].description;
  tempMin.innerHTML = parseInt(data.main.temp_min);
  tempMax.innerHTML = parseInt(data.main.temp_max);
  updateSVG(data.weather[0].icon, "svg-container");
  windTax.innerHTML = `${data.wind.speed}<span> km/h</span>`;
  moistureTax.innerHTML = `${data.main.humidity}<span> %</span>`;
  visibilityTax.innerHTML = `${visibility}<span> km</span>`;
};
//eventos
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    let city = cityInput.value;
    showWeatherData(city);
  }
});

cityInput.addEventListener("blur", () => {
  let city = cityInput.value;
  showWeatherData(city);
});

//Atualiza o tamanho do input do nome da cidade dinamicamente
function inputCitySizeAdjust() {
  cityInput.addEventListener("input", function () {
    this.style.width = this.value.length * 8 + "px";
  });
}
