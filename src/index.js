/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import {
  latLongFetcher,
  weatherDataFetcher,
  currentWeather,
} from './functions/apiFetcher';
import './style/style.css';
import {
  bodyAppender,
  currentWeatherCard,
  weatherCardRemover,
  miniDataCards,
  forecastDataCards,
} from './functions/design';

export { eventListenerChainStarter };

// Initial run on firt visit
bodyAppender();
getCoordinates(2);
getCoordinates(1);

// Function to get coordinates
async function getCoordinates(APIchoice, location) {
  // weather data forecast
  if (APIchoice === 1) {
    try {
      const coordinates = await latLongFetcher(location);
      if (coordinates === '!200') {
        return 0;
      }
      const check = await getWeatherDataForecast(
        coordinates.lat,
        coordinates.lon
      );
      if (check === 0) {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Current Weather
  else {
    try {
      const coordinates = await latLongFetcher(location);
      if (coordinates === '!200') {
        warningText();
        return 0;
      }
      const check2 = await getWeatherDataCurrent(
        coordinates.lat,
        coordinates.lon
      );
      if (check2 === 0) {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// Function to get weather data forecast
async function getWeatherDataForecast(lat, long) {
  const data = await weatherDataFetcher(lat, long);

  forecastDataCards(data);
}

//  get weather data current
async function getWeatherDataCurrent(lat, long) {
  const data = await currentWeather(lat, long);

  if (data === '!200') {
    warningText();
    return 0;
  }

  miniDataCards(data);
  currentWeatherCard(data);
}

// Exported to design to connect eventlistener data
async function eventListenerChainStarter(location) {
  const status = await getCoordinates(2, location);
  if (status === 0) {
    return 0;
  }
  weatherCardRemover();
  await getCoordinates(1, location);
}

// Warning Text inserter
function warningText(mode = 1) {
  if (mode === 1) {
    const weatherCard = document.querySelector('.weatherCard');

    const warningTextDiv = document.createElement('div');
    warningTextDiv.className = 'warning';
    warningTextDiv.innerText = 'Location not found.';
    weatherCard.appendChild(warningTextDiv);
  }
}
