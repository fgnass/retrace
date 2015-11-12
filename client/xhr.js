var xhr = require('xhr');
var onerror = require('./onerror');

module.exports = function(opts, cb) {
  if (typeof opts == 'function') cb = opts;
  if (typeof opts != 'object') opts = {};

  onerror(opts.window, function(stack) {
    var target = opts.target || '/retrace';
    var url = target + '?stack=' + encodeURIComponent(stack);
    xhr({ url: url }, function(err, resp, body) {
      if (cb) {
        if (err) cb('Error requesting ' + url + ': ' + err);
        else cb(null, body);
      }
    });
  });
};
