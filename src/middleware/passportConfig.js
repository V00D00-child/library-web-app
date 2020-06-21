/* eslint-disable padded-blocks */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function passportConfig(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrives user from session by id
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

module.exports = passportConfig;
