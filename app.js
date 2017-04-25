var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// importing controller(s)
var forwarder = require('./controllers/forwarder');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up routes; fix landing page to index.html
options = {
    index: 'index.html'
};
app.use('/', express.static(path.join(__dirname, 'public/views'), options));
app.post('/forward', forwarder.forward);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// initialize new oauth access_token everytime the app boots
request.post({
            url: 'https://api.ambiverse.com/oauth/token',
            form: {
                // hush hush, secret things
                grant_type: "client_credentials",
                client_id: "9646e250",
                client_secret: "a5581eb3a113b35a3d534299b7fd51f4"
            },
            json: true,
            },
            function(err, response, body){
                if(!err && response.statusCode == 200){
                    // body format = '{"token_type":"bearer","expires_in":86400,"access_token":"xxxx"}\n'
                    console.log('INFO: access_token initialized successfully');
                    app.locals.access_token = body['access_token'];
                }
                else{
                    // halt the server
                    throw new Error('OAuth Error');
                }
            });

module.exports = app;
