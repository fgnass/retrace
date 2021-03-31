
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');

var retrace = require('../../');

/* Small express app that send sthe mapped stack trace back to the client. */

var app = express();
app.use(express.static(path.resolve(__dirname, '../../test/fixture')));
app.get('/retrace', function(req, res) {
  // Read the stack from a query parameter
  var stack = req.query.stack;
  // ... pass it to retrace
  retrace.map(stack).then(function(s) {
    // ... and send back the re-mapped stack trace
    res.send(s);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
  .finally(function() {
    res.end();
  })
});

var server = http.createServer(app);
server.listen(8001);

console.log('server running. please check http://localhost:8001');

module.exports = app;
