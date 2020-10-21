var passport = require('passport')
var LinkedinStrategy = require('passport-linkedin').Strategy;
var User = require('../models/User');

passport.use(new LinkedinStrategy({
    clientID: "86scahttau56rp",
    clientSecret: "nybfHvd3tES7cqhL",
    callbackURL: "http://localhost:3000/auth/linkedin/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({Linkid: profile.id}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;

