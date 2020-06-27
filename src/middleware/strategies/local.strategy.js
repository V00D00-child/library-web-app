const passport = require('passport');
const { Strategy } = require('passport-local');
const chalk = require('chalk');
const debug = require('debug')('app:local.strategy');
const AppUser = require('../../model/user');
const pool = require('../databaseConfig');

function localStrategy() {
  passport.use(new Strategy(
    { usernameField: 'userName', passwordField: 'password' },
    (userName, password, done) => {
      (async function doGetAppUser() {
        try {
          const result = await pool.query('SELECT * FROM App_User WHERE User_Name = ?', [userName]);
          debug(chalk.green('DataBase SELECT user:'), result[0]);

          const user = new AppUser(
            result[0].User_Id,
            result[0].User_Name,
            result[0].Encryted_Password,
          );

          if (user.password === password) {
            debug(chalk.green('user password matches'));
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (error) {
          debug(chalk.red(error));
        }
      }());
    },
  ));
}
module.exports = localStrategy;
