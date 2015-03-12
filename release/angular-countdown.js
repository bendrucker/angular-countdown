!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularCountdown=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire((typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null));

var directive = _interopRequire(require("./directive"));

var service = _interopRequire(require("./service"));

module.exports = angular.module("countdown", []).directive("countdown", directive).factory("CountdownTimer", service).name;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./directive":4,"./service":5}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],3:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var template = _interopRequire(require("./template.html"));

var styles = _interopRequire(require("./styles.css"));

var insertCss = _interopRequire(require("insert-css"));

var Pi = Math.PI;

insertCss(styles);

module.exports = function () {
  return {
    restrict: "EA",
    scope: {
      timer: "=",
      radius: "@",
      stroke: "@"
    },
    controller: CountdownController,
    bindToController: true,
    controllerAs: "countdown",
    template: template,
    templateNamespace: "svg"
  };
};

function CountdownController($scope) {
  var _this = this;
  this.$id = $scope.$id;
  this.radius = parseInt(this.radius);
  this.angle = 0;
  Object.defineProperties(this, {
    diameter: {
      get: function get() {
        return this.radius * 2;
      }
    },
    mid: {
      get: function get() {
        return ~ ~(this.angle > Pi);
      }
    },
    x: {
      get: function get() {
        return Math.sin(this.angle) * this.radius;
      }
    },
    y: {
      get: function get() {
        return Math.cos(this.angle) * -this.radius;
      }
    }
  });
  this.timer.on("tick", function (ticked) {
    return _this.angle += 2 * Pi * ticked;
  }).once("done", function () {
    return _this.done = true;
  });
}
CountdownController.$inject = ["$scope"];

},{"./styles.css":6,"./template.html":7,"insert-css":3}],5:[function(require,module,exports){
(function (global){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = _interopRequire(require("events"));

var angular = _interopRequire((typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null));

function factory($interval, $q) {
  return (function (EventEmitter) {
    function CountdownTimer(length, options) {
      _classCallCheck(this, CountdownTimer);

      this.length = length;
      this.options = angular.extend({
        tickInterval: 15
      }, options);
      this.$$deferred = $q.defer();
    }

    _inherits(CountdownTimer, EventEmitter);

    _prototypeProperties(CountdownTimer, null, {
      start: {
        value: function start() {
          var _this = this;
          var tickInterval = this.options.tickInterval;
          this.$$interval = $interval(function () {
            _this.emit("tick", tickInterval / _this.length);
          }, tickInterval, this.length / tickInterval);

          this.$$interval.then(function () {
            _this.emit("done");
            _this.$$deferred.resolve();
          });

          return this;
        },
        writable: true,
        configurable: true
      },
      cancel: {
        value: function cancel() {
          if (this.$$interval) {
            $interval.cancel(this.$$interval);
            this.emit("done");
            this.$$deferred.reject(new Error("Timer cancelled"));
          }
          return this;
        },
        writable: true,
        configurable: true
      },
      then: {
        value: function then(handler) {
          return this.$$deferred.promise.then(handler);
        },
        writable: true,
        configurable: true
      },
      "catch": {
        value: function _catch(handler) {
          return this.$$deferred.promise["catch"](handler);
        },
        writable: true,
        configurable: true
      },
      "finally": {
        value: function _finally(handler) {
          return this.$$deferred.promise["finally"](handler);
        },
        writable: true,
        configurable: true
      }
    });

    return CountdownTimer;
  })(EventEmitter);
}
factory.$inject = ["$interval", "$q"];

module.exports = factory;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"events":2}],6:[function(require,module,exports){
module.exports = 'countdown {\n  display: block\n}\n';
},{}],7:[function(require,module,exports){
module.exports = '<svg\n  ng-if="!countdown.done"\n  class="countdown"\n  ng-attr-width="{{countdown.diameter}}"\n  ng-attr-height="{{countdown.diameter}}"\n  ng-attr-viewbox="0 0 {{countdown.diameter}} {{countdown.diameter}}"\n>\n  <defs>\n    <mask ng-attr-id="countdown-mask-{{countdown.$id}}">\n      <circle cx="50%" cy="50%" ng-attr-r="{{countdown.radius}}" fill="#fff" />\n      <circle cx="50%" cy="50%" ng-attr-r="{{countdown.radius - countdown.stroke}}" fill="#000" />\n    </mask>\n  </defs>\n  <g ng-attr-mask="url(#countdown-mask-{{countdown.$id}})">\n    <path\n      class="countdown-border"\n      ng-attr-id="loader-{{countdown.$id}}"\n      ng-attr-transform="translate({{countdown.radius}}, {{countdown.radius}})"\n      ng-attr-d="M 0 0 v -{{countdown.radius}} A {{countdown.radius}} {{countdown.radius}} 1 {{countdown.mid}} 1 {{countdown.x}} {{countdown.y}} z"\n    />\n  </g>\n</svg>\n';
},{}]},{},[1])(1)
});