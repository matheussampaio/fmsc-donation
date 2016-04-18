const http = require('http');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');

const index = require('./routes/index');

const app = module.exports = express();

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
