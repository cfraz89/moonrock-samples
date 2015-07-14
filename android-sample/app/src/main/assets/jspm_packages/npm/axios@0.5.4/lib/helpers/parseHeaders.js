/* */ 
'use strict';
var utils = require("../utils");
module.exports = function parseHeaders(headers) {
  var parsed = {},
      key,
      val,
      i;
  if (!headers) {
    return parsed;
  }
  utils.forEach(headers.split('\n'), function(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));
    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });
  return parsed;
};
