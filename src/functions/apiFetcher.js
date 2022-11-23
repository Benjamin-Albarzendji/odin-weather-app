async function latLongFetcher(location = 'Stockholm') {
  try {
    const geoCoordinates = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=fb7870376af0a09b9d81956c74c34876`
    );

    const geoCordsJSONED = await geoCoordinates.json();
    const { lat } = geoCordsJSONED[0];
    const { lon } = geoCordsJSONED[0];

    return { lat, lon };

    // return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    return error;
  }
}

async function weatherDataFetcher(lat, long, units = 'metric') {
  const unit = units === 'metric' ? 'metric' : 'imperial';

  try {
    const weatherData = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=fb7870376af0a09b9d81956c74c34876&units=${unit}`
    );

    const weatherDataJSON = await weatherData.json();

    return weatherDataJSON;
  } catch (error) {
    return error;
  }
}

async function currentWeather(lat, long, units = 'metric') {
  const unit = units === 'metric' ? 'metric' : 'imperial';

  try {
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=fb7870376af0a09b9d81956c74c34876&units=${unit}`
    );

    const weatherDataJSON = await weatherData.json();

    return weatherDataJSON;
  } catch (error) {
    return error;
  }
}

export { latLongFetcher, weatherDataFetcher, currentWeather };
