/* eslint-disable padded-blocks */
const express = require('express');

const authRouter = express.Router();
// const chalk = require('chalk');
const debug = require('debug')('app:authRoutes');
// const pool = require('../middleware/database');

function router(nav) {

  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body);
      res.json(req.body);

    });

  return authRouter;

}

module.exports = router;
