var fs = require('fs');
var path = require('path');

console.log('resolving with public maps');

require('../server-common').get('/', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res);
});

