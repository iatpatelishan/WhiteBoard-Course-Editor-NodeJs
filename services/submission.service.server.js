module.exports = function (app) {
    app.get('/api/submission', findAllSubmissions);
    app.post('/api/submission', createSubmission);
    app.get('/api/form/:formId/submission', findSubmissionForFormId);
    app.get('/api/submission/:submissionId', findSubmissionById);

    var submissionModel = require('../models/submission/submission.model.server');

    function createSubmission(req, res) {
        var submission = req.body;

        submissionModel
            .createSubmission(submission)
            .then(function (result) {
                if (!result) {
                    res.status(401).json({
                        "success": false,
                        "message": "Cannot create"
                    });
                }
                res.send(result);
            });
    }

    function findAllSubmissions(req, res) {
        submissionModel.findAllSubmissions()
            .then(function (submissios) {
                res.send(submissios);
            })
    }

    function findSubmissionForFormId(req, res) {
        var id = req.params['formId'];
        submissionModel.findSubmissionsForForm(id)
            .then(function (submissions) {
                res.send(submissions);
            })
    }

    function findSubmissionById(req, res) {
        var id = req.params['submissionId'];
        submissionModel.findSubmissionById(id)
            .then(function (submission) {
                res.send(submission);
            })
    }




}
