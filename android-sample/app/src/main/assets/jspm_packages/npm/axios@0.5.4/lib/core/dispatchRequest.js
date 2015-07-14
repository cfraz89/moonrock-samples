/* */ 
(function(process) {
  'use strict';
  module.exports = function dispatchRequest(config) {
    return new Promise(function(resolve, reject) {
      try {
        if (typeof window !== 'undefined') {
          require("../adapters/xhr")(resolve, reject, config);
        } else if (typeof process !== 'undefined') {
          require("../adapters/xhr")(resolve, reject, config);
        }
      } catch (e) {
        reject(e);
      }
    });
  };
})(require("process"));
