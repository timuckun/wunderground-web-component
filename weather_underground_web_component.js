
const weather_data={observation:{}};
class WundergroundStation extends HTMLElement {
  constructor(station, api_key, units) {
    super();
    this.unit_translator = {
        imperial: "e",
        metric: "m",
        uk_hybrid: "h",
        metric_si: "s",
      };
   //console.log(this);
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
    if (!['m','e','h','s'].includes(this.units)) {
       throw "units attribute must be one of e (imperial), m (metric), h (uk_hybrid) or s (metric_si)";
     }

    // This is confusing perhaps
    const units = this.getUnits(this.units);
    //console.log(units);
    //const div = document.createElement("div");
    //const shadow = this.attachShadow({ mode: "open" });


    this.refresh();
  } //connectedCallback
  refresh() {  
    //var element = this.$.container.querySelector("portal-tree-view");
    //element.parentNode.removeChild(element)

    this.fetchWeather();
    this.create_inner_html();
  
  }

   create_inner_html(){
    this.innerHTML =
    "<div class='wunderground_widget>" +
      "<div class='wunderground_header'>" +
          "<a href='https://www.wunderground.com/dashboard/pws/" +
          this.station +
          "' target='_blank'>Weather Underground</a>" +
      "</div>" +
      "<div class='wunderground_location'>" +
      "<div class='wunderground_location-data'>" +
      "<div class='wunderground_neighborhood'></div>" +
      "<div class='wunderground_stationID'><a href='https://www.wunderground.com/dashboard/pws/" +
          this.station +
          "' target='_blank'>" +
          this.station +
          "</a>" +
      "</div>" +
      "<div class='wunderground_datetime'></div>" +
    "</div>" +
    "<div class='wunderground_refresh'><span class='icon spin'>Refresh</span></div>" +
    "</div>" +
    "<div class='wunderground_dashboard'>" +
    
    "</div>" ;
   }
   async makeApiCall(url){
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok" );                
        };
        return await  response.json();
  }
  async fetchGeneric(features, query){

    /**
     * Set a API feature. Available features:
     * - alerts
     * - almanac
     * - astronomy
     * - conditions
     * - currenthurricane
     * - forecast
     * - forecast10day
     * - geolookup
     * - history
     * - hourly
     * - hourly10day
     * - planner
     * - rawtide
     * - tide
     * - webcams
     * - yesterday
     *
     * @param string|array $features
     * @return $this
     */

     /**
     * Set a API setting. Available settings are:
     * - lang
     * - pws
     * - bestfct
     *
     * @param string $settings
     * @return $this
     */

     /**
     * Set a API query. Query examples:
     * - <US state>/<city>
     * - <US zipcode>/<city>
     * - <country>/<city>
     * - <latitude>,<longitude>
     * - <airport code>
     * - pws:<PWS id>
     * - autoip
     * - autoip.json?geo_ip=<IP address>
     *
     * @param string $query
     * @return $this
     */
    const settings="lang:EN"
    
    const url = "http://api.wunderground.com/api/" +  this.api_key + "/" + features + "/" + settings + "/" + query + ".json";
  console.log(url);
    return await this.makeApiCall(url);

  }

  async fetchObservation(params){
    const url = "https://api.weather.com/v2/pws/observations/current?format=json&language=en-US&" + params
     return  await this.makeApiCall(url);

  }
  async fetchPwsObservation(station, units, api_key){
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
  async fetchForecast(lat, lon, units, api_key){

    const url ="https://api.weather.com/v3/wx/forecast/daily/5day?geocode=" + 
    lat +
    "," + 
    lon + 
    "&format=json&language=en-US&units=" + 
    units + 
    "&apiKey=" + 
    api_key

    return await this.makeApiCall(url);
                 
  }
  async fetchWeather() {
      //fetch the observation
      const lat= -37.737;
      const lon= 175.981;
  
      const base_params="units=" + this.units + "&apiKey=" + this.api_key+ "&";

    const geocode_params="geocode="+ lat + "," + lon ;
    const current=await this.fetchPwsObservation(this.station, this.units, this.api_key);
    
    console.log(current);
    
    const forecast = await this.fetchForecast(current['lat'], current['lon'], this.units, this.api_key);
    console.log(forecast);
   // const params=base_params + geocode_params + "&stationId=" + this.station;
    //const latlon= await this.fetchObservation(params);
    //console.log(latlon);
    let query=lat + "," + lon;
    let x = await this.fetchGeneric("observation", query);
    console.log(x)
    const units = this.getUnits(this.units);
    
    var data = current[units['name']];
    
    var datetime = new Date(current.obsTimeLocal);
	var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' , hour: 'numeric', minute: 'numeric'};
    const d={};
    d.date=datetime.toLocaleDateString("en-NZ", options);
    d.data=data;
    d.neighborhood=current.neighborhood;

    console.log(d);
                       

    

  }

update() {
    if (processing_update != true) {
        processing_update = true;
        element.find('.wunderground_refresh').addClass('spin');
        this.fetch_current()
            .then(function(current) {
                //console.log(current);
                var data = current[units['name']];
                var datetime = new Date(current.obsTimeLocal);
                var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' , hour: 'numeric', minute: 'numeric'};
                console.log(datetime.toLocaleDateString("en-NZ", options));

                
                element.find('.wunderground_location .wunderground_neighborhood').html(current.neighborhood);
                element.find('.wunderground_location .wunderground_datetime').html(datetime.toLocaleDateString("en-NZ", options));
                // 	datetime.getUTCFullYear()+'-'+(datetime.getUTCMonth()+1)+"-"+datetime.getUTCDate()+" "+
                // 	datetime.getUTCHours()+":"+datetime.getUTCMinutes()
                // );
                
                element.find('#wunderground_temp .wunderground_current tspan:not(.wunderground_degree)').html(data.temp);
                element.find('#wunderground_temp circle').css('stroke',wunderground.temp_to_color(data.temp));
                element.find('#wunderground_temp .wunderground_current').css('fill',wunderground.temp_to_color(data.temp));
                element.find('#wunderground_temp .wunderground_feels-like tspan.wunderground_like').html(data.windChill);
                element.find('#wunderground_temp .wunderground_feels-like tspan:not(.wunderground_like-text)').css('fill',wunderground.temp_to_color(data.windChill));
                
                element.find('#wunderground_wind .wunderground_direction').attr('transform','rotate('+current.winddir+',50 45)');
                element.find('#wunderground_wind text.wunderground_speed').html(data.windSpeed);
                element.find('#wunderground_wind tspan.wunderground_gusts').html(data.windGust);
                return wunderground.fetch_forcast();
            })
            .then(function(forcast) {
                //console.log(forcast);
                var dayPart = forcast.daypart[0].iconCode[0] === null ? 1 : 0;
                var current = wunderground.current_weather
                
                if (dayPart == 1) {
                    element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_hi').html('--');
                    element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_hi, #wunderground_temp .wunderground_hilo tspan.wunderground_hi ~ tspan').css('fill','');
                } else {
                    element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_hi').html(forcast.temperatureMax[0]);
                    element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_hi, #wunderground_temp .wunderground_hilo tspan.wunderground_hi ~ tspan').css('fill',wunderground.temp_to_color(forcast.temperatureMax[0]));
                }
                element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_lo').html(forcast.temperatureMin[0]);
                element.find('#wunderground_temp .wunderground_hilo tspan.wunderground_lo, #wunderground_temp .wunderground_hilo tspan.wunderground_lo ~ tspan').css('fill',wunderground.temp_to_color(forcast.temperatureMin[0]));
                element.find('.wunderground_icon_wrapper')
                    .css("background-image","url(//www.wunderground.com/static/i/c/v4/"+forcast.daypart[0].iconCode[dayPart]+".svg)")
                    .html(forcast.daypart[0].wxPhraseLong[dayPart]);
                
                var temp_desc = "Hi: "+(dayPart == 1 ? "N/A" : forcast.temperatureMax[0])+units['temp']+" | "+
                    "Lo: "+forcast.temperatureMin[0]+units['temp']+"<br/>"+
                    "Current: "+current[units['name']].temp+units['temp']+"<br/>"+
                    "Feels Like: "+current[units['name']].windChill+units['temp'];
                element.find('#wunderground_temp desc').html(temp_desc);
                
                var wind_desc = current[units['name']].windSpeed+" "+units['speed']+" with "+
                    current[units['name']].windGust+" "+units['speed']+" gusts out of the "+ wunderground.wind_readable(current.winddir);
                
                element.find('#wunderground_wind desc').html(wind_desc);
                
                element.find('.wunderground_dashboard .wunderground_error').remove();
                element.find('.wunderground_refresh .icon').removeClass('spin');
                processing_update = false;
            })
            .catch(function(type) {
                console.log(type);
                wunderground.throwError();
                element.find('.wunderground_refresh .icon').removeClass('spin');
                processing_update = false;
            });
    }
};
F_to_C = function(degreee) {
			return (degreee - 32) * 5 / 9
		}
		
		/********************************
		* Turn tempurature into a color *
		********************************/
	temp_to_color = function(degree, units) {
			if (units == 'e') {
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
		
getUnits(units){
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
}

customElements.define("wunderground-station", WundergroundStation);
