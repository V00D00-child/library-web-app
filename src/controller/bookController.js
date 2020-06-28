const chalk = require('chalk');
const debug = require('debug')('app:bookController');
const pool = require('../middleware/databaseConfig');

function bookController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function getIndex(req, res) {
    (async function query() {
      try {
        const result = await pool.query('SELECT * FROM books');
        debug(chalk.green('Database SELECT all Books Result:'), result);

        // render UI
        if (result) {
          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books: result,
            },
          );
        }
      } catch (error) {
        debug(chalk.red(error));
        res.status(500).json({ success: false, error: 'Sorry, books not found' });
        res.end();
      }
    }());
  }

  function getById(req, res) {
    (async function doRunQuery() {
      const { id } = req.params;
      try {
        const singleResult = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        debug(chalk.green('Database SELECT single Book Result:'), singleResult);
        [req.book] = singleResult;

        if (req.book) {
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book: req.book,
            },
          );
        } else {
          res.status(404).json({ success: false, error: 'Sorry, book not found' });
          res.end();
        }
      } catch (error) {
        debug(chalk.red(error));
        res.status(500).json({ success: false, error: 'Sorry, book not found' });
        res.end();
      }
    }());
  }

  return {
    middleware,
    getIndex,
    getById,
  };
}

module.exports = bookController;
