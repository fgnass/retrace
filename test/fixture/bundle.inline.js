(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(win, send) {
  if (!win) win = window;
  var _onerror = win.onerror;
  win.onerror = function(msg, url, line, col, err) {
    var stack = err && err.stack;
    if (!stack) {
      // create a single stack frame from the provided data:
      stack = msg + '\n    at ' + url + ':' + line + ':' + col;
    }
    send(stack);
    if (_onerror) _onerror(msg, url, line, col, err);
  };
}

},{}],2:[function(require,module,exports){
var onerror = require('./onerror');

module.exports = function(opts, cb) {
  if (typeof opts == 'function') cb = opts;
  if (typeof opts != 'object') opts = {};

  onerror(opts.window, function(stack) {
    var target = opts.target || '/retrace';
    var url = target + '?stack=' + encodeURIComponent(stack);
    get(url, cb);
  });
};

function get(url, cb) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState != 4) return false;
    var status = req.status;
    if (status != 200) return cb(status);
    cb(null, req.responseText);
  };
  req.open('GET', url, true);
  req.send();
}

},{"./onerror":1}],3:[function(require,module,exports){
function invariant(cond, message) {
  if (!cond) throw new Error(message);
}

function fail(message) {
  invariant(false, message);
}

module.exports = function(message) {
  fail(message);
}

},{}],4:[function(require,module,exports){
require('../../client/xhr')(function(err, stack) {
  document.body.innerHTML = '<pre class="stack">' + stack + '</pre>';
});

var error = require('./error');

setTimeout(function() {
  error('boo');
}, 1);

},{"../../client/xhr":2,"./error":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9jbGllbnQvb25lcnJvci5qcyIsIi4uLy4uL2NsaWVudC94aHIuanMiLCJlcnJvci5qcyIsIm1haW4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aW4sIHNlbmQpIHtcbiAgaWYgKCF3aW4pIHdpbiA9IHdpbmRvdztcbiAgdmFyIF9vbmVycm9yID0gd2luLm9uZXJyb3I7XG4gIHdpbi5vbmVycm9yID0gZnVuY3Rpb24obXNnLCB1cmwsIGxpbmUsIGNvbCwgZXJyKSB7XG4gICAgdmFyIHN0YWNrID0gZXJyICYmIGVyci5zdGFjaztcbiAgICBpZiAoIXN0YWNrKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzaW5nbGUgc3RhY2sgZnJhbWUgZnJvbSB0aGUgcHJvdmlkZWQgZGF0YTpcbiAgICAgIHN0YWNrID0gbXNnICsgJ1xcbiAgICBhdCAnICsgdXJsICsgJzonICsgbGluZSArICc6JyArIGNvbDtcbiAgICB9XG4gICAgc2VuZChzdGFjayk7XG4gICAgaWYgKF9vbmVycm9yKSBfb25lcnJvcihtc2csIHVybCwgbGluZSwgY29sLCBlcnIpO1xuICB9O1xufVxuIiwidmFyIG9uZXJyb3IgPSByZXF1aXJlKCcuL29uZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzLCBjYikge1xuICBpZiAodHlwZW9mIG9wdHMgPT0gJ2Z1bmN0aW9uJykgY2IgPSBvcHRzO1xuICBpZiAodHlwZW9mIG9wdHMgIT0gJ29iamVjdCcpIG9wdHMgPSB7fTtcblxuICBvbmVycm9yKG9wdHMud2luZG93LCBmdW5jdGlvbihzdGFjaykge1xuICAgIHZhciB0YXJnZXQgPSBvcHRzLnRhcmdldCB8fCAnL3JldHJhY2UnO1xuICAgIHZhciB1cmwgPSB0YXJnZXQgKyAnP3N0YWNrPScgKyBlbmNvZGVVUklDb21wb25lbnQoc3RhY2spO1xuICAgIGdldCh1cmwsIGNiKTtcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBnZXQodXJsLCBjYikge1xuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBzdGF0dXMgPSByZXEuc3RhdHVzO1xuICAgIGlmIChzdGF0dXMgIT0gMjAwKSByZXR1cm4gY2Ioc3RhdHVzKTtcbiAgICBjYihudWxsLCByZXEucmVzcG9uc2VUZXh0KTtcbiAgfTtcbiAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHJlcS5zZW5kKCk7XG59XG4iLCJmdW5jdGlvbiBpbnZhcmlhbnQoY29uZCwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmQpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZmFpbChtZXNzYWdlKSB7XG4gIGludmFyaWFudChmYWxzZSwgbWVzc2FnZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICBmYWlsKG1lc3NhZ2UpO1xufVxuIiwicmVxdWlyZSgnLi4vLi4vY2xpZW50L3hocicpKGZ1bmN0aW9uKGVyciwgc3RhY2spIHtcbiAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPHByZSBjbGFzcz1cInN0YWNrXCI+JyArIHN0YWNrICsgJzwvcHJlPic7XG59KTtcblxudmFyIGVycm9yID0gcmVxdWlyZSgnLi9lcnJvcicpO1xuXG5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICBlcnJvcignYm9vJyk7XG59LCAxKTtcbiJdfQ==
