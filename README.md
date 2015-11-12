# Readable stack traces

[![Build Status](https://travis-ci.org/fgnass/retrace.svg?branch=master)](https://travis-ci.org/fgnass/retrace)

Using bundled and minified JavaScript code usually leaves you with hard to read stack traces. Some browser dev-tools automatically apply source maps to map locations back to the original source, but this doesn't help when you want to track all client-side errors on the server or when you have to deal with browsers that don't support source maps at all.

_Retrace_ helps you to set up the following flow for your application:

1. Submit unhandled client-side errors to the server
2. Let the server parse the stack trace
3. Fetch the source map for each mentioned file
4. Map the location back to the original source
5. Log a readable stack trace

Retrace works with all browsers supported by [stacktrace-parser](https://www.npmjs.com/package/stacktrace-parser). This currently includes Chrome, Firefox, Internet Explorer, Safari, Opera and JavaScriptCore.

## Sending stack traces to your server

In modern browsers we could just do something like this to submit a stack trace:

```js
window.addEventListener('error', e =>
  fetch('/retrace?stack=' + e.error.stack)
);
```

To support a wider range of browsers you can use one of the clients provided by this package:

```js
require('retrace/client/xhr')('/retrace');
```

This will set `window.onerror` to a function that uses an `XMLHttpRequest` to send the stack trace to the provided URL – `/retrace` in this case.

The package also contains [another client](client/beacon.js) that uses an `Image` beacon to transmit the data. You may use this as starting point for a custom implementation which might use an iframe, websocket or the fetch API as transport.

## Using retrace to re-map the stacktraces

Here is a simple example of how to use _retrace_ within an express app:

```js
var express = require('express');
var retrace = require('retrace');

var app = express();

app.get('/retrace', function(req, res) {

  // Read the stack from a query parameter
  var stack = req.query.stack;

  retrace.map(stack).then(function(stack) {
    console.log(stack); // Log the re-mapped stack trace
    res.end(stack); // ... and send it back to the client
  })
  .catch(function(err) {
    console.log('Something went wrong', err);
    res.status(500).end();
  })
});
```

## Private source maps

By default _retrace_ downloads the sources and source maps via HTTP. If you don't want to expose your source maps you can register them manually:

```js
var fs = require('fs');
var retrace = require('retrace');

var sourceMap = fs.readFileSync('./bundle.js.map', 'utf8');
retrace.register('https://example.com/bundle.min.js', sourceMap)
```

You can `register()` a source-map as string, as parsed JSON object or as promise that resolves to either of the two.

Alternatively you can provide a `resolve` function. This might be easier if you need to support multiple host names or protocols:

```js
var retrace = require('retrace');

var sourceMap = JSON.parse(fs.readFileSync('./bundle.js.map', 'utf8'));

// Simple resolver that always returns the same source map
retrace.resolve = function(url) {
  return sourceMap;
};
```

## License

MIT
