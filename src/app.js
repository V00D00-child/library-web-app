const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql');

// connect to database
const dbConfig = JSON.parse(fs.readFileSync('db.json'));
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

connection.connect((err) => {
  if (err) {
    debug(chalk.red(err));
    throw err;
  }
  debug(chalk.green('CONNECTED'));

  connection.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error;
    }
    debug('Database Results:', results);
  });
  connection.end();
  debug(chalk.blue('Ending connection'));
});


// logging for incoming request (tiny, combined)
app.use(morgan('tiny'));

// serve static content
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));

// Set up template engine
app.set('views', './src/views');
app.set('view engine', 'ejs');

// set up routers
const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' },
];

const bookRouter = require('./routes/bookRoutes')(nav);

app.use('/books', bookRouter);
app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,
      title: 'Library',
    },
  );
});

app.listen(port, () => {
  debug(`Listening at port ${chalk.green(port)}`);
});
