import * as Api from "./api.js";
import * as Cache from "./cache.js";
//import { unit_dictionary } from "./utils.js";
import * as Utils from "./utils.js";
import * as Template from "./template.js";

import { T } from "./test.js";

class WundergroundStation extends HTMLElement {
  constructor() {
    super();
    this.station = {};

    const station = this.getAttribute("station");
    if (!station) {
      throw "station attribute is required";
    }
    this.station.id = station;

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

    this.templateContent = template.innerHTML;
    this.data = { api_key, station, units, locale };
    this.api_key = api_key;
    this.station.id = station;

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
    var ex = /{{\s*(.+?)\s*}}/;
    while (template.match(ex)) {
      const match = template.match(ex);
      const value = eval("this." + match[1]);
      if (value) {
        template = template.replace(match[0], value);
      } else {
        template = template.replace(
          match[0],
          "'" + match[1] + "' is not defined"
        );
      }
    }
    return template;
  }

  async refresh() {
    await this.fetchWeather();
    //T.test();
    let templateContent = this.templateContent;
    //console.log(this.template.innerHTML)
    //console.log(this.templateContent)
    // console.log(this.templateContent.innerHTML);
    ///let templateContent = this.template.innerHTML;

    //templateContent = Template.render(templateContent,this);
    templateContent = this.render_template(templateContent);

    //this.shadowRoot.appendChild(templateContent.cloneNode(true));
    this.shadowRoot.innerHTML = templateContent;
    // now that I have the observation and the forecast I can go ahead and populate more of the dib
  }

  async fetchWeather() {
    const cache_key = this.station.id + "_observation";
    // I am not sure how often the updates are.
    const cache_duration = Cache.ONE_MINUTE * 15;
    const obs = await this.memoize(cache_key, cache_duration, async () => {
      return await Api.fetchPwsObservation(
        this.station.id,
        this.units.abbrev,
        this.api_key
      );
    });
    console.log(obs);
    // map the metrics to the top level object to make more sense for the template rendering
    this.setObservation(obs);
    //const cache_duration = Cache.NEVER;
    //const observation = await Api.fetchPwsObservation(this.station.id, this.units.abbrev, this.api_key);
    //console.log(observation);
    //    {
    //     "stationID": "ITAURA99",
    //     "obsTimeUtc": "2021-04-01T10:30:43Z",
    //     "obsTimeLocal": "2021-04-01 23:30:43",
    //     "neighborhood": "Whakamarama",
    //     "softwareType": null,
    //     "country": "NZ",
    //     "solarRadiation": null,
    //     "lon": 175.981,
    //     "realtimeFrequency": null,
    //     "epoch": 1617273043,
    //     "lat": -37.737,
    //     "uv": null,
    //     "winddir": 248,
    //     "humidity": 85,
    //     "qcStatus": -1,
    //     "metric": {
    //         "temp": 13,
    //         "heatIndex": 13,
    //         "dewpt": 10,
    //         "windChill": 13,
    //         "windSpeed": 3,
    //         "windGust": 3,
    //         "pressure": 1022.01,
    //         "precipRate": 0,
    //         "precipTotal": 0.25,
    //         "elev": 311
    //     }
    // }
    //2021-04-01 23:30:07
    //const obs = Api.fetchPwsObservation(this.station.id, this.units.abbrev, this.api_key)
  }
  async getObservation(){

  }
  setObservation(observation) {
    // This is going to be populated and returned.
    const h ={};
    // Some mappings.
    const obs = {
      country: "NZ",
      epoch: "epoch",
      humidity: "humidity",
      lat: "lat",
      lon: "lon",
      neighborhood: "neighborhood",
      obsTimeLocal: "localTime",
      obsTimeUtc: "utcTime",
      qcStatus: "status",
      realtimeFrequency: "realtimeFrequency",
      softwareType: "softwareType",
      solarRadiation: "solarRadiation",
      stationID: "stationID",
      uv: "uv",
      winddir: "windDirection",
    };
    // metrics have units.
    const metrics = {
      dewpt: ["dewPoint", 'temp'],
      elev: ["elevation", 'alt'],
      heatIndex: ["heatIndex",'temp'],
      precipRate: ["precipRate",
      precipTotal: "precipTotal",
      pressure: "pressure",
      temp: "temp",
      windChill: "windChill",
      windGust: "windGust",
      windSpeed: "windSpeed",
    };

    // This function extracts the data from the observation and  normalizes them
    const h = {};
    // Fist extract the station information
    this.station.country = obs.country;
    this.station.elevation = obs.metric.elev;
    this.station.lat = obs.lat;
    this.station.lon;
    this.station.neighborhood = obs.neighborhood;

    // Not used...

    // solarRadiation: null
    // uv: null
    //some data is at the root object

    h.heatIndex = obs.heatIndex;
    h.humidity = `${obs.humidity} %`;
    h.temp = obs.temp;
    const time = new Date(obs.obsTimeLocal);
    h.time = Utils.formatDateTime(time, this.locale);
    // obsTimeUtc: "2021-04-17T11:58:02Z"
    h.precipRate = obs.precipRate;
    h.precipTotal = obs.precipTotal;
    h.pressure = obs.pressure;
    h.solarRadiation = obs.solarRadiation;
    h.uv = obs.uv;
    h.windDirection = obs.windir; // wind direction is at the top level but speed is in metric
    // qcStatus: 1

    // temp: 8

    // metric:
    h.dewPoint = obs.metric.dewpt;

    // heatIndex: 8
    // precipRate: 0
    // precipTotal: 0
    // pressure: 1023.03
    // temp: 8
    // windChill: 8
    // windGust: 0
    // windSpeed: 0
    // __proto__: Object

    // obsTimeLocal: "2021-04-17 23:58:02"
    // obsTimeUtc: "2021-04-17T11:58:02Z"
    // precipRate: 0
    // precipTotal: 0
    // pressure: 1023.03
    // qcStatus: 1
    // realtimeFrequency: null
    // softwareType: null
    // solarRadiation: null
    // stationID: "ITAURA99"
    // temp: 8
    // uv: null
    // windChill: 8
    // windGust: 0
    // windSpeed: 0
    // winddir: 225

    this.observation = h;
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

  async memoize(cache_key, expirySeconds, func) {
    //console.log(args);
    //cache_key = station + "_observation";

    let retval = Cache.get(cache_key);

    // sometimes you get empty objects
    if (
      retval && // 👈 null and undefined check
      !(Object.keys(retval).length === 0 && retval.constructor === Object)
    ) {
      return retval;
    }

    retval = await func();
    //retval could be a promise.
    console.log(retval);
    Cache.set(cache_key, retval, expirySeconds);
    return retval;
  }
}

customElements.define("wunderground-station", WundergroundStation);
