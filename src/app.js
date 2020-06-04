var express = require('express');
var chalk = require('chalk');
var debug = require('debug')('app');
var morgan = require('morgan');
var path =require('path');

var app = express();

// logging for incoming request (tiny, combined)
app.use(morgan('tiny'));

// serve static content
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.listen(8080,()=> {
    // Only runs when in debug mode
    // In windows set DEBUG= * & node app.js
    debug(`Listening on port ${chalk.green(8080)}`);
});