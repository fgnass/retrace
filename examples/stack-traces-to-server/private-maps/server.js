var express = require('express');
var fs = require('fs');
var path = require('path');

var retrace = require('../../../');

retrace.resolve = function (url){
    if(url && url.includes('bundle.private.min.js')){
      return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, 'bundle.private.min.js.map'), (err, data) => {
          if(err)
            reject(err);
          else
            resolve(JSON.parse(data));
        });
      });
    }
    return null;
};

console.log('resolving with private maps location');

var app = require('../server-common');
app.use(express.static(path.resolve(__dirname, 'public')));
app.get('/', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res);
});
