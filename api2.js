function makeApiCall(url) {
    let result="";
    const request = async () => {
        const response = await fetch('url');
        const json = await response.json();
        console.log(json);
    }
    
    result = request();
    console.log(result);
    // const response = await fetch(url);
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    // return await response.json();
  }
  
  export function fetchPwsObservation(station, units, api_key) {
    const url =
      "https://api.weather.com/v2/pws/observations/current?stationId=" +
      station +
      "&format=json&units=" +
      units +
      "&apiKey=" +
      api_key;
    const data =  makeApiCall(url);
    return data.observations[0];
  }
  
  export async function fetchForecast(lat, lon, units, api_key) {
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
  }
  
  export async function searchNearestAirpot(lat, lon, api_key) {
    const url =
      "https://api.weather.com/v3/location/near?geocode=" +
      lat +
      "," +
      lon +
      "&format=json&lproduct=airport&apiKey=" +
      api_key;
    return await makeApiCall(url);
  }
  
  // Search Airport by Geocode: Required Parameters: geocode, format, product, apiKey
  // https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=airport&format=json&apiKey=yourApiKey
  // Search Observation by Geocode: Required Parameters: geocode, format, product, apiKey
  // https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=observation&format=json&apiKey=yourApiKey
  // Search PWS by Geocode: Required Parameters: geocode, format, product, apiKey
  // https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=pws&format=json&apiKey=yourApiKey
  // Search Ski Resort by Geocode: Required Parameters: geocode, format, product, apiKey
  // https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=ski&format=json&apiKey=yourApiKey
  