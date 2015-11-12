var dataUriToBuffer = require('data-uri-to-buffer');
var got = require('got');
var parser = require('stacktrace-parser');
var Promise = require('promise');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var url = require('url');

/* SourceMapConsumer that returns positions verbatim. */
var identity = {
  originalPositionFor: function(pos) {
    return pos;
  }
};

function Retrace() {
  this.clearCache();
}

Retrace.prototype.map = function(stack) {
  return Promise.all(parser.parse(stack).map(this.mapFrame, this))
  .then(function(frames) {
    var msg = /^.*$/m.exec(stack)[0];
    return msg + '\n' + frames.map(function(f) {
      var pos = f.source;
      if (f.line) pos += ':' + f.line;
      if (f.column >= 0) pos += ':' + f.column;
      var loc = f.name ? f.name + '(' + pos + ')' : pos;
      return '    at ' + loc;
    }).join('\n');
  });
};

Retrace.prototype.mapFrame = function(f) {
  return this.getSourceMapConsumer(f.file).then(function(sm) {
    return sm.originalPositionFor({
      source: f.file,
      line: f.lineNumber,
      column: f.column
    });
  });
};

Retrace.prototype.register = function(uri, sourceMap) {
  return this.consumers[uri] = Promise.resolve(sourceMap).then(function(sm) {
    if (typeof sm == 'string') sm = JSON.parse(sm);
    if (!sm) sm = identity;
    return new SourceMapConsumer(sm);
  });
}

Retrace.prototype.getSourceMapConsumer = function(uri) {
  return this.consumers[uri] || this.register(uri, this.getSourceMap(uri));
};

Retrace.prototype.getSourceMap = function(uri) {
  if (this.resolve) return Promise.resolve(this.resolve(uri));
  return this.fetchSourceMap(uri);
}

Retrace.prototype.fetchSourceMap = function(f) {
  return got(f).then(function(res) {
    var lines = res.body.split('\n');
    for (var i = lines.length - 1; i; i--) {
      var m = /\/[/*][@#]\s*sourceMappingURL=(.+?)(?:\s|\*|$)/.exec(lines[i]);
      if (m) {
        var uri = m[1];
        if (uri.indexOf('data:') === 0) {
          var src = dataUriToBuffer(uri).toString();
          return JSON.parse(src);
        }
        return got(url.resolve(f, uri)).then(function(res) {
          return JSON.parse(res.body);
        });
      }
    }
  });
};

Retrace.prototype.clearCache = function() {
  this.consumers = {};
};

module.exports = new Retrace();
