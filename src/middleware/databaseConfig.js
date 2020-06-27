const fs = require('fs');
const debug = require('debug')('app:databaseConfig');
const chalk = require('chalk');

const util = require('util');
const mysql = require('mysql');

const dbConfig = JSON.parse(fs.readFileSync('db.json'));
const pool = mysql.createPool({
  connectionLimit: dbConfig.connectionLimit,
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      debug(chalk.red('Database connection was closed.'));
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      debug(chalk.red('Database has too many connections.'));
    }
    if (err.code === 'ECONNREFUSED') {
      debug(chalk.red('Database connection was refused.'));
    }
  }
  connection.release();

  // Handle error after the release.
  if (err) throw err;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
