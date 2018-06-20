module.exports = function (app) {

    app.post('/api/course/:courseId/section', createSection);
    app.get('/api/course/:courseId/section', findSectionsForCourse);
    app.post('/api/student/:studentId/section/:sectionId', enrollStudentInSection);
    app.delete('/api/student/:studentId/section/:sectionId', unenrollStudentInSection);
    app.get('/api/student/section', findSectionsForStudent);
    app.delete('/api/section/:sectionId', deleteSection);
    app.put('/api/section/:sectionId', updateSection);

    var sectionModel = require('../models/section/section.model.server');
    var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function findSectionsForStudent(req, res) {
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function (enrollments) {
                res.json(enrollments);
            });
    }

    function enrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var studentId = req.params.studentId;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .findSectionById(sectionId)
            .then(function (section) {
                if (section.usedSeats < section.seats) {
                    sectionModel
                        .decrementSectionSeats(sectionId)
                        .then(function () {
                            return enrollmentModel
                                .enrollStudentInSection(enrollment)
                        })
                        .then(function (enrollment) {
                            res.json(enrollment);
                        });
                } else {
                    res.json({"success": false, "message": "No seats available"});
                }
            })
    }

    function unenrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var studentId = req.params.studentId;
        var enrollment = {
            student: studentId,
            section: sectionId
        };

        sectionModel
            .findSectionById(sectionId)
            .then(function (section) {
                if (section.usedSeats > 0)
                    sectionModel
                        .incrementSectionSeats(sectionId)
                        .then(function () {
                            return enrollmentModel
                                .unenrollStudentInSection(enrollment)
                        })
                        .then(function() {
                            res.json({"success": true});
                        })
                        .catch(function () {
                            res.json({"success": false});
                        })
            })
            .catch(function () {
                res.json({"success": false});
            })
    }

    function findSectionsForCourse(req, res) {
        var courseId = req.params['courseId'];
        sectionModel
            .findSectionsForCourse(courseId)
            .then(function (sections) {
                res.json(sections);
            })
    }

    function createSection(req, res) {
        var section = req.body;
        sectionModel
            .createSection(section)
            .then(function (section) {
                res.json(section);
            })
    }

    function deleteSection(req, res) {
        var sectionId = req.params['sectionId'];
        sectionModel.deleteSection(sectionId).then(() => {
            enrollmentModel.deleteSectionEnrollments(sectionId).then(res.json({"success": true}));
        });
    }

    function updateSection(req, res) {
        var sectionId = req.params['sectionId'];
        var updatedSection = req.body;
        sectionModel.updateSection(sectionId, updatedSection).then(() => {
            res.json({"success": true});
        });
    }

};