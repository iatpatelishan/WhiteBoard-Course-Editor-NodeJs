var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function createSection(section) {
    return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
    return sectionModel.find({courseId: courseId});
}

function findSectionById(sectionId){
    return sectionModel.findOne({_id: sectionId});
}

function decrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {usedSeats: +1}
    });
}

function incrementSectionSeats(sectionId) {
    return sectionModel.update({
        _id: sectionId
    }, {
        $inc: {usedSeats: -1}
    });
}

function deleteSection(sectionId) {
    return sectionModel.remove({
        _id: sectionId
    });
}

function updateSection(sectionId, updatedSection) {
    return sectionModel.update({_id: sectionId}, {$set: updatedSection});
}

module.exports = {
    createSection: createSection,
    findSectionsForCourse: findSectionsForCourse,
    decrementSectionSeats: decrementSectionSeats,
    incrementSectionSeats: incrementSectionSeats,
    deleteSection: deleteSection,
    findSectionById: findSectionById,
    updateSection: updateSection
};