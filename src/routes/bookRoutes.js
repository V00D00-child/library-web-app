/* eslint-disable padded-blocks */
const express = require('express');

const bookRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:bookRoutes');
const pool = require('../middleware/databaseConfig');

function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });

  bookRouter.route('/')
    .get((req, res) => {

      // use iffy to query database
      (async function query() {
        try {
          const result = await pool.query('SELECT * FROM books');
          debug(chalk.green('Database SELECT all Books Result:', result));

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

    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      (async function doRunQuery() {
        try {
          const singleResult = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
          debug(chalk.green('Database SELECT single Book Result:', singleResult));

          // pass along the single book using array deconstruction
          [req.book] = singleResult;
          debug(chalk.green('test result:'), req.book);

          next();
        } catch (error) {
          debug(chalk.red(error));
          res.status(500).json({ success: false, error: 'Sorry, book not found' });
          res.end();
        }
      }());
    })
    .get((req, res) => {
      debug('Single Result:', req.book);

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
    });

  return bookRouter;
}

module.exports = router;
