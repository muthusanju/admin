passport.use(new TwitterStrategy({
    consumerKey: '',
    consumerSecret: '',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
   
  }
));
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/twittererror' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });