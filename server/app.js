const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const app = express();
const router = require("./api-route");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../dist')));

app.use(favicon(path.join('dist', 'assets', 'favicon.ico')));

app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: __dirname });
})

app.use('/api', router);


app.listen(8888, function () {
    console.log("listening on 8888");
})