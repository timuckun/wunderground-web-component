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
 
    // This is how I want it to work
    // see fetchweather function for how I got it to work but as I said it all has to stay async.
    /*const observation = this.fetchPwsObservation(
      this.station,
      this.units,
      this.api_key
    );

    const forecast = this.fetchForecast(
      observation["lat"],
      observation["lon"],
      this.units,
      this.api_key
    );
*/
    this.fetchWeather();

    // now that I have the observation and the forecast I can go ahead and populate more of the dib
  }

  

  async fetchPwsObservation(station, units, api_key) {
    const url =
      "https://api.weather.com/v2/pws/observations/current?stationId=" +
      station +
      "&format=json&units=" +
      units +
      "&apiKey=" +
      api_key;
    const data = await this.makeApiCall(url);
    return data.observations[0];
  }
  async fetchForecast(lat, lon, units, api_key) {
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
  }
  async fetchWeather() {
    const current = await this.fetchPwsObservation(
      this.station,
      this.units,
      this.api_key
    );

    console.log(current);

    const forecast = await this.fetchForecast(
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

  async makeApiCall(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }


  F_to_C = function (degreee) {
    return ((degreee - 32) * 5) / 9;
  };

  /********************************
   * Turn tempurature into a color *
   ********************************/
  tempToColor(degree, units) {
    if (units == "e") {
      degree = this.F_to_C(degree);
    }
    if (degree <= -50) {
      return "#140f1e";
    } else if (degree <= -45) {
      return "#4d026c";
    } else if (degree <= -40) {
      return "#7c007a";
    } else if (degree <= -35) {
      return "#ae00af";
    } else if (degree <= -30) {
      return "#dd07de";
    } else if (degree <= -25) {
      return "#ec04fe";
    } else if (degree <= -20) {
      return "#9101ff";
    } else if (degree <= -15) {
      return "#041cfc";
    } else if (degree <= -10) {
      return "#0572f8";
    } else if (degree <= -5) {
      return "#17c6f1";
    } else if (degree <= 0) {
      return "#00e6ff";
    } else if (degree <= 5) {
      return "#7fff05";
    } else if (degree <= 10) {
      return "#cdfe01";
    } else if (degree <= 15) {
      return "#ffe105";
    } else if (degree <= 20) {
      return "#fdaf00";
    } else if (degree <= 25) {
      return "#fa8301";
    } else if (degree <= 30) {
      return "#ff0000";
    } else if (degree <= 35) {
      return "#ff5c60";
    } else if (degree <= 40) {
      return "#f98888";
    } else if (degree <= 45) {
      return "#feb7b6";
    } else {
      return "#fbeae9";
    }
  }

  getUnits(units) {
    const unit_map = {
      m: {
        alt: "m",
        temp: "°C",
        press: "mb",
        rain: "mm",
        snow: "cm",
        dist: "km",
        vis: "km",
        speed: "km",
        wave: "mtr",
        name: "metric",
      },
      s: {
        alt: "m",
        temp: "°C",
        press: "mb",
        rain: "mm",
        snow: "cm",
        dist: "m",
        vis: "km",
        speed: "m/s",
        wave: "mtr",
        name: "metric_si",
      },
      e: {
        name: "imperial",
        alt: "ft",
        wave: "ft",
        temp: "°F",
        press: "hg",
        rain: "in",
        snow: "in",
        dist: "mi",
        vis: "mi",
        speed: "MPH",
      },
      h: {
        alt: "ft",
        temp: "°C",
        press: "mb",
        rain: "mm",
        snow: "cm",
        dist: "mi",
        vis: "km",
        speed: "MPH",
        wave: "ft",
        name: '"uk_hybrid"',
      },
    }; //unit_map
    return unit_map[units];
  }
  cache_get(key) {
    var value = localStorage[key];
    if (!value) {
      return null;
    }
    var model = JSON.parse(value);
    // I don't know why this would happen but maybe some other process?
    if (model.payload == nul || model.expiry == null) {
      return null;
    }
    var now = new Date();
    if (now > Date.parse(model.expiry)) {
      localStorage.removeItem(key);
      return null;
    }
    return JSON.parse(value).payload;
  }

  cache_set(key, value, expiryMinutes) {
    let maxDate = new Date(8640000000000000);
    let minDate = new Date(-8640000000000000);
    const expiryDate = new Date();

    if (expiryMinutes == -1) {
      // does not ever expire
      expiryDate = maxDate;
    } else {
      const expirySeconds = expiryMinutes * 60;
      expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds);
    }
    localStorage[key] = JSON.stringify({
      payload: value,
      expiry: expiryDate,
    });
  }
}

customElements.define("wunderground-station", WundergroundStation);
