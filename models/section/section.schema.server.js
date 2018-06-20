var mongoose = require('mongoose');
var sectionSchema = mongoose.Schema({
    name: String,
    seats: Number,
    usedSeats: Number,
    courseId: Number,
    students: [String]
}, {collection: 'section'});
module.exports = sectionSchema;