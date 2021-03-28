

export const Api = {

   async makeApiCall(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  },

  async fetchPwsObservation (station, units, api_key) {
    const url =
      "https://api.weather.com/v2/pws/observations/current?stationId=" +
      station +
      "&format=json&units=" +
      units +
      "&apiKey=" +
      api_key;
    const data = await this.makeApiCall(url);
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

    return await this.makeApiCall(url);
  },
  searchNearestAirpot: async function(lat, lon, api_key){
    const url =
    "https://api.weather.com/v3/location/near?geocode=" +
    lat +
    "," +
    lon +
    "&format=json&lproduct=airport&apiKey=" +
    api_key;
    return await this.makeApiCall(url);
  },


// Search Airport by Geocode: Required Parameters: geocode, format, product, apiKey
// https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=airport&format=json&apiKey=yourApiKey
// Search Observation by Geocode: Required Parameters: geocode, format, product, apiKey 
// https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=observation&format=json&apiKey=yourApiKey
// Search PWS by Geocode: Required Parameters: geocode, format, product, apiKey 
// https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=pws&format=json&apiKey=yourApiKey
// Search Ski Resort by Geocode: Required Parameters: geocode, format, product, apiKey
// https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=ski&format=json&apiKey=yourApiKey




};
