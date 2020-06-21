const passport = require('passport');
const { Strategy } = require('passport-local');
const AppUser = require('../../model/user');

function localStrategy() {
  passport.use(new Strategy(
    { usernameField: 'userName', passwordField: 'password' },
    (userName, password, done) => {
      const user = new AppUser(userName, password);
      done(null, user);
    },
  ));
}
module.exports = localStrategy;
