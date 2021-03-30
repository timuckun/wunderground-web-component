export const INFINITY = 8640000000000000;
export const ALWAYS = 8640000000000000;
export const NEGATIVE_INFINITY = -8640000000000000;
export const NEVER = -8640000000000000;
export const ONE_MINUTE = 60 * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_DAY * 30;

export function get(key) {
  let value = localStorage[key];
  if (!value) {
    return null;
  }
  let model = JSON.parse(value);
  // I don't know why this would happen but maybe some other process?
  if (model.payload == null || model.expiry == null) {
    return null;
  }
  let now = new Date();
  if (now > Date.parse(model.expiry)) {
    localStorage.removeItem(key);
    return null;
  }
  return JSON.parse(value).payload;
}

export function set(key, value, expirySeconds) {
  const expiryDate = new Date();
 
  expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds);

  localStorage[key] = JSON.stringify({
    payload: value,
    expiry: expiryDate,
  });
}
export function memoize(cache_key, expirySeconds, func) {
  //console.log(args);
  //cache_key = station + "_observation";

  let retval = this.get(cache_key);
  if (retval) {
    return retval;
  }

  retval = func();
  console.log(retval);
  set(cache_key, retval, expirySeconds);
  return retval;
}

function memoize_2(cache_key, expirySeconds, func, args) {
  console.log(args);
  //cache_key = station + "_observation";
  console.log(this);
  let retval = Cache.get(cache_key);
  if (retval) {
    return retval;
  }

  retval = func.apply(this, args);
  Cache.set(cache_key, retval, expirySeconds);
  return retval;
}
