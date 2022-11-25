/* eslint-disable no-return-assign */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
// Appends a content div to the body of the document

import { eventListenerChainStarter } from '..';

// Image cache from the icons folder

export {
  bodyAppender,
  currentWeatherCard,
  weatherCardRemover,
  miniDataCards,
  forecastDataCards,
};

const cache = {};

importAll(require.context('../images/icons', false, /\.(png|jpe?g|svg)$/));

// Generates the current Weather Card
function currentWeatherCard(data, units = 'metric') {
  const unit = units === 'metric' ? '°C' : '°F';

  const contentDiv = document.querySelector('.content');

  // Weather Card appended to content Div
  const weatherCard = document.createElement('div');
  weatherCard.className = 'weatherCard';
  contentDiv.appendChild(weatherCard);

  // Weather card populated with data

  // Description div
  const description = document.createElement('div');
  const descriptionText = data.weather[0].description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  description.innerText = ` ${descriptionText}`;
  description.className = 'description';
  weatherCard.appendChild(description);

  // Weather Temp Div
  const weatherTemp = document.createElement('div');
  weatherTemp.innerText = ` ${Math.round(data.main.temp)}${unit}`;
  weatherTemp.className = 'weatherTemp';
  weatherCard.appendChild(weatherTemp);

  imageAppender(weatherCard, data.weather[0].icon);

  // max min Div
  const maxMin = document.createElement('div');
  maxMin.className = 'maxMin';
  const max = document.createElement('div');
  max.className = 'max';
  max.innerText = ` L: ${Math.round(data.main.temp_max)}°`;
  const min = document.createElement('div');
  min.className = 'min';
  min.innerText = ` H: ${Math.round(data.main.temp_min)}°`;
  maxMin.appendChild(max);
  maxMin.appendChild(min);

  weatherCard.appendChild(maxMin);

  // Location div
  const location = document.createElement('div');
  location.innerText = ` ${data.name}`;
  location.className = 'location';
  weatherCard.appendChild(location);

  // Date Div
  const date = document.createElement('div');
  const dateFormat = getDate(data.timezone);
  date.innerText = dateFormat.cityDate.slice(4);
  date.className = 'date';
  weatherCard.appendChild(date);

  // Time Div
  const time = document.createElement('div');
  const timeFormat = getTime(data.timezone);
  time.innerText = ` ${timeFormat.time.slice(0, 5)}`;
  time.className = 'time';
  weatherCard.appendChild(time);

  // Input field
  const input = document.createElement('input');
  input.required = true;
  input.placeholder = 'Search Location...';
  eventListenerAdder(input, 'keydown');
  weatherCard.appendChild(input);
}

// Creates the data mini cards above the main card
function miniDataCards(data, units = 'metric') {
  const speed = units === 'metric' ? 'm/s' : 'm/h';

  const contentDiv = document.querySelector('.content');

  //  Card Container appended to content Div
  const cardContainer = document.createElement('div');
  cardContainer.className = 'cardContainer';
  contentDiv.appendChild(cardContainer);

  // Feels like Div
  const feelsLikeCard = document.createElement('div');
  const feelsLike = document.createElement('div');
  const feelsLikeData = document.createElement('div');
  feelsLike.innerText = 'Feels like';
  feelsLikeData.innerText = `${Math.round(data.main.feels_like)}°`;
  feelsLikeCard.className = 'feelsLikeCard';
  feelsLikeCard.appendChild(feelsLike);
  feelsLikeCard.appendChild(feelsLikeData);
  cardContainer.appendChild(feelsLikeCard);

  // Humidity  Div
  const humidityCard = document.createElement('div');
  const humidity = document.createElement('div');
  const humidityData = document.createElement('div');
  humidity.innerText = 'Humidity';
  humidityData.innerText = `${data.main.humidity} %`;
  humidityCard.className = 'humidityCard';
  humidityCard.appendChild(humidity);
  humidityCard.appendChild(humidityData);
  cardContainer.appendChild(humidityCard);

  // Chance of Rain  Div
  const cOfRainCard = document.createElement('div');
  const cOfRain = document.createElement('div');
  const cOfRainData = document.createElement('div');
  cOfRain.innerText = 'Precipitation';
  if ('rain' in data) {
    cOfRainData.innerText = `${data.rain['1h'] * 100} %`;
  } else if ('snow' in data) {
    cOfRainData.innerText = `${data.snow['1h'] * 100} %`;
  } else {
    cOfRainData.innerText = `N/A`;
  }

  //   cOfRainData.innerText = `${data.rain['1h'] * 100} %`;
  cOfRainCard.className = 'cOfRainCard';
  cOfRainCard.appendChild(cOfRain);
  cOfRainCard.appendChild(cOfRainData);
  cardContainer.appendChild(cOfRainCard);

  // windSpeed Div
  const windSpeedCard = document.createElement('div');
  const windSpeed = document.createElement('div');
  const windSpeedData = document.createElement('div');
  windSpeed.innerText = 'Wind Speed';
  windSpeedData.innerText = `${data.wind.speed} ${speed}`;
  windSpeedCard.className = 'windSpeedCard';
  windSpeedCard.appendChild(windSpeed);
  windSpeedCard.appendChild(windSpeedData);
  cardContainer.appendChild(windSpeedCard);
}

function getTime(timezone) {
  const localTime = new Date().getTime();
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const currentUtcTime = localOffset + localTime;
  const cityOffset = currentUtcTime + 1000 * timezone;
  const cityTime = new Date(cityOffset).toTimeString().split(' ');
  return { time: cityTime[0] };
}

function getDate(timezone) {
  const localTime = new Date().getTime();
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const currentUtcTime = localOffset + localTime;
  const cityOffset = currentUtcTime + 1000 * timezone;
  const cityDate = new Date(cityOffset).toDateString();
  return { cityDate };
}

// To import all images via webpack require.context
function importAll(r) {
  r.keys().forEach((key) => (cache[key] = r(key)));
}

// Appends image to the Weather Card
function imageAppender(e, code = '01d') {
  const img = document.createElement('img');
  img.src = cache[`./${code}.png`].default;
  e.appendChild(img);
}

function forecastDataCards(data) {
  const contentDiv = document.querySelector('.content');

  //  Card Container appended to content Div
  const forecastCardContainer = document.createElement('div');
  forecastCardContainer.className = 'forecastCardContainer';
  contentDiv.appendChild(forecastCardContainer);

  // day 1 Card
  const day1Card = document.createElement('div');
  day1Card.className = 'day1Card';
  const day1Temp = document.createElement('div');
  const day1Date = document.createElement('div');

  day1Temp.innerText = `${Math.round(data.list[8].main.temp)}°`;
  const date = data.list[8].dt_txt.slice(0, 10);
  const dateObject1 = new Date(date);
  const day1DateData = dateObject1.toDateString();
  day1Date.innerText = day1DateData.slice(0, 3);

  forecastCardContainer.appendChild(day1Card);
  day1Card.appendChild(day1Date);
  day1Card.appendChild(day1Temp);
  imageAppender(day1Card, data.list[8].weather[0].icon);

  // day 2 Card
  const day2Card = document.createElement('div');
  day2Card.className = 'day2Card';
  const day2Temp = document.createElement('div');
  const day2Date = document.createElement('div');

  day2Temp.innerText = `${Math.round(data.list[16].main.temp)}°`;
  const date2 = data.list[16].dt_txt.slice(0, 10);
  const dateObject2 = new Date(date2);
  const day2DateData = dateObject2.toDateString();
  day2Date.innerText = day2DateData.slice(0, 3);

  forecastCardContainer.appendChild(day2Card);
  day2Card.appendChild(day2Date);
  day2Card.appendChild(day2Temp);
  imageAppender(day2Card, data.list[16].weather[0].icon);

  // day 3 Card
  const day3Card = document.createElement('div');
  day3Card.className = 'day3Card';
  const day3Temp = document.createElement('div');
  const day3Date = document.createElement('div');

  day3Temp.innerText = `${Math.round(data.list[24].main.temp)}°`;
  const date3 = data.list[24].dt_txt.slice(0, 10);
  const dateObject3 = new Date(date3);
  const day3DateData = dateObject3.toDateString();
  day3Date.innerText = day3DateData.slice(0, 3);

  forecastCardContainer.appendChild(day3Card);

  day3Card.appendChild(day3Date);
  day3Card.appendChild(day3Temp);
  imageAppender(day3Card, data.list[24].weather[0].icon);

  // day 4 Card
  const day4Card = document.createElement('div');
  day4Card.className = 'day4Card';
  const day4Temp = document.createElement('div');
  const day4Date = document.createElement('div');

  day4Temp.innerText = `${Math.round(data.list[32].main.temp)}°`;
  const date4 = data.list[32].dt_txt.slice(0, 10);
  const dateObject4 = new Date(date4);
  const day4DateData = dateObject4.toDateString();
  day4Date.innerText = day4DateData.slice(0, 3);

  forecastCardContainer.appendChild(day4Card);

  day4Card.appendChild(day4Date);
  day4Card.appendChild(day4Temp);
  imageAppender(day4Card, data.list[32].weather[0].icon);

  // day 5 Card
  const day5Card = document.createElement('div');
  day5Card.className = 'day5Card';
  const day5Temp = document.createElement('div');
  const day5Date = document.createElement('div');

  day5Temp.innerText = `${Math.round(data.list[39].main.temp)}°`;
  const date5 = data.list[39].dt_txt.slice(0, 10);
  const dateObject5 = new Date(date5);
  const day5DateData = dateObject5.toDateString();
  day5Date.innerText = day5DateData.slice(0, 3);

  forecastCardContainer.appendChild(day5Card);

  day5Card.appendChild(day5Date);
  day5Card.appendChild(day5Temp);
  imageAppender(day5Card, data.list[39].weather[0].icon);
}

function bodyAppender() {
  const { body } = document;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';

  body.appendChild(contentDiv);
}

function weatherCardRemover() {
  const weatherCard = document.querySelector('.weatherCard');
  weatherCard.remove();

  const dataCards = document.querySelector('.cardContainer');
  dataCards.remove();

  const foreCastCards = document.querySelector('.forecastCardContainer');
  foreCastCards.remove();
}

function eventListenerAdder(object, event = 'click') {
  if (event === 'keydown') {
    object.addEventListener(event, (e) => {
      if (e.keyCode === 13) {
        eventListenerChainStarter(e.target.value);
      }
    });
  }
}
