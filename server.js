var http = require('http');
var path = require('path');
var morgan = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');

var api = require('./dist/routes/api');
var index = require('./dist/routes/index');

var app = module.exports = express();

/**
 * Database Configuration
 */
var mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fmsc';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function(err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});

/**
 * Express Configuration
 */
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(express.static(path.resolve('www')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());

var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  app.use(errorHandler());
}

/**
 * Routes
 */

// API
app.use('/api', api(app));


// serve index and view partials
app.all('/*', index.index);

// app.use(function(req, res, next) {
//   res.status(404).send({ error: 'Page not found', status: 404 });
// });

/**
 * Start Server
 */
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
