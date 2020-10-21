var Instagram = require('passport-instagram');
const InstagramStrategy = Instagram.Strategy;
var passport = require('passport');
var User = require('../models/User');

passport.use(new InstagramStrategy({
    clientID: "611105646508906",
    clientSecret: "a8c531c7ccdb46283f96dc0596143724",
    callbackURL: "http://localhost:3000/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ instagram: profile.id }, { name: profile.displayName,userid: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));

module.exports = passport;