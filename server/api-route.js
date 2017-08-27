var express = require('express');
var moment = require('moment');
var router = express.Router();

// set up database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/scheduler');

var db = mongoose.connection;
db.once('open', function(callback) {
    console.log("connection to db open")
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// import db references
var courseSchema = require('./schemas/course-schema');
var Course = db.model('courseModel', courseSchema);

// routes
router.get('/courses', function (req, res) {
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
        console.log("RESULT: ", result);
        return res.json({courses: result});
    })
})

module.exports = router;