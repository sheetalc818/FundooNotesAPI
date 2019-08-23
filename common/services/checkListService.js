'use strict';
var app = require('../../server/server');
var async = require('async');
function checklistService() {

}
checklistService.prototype.addCheckListService = (noteId, checklistdata, userId, cb) => {
    var noteCheckLists = app.models.noteCheckLists;
    try {
        if (checklistdata != undefined && checklistdata != null && checklistdata.length > 0) {
            var currentdate = new Date();
            var operations = [];
            for (var i = 0; i < checklistdata.length; i++) {
                if (checklistdata[i].itemName != null && checklistdata[i].itemName != undefined && checklistdata[i].itemName != "") {
                    if (checklistdata[i].status != null && checklistdata[i].status != undefined && (checklistdata[i].status == "open" || checklistdata[i].status == "close")) {

                        var data = {
                            itemName: checklistdata[i].itemName,
                            status: checklistdata[i].status,
                            createdDate: currentdate,
                            modifiedDate: currentdate,
                            notesId: noteId
                        }
                        operations.push((function (data) {
                            return function (callback) {
                                noteCheckLists.create(data, function (err, count) {
                                    if (err) {
                                        return callback(err);
                                    } else {
                                        return callback(null, "checklist added sucessfully")
                                    }
                                });
                            };
                        })(data))
                    }
                }
            }
            if (operations.length > 0) {
                async.series(operations, function (err, results) {
                    if (err) {
                        console.error("Error: Failed to add checklist ", err)
                        return cb(err);
                    } else {
                        console.log("Info: checklist added.")
                        return cb(null, results);
                    }
                });
            }else{
                return cb(null, "checklist added sucessfully")
            }
        }
        else {
            return cb(null, "checklist added sucessfully")
        }

    }
    catch (e) {
        return cb(e);
    }
};

checklistService.prototype.addSingleCheckListService = (noteId, checklistdata, userId, cb) => {
    var noteCheckLists = app.models.noteCheckLists;
    try {
        if (checklistdata != undefined && checklistdata != null) {
            var currentdate = new Date();
            var data = {
                itemName: checklistdata.itemName,
                status: checklistdata.status,
                createdDate: currentdate,
                modifiedDate: currentdate,
                notesId: noteId
            }

            noteCheckLists.create(data, function (err, result) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, result)
                }
            });
        }
        else {
            return cb("Checklist data not available")
        }
    }
    catch (e) {
        return cb(e);
    }
};


checklistService.prototype.updateCheckListBulkService = (noteId, checklistdata, userId, cb) => {
    //var noteCheckLists = app.models.noteCheckLists;
    try {
        if (checklistdata != undefined && checklistdata != null && checklistdata.length > 0) {
            var currentdate = new Date();
            var operations = [];
            for (var i = 0; i < checklistdata.length; i++) {
                var data = {
                    itemName: checklistdata[i].itemName,
                    status: checklistdata[i].status,
                    modifiedDate: currentdate
                }
                operations.push((function (data) {
                    return function (callback) {
                        self.updateSingleCheckListByQueryService(checklistdata[i].id, data, function (err, resultdata) {
                            if (err) {
                                return callback(err);
                            } else {
                                return callback(null, "checklist updated sucessfully")
                            }
                        });
                    };
                })(data))
            }
            async.series(operations, function (err, results) {
                if (err) {
                    console.error("Error: Failed to add checklist ", err)
                    return cb(err);
                } else {
                    console.log("Info: checklist added.")
                    return cb(null, results);
                }
            });
        }
        else {
            return cb("Checklist data not available")
        }

    }
    catch (e) {
        return cb(e);
    }
};


checklistService.prototype.updateSingleCheckListByQueryService = (checklistId, checklistdata, userId, cb) => {
    var noteCheckLists = app.models.noteCheckLists;
    try {
        if (checklistdata != undefined && checklistdata != null) {


            noteCheckLists.updateAll({ id: checklistId }, checklistdata, function (err, count) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, "checklist updated sucessfully")
                }
            });
        }
        else {
            return cb("Checklist data not available")
        }

    }
    catch (e) {
        return cb(e);
    }
};
var self = module.exports = new checklistService();