var express = require('express');
var moment = require('moment');
var router = express.Router();

// set up database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://GuohaoDou:Dudu040803@ds111204.mlab.com:11204/uiuc-scheduler');

var db = mongoose.connection;
db.once('open', function(callback) {
    console.log("connection to db open")
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// import db references
var courseSchema = require('./schemas/course-schema');
var Course = db.model('courseModel', courseSchema, 'courses');

// routes
router.post('/courses', function (req, res) {
    if (!req.body.courseNames) {
        return res.json({courses: []})
    }
    Course.find({
        name: {
            $in: req.body.courseNames
        }
    }, {_id: 0}, (err, result) => {
        if (err) {
            return res.json({courses: []});
        }
        return res.json({courses: result.sort(
            (x, y) => req.body.courseNames.indexOf(x.name) - req.body.courseNames.indexOf(y.name)
        )});
    })
})

router.get('/courselist', function (req, res) {
    Course.find({}, {_id: 0}, (err, result) => {
        if (err) {
            return res.json({list: []});
        }
        return res.json({list: result.map(r => r.name)});
    })
})

module.exports = router;