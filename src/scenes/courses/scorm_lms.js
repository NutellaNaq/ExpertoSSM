function supports_html5_storage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}

// Load scormStatus from storage
function getLastStorage({ window, storage, prefixNumber }) {
  const futureScormData = {};
  // Get all keys that start with prefix .cmi
  const keys = Object.keys(storage).filter((key) =>
    key.startsWith(prefixNumber + ".cmi")
  );

  // for each key, we need to store it in the scormStatus object
  keys.forEach((key) => {
    // Split the key by dot
    const splittedKey = key.split(".");

    // Get the last part of the key (after the last dot) (2.cmi.interactions.0.id => id)
    const bigKey = splittedKey.pop();

    // Get the value
    const value = storage.getItem(key);

    // If it's an interaction, we need to store it in a different way
    if (splittedKey.includes("interactions")) {
      const id = splittedKey[3];

      if (!futureScormData.interactions) futureScormData.interactions = {};

      if (!futureScormData.interactions[id]) {
        futureScormData.interactions[id] = {};
      }

      futureScormData.interactions[id] = {
        ...futureScormData.interactions[id],
        [bigKey]: value,
      };
    } else {
      futureScormData[bigKey] = value;
    }
  });

  return futureScormData;
}

export function scormInit({ window, storage, prefixNumber, callback }) {
  // Default prefix is empty
  const prefix = prefixNumber ? prefixNumber + "." : 0 + ".";
  // Default callback is a function that does nothing
  callback = typeof callback !== "undefined" ? callback : function () {};

  // Set storage
  storage = supports_html5_storage() ? localStorage : {};
  window.API = {};

  // Set default values
  window.scormStatus = getLastStorage({ window, storage, prefixNumber });

  // Callback on init
  window.API.LMSInitialize = function () {
    console.log("LMSInitialize");
  };

  // Callback on terminate
  window.API.LMSTerminate = function () {
    console.log("LMSTerminate");
  };

  // Callback on get value
  window.API.LMSGetValue = function (varname) {
    varname = prefix + varname;
    var ret = storage.getItem(varname);
    if (
      ret == null &&
      varname.indexOf("_count", this.length - "_count".length) !== -1
    ) {
      ret = 0;
      storage.setItem(varname, ret);
    }
    return ret;
  };

  // Callback on set value
  window.API.LMSSetValue = function (varname, varvalue) {
    varname = prefix + varname;

    var match = varname.match(/([0-9]+)\.cmi\.interactions\.([0-9]+)\.id/);

    // Big key is the last part of the varname (after the last dot) (2.cmi.interactions.0.id => id)
    const bigKey = varname.split(".").pop();

    // Increment interactions count if needed
    if (match != null) {
      storage.setItem(
        `${prefixNumber}.cmi.interactions._count`,
        parseInt(match[2]) + 1
      );
    }

    match = varname.match(/([0-9]+)\.cmi\.interactions\.([0-9]+)/);

    // If it's an interaction, we need to store it in a different way
    if (match != null) {
      const id = parseInt(match[2]);

      if (!window.scormStatus.interactions)
        window.scormStatus.interactions = {};

      if (!window.scormStatus.interactions[id])
        window.scormStatus.interactions[id] = {};

      window.scormStatus.interactions[id] = {
        ...window.scormStatus.interactions[id],
        [bigKey]: varvalue,
      };
    } else {
      window.scormStatus[bigKey] = varvalue;
    }

    storage.setItem(varname, varvalue);
    console.log("LMSSetValue", varname, "=", varvalue);
  };

  // Callback on commit
  window.API.LMSCommit = function (e) {
    console.log("LMSCommit");
    //saving to API
    callback({
      progress: window.scormStatus,
    });
    return true;
  };

  // Callback on get finish
  window.API.LMSFinish = function (e) {
    console.log("LMSFinish");
  };

  // Callback on get last error
  window.API.LMSGetLastError = function (e) {
    console.log("LMSGetLastError");
  };

  // Callback on get error string
  window.API.LMSGetErrorString = function (e) {
    console.log("LMSGetErrorString");
  };

  // Callback on get diagnostic
  window.API.LMSGetDiagnostic = function (e) {
    console.log("LMSGetDiagnostic");
  };
}
