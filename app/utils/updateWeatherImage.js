export function updateImage(weatherdesc, place) {
  const container = document.getElementById(place);
  
  let weather = getWeatherDescription(weatherdesc)

  container.src = `/images/weatherImages/${weather}.png`;
  container.setAttribute("alt", weather);
}



export function updateBackgroundImage(weatherdesc){
  const backgroundArea = document.querySelector('.weather-block')
  let weather = getWeatherDescription(weatherdesc)

  console.log(weather)
  
  let url = `/images/backgrounds/bg_${weather}.png`
  backgroundArea.style.backgroundImage = `linear-gradient(
    to bottom,
    rgba(75, 7, 69, 0.500),
    rgba(79, 5, 97, 0.126)
  ),
  url("/images/backgrounds/bg_${weather}.png");`

    console.log(url)

}

function getWeatherDescription(weatherdesc){
  let weather;

  switch (weatherdesc) {
    case "01d":
      weather = "Ensolarado";
      break;
    case "01n":
      weather = "CeuLimpo";
      break;
    case "02d":
      weather = "SolEntreNuvens";
      break;
    case "02n":
      weather = "NoiteComNuvens";
      break;
    case "03d":
    case "03n":
      weather = "NuvensDispersas";
      break;
    case "04d":
    case "04n":
      weather = "Nublado";
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      weather = "ChuvaLeve";
      break;
    case "11d":
    case "11n":
      weather = "ChuvaForte";
      break;
    default:
      weather = "error";
      break;
  }

  return weather;
}