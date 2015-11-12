require('../../client/xhr')(function(err, stack) {
  document.body.innerHTML = '<pre class="stack">' + stack + '</pre>';
});

var error = require('./error');

setTimeout(function() {
  error('boo');
}, 1);
