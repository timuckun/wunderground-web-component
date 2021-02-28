import {Api } from './api.js';
import {Cache} from './cache.js';

const wunderground_template = document.createElement("template");
wunderground_template.innerHTML = `
      <div class='wunderground_widget'>
				<div class='wunderground_header'>
				 <!-- Possible link to weather underground? -->	
        </div>
				<div class='wunderground_location'>
					<div class='wunderground_location-data'>
						<div class='wunderground_neighborhood'></div>
						<div class='wunderground_stationID'>
            </div>
						<div class='wunderground_datetime'></div>
					</div>
				</div>
				<div class='wunderground_dashboard'>
		    </div>
			</div>`;

class WundergroundStation extends HTMLElement {
  constructor(station, api_key, units) {
    super();
    this.attachShadow({ mode: "open" });
  } // constructor

  connectedCallback() {
    // console.log(this);
    this.station = this.getAttribute("station");
    if (!this.station) {
      throw "station attribute is required";
    }
    this.api_key = this.getAttribute("api_key") || secret_api_key;
    if (!this.api_key) {
      throw "api_key attribute is required";
    }

    this.units = this.getAttribute("units") || "m";
    if (!["m", "e", "h", "s"].includes(this.units)) {
      throw "units attribute must be one of e (imperial), m (metric), h (uk_hybrid) or s (metric_si)";
    }
 
    this.locale=this.getAttribute('locale') || "en-NZ"
    // Just in case people want to style multiple stations differently I guess.
    this.id = "station_" + this.station;

    this.shadowRoot.appendChild(wunderground_template.content.cloneNode(true));

    this.refresh();
  } //connectedCallback

  refresh() {
 
    
    this.fetchWeather();

    // now that I have the observation and the forecast I can go ahead and populate more of the dib
  }

  

  // async fetchPwsObservation(station, units, api_key) {
  //   const url =
  //     "https://api.weather.com/v2/pws/observations/current?stationId=" +
  //     station +
  //     "&format=json&units=" +
  //     units +
  //     "&apiKey=" +
  //     api_key;
  //   const data = await this.makeApiCall(url);
  //   return data.observations[0];
  // }
  // async fetchForecast(lat, lon, units, api_key) {
  //   const url =
  //     "https://api.weather.com/v3/wx/forecast/daily/5day?geocode=" +
  //     lat +
  //     "," +
  //     lon +
  //     "&format=json&language=en-US&units=" +
  //     units +
  //     "&apiKey=" +
  //     api_key;

  //   return await this.makeApiCall(url);
  // }
  async fetchWeather() {
    const current = await Api.fetchPwsObservation(
      this.station,
      this.units,
      this.api_key
    );

    console.log(current);

    const forecast = await Api.fetchForecast(
      current["lat"],
      current["lon"],
      this.units,
      this.api_key
    );

    const datetime = new Date(current.obsTimeLocal);
    this.setDateTime(datetime, this.locale)
 
    const neighborhood = current.neighborhood;
    this.setStationLink(neighborhood);
  }

  setDateTime(datetime, locale = "en-NZ") {
    const  options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const datestring= datetime.toLocaleDateString(locale, options);
    const div=this.getElement('.wunderground_datetime');
    div.innerHTML=datestring;
  }

  setStationLink(desc) {
    const div = this.getElement(".wunderground_stationID");
    const a = document.createElement("a");
    const txt = document.createTextNode(desc);
    //a.title=desc;
    a.href = "https://www.wunderground.com/dashboard/pws/" + this.station;
    a.target = "_blank";
    a.appendChild(txt);
    div.appendChild(a);
  }


  // UTIL FUNCTIONS

  getElement(class_name) {
    return this.shadowRoot.querySelector(class_name);
  }

  // async makeApiCall(url) {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }
  //   return await response.json();
  // }


 
  
}

customElements.define("wunderground-station", WundergroundStation);
