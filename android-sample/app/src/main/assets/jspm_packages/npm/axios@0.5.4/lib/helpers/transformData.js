/* */ 
'use strict';
var utils = require("../utils");
module.exports = function transformData(data, headers, fns) {
  utils.forEach(fns, function(fn) {
    data = fn(data, headers);
  });
  return data;
};
