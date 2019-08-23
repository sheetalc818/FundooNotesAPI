'use strict';
var app = require('../../server/server');
function userService() {

}
userService.prototype.checkAndGetUserService = (userId, callback) => {
    var user = app.models.user;
    try {
        user.find({ where: { "id": userId }, limit: 1000 }, function (err, data) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, data)
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};


userService.prototype.updateUser = (userId,obj, callback) => {
    var user = app.models.user;
    try {
        user.updateAll({ id: userId},obj, function (err, count) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, "updated sucessfully");
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

userService.prototype.getUserList = (callback) => {
    var user = app.models.user;
    try {
        user.find({ limit: 1000 }, function (err, data) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, data)
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

userService.prototype.getUserStaticsService = (callback) => {
    var user = app.models.user;
    try {
        var responseData = [];
        var regex = new RegExp("^basic$", "i")
        user.find({
            where: { service: { "regexp": new RegExp("^basic$", "i") } }

        }, function (err, basicData) {
            if (err) {
                return callback(err);
            } else {
                responseData.push({ "service": "basic", "count": basicData.length });
                user.find({
                    where: { service: { "regexp": new RegExp("^advance$", "i") } }

                }, function (err, advanceData) {
                    if (err) {
                        return callback(err);
                    } else {
                        responseData.push({ "service": "advance", "count": advanceData.length });
                        return callback(null, responseData)
                    }
                });

            }
        });
    }
    catch (e) {
        return callback(e);
    }
};


userService.prototype.searchUserListService = (obj, callback) => {
    var user = app.models.user;
    try {
        console.log(obj);
        var responseData = [];
        var pattern = new RegExp('.*' + obj.searchWord + '.*', "i"); //new RegExp("^"+obj.searchWord+"$", "i")
        user.find({
            where: { email: { "like": pattern } }

        }, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                var responseR = [];
                for (var i = 0; i < result.length; i++) {
                    responseR.push({ "firstName": result[i].firstName, "lastName": result[i].lastName, "email": result[i].email, "userId": result[i].id });
                }
                return callback(null, responseR);
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

var self = module.exports = new userService();