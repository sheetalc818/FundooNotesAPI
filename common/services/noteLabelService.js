'use strict';
var app = require('../../server/server');
var async = require('async');
function noteLabelService() {

}
noteLabelService.prototype.updateNoteLabelService = (noteLableId, notelabeldata, userId, callback) => {
    var noteLable = app.models.noteLabel;
    try {
        noteLable.updateAll({ id: noteLableId }, notelabeldata, function (err, count) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, "updated sucessfully")
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

noteLabelService.prototype.getNoteLabelListService = ( userId, callback) => {
    var noteLable = app.models.noteLabel;
    try {
        noteLable.find({ where: { "userId": userId,"isDeleted":false }, limit: 1000 }, function (err, result) {
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
var self = module.exports = new noteLabelService();