/* eslint-disable padded-blocks */
const express = require('express');

const adminRouter = express.Router();
const chalk = require('chalk');
const debug = require('debug')('app:adminRoutes');
const pool = require('../middleware/database');

function router(nav) {
  adminRouter.route('/')
    .all((req, res, next) => {
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
    })
    .get((req, res) => {
      res.render(
        'adminDashboard.ejs',
        {
          nav,
          title: 'Library',
        },
      );
    })
    .post((req, res) => {

      // build query from user input
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
      res.send('Now Inserting book!');
    });


  return adminRouter;
}


module.exports = router;
