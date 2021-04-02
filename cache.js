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
  console.log("set");
  const expiryDate = new Date();
 
  expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds);
  console.log(expiryDate);
  let str =JSON.stringify({
    payload: value,
    expiry: expiryDate,
  })
  console.log(str);
  localStorage[key] = str;
}
export function memoize(cache_key, expirySeconds, func) {
  //console.log(args);
  //cache_key = station + "_observation";
console.log("here");
  let retval = this.get(cache_key);
  console.log(retval);
  
  // sometimes you get empty objects
  if (retval  // 👈 null and undefined check 
    && !( Object.keys(retval).length === 0 && retval.constructor === Object)) {
    return retval;
  }

  retval = func();
  //retval could be a promise.
 console.log('r')
  let r = Promise.resolve(func()).then( (v) => { return v});
  console.log('resolved promise');
  console.log(r);
  console.log("called func")
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
