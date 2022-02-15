var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');

var app = express();

app.use(function (req, res, next) {
  var urlPath = url.parse(req.url).pathname || '';
  // api exists
  var apiPath = `${path.join(__dirname, '../mock', urlPath)}.json`;
  
  //   console.log(`mock api ${req.url} to ${apiPath}`)
  
  if (fs.existsSync(apiPath)) {
    res.setHeader('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, platformid');
    res.end(fs.readFileSync(apiPath));
    return;
  }
  
  return next();
});

app.listen(9009, () => {
  console.log('mock is runing localhot:9009\nyou can visit http://localhost:9009/api/data  to see the example of api.');
});
