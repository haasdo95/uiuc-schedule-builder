var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var moment = require('moment');

var sectionSchema = new Schema({
    section: String,
    crn: String,
    type: String,
    meetings: {
        date: String,
        time: {
            from: String,
            to: String
        }
    }
});

sectionSchema.virtual('range').get(function () {
    return {
        from: moment(this.meetings.time.from, 'hh:mm A'),
        to: moment(this.meetings.time.to, 'hh:mm A')
    }
})

var courseSchema = new Schema({
    name: String,
    sections: [
        sectionSchema
    ]
})

module.exports = courseSchema;