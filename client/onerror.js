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
