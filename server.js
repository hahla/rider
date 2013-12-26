if (!process.env.NODE_ENV) process.env.NODE_ENV='development'

var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  path = require('path'),
  reload = require('reload'),
  colors = require('colors'),
  offer = require('./server/api/offer'),
  couchbase = require('couchbase')

// setup and connect to the database
var bucket = bucket || undefined;
var configCouchbase = "config.json";
var initCouchbase = (function() {
  if (fs.existsSync(configCouchbase)) {
    config = JSON.parse(fs.readFileSync(configFilename));
  } else {
    console.log("cant find config file: " + configCouchbase);
    config = {};
  }
  bucket = new couchbase.Connection(config, function(err) {
    if (err)  { 
      console.log("failed to connect"); 
      throw err; 
    }
    console.log("got connection ok");
    offer.db(bucket);
  });
})();

//offer.bucket = bucket; // hmm this doesnt work.
//offer.calltest(bucket);
var app = express()
var clientDir = path.join(__dirname, 'client')
app.configure(function() {
  app.set('port', process.env.PORT || 3000)
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser()) 
  app.use(app.router) 
  app.use(express.static(clientDir)) 
})

app.configure('development', function(){
  app.use(express.errorHandler());
})

app.get('/', function(req, res) { res.sendfile(path.join(clientDir, 'index.html')) })
app.get('/api/offer', offer.list) 
 app.get('/api/offer/total', offer.total) //placement matters
// app.get('/api/offer/:id', offer.read) //sometimes called 'show'
 app.post('/api/offer', offer.create)
// app.put('/api/offer/:id', offer.update)
// app.del('/api/offer/:id', offer.del)

var server = http.createServer(app)
reload(server, app)
server.listen(app.get('port'), function(){
  console.log("Web server listening in %s on port %d", colors.red(process.env.NODE_ENV), app.get('port'));
});
