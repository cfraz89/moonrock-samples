/* */ 
(function(process) {
  var axios = (function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId])
        return installedModules[moduleId].exports;
      var module = installedModules[moduleId] = {
        exports: {},
        id: moduleId,
        loaded: false
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.loaded = true;
      return module.exports;
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
  })([function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(1);
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var defaults = __webpack_require__(3);
    var utils = __webpack_require__(4);
    var deprecatedMethod = __webpack_require__(5);
    var dispatchRequest = __webpack_require__(6);
    var InterceptorManager = __webpack_require__(7);
    (function() {
      var P = __webpack_require__(2);
      if (P && typeof P.polyfill === 'function') {
        P.polyfill();
      }
    })();
    var axios = module.exports = function axios(config) {
      config = utils.merge({
        method: 'get',
        headers: {},
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse
      }, config);
      config.withCredentials = config.withCredentials || defaults.withCredentials;
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);
      axios.interceptors.request.forEach(function(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      axios.interceptors.response.forEach(function(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      promise.success = function success(fn) {
        deprecatedMethod('success', 'then', 'https://github.com/mzabriskie/axios/blob/master/README.md#response-api');
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, response.config);
        });
        return promise;
      };
      promise.error = function error(fn) {
        deprecatedMethod('error', 'catch', 'https://github.com/mzabriskie/axios/blob/master/README.md#response-api');
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, response.config);
        });
        return promise;
      };
      return promise;
    };
    axios.defaults = defaults;
    axios.all = function(promises) {
      return Promise.all(promises);
    };
    axios.spread = __webpack_require__(8);
    axios.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
    (function() {
      function createShortMethods() {
        utils.forEach(arguments, function(method) {
          axios[method] = function(url, config) {
            return axios(utils.merge(config || {}, {
              method: method,
              url: url
            }));
          };
        });
      }
      function createShortMethodsWithData() {
        utils.forEach(arguments, function(method) {
          axios[method] = function(url, data, config) {
            return axios(utils.merge(config || {}, {
              method: method,
              url: url,
              data: data
            }));
          };
        });
      }
      createShortMethods('delete', 'get', 'head');
      createShortMethodsWithData('post', 'put', 'patch');
    })();
  }, function(module, exports, __webpack_require__) {
    module.exports = {Promise: Promise};
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
    var PROTECTION_PREFIX = /^\)\]\}',?\n/;
    var DEFAULT_CONTENT_TYPE = {'Content-Type': 'application/x-www-form-urlencoded'};
    module.exports = {
      transformRequest: [function(data, headers) {
        if (utils.isFormData(data)) {
          return data;
        }
        if (utils.isArrayBuffer(data)) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isObject(data) && !utils.isFile(data) && !utils.isBlob(data)) {
          if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
            headers['Content-Type'] = 'application/json;charset=utf-8';
          }
          return JSON.stringify(data);
        }
        return data;
      }],
      transformResponse: [function(data) {
        if (typeof data === 'string') {
          data = data.replace(PROTECTION_PREFIX, '');
          try {
            data = JSON.parse(data);
          } catch (e) {}
        }
        return data;
      }],
      headers: {
        common: {'Accept': 'application/json, text/plain, */*'},
        patch: utils.merge(DEFAULT_CONTENT_TYPE),
        post: utils.merge(DEFAULT_CONTENT_TYPE),
        put: utils.merge(DEFAULT_CONTENT_TYPE)
      },
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN'
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }
    function isFormData(val) {
      return toString.call(val) === '[object FormData]';
    }
    function isArrayBufferView(val) {
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        return ArrayBuffer.isView(val);
      } else {
        return (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
    }
    function isString(val) {
      return typeof val === 'string';
    }
    function isNumber(val) {
      return typeof val === 'number';
    }
    function isUndefined(val) {
      return typeof val === 'undefined';
    }
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === 'undefined') {
        return ;
      }
      var isArrayLike = isArray(obj) || (typeof obj === 'object' && !isNaN(obj.length));
      if (typeof obj !== 'object' && !isArrayLike) {
        obj = [obj];
      }
      if (isArrayLike) {
        for (var i = 0,
            l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      forEach(arguments, function(obj) {
        forEach(obj, function(val, key) {
          result[key] = val;
        });
      });
      return result;
    }
    module.exports = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      forEach: forEach,
      merge: merge,
      trim: trim
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    module.exports = function deprecatedMethod(method, instead, docs) {
      try {
        console.warn('DEPRECATED method `' + method + '`.' + (instead ? ' Use `' + instead + '` instead.' : '') + ' This method will be removed in a future release.');
        if (docs) {
          console.warn('For more information about usage see ' + docs);
        }
      } catch (e) {}
    };
  }, function(module, exports, __webpack_require__) {
    (function(process) {
      'use strict';
      module.exports = function dispatchRequest(config) {
        return new Promise(function(resolve, reject) {
          try {
            if (typeof window !== 'undefined') {
              __webpack_require__(9)(resolve, reject, config);
            } else if (typeof process !== 'undefined') {
              __webpack_require__(9)(resolve, reject, config);
            }
          } catch (e) {
            reject(e);
          }
        });
      };
    }.call(exports, __webpack_require__(10)));
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
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
  }, function(module, exports, __webpack_require__) {
    'use strict';
    module.exports = function spread(callback) {
      return function(arr) {
        callback.apply(null, arr);
      };
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var defaults = __webpack_require__(3);
    var utils = __webpack_require__(4);
    var buildUrl = __webpack_require__(11);
    var cookies = __webpack_require__(12);
    var parseHeaders = __webpack_require__(13);
    var transformData = __webpack_require__(14);
    var urlIsSameOrigin = __webpack_require__(15);
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
  }, function(module, exports, __webpack_require__) {
    var process = module.exports = {};
    var queue = [];
    var draining = false;
    function drainQueue() {
      if (draining) {
        return ;
      }
      draining = true;
      var currentQueue;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
          currentQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }
    process.nextTick = function(fun) {
      queue.push(fun);
      if (!draining) {
        setTimeout(drainQueue, 0);
      }
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = '';
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.binding = function(name) {
      throw new Error('process.binding is not supported');
    };
    process.cwd = function() {
      return '/';
    };
    process.chdir = function(dir) {
      throw new Error('process.chdir is not supported');
    };
    process.umask = function() {
      return 0;
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
    function encode(val) {
      return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
    }
    module.exports = function buildUrl(url, params) {
      if (!params) {
        return url;
      }
      var parts = [];
      utils.forEach(params, function(val, key) {
        if (val === null || typeof val === 'undefined') {
          return ;
        }
        if (!utils.isArray(val)) {
          val = [val];
        }
        utils.forEach(val, function(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });
      if (parts.length > 0) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
      }
      return url;
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
    module.exports = {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }
        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }
        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }
        if (secure === true) {
          cookie.push('secure');
        }
        document.cookie = cookie.join('; ');
      },
      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },
      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
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
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
    module.exports = function transformData(data, headers, fns) {
      utils.forEach(fns, function(fn) {
        data = fn(data, headers);
      });
      return data;
    };
  }, function(module, exports, __webpack_require__) {
    'use strict';
    var utils = __webpack_require__(4);
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originUrl;
    function urlResolve(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
      };
    }
    originUrl = urlResolve(window.location.href);
    module.exports = function urlIsSameOrigin(requestUrl) {
      var parsed = (utils.isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
      return (parsed.protocol === originUrl.protocol && parsed.host === originUrl.host);
    };
  }]);
})(require("process"));
