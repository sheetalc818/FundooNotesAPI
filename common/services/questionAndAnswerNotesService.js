'use strict';
var app = require('../../server/server');
//var async = require('async');
function questionAndAnswerNotesService() {

}
questionAndAnswerNotesService.prototype.addQuestionAndAnswerService = (questionAndAnswerNotesdata, callback) => {
    var questionAndAnswerNotes = app.models.questionAndAnswerNotes;
    try {
        questionAndAnswerNotes.create(questionAndAnswerNotesdata, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result)
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

questionAndAnswerNotesService.prototype.updateQuestionAndAnswerService = (msgId,questionAndAnswerNotesdata, callback) => {
    var questionAndAnswerNotes = app.models.questionAndAnswerNotes;
    try {
        questionAndAnswerNotes.updateAll({ id: msgId },questionAndAnswerNotesdata, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, result)
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};
questionAndAnswerNotesService.prototype.findQuestionAndAnswerNotes = (questionAndAnswerNotesId, callback) => {
    var questionAndAnswerNotes = app.models.questionAndAnswerNotes;
    try {
        questionAndAnswerNotes.find({ where: { "id": questionAndAnswerNotesId }, limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback("questionAndAnswerNotes not found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};
questionAndAnswerNotesService.prototype.findUnApprovedQuestionAndAnswer = ( callback) => {
    var questionAndAnswerNotes = app.models.questionAndAnswerNotes;
    try {
        questionAndAnswerNotes.find({ where: { "isApproved": false,"isCanceled":false }, limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback("questionAndAnswerNotes not found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};
var self = module.exports = new questionAndAnswerNotesService();