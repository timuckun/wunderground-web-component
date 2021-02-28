import { Cache } from "./cache.js";

async function makeApiCall(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export const Api = {
  fetchPwsObservation: async function (station, units, api_key) {
    const url =
      "https://api.weather.com/v2/pws/observations/current?stationId=" +
      station +
      "&format=json&units=" +
      units +
      "&apiKey=" +
      api_key;
    const data = await makeApiCall(url);
    return data.observations[0];
  },

  fetchForecast: async function (lat, lon, units, api_key) {
    const url =
      "https://api.weather.com/v3/wx/forecast/daily/5day?geocode=" +
      lat +
      "," +
      lon +
      "&format=json&language=en-US&units=" +
      units +
      "&apiKey=" +
      api_key;

    return await makeApiCall(url);
  },
};
