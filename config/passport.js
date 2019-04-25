const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: keys.callbackURL,
        proxy: true // to fix HTTPS issue on server
      },
      (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(profile);
      }
    )
  );
};
