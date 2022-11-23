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
  miniDataCards
} from './functions/design';

// Function to get coordinates
async function getCoordinates(APIchoice, location) {
  // weather data forecast
  if (APIchoice === 1) {
    try {
      const coordinates = await latLongFetcher(location);
      getWeatherDataForecast(coordinates.lat, coordinates.lon);
    } catch (error) {
      console.log(error);
    }
  }

  // Current Weather
  else {
    try {
      const coordinates = await latLongFetcher(location);
      getWeatherDataCurrent(coordinates.lat, coordinates.lon);
    } catch (error) {
      console.log(error);
    }
  }
}

async function getWeatherDataForecast(lat, long) {
  const data = await weatherDataFetcher(lat, long);

  console.log(data);
}

async function getWeatherDataCurrent(lat, long) {
  const data = await currentWeather(lat, long);

  miniDataCards(data)
  currentWeatherCard(data);
}

bodyAppender();
getCoordinates(1);
getCoordinates(2);
