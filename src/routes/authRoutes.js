/* eslint-disable padded-blocks */
const express = require('express');
const passport = require('passport');

const authRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');
const pool = require('../middleware/databaseConfig');

function router(nav) {

  authRouter.route('/signup')
    .all((req, res, next) => {
      (async function doGetIds() {
        try {
          const result = await pool.query('SELECT User_Id FROM App_User');
          debug(chalk.green('DataBase SELECT user id Results:'), result);

          // find next id and pass it along
          req.nextId = result[result.length - 1].User_Id + 1;
          next();

        } catch (error) {
          debug(chalk.red(error));
          res.status(500).json({ success: false, error: 'Sorry, could not find ids' });
          res.end();
        }
      }());
    })
    .post((req, res) => {
      // create user and give them a role
      const { userName, password, roleType } = req.body;
      const id = req.nextId;
      let roleId = 1;
      if (roleType !== 'admin') {
        roleId = 2;
      }

      (async function doCreateUser() {
        try {
          const result = await pool.query('INSERT INTO App_User (User_Id, User_Name, Encryted_Password, ENABLED) values (?, ?, ?, ?)',
            [id, userName, password, 1]);
          debug(chalk.green('DataBase INSERT new user Results:'), result);


        } catch (error) {
          debug(chalk.red(error));
          res.status(500).json({ success: false, error: 'Sorry, could not create user' });
          res.end();
        }

      }());


      (async function doCreateRole() {
        try {
          const result = await pool.query('INSERT INTO User_Roles (ID, User_Id, Role_Id) values (?, ?, ?)',
            [id, id, roleId]);
          debug(chalk.green('DataBase INSERT new user role Results:'), result);

        } catch (error) {
          debug(chalk.red(error));
          res.status(500).json({ success: false, error: 'Sorry, could not create user role' });
          res.end();
        }

      }());

      req.login(req.body, () => {
        res.redirect('/auth/signin');
      });

    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRouter.route('/profile')
    .get((req, res) => {
      // user is now attached to request object
      res.json(req.user);
    });

  return authRouter;

}

module.exports = router;
