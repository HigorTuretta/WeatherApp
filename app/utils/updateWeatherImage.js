export function updateSVG(wheaterDescription, place){

const container = document.getElementById(place);
let wheater

switch (wheaterDescription){
    case '01d':
    case '01n': 
       wheater = 'Ensolarado' 
        break
    case '02d':
    case '02n': 
        wheater = 'PoucasNuvens' 
        break
    case '03d':
    case '03n': 
    case '04d':
    case '04n':
        wheater = 'Nublado' 
        break
    case '09d':
    case '09n':
    case '10d':
    case '10n':
        wheater = 'ChuvaLeve'
        break
    case '11d':
    case '11n':
            wheater = 'ChuvaForte'
            break
    default:
        wheater = 'error'
        break
}

container.src = `./images/svg/${wheater}.svg`;
container.setAttribute('alt', wheater);
}