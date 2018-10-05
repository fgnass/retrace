
var express = require('express');
var http = require('http');
var tap = require('tap');
var wd = require('wd');

var retrace = require('../');

console.log('Node Version:', process.version);

/* Small express app that send sthe mapped stack trace back to the client. */

var app = express();
app.use(express.static(__dirname + '/fixture'));
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

/* Use sourcelabs to test differnt browsers. Requires a sauce connect tunnel! */

var user = process.env.SAUCE_USERNAME;
var key = process.env.SAUCE_ACCESS_KEY;
var job = process.env.TRAVIS_JOB_NUMBER;

if (!user) throw new Error('SAUCE_USERNAME must be set.');
if (!key) throw new Error('SAUCE_ACCESS_KEY must be set.');

var browser = wd.remote('localhost', 4445, user, key);

function testBrowser(name) {
  tap.test(name, function(t) {
    t.tearDown(function() {
      browser.quit();
    });
    browser.init({
      name: 'retrace build #' + job,
      browserName: name,
      tunnelIdentifier: job
    },
    function() {
      ['bundle', 'bundle.min' , 'bundle.inline'].forEach(function(s) {
        t.test(s, testScript(s));
      });
      t.end();
    });
  });
}

function testScript(name) {
  return function(t) {
    browser.get('http://localhost:8001/' + name + '.html', function() {
      browser.waitForElementByCss('.stack' , 10000, function(err, el) {
        t.error(err, 'stack added to page');
        el.text(function(err, text) {
          t.error(err, 'text retrieved');
          t.match(text, 'error.js:2:0', 'stack cointains location 1');
          t.match(text, 'error.js:6:0', 'stack cointains location 2');
          t.match(text, 'main:8:0', 'stack cointains location 3');
          t.end();
        });
      });
    });
  };
}

var server = http.createServer(app);
server.listen(8001, function() {
  ['chrome', 'firefox'].forEach(testBrowser);
});

tap.tearDown(function() {
  server.close();
  process.exit();
});
