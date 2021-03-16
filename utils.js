export function F_to_C  (degreee) {
    return ((degreee - 32) * 5) / 9;
  };

  /********************************
   * Turn tempurature into a color *
   ********************************/
  export function tempToColor(degree, units) {
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

  export  const unit_dictionary = {
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
    }

		
  // export function lookup_units(units) {
  //   const unit_map = {
  //     m: {

  //       alt: "m",
  //       temp: "°C",
  //       press: "mb",
  //       rain: "mm",
  //       snow: "cm",
  //       dist: "km",
  //       vis: "km",
  //       speed: "km",
  //       wave: "mtr",
  //       name: "metric",

  //     },
  //     s: {
  //       alt: "m",
  //       temp: "°C",
  //       press: "mb",
  //       rain: "mm",
  //       snow: "cm",
  //       dist: "m",
  //       vis: "km",
  //       speed: "m/s",
  //       wave: "mtr",
  //       name: "metric_si",
  //     },
  //     e: {
  //       name: "imperial",
  //       alt: "ft",
  //       wave: "ft",
  //       temp: "°F",
  //       press: "hg",
  //       rain: "in",
  //       snow: "in",
  //       dist: "mi",
  //       vis: "mi",
  //       speed: "MPH",
  //     },
  //     h: {
  //       alt: "ft",
  //       temp: "°C",
  //       press: "mb",
  //       rain: "mm",
  //       snow: "cm",
  //       dist: "mi",
  //       vis: "km",
  //       speed: "MPH",
  //       wave: "ft",
  //       name: '"uk_hybrid"',
  //     },
  //   }; //unit_map
  //   return unit_map[units];
  // }