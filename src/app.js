const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configure authentication with passport
app.use(cookieParser());
app.use(session(
  {
    secret: 'library',
    name: 'library-cookie',
    proxy: true,
    resave: true,
    saveUninitialized: true,
  },
));
require('./middleware/passportConfig.js')(app);

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
  { link: '/auth/profile', title: 'Profile' },
  { link: '/admin', title: 'Admin Dashboard' },
];

const bookRouter = require('./routes/bookRoutes')(nav);
const adminRouter = require('./routes/adminRoutes')(nav);
const authRouter = require('./routes/authRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,
      title: 'Library',
    },
  );
});

// listen for request
app.listen(port, () => {
  debug(`Listening at port ${chalk.green(port)}`);
});
