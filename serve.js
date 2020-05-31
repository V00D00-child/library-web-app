var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('Hello from my library app');
});