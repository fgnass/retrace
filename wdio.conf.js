import * as url from 'url';
import http from 'http';
import express from 'express';

import retrace from './index.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let server = null;

export const config = {
  runner: 'browser',
  specs: ['./test/index.js'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60 * 1000,
  },
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'eu',
  services: [
    ['sauce', {
      sauceConnect: true,
      sauceConnectOpts: {
      }
    }]
  ],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    platformName: 'Windows 11',
    browserVersion: '110'
  }, {
    browserName: 'chrome',
    platformName: 'Windows 11',
    browserVersion: 'latest'
  }, {
    browserName: 'chrome',
    platformName: 'macOS 13',
    browserVersion: '110'
  }, {
    browserName: 'chrome',
    platformName: 'macOS 13',
    browserVersion: 'latest'
  }, {
    browserName: 'chrome',
    platformName: 'linux',
    browserVersion: 'latest'
  }, {
    browserName: 'MicrosoftEdge',
    platformName: 'Windows 11',
    browserVersion: '110'
  }, {
    browserName: 'MicrosoftEdge',
    platformName: 'Windows 11',
    browserVersion: 'latest'
  }, {
    browserName: 'MicrosoftEdge',
    platformName: 'macOS 13',
    browserVersion: 'latest'
  }, {
    browserName: 'firefox',
    platformName: 'Windows 11',
    browserVersion: 'latest'
  }, {
    browserName: 'firefox',
    platformName: 'macOS 13',
    browserVersion: 'latest'
  }, {
    browserName: 'firefox',
    platformName: 'linux',
    browserVersion: 'latest'
//  }, {
// Execution fails with
// >> "Failed to load test page (title = \"Invalid URL\", source: <head>\n<meta charset=\"UTF-8\">\n<title>Invalid URL<\/title>\n<\/head>\n<body>\n<h1>Invalid URL<\/h1>\n<p>client error (ERR_INVALID_URL)<\/p>\n<p>Invalid URL: \/?cid=0-0&amp;spec=\/.......
// so this environment is disabled for now!
//    browserName: 'safari',
//    platformName: 'macOS 12',
//    browserVersion: '15'
//  }, {
// This environment just get stuck. Likely the same reason as with macOS 12
//    browserName: 'safari',
//    platformName: 'macOS 13',
//    browserVersion: 'latest'
//  }, {
// Execution fails with
// >> "'Failed to load test page (title = "", source: <head></head><body></body>)"
// so this environment is disabled for now!
//    browserName: 'safari',
//    platformName: 'iOS',
//    'appium:deviceName': 'iPhone Simulator',
//    'appium:deviceOrientation': 'portrait',
//    'appium:platformVersion': 'current_major',
//    'appium:automationName': 'XCUITest',
//  }, {
// Android 6 in SauceLabs fails with
// >> SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
// so this environment is disabled for now! The cause of the problem seems to be some of the wdio modules running ES6
//    browserName: 'Browser',
//    platformName: 'Android',
//    'appium:deviceName': 'Android GoogleAPI Emulator',
//    'appium:deviceOrientation': 'portrait',
//    'appium:platformVersion': 'current_major',
//    'appium:automationName': 'UiAutomator2',
  }],
  logLevel: 'trace',
  onPrepare: function (_config, _capabilities) {
    if (server) {
      ++server.__onPrepareCount__;
      return;
    }
    var app = express();
    app.use(express.static(__dirname + '/test/fixture'));
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
      });
    });
    server = http.createServer(app);
    server.__onPrepareCount__ = 1;
    server.listen(8001, () => console.log('server listening on port 8001') );
  },
  onComplete: function (_exitCode, _config, _capabilities, _results) {
    if (server) {
      if (--server.__onPrepareCount__) {
        console.log('stopping server on port 8001');
        server.close();
        server = null;
      }
    }
  }
};
