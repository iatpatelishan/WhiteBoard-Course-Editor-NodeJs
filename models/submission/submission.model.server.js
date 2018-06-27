var mongoose = require('mongoose');
var submissionSchema = require('./submission.schema.server');
var submissionModel = mongoose.model(
    'SubmissionModel',
    submissionSchema
);

function findAllSubmissions() {
    return submissionModel.find();
}

function findSubmissionsForForm(formId) {
    return submissionModel.find({formId: formId});
}

function findSubmissionsForUser(username) {
    return submissionModel.find({username: username});
}

function createSubmission(submission) {
    return submissionModel.create(submission);
}

module.exports = {
    findSubmissionsForForm: findSubmissionsForForm,
    findSubmissionsForUser: findSubmissionsForUser,
    createSubmission: createSubmission,
    findAllSubmissions: findAllSubmissions
};