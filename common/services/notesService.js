'use strict';
var app = require('../../server/server');
var async = require('async');
var Client = require('node-rest-client').Client;
function notesService() {

}
notesService.prototype.addNoteService = (data, userId, callback) => {
    var Notes = app.models.notes;
    var NoteLabels = app.models.noteLabel
    try {
        console.log(data);
        var date = new Date();
        data.createdDate = date;
        data.modifiedDate = date;
        var mydata = new Notes(data)
        Notes.create(mydata, function (err, noteData) {
            if (err) {
                return callback(err);
            } else {
                console.log(noteData)
                self.connectNoteWithLabel(noteData.id, data.labelIdList, function (err, result) {
                    return callback(null, noteData);
                })


                ////remove mapping
                // var oldLabel = new NoteLabels();
                // oldLabel.id = '5bbdc942a7d03049ec6a5ab9';

                // var oldNote = new Notes();

                // oldNote.id = '5ba4a61939856445a0562565';
                // oldNote.noteLabels.remove(oldLabel, function (err) {
                //     //...
                //     console.log(err);
                //     return callback(null, data);
                // });


                // var oldNote = new Notes();
                // oldNote.id='5ba4a61939856445a0562565';
                // oldNote.noteLabels.destroy(
                //      '5bbd8e3ac6eaa1282e4584ce'
                // , function(err) {
                //     //...
                //     console.log(err);
                //     return callback(null, data);
                //   });


                // return callback(null,data);
                // data.noteLabels.add('5bbd8e3ac6eaa1282e4584ce', function(err) {
                //     //...
                //     console.log(err);
                //     return callback(null, data);
                //   });

                // data.noteLabels.create({ label: "my test" }, function (err) {
                //     //...
                //     console.log(err)
                //     return callback(null, data);
                // });

                // var oldNote = new Notes();
                // oldNote.id='5ba4a61939856445a0562565';
                // oldNote.noteLabels.add('5bbd8e3ac6eaa1282e4584ce', function(err) {
                //     //...
                //     console.log(err);
                //     return callback(null, data);
                //   });



            }
        });
    }
    catch (e) {
        return callback(e);
    }
};


notesService.prototype.mapNoteWithLabelService = (noteId, labelId, userId, callback) => {
    var Notes = app.models.notes;
    var NoteLabels = app.models.noteLabel
    try {
        var oldNote = new Notes();
        oldNote.id = noteId;
        oldNote.noteLabels.add(labelId, function (err) {
            return callback(null, "Added successfully");
        });
    }
    catch (e) {
        return callback(e);
    }
};

notesService.prototype.removeNoteWithLabelService = (noteId, labelId, userId, callback) => {
    var Notes = app.models.notes;
    var NoteLabels = app.models.noteLabel
    try {
        ////remove mapping
        var oldLabel = new NoteLabels();
        oldLabel.id = labelId;

        var oldNote = new Notes();

        oldNote.id = noteId;
        oldNote.noteLabels.remove(oldLabel, function (err) {

            return callback(null, "Removed succesfully");
        });


    }
    catch (e) {
        return callback(e);
    }
};
notesService.prototype.updateNotesAsyncService = (noteIdList, userId, data, cb) => {
    try {
        var Notes = app.models.notes;
        if (noteIdList != null && noteIdList.length > 0) {

            var operations = [];
            for (var i = 0; i < noteIdList.length; i++) {

                var searchData = {
                    noteId: noteIdList[i],
                    updatedata: data,
                    userId: userId
                }
                operations.push((function (searchData) {
                    return function (callback) {

                        self.validateNotes(searchData.noteId, searchData.userId, function (err, notesResult) {
                            if (err) {
                                return callback(err);
                            }
                            else {
                                Notes.updateAll({ id: searchData.noteId }, searchData.updatedata, function (err, count) {
                                    if (err) {
                                        return callback(err);
                                    } else {
                                        return callback(null, "updated sucessfully");
                                    }
                                });


                            }
                        })
                    };
                })(searchData))
            }
            async.series(operations, function (err, results) {
                if (err) {
                    console.error("Error: Failed to update note ", err)
                    return cb(err);
                } else {
                    console.log("Info: updated")
                    return cb(null, results);
                }
            });
        }
    }
    catch (e) {
        return cb(e);
    }

}



notesService.prototype.deleteForeverNotesAsyncService = (noteIdList, userId, cb) => {
    try {
        var Notes = app.models.notes;
        if (noteIdList != null && noteIdList.length > 0) {

            var operations = [];
            for (var i = 0; i < noteIdList.length; i++) {

                var searchData = {
                    noteId: noteIdList[i],
                    userId: userId
                }
                operations.push((function (searchData) {
                    return function (callback) {

                        self.validateNotes(searchData.noteId, searchData.userId, function (err, notesResult) {
                            if (err) {
                                return callback(err);
                            }
                            else {
                                Notes.destroyById(searchData.noteId, function (err, count) {
                                    if (err) {
                                        return callback(err);
                                    } else {
                                        return callback(null, "deleted sucessfully");
                                    }
                                });
                            }
                        })
                    };
                })(searchData))
            }
            async.series(operations, function (err, results) {
                if (err) {
                    console.error("Error: Failed to update note ", err)
                    return cb(err);
                } else {
                    console.log("Info: updated")
                    return cb(null, results);
                }
            });
        }
    }
    catch (e) {
        return cb(e);
    }

}

notesService.prototype.connectNoteWithLabel = (noteId, labelIdList, cb) => {
    try {
        var Notes = app.models.notes;
        //console.log(labelIdList)
        if (labelIdList != null && labelIdList.length > 0) {
            // console.log("noteId ", noteId)
            //console.log("labelIdList ", labelIdList[0])
            var operations = [];
            for (var i = 0; i < labelIdList.length; i++) {

                var labelData = {
                    id: labelIdList[i],
                    noteId: noteId
                }
                // console.log(labelData);
                operations.push((function (labelData) {
                    return function (callback) {


                        var oldNote = new Notes();
                        oldNote.id = labelData.noteId;
                        oldNote.noteLabels.add(labelData.id, function (err) {
                            console.log(err);
                            return callback(null, "Label link sucessfully")
                        });
                    };
                })(labelData))
            }
            async.series(operations, function (err, results) {
                if (err) {
                    console.error("Error: Failed to map label ", err)
                    return cb(err);
                } else {
                    console.log("Info: label mapped.")
                    return cb(null, results);
                }
            });
        }
        else {
            return cb("lable not passed");
        }
    }
    catch (e) {
        return cb(e);
    }
}
notesService.prototype.updateNote = (noteId, data, userId, callback) => {
    var Notes = app.models.notes;
    try {
        //console.log("in");
        Notes.updateAll({ id: noteId }, data, function (err, count) {
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

notesService.prototype.findNotes = (noteId, callback) => {
    var Notes = app.models.notes;
    try {
        Notes.find({ where: { "id": noteId }, include: ['noteCheckLists', 'noteLabels','user', {'questionAndAnswerNotes':['user']}], limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback("Note not found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};
// lsof -i tcp:3000
// kill -9 14966
notesService.prototype.validateNotes = (noteId, userId, callback) => {
    var Notes = app.models.notes;
    try {
       
        userId = String(userId);
        Notes.find({ where: {id:noteId, or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] }, limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback("Note not found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

notesService.prototype.getNotesListService = (userId, callback) => {
    var Notes = app.models.notes;
    try {
        //console.log(userId);
        userId = String(userId);
        //Notes.find({ "where":{"collaberator.userid":userId}, limit: 1000 }, function (err, doc) {


        Notes.find({ where: { or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] },
         include: ['noteCheckLists', 'noteLabels', 'questionAndAnswerNotes',
         'user'], 
            limit: 1000 }, function (err, doc) {
            //Notes.find({ where: {  "userId": userId , "reminder":{ lt:'2018-10-10T00:00:00.000Z' }  }, include: ['noteCheckLists', 'noteLabels','questionAndAnswerNotes'], limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {

                    return callback(null, doc)
                }
                else {
                    return callback(null, doc);
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

notesService.prototype.getTrashNotesListService = (userId, callback) => {
    var Notes = app.models.notes;
    try {
        //console.log(userId);
        userId = String(userId);
        //Notes.find({ "where":{"collaberator.userid":userId}, limit: 1000 }, function (err, doc) {
        Notes.find({ where: { 'isDeleted': true, or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] }, include: ['noteCheckLists', 'noteLabels','user','questionAndAnswerNotes'], limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback(null, doc);
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

notesService.prototype.getArchiveNotesListService = (userId, callback) => {
    var Notes = app.models.notes;
    try {
        //console.log(userId);
        userId = String(userId);
        //Notes.find({ "where":{"collaberator.userid":userId}, limit: 1000 }, function (err, doc) {
        Notes.find({ where: { 'isArchived': true, or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] }, include: ['noteCheckLists', 'noteLabels','user','questionAndAnswerNotes'], limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback(null, doc);
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

notesService.prototype.getReminderNotesListService = (userId, callback) => {
    var Notes = app.models.notes;
    try {
        //console.log(userId);
        userId = String(userId);
        //Notes.find({ "where":{"collaberator.userid":userId}, limit: 1000 }, function (err, doc) {
        Notes.find({ where: { 'isArchived': false, isDeleted: false, reminder: { neq: [] }, or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] }, include: ['noteCheckLists', 'noteLabels','user','questionAndAnswerNotes'], limit: 1000 }, function (err, doc) {
            if (err) {
                return callback(err);
            } else {
                if (doc.length > 0) {
                    return callback(null, doc)
                }
                else {
                    return callback(null, doc);
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};
// notesService.prototype.getUserLabelListService = (userId, callback) => {
//     var Notes = app.models.notes;
//     try {
//         //console.log(userId);
//         userId = String(userId);
//         //Notes.find({ "where":{"collaberator.userid":userId}, limit: 1000 }, function (err, doc) {
//         Notes.find({ fields: ['label'], limit: 1000 }, function (err, doc) {
//             if (err) {
//                 return callback(err);
//             } else {
//                 if (doc.length > 0) {
//                     return callback(null, doc)
//                 }
//                 else {
//                     return callback(null, doc);
//                 }
//             }
//         });
//     }
//     catch (e) {
//         return callback(e);
//     }
// };



notesService.prototype.getNotesListByLabelService = (userId, labelName, callback) => {
    var Notes = app.models.notes;
    try {
        userId = String(userId);
        var NoteLabels = app.models.noteLabel;
        Notes.find({ where: { 'isArchived': false, "isDeleted": false, or: [{ "userId": userId }, { collaborators: { elemMatch: { userId: userId } } }] }, include: ['noteCheckLists', 'noteLabels','user','questionAndAnswerNotes'], limit: 1000 }, function (err, docArray) {
            if (err) {
                return callback(err);
            } else {
                var mydata = [];

                for (var i = 0; i < docArray.length; i++) {
                    var doc = JSON.parse(JSON.stringify(docArray[i])).noteLabels;
                    var index = doc.findIndex(function (element, index, array) {
                        if (element.label != null && element.label != undefined && element.label.toLowerCase() == labelName.toLowerCase()) {
                            return true;
                        }
                    })
                    if (index != -1) {
                        mydata.push(docArray[i])
                    }
                }
                return callback(null, mydata);
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};


notesService.prototype.sendPushNotification = (title, userId, callback) => {
    var pushToken = app.models.pushToken;
    try {
        pushToken.find({ where: { userId: userId, isDeleted: false }, limit: 1000 }, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                var RegisteredTokens = [];
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        RegisteredTokens.push(result[i].pushToken)
                    }

                }
                if (RegisteredTokens.length > 0) {

                    var client = new Client();

                    var fullapiurl = "https://android.googleapis.com/gcm/send";
                    var body = {
                        "notification": { "title": title, "body": "This is the reminder of your " + title, "click_action": "http://localhost:4200" },
                        // "to": data.pushToken,
                        registration_ids: RegisteredTokens
                    };  //"eozuAnBkBQA:APA91bE0IDPKCrW56F5UBRZRLa7DbHLqRSd83t1JM6RVPMpigZPsGtLmHCwn9C972Gx7JnVjtj3J2_gpXXWhyPjjjbi03J_MMFqmvEAba2ntvd-IUyN7GHGmVXHevZPCABhAVq8SVofd"
                    var args = {
                        data: body,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": process.env.FIREBASE_SERVER_KEY
                        } // request headers
                    };
                    client.post(fullapiurl, args,
                        function (data, response) {
                            return callback(null, "push notification sent")
                        });
                }
                else {
                    return callback("No tokens found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }


}


function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}
notesService.prototype.getReminderByDateTimeNotesListService = (callback) => {
    var Notes = app.models.notes;
    try {
        //console.log(userId);
        var currentDate = new Date();
        var newDate = new Date();
        var durationInMinutes = 1;

        newDate = newDate.setMinutes(currentDate.getMinutes() - durationInMinutes);
        newDate = new Date(newDate);

        //currentDate=toTimestamp(currentDate);
        //console.log(newDate);
        //console.log(currentDate);
        //return callback(null,[ newDate,currentDate]);
        //Notes.find({ where: { isArchived:false,isDeleted:false, "reminder.date":{ lt:currentDate}  }, limit: 1000 }, function (err, doc) {
        //         Notes.find({ where: { isArchived:false,isDeleted:false, "reminder":{ lt:newDate}  }, limit: 1000 }, function (err, doc) {
        //             if (err) {
        //                 return callback(err);
        //             } else {
        //                 if (doc.length > 0) {
        // console.log(doc);
        //                     return callback(null, doc)
        //                 }
        //                 else {
        //                     return callback(null, doc);
        //                 }
        //             }
        //         });

        Notes.find({ where: { isArchived: false, isDeleted: false, "reminder": { neq: [] } }, limit: 1000 }, function (err, doc) {
            if (err) {
                //console.log(err)
                return callback(err);
            } else {
                if (doc.length > 0) {
                    //return callback(null, doc);
                    var operations = [];
                    for (var i = 0; i < doc.length; i++) {
                        if (doc[i].reminder != null && doc[i].reminder != undefined && doc[i].reminder.length > 0) {
                            //console.log(new Date(doc[i].reminder[0]))
                            if (new Date(doc[i].reminder[0]) >= newDate && new Date(doc[i].reminder[0]) < currentDate) {
                                //var noteTitle = doc[i].title;
                                //console.log(" send PN to date ", doc[i].reminder[0]);
                                //console.log(" send PN to user ", doc[i]);
                                var paraData = {
                                    title: doc[i].title,
                                    userId: doc[i].userId
                                }
                                operations.push((function (paraData) {
                                    return function (cb) {

                                        self.sendPushNotification(paraData.title, paraData.userId, function (err, notesResult) {
                                            if (err) {
                                                return cb(err);
                                            }
                                            else {
                                                return cb(null, "Push notification sent");
                                            }
                                        })
                                    };
                                })(paraData))
                            }
                        }
                    }
                    async.series(operations, function (err, results) {
                        if (err) {
                            //console.error("Error: Failed to update note ", err)
                            return callback(err);
                        } else {
                            //console.log("Info: updated")
                            return callback(null, results);
                        }
                    });
                }
                else {
                    return callback("data not found");
                }
            }
        });
    }
    catch (e) {
        return callback(e);
    }
};

var self = module.exports = new notesService();