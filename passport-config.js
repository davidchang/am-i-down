var config = require('./config')
  , FacebookStrategy = require('passport-facebook').Strategy
  , schemas = require('./mongo')
  , User = schemas.User;

module.exports = function(passport) {

    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , facebook: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
          done(err, user)
        })
    });

}
