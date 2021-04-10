//  async function makeApiCall(url) {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
//   return response.json();
// }
function makeApiCall(url) {
  let retval;
  let x = fetch('url')
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then(function(json) {
    return json
    })
    console.log(x)
    let y = Promise.all([x])
    console.log(y);
    y = Promise.all([x]).then(values => console.log(values));
    console.log(y)
}
export  function fetchPwsObservation(station, units, api_key) {
  const url =
    "https://api.weather.com/v2/pws/observations/current?stationId=" +
    station +
    "&format=json&units=" +
    units +
    "&apiKey=" +
    api_key;
  var data="";
  let d2;
   d2=makeApiCall(url).then(value => value);
   console.log('d2');
   console.log(d2);
   console.log(Promise.resolve(d2));
   console.log('data')
   console.log(data);
  //return data.observations[0];
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
