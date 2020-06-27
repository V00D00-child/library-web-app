const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const debug = require('debug')('app:local.strategy');
const AppUser = require('../../model/user');
const pool = require('../databaseConfig');

const secretKey = 'XS4*dN';

function localStrategy() {
  passport.use(new Strategy(
    { usernameField: 'userName', passwordField: 'password' },
    (userName, password, done) => {
      (async function doGetAppUser() {
        try {
          const result = await pool.query('SELECT * FROM App_User WHERE User_Name = ?', [userName]);
          debug(chalk.green('DataBase SELECT user:'), result[0]);

          const resultRoles = await pool.query('SELECT r.Role_Name FROM User_Roles u, App_Role r WHERE u.Role_Id = r.Role_Id and u.User_Id = ?;', [result[0].User_Id]);
          debug(chalk.green('DataBase SELECT user roles:'), resultRoles[0]);

          const user = new AppUser(
            result[0].User_Id,
            result[0].User_Name,
            result[0].Encryted_Password,
            result[0].ENABLED,
            result[0].Salt,
            resultRoles[0].Role_Name,
          );
          debug(chalk.green('App user:'), user);

          // handle authenication
          const hashTotest = await bcrypt.hash(password + secretKey, user.salt);

          if (hashTotest === user.password) {
            debug(chalk.green('user password matches'));
            done(null, user);
          } else {
            debug(chalk.green('user password does not match'));
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
