var onerror = require('./onerror');

module.exports = function(opts) {

  if (!opts) opts = {};
  var target = opts.target || '/retrace';

  onerror(opts.window, function(stack) {
    var img = new Image();
    img.src = target
      + '?stack=' + encodeURIComponent(stack)
      + '&time=' + new Date().getTime();
  });

};
