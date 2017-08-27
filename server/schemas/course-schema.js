var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var moment = require('moment');

var meetingSchema = new Schema({
    date: String,
    time: {
        from: String,
        to: String
    }
}, {
    'toJSON': { virtuals: true },
    'toObject': { virtuals: true },
    _id : false
})

meetingSchema.virtual('range').get(function () {
    return {
        from: moment(this.time.from, 'hh:mm A'),
        to: moment(this.time.to, 'hh:mm A')
    }
})

var sectionSchema = new Schema({
    section: String,
    crn: String,
    type: String,
    meetings: meetingSchema
}, { _id : false });

var courseSchema = new Schema({
    name: String,
    sections: [
        sectionSchema
    ]
})

module.exports = courseSchema;