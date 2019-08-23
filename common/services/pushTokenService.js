'use strict';
var app = require('../../server/server');
var async = require('async');
function pushTokenService() {

}
pushTokenService.prototype.addPushTokenService = (pushTokenData, userId, callback) => {
    var pushToken = app.models.pushToken;
    try {
        pushToken.create(pushTokenData, function (err, result) {
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

pushTokenService.prototype.updatePushTokenUsingTokenService = (pushTokenValue,pushTokenData, callback) => {
    var pushToken = app.models.pushToken;
    try {
        //console.log(pushToken)
        //console.log(pushTokenData)
        pushToken.updateAll({ pushToken: pushTokenValue }, pushTokenData, function (err, count) {
            if (err) {
                return callback(err);
            } else {
                console.log(count)
                return callback(null, "updated sucessfully")
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

// pushTokenService.prototype.getNoteLabelListService = ( userId, callback) => {
//     var noteLable = app.models.noteLabel;
//     try {
//         noteLable.find({ where: { "userId": userId,"isDeleted":false }, limit: 1000 }, function (err, result) {
//             if (err) {
//                 return callback(err);
//             } else {
//                 return callback(null, result)
//             }
//         });
//     }
//     catch (e) {
//         return callback(e);
//     }
// };
var self = module.exports = new pushTokenService();