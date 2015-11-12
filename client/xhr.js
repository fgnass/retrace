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
