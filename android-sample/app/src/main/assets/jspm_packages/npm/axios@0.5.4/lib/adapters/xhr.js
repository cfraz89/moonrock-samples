/* */ 
'use strict';
var defaults = require("../defaults");
var utils = require("../utils");
var buildUrl = require("../helpers/buildUrl");
var cookies = require("../helpers/cookies");
var parseHeaders = require("../helpers/parseHeaders");
var transformData = require("../helpers/transformData");
var urlIsSameOrigin = require("../helpers/urlIsSameOrigin");
module.exports = function xhrAdapter(resolve, reject, config) {
  var data = transformData(config.data, config.headers, config.transformRequest);
  var requestHeaders = utils.merge(defaults.headers.common, defaults.headers[config.method] || {}, config.headers || {});
  if (utils.isFormData(data)) {
    delete requestHeaders['Content-Type'];
  }
  var request = new (XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');
  request.open(config.method.toUpperCase(), buildUrl(config.url, config.params), true);
  request.onreadystatechange = function() {
    if (request && request.readyState === 4) {
      var responseHeaders = parseHeaders(request.getAllResponseHeaders());
      var responseData = ['text', ''].indexOf(config.responseType || '') !== -1 ? request.responseText : request.response;
      var response = {
        data: transformData(responseData, responseHeaders, config.transformResponse),
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config
      };
      (request.status >= 200 && request.status < 300 ? resolve : reject)(response);
      request = null;
    }
  };
  var xsrfValue = urlIsSameOrigin(config.url) ? cookies.read(config.xsrfCookieName || defaults.xsrfCookieName) : undefined;
  if (xsrfValue) {
    requestHeaders[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
  }
  utils.forEach(requestHeaders, function(val, key) {
    if (!data && key.toLowerCase() === 'content-type') {
      delete requestHeaders[key];
    } else {
      request.setRequestHeader(key, val);
    }
  });
  if (config.withCredentials) {
    request.withCredentials = true;
  }
  if (config.responseType) {
    try {
      request.responseType = config.responseType;
    } catch (e) {
      if (request.responseType !== 'json') {
        throw e;
      }
    }
  }
  if (utils.isArrayBuffer(data)) {
    data = new DataView(data);
  }
  request.send(data);
};
