export const Cache = {
    get: (key) => {
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
  },

  set: (key, value, expiryMinutes) => {
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
};