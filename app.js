var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport');

require('./passport-config')(passport);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.static(path.join(__dirname, 'public/dist')));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes').setRoutes(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
