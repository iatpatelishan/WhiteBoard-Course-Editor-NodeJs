var mongoose = require('mongoose');
var submissionSchema = mongoose.Schema({
    username: String,
    formId: Number,
    formData: Object
}, {collection: 'submissions'});
module.exports = submissionSchema;