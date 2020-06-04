// common js patteren for imports
var express = require('express');
var chalk = require('chalk');
var debug = require('debug')('app');
var morgan = require('morgan');
var path =require('path');

var app = express();

// middleware used for (tiny, combined)
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.listen(8080,()=> {
    // Only runs when in debug mode
    // In windows set DEBUG= * & node app.js
    debug(`Listening on port ${chalk.green(8080)}`);
});