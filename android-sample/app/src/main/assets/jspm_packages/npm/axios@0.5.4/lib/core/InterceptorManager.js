/* */ 
'use strict';
var utils = require("../utils");
function InterceptorManager() {
  this.handlers = [];
}
InterceptorManager.prototype.use = function(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
InterceptorManager.prototype.eject = function(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager.prototype.forEach = function(fn) {
  utils.forEach(this.handlers, function(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
module.exports = InterceptorManager;
