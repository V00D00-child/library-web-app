
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const debug = require('debug')('app:authController');
const pool = require('../middleware/databaseConfig');

const secretKey = 'XS4*dN';
const saltRounds = 10;

async function createHashWithSalt(password) {
  const newPassword = password + secretKey;
  let userHash;
  let userSalt;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPassword, salt);
    debug(chalk.green('making new password:'), newPassword);
    debug(chalk.green('hash generated:'), {
      userHash: hash,
      userSalt: salt,
    });
    userHash = hash;
    userSalt = salt;
  } catch (error) {
    debug(chalk.red(error));
  }
  return {
    userHash,
    userSalt,
  };
}

function authContoller(nav) {
  function nextUserIdMiddleware(req, res, next) {
    (async function doGetIds() {
      try {
        const result = await pool.query('SELECT User_Id FROM App_User ORDER BY User_Id');
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
  }

  function createUser(req, res) {
    const { userName, password, roleType } = req.body;
    const id = req.nextId;
    let roleId = 1;
    if (roleType !== 'admin') {
      roleId = 2;
    }

    (async function doCreateUser() {
      const hashCode = await createHashWithSalt(password);
      try {
        const result = await pool.query('INSERT INTO App_User (User_Id, User_Name, Encryted_Password, ENABLED, Salt) values (?, ?, ?, ?, ?)',
          [id, userName, hashCode.userHash, 1, hashCode.userSalt]);
        debug(chalk.green('DataBase INSERT new user Results:'), result);

        const resultRole = await pool.query('INSERT INTO User_Roles (ID, User_Id, Role_Id) values (?, ?, ?)',
          [id, id, roleId]);
        debug(chalk.green('DataBase INSERT new user role Results:'), resultRole);
      } catch (error) {
        debug(chalk.red(error));
        res.status(500).json({ success: false, error: 'Sorry, could not create user' });
        res.end();
      }
    }());

    req.login(req.body, () => {
      res.redirect('/auth/signin');
    });
  }

  function getSignIn(req, res) {
    res.render('signin', {
      nav,
      title: 'Sign In',
    });
  }

  function profileMiddleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function getProfile(req, res) {
    res.render('profile', {
      nav,
      title: 'Profile',
      user: req.user,
    });
  }

  function getLogout(req, res) {
    req.logOut();
    res.redirect('/');
  }

  return {
    nextUserIdMiddleware,
    createUser,
    getSignIn,
    profileMiddleware,
    getProfile,
    getLogout,
  };
}

module.exports = authContoller;
