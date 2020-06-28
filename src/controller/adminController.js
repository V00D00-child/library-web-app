const chalk = require('chalk');
const debug = require('debug')('app:adminController');
const pool = require('../middleware/databaseConfig');

function adminController(nav) {
  function authorization(req, res, next) {
    if ((req.user) && (req.user.role === 'Role_Admin')) {
      next();
    } else {
      res.redirect('/books');
    }
  }

  function getAuthMiddleware(req, res, next) {
    (async function doGetIds() {
      try {
        const result = await pool.query('SELECT id FROM books');
        debug(chalk.green('DataBase SELECT id Results:'), result);

        // find next id and pass it along
        req.nextId = result[result.length - 1].id + 1;
        next();

      } catch (error) {
        debug(chalk.red(error));
        res.status(500).json({ success: false, error: 'Sorry, could not find ids' });
        res.end();
      }
    }());
  }

  function getAuth(req, res) {
    res.render(
      'adminDashboard.ejs',
      {
        nav,
        title: 'Admin Dashboard',
      },
    );
  }

  function doCreateBook(req, res) {

    const title = req.body.formTitle;
    const author = req.body.formAuthor;

    // TODO: Add the mutiple inserts
    (async function doAddBook() {
      try {
        const result = await pool.query('INSERT INTO books (id, title, author) VALUES (?, ?, ?)', [req.nextId, title, author]);
        debug(chalk.green('Database INSERT Result:'), result);
      } catch (error) {
        debug(chalk.red(error));
        res.status(500).json({ success: false, error: 'Sorry, can not insert book' });
        res.end();
      }
    }());
    res.redirect('/books');
  }

  return {
    authorization,
    getAuthMiddleware,
    getAuth,
    doCreateBook,
  };
}

module.exports = adminController;
