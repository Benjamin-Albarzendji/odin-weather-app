/* eslint-disable no-use-before-define */
// Appends a content div to the body of the document

// Image cache from the icons folder

export { bodyAppender, currentWeatherCard, weatherCardRemover, miniDataCards };

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
  weatherTemp.innerText = ` ${data.main.temp}${unit}`;
  weatherTemp.className = 'weatherTemp';
  weatherCard.appendChild(weatherTemp);

  imageAppender(weatherCard, data.weather[0].icon);

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

  console.log(data);
}

// Creates the data mini cards above the main card
function miniDataCards(data, units = 'metric') {
  const unit = units === 'metric' ? '°C' : '°F';

  //  Card Container appended to content Div
  const cardContainer = document.createElement('div');
  weatherCard.className = 'weatherCard';
  contentDiv.appendChild(weatherCard);
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

function bodyAppender() {
  const { body } = document;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';

  body.appendChild(contentDiv);
}

function weatherCardRemover() {
  const weatherCard = document.querySelector('.weatherCard');
  weatherCard.remove();

  console.log('Removed');
}
