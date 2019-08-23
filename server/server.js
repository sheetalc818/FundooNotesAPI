'use strict';
require('dotenv').config();
var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');
var app = module.exports = loopback();

app.middleware('initial', bodyParser.urlencoded({ extended: true }));
boot(app, __dirname);


app.use(loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me'
}));

app.use(function (req, res, next) {
  app.currentUser = null;
  //console.log("accessToken",req.accessToken);
  if (!req.accessToken) return next();
  req.accessToken.user(function (err, user) {
    if (err) return next(err);

    req.currentUser = user;
   
    next();
  });
});

//app.models.user.settings.acls = require('./user-acl.json');
app.start = function () {
  // start the web server
  return app.listen('8000','0.0.0.0',function () {
  // return app.listen(function () {
  //   app.emit('started');
  //   var baseUrl = app.get('url').replace(/\/$/, '');
  //   console.log('Web server listening at: %s', baseUrl);
  //   if (app.get('loopback-component-explorer')) {
  //     var explorerPath = app.get('loopback-component-explorer').mountPath;
  //     console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  //   }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
