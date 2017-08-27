var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var router = require("./api-route");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.use('/api', router);


app.listen(8888, function () {
    console.log("listening on 8888");
})