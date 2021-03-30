import * as Api from "./api.js";
import * as Cache from "./cache.js";
//import { unit_dictionary } from "./utils.js";
import * as Utils from "./utils.js";
import * as Template from "./template.js";

import { T } from "./test.js";

class WundergroundStation extends HTMLElement {
  constructor() {
    super();

    const station = this.getAttribute("station");
    if (!station) {
      throw "station attribute is required";
    }

    const api_key = this.getAttribute("api_key") || secret_api_key;
    if (!api_key) {
      throw "api_key attribute is required";
    }

    const units = this.getAttribute("units") || "m";
    const measure_units = Utils.unit_dictionary[units];

    if (!measure_units) {
      throw "units attribute must be one of e (imperial), m (metric), h (uk_hybrid) or s (metric_si)";
    }

    measure_units.abbrev = units;
    const locale = this.getAttribute("locale") || "en-NZ";
    // Just in case people want to style multiple stations differently I guess.
    //this.id = "station_" + this.station;

    const template_id = this.getAttribute("template_id");

    if (!template_id) {
      throw "template_id is required";
    }
    let template = document.getElementById(template_id);
    if (!template) {
      throw "specified template " + template_id + " does not exist in the DOM ";
    }
    this.template = template;
    this.attachShadow({ mode: "open" });

    this.templateContent = template.content;
    this.data = { api_key, station, units, locale };
    this.api_key = api_key;
    this.station = station;

    this.units = measure_units;
    this.locale = locale;
    this.measure_units = measure_units;
  } // constructor

  connectedCallback() {
    // console.log(this);

    console.log(this.template_id);

    console.log(this.data);

    //this.shadowRoot.appendChild(wunderground_template.content.cloneNode(true));

    this.refresh();
  } //connectedCallback

   render_template(template) {
    var ex = /{{(.+?)}}/;
    while (template.match(ex)) {
      const match = template.match(ex);
      const value = eval('this.' + match[1])
      if (value){
      template = template.replace(match[0], value);
      }else{
        template= template.replace(match[0], "'" + match[1] + "' is not defined")
      }
    }
    return template;
  }

  
  refresh() {
    //T.test();
    let templateContent = this.templateContent;

    console.log(templateContent);
    console.log(this.template.innerHTML);
    templateContent = this.template.innerHTML;

    //this.fetchWeather();
  // templateContent = Template.render(templateContent, this);
    templateContent=this.render_template(templateContent);

    console.log(templateContent);

    //this.shadowRoot.appendChild(templateContent.cloneNode(true));
    this.shadowRoot.innerHTML = templateContent;
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
    const key = this.station + "_observation";
    const station = this.station;
    const units = this.units;
    const api_key = this.api_key;

    const obs = await Cache.memoize(key, Cache.NegativeInfinity, () => {
      console.log(station);
      Api.fetchPwsObservation(station, units, api_key);
    });
    console.log(obs);
  }
  async fetchWeather_old() {
    const current = await Api.fetchPwsObservation(
      this.station,
      this.units,
      this.api_key
    );

    console.log(current);

    // const forecast = await Api.fetchForecast(
    //   current["lat"],
    //   current["lon"],
    //   this.units,
    //   this.api_key
    // );

    // const datetime = new Date(current.obsTimeLocal);
    // this.setDateTime(datetime, this.locale);

    // const neighborhood = current.neighborhood;
    // this.setStationLink(neighborhood);
  }

  setDateTime(datetime, locale = "en-NZ") {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const datestring = datetime.toLocaleDateString(locale, options);
    const div = this.getElement(".wunderground_datetime");
    div.innerHTML = datestring;
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
