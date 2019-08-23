'use strict';
var notesService = require('../services/notesService');
var checkListService = require('../services/checkListService');
var userService = require('../services/userService');

var app = require('../../server/server');
var disableAllMethods = require('./helper').disableAllMethods;
var multer = require('multer');
var fs = require('fs');


module.exports = function (Notes) {
    disableAllMethods(Notes, []);

    // Notes.embedsMany(app.models.noteLabel, {
    //     as: 'address', // default to the relation name - address
    //     property: 'billingAddress' // default to addressItem
    //   });


    // Notes.pinUnpinNotes = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {
    //             if (data.isPined != null && data.isPined != undefined && (data.isPined == true || data.isPined == false)) {
    //                 var userId = "";
    //                 if (req.accessToken!=null && req.accessToken!=undefined &&  req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                     userId = req.accessToken.userId;
    //                 }
    //                 notesService.validateNotes(id, userId, function (err, notesResult) {
    //                     if (err) {
    //                         var responseResult = {
    //                             "success": false,
    //                             "message": err
    //                         }
    //                         return cb(responseResult);
    //                     }
    //                     else {
    //                         notesService.updateNote(id, { "isPined": data.isPined }, userId, function (err, updateResult) {
    //                             if (err) {
    //                                 var responseResult = {
    //                                     "success": false,
    //                                     "message": err
    //                                 }
    //                                 return cb(responseResult);
    //                             }
    //                             else {
    //                                 var responseResult = {
    //                                     "success": true,
    //                                     "message": updateResult
    //                                 }
    //                                 return cb(null, responseResult);
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //             else {
    //                 var responseResult = {
    //                     "success": false,
    //                     "message": "Please provide valid pin value"
    //                 }
    //                 return cb(responseResult);
    //             }
    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'pinUnpinNotes',
    //     {
    //         http: { path: '/:id/pinUnpinNotes', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    Notes.pinUnpinNotes = function (data, req, cb) {
        try {
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                if (data.isPined != null && data.isPined != undefined && (data.isPined == true || data.isPined == false)) {
                    var userId = "";
                    if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    notesService.updateNotesAsyncService(data.noteIdList, userId, { "isArchived": false, "isPined": data.isPined }, function (err, updateResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {
                            var responseResult = {
                                "success": true,
                                "message": "Note updated sucessfully"
                            }
                            return cb(null, responseResult);
                        }
                    })

                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid pin value"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node ids"
                }
                return cb(responseResult);
            }

        } catch (e) {
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'pinUnpinNotes',
        {
            http: { path: '/pinUnpinNotes', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    // Notes.archiveNotes = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {
    //             if (data.isArchived != null && data.isArchived != undefined && (data.isArchived == true || data.isArchived == false)) {
    //                 var userId = "";
    //                 if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                     userId = req.accessToken.userId;
    //                 }
    //                 userService.checkAndGetUserService(userId, function (err, userdetails) {
    //                     if (err) {
    //                         var responseResult = {
    //                             "success": false,
    //                             "message": "Some error occured, please try in sometimes."
    //                         }
    //                         return cb(responseResult);
    //                     }
    //                     else {
    //                         if (userdetails != null && userdetails.length > 0) {
    //                             var subscription = userdetails[0].service;
    //                             if (subscription.toLowerCase() == "advance") {
    //                                 notesService.validateNotes(id, userId, function (err, notesResult) {
    //                                     if (err) {
    //                                         var responseResult = {
    //                                             "success": false,
    //                                             "message": err
    //                                         }
    //                                         return cb(responseResult);
    //                                     }
    //                                     else {
    //                                         notesService.updateNote(id, { "isArchived": data.isArchived }, userId, function (err, updateResult) {
    //                                             if (err) {
    //                                                 var responseResult = {
    //                                                     "success": false,
    //                                                     "message": err
    //                                                 }
    //                                                 return cb(responseResult);
    //                                             }
    //                                             else {
    //                                                 var responseResult = {
    //                                                     "success": true,
    //                                                     "message": updateResult
    //                                                 }
    //                                                 return cb(null, responseResult);
    //                                             }
    //                                         })
    //                                     }
    //                                 })
    //                             }
    //                             else {
    //                                 var responseResult = {
    //                                     "success": false,
    //                                     "message": "You dont have permission to archive the notes"
    //                                 }
    //                                 return cb(responseResult);
    //                             }
    //                         }
    //                         else {
    //                             var responseResult = {
    //                                 "success": false,
    //                                 "message": "USer not found"
    //                             }
    //                             return cb(responseResult);
    //                         }
    //                     }
    //                 })

    //             }
    //             else {
    //                 var responseResult = {
    //                     "success": false,
    //                     "message": "Please provide valid archive value"
    //                 }
    //                 return cb(responseResult);
    //             }
    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }

    // }
    // Notes.remoteMethod(
    //     'archiveNotes',
    //     {
    //         http: { path: '/:id/archiveNotes', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );
    Notes.archiveNotes = function (data, req, cb) {
        try {
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                if (data.isArchived != null && data.isArchived != undefined && (data.isArchived == true || data.isArchived == false)) {
                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    userService.checkAndGetUserService(userId, function (err, userdetails) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": "Some error occured, please try in sometimes."
                            }
                            return cb(responseResult);
                        }
                        else {
                            if (userdetails != null && userdetails.length > 0) {
                                var subscription = userdetails[0].service;
                                if (subscription.toLowerCase() == "advance") {
                                    notesService.updateNotesAsyncService(data.noteIdList, userId, { "isArchived": data.isArchived, "isPined": false }, function (err, updateResult) {
                                        if (err) {
                                            var responseResult = {
                                                "success": false,
                                                "message": err
                                            }
                                            return cb(responseResult);
                                        }
                                        else {
                                            var responseResult = {
                                                "success": true,
                                                "message": "Note updated sucessfully"
                                            }
                                            return cb(null, responseResult);
                                        }
                                    })
                                }
                                else {
                                    var responseResult = {
                                        "success": false,
                                        "message": "You dont have permission to archive the notes"
                                    }
                                    return cb(responseResult);
                                }
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "USer not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })

                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid archive value"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }

    }
    Notes.remoteMethod(
        'archiveNotes',
        {
            http: { path: '/archiveNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    // Notes.trashNotes = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {
    //             if (data.isDeleted != null && data.isDeleted != undefined && (data.isDeleted == true || data.isDeleted == false)) {
    //                 var userId = "";
    //                 if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                     userId = req.accessToken.userId;
    //                 }
    //                 userService.checkAndGetUserService(userId, function (err, userdetails) {
    //                     if (err) {
    //                         var responseResult = {
    //                             "success": false,
    //                             "message": "Some error occured, please try in sometimes."
    //                         }
    //                         return cb(responseResult);
    //                     }
    //                     else {
    //                         if (userdetails != null && userdetails.length > 0) {
    //                             var subscription = userdetails[0].service;
    //                             if (subscription.toLowerCase() == "advance") {

    //                                 notesService.validateNotes(id, userId, function (err, notesResult) {
    //                                     if (err) {
    //                                         var responseResult = {
    //                                             "success": false,
    //                                             "message": err
    //                                         }
    //                                         return cb(responseResult);
    //                                     }
    //                                     else {
    //                                         notesService.updateNote(id, { "isDeleted": data.isDeleted }, userId, function (err, updateResult) {
    //                                             if (err) {
    //                                                 var responseResult = {
    //                                                     "success": false,
    //                                                     "message": err
    //                                                 }
    //                                                 return cb(responseResult);
    //                                             }
    //                                             else {
    //                                                 var responseResult = {
    //                                                     "success": true,
    //                                                     "message": updateResult
    //                                                 }
    //                                                 return cb(null, responseResult);
    //                                             }
    //                                         })
    //                                     }
    //                                 })
    //                             }
    //                             else {
    //                                 var responseResult = {
    //                                     "success": false,
    //                                     "message": "You dont have permission to delete the notes"
    //                                 }
    //                                 return cb(responseResult);
    //                             }
    //                         }
    //                         else {
    //                             var responseResult = {
    //                                 "success": false,
    //                                 "message": "USer not found"
    //                             }
    //                             return cb(responseResult);
    //                         }
    //                     }
    //                 })
    //             }
    //             else {
    //                 var responseResult = {
    //                     "success": false,
    //                     "message": "Please provide valid trash value"
    //                 }
    //                 return cb(responseResult);
    //             }
    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'trashNotes',
    //     {
    //         http: { path: '/:id/trashNotes', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    Notes.trashNotes = function (data, req, cb) {
        try {
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                if (data.isDeleted != null && data.isDeleted != undefined && (data.isDeleted == true || data.isDeleted == false)) {
                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    userService.checkAndGetUserService(userId, function (err, userdetails) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": "Some error occured, please try in sometimes."
                            }
                            return cb(responseResult);
                        }
                        else {
                            if (userdetails != null && userdetails.length > 0) {
                                var subscription = userdetails[0].service;
                                if (subscription.toLowerCase() == "advance") {
                                    notesService.updateNotesAsyncService(data.noteIdList, userId, { "isDeleted": data.isDeleted }, function (err, updateResult) {
                                        if (err) {
                                            var responseResult = {
                                                "success": false,
                                                "message": err
                                            }
                                            return cb(responseResult);
                                        }
                                        else {
                                            var responseResult = {
                                                "success": true,
                                                "message": "Note updated sucessfully"
                                            }
                                            return cb(null, responseResult);
                                        }
                                    })
                                }
                                else {
                                    var responseResult = {
                                        "success": false,
                                        "message": "You dont have permission to delete the notes"
                                    }
                                    return cb(responseResult);
                                }
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "USer not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid trash value"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'trashNotes',
        {
            http: { path: '/trashNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.deleteForeverNotes = function (data, req, cb) {
        try {
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                userService.checkAndGetUserService(userId, function (err, userdetails) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": "Some error occured, please try in sometimes."
                        }
                        return cb(responseResult);
                    }
                    else {
                        if (userdetails != null && userdetails.length > 0) {
                            var subscription = userdetails[0].service;
                            if (subscription.toLowerCase() == "advance") {
                                notesService.deleteForeverNotesAsyncService(data.noteIdList, userId, function (err, updateResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": "Note deleted sucessfully"
                                        }
                                        return cb(null, responseResult);
                                    }
                                })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "You dont have permission to delete the notes"
                                }
                                return cb(responseResult);
                            }
                        }
                        else {
                            var responseResult = {
                                "success": false,
                                "message": "USer not found"
                            }
                            return cb(responseResult);
                        }
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'deleteForeverNotes',
        {
            http: { path: '/deleteForeverNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    // Notes.changesColorNotes = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {
    //             if (data.color != null && data.color != undefined && data.color != "") {
    //                 var colorRegex = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/;
    //                 if (!colorRegex.test(data.color)) {
    //                     var responseResult = {
    //                         "success": false,
    //                         "message": "Invalid color code"
    //                     }
    //                     return cb(responseResult);
    //                 }
    //                 var userId = "";
    //                 if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                     userId = req.accessToken.userId;
    //                 }
    //                 userService.checkAndGetUserService(userId, function (err, userdetails) {
    //                     if (err) {
    //                         var responseResult = {
    //                             "success": false,
    //                             "message": "Some error occured, please try in sometimes."
    //                         }
    //                         return cb(responseResult);
    //                     }
    //                     else {
    //                         if (userdetails != null && userdetails.length > 0) {
    //                             var subscription = userdetails[0].service;
    //                             if (subscription.toLowerCase() == "advance") {
    //                                 notesService.validateNotes(id, userId, function (err, notesResult) {
    //                                     if (err) {
    //                                         var responseResult = {
    //                                             "success": false,
    //                                             "message": err
    //                                         }
    //                                         return cb(responseResult);
    //                                     }
    //                                     else {
    //                                         notesService.updateNote(id, { "color": data.color }, userId, function (err, updateResult) {
    //                                             if (err) {
    //                                                 var responseResult = {
    //                                                     "success": false,
    //                                                     "message": err
    //                                                 }
    //                                                 return cb(responseResult);
    //                                             }
    //                                             else {
    //                                                 var responseResult = {
    //                                                     "success": true,
    //                                                     "message": updateResult
    //                                                 }
    //                                                 return cb(null, responseResult);
    //                                             }
    //                                         })
    //                                     }
    //                                 })
    //                             }
    //                             else {
    //                                 var responseResult = {
    //                                     "success": false,
    //                                     "message": "You dont have permission to change color of the notes"
    //                                 }
    //                                 return cb(responseResult);
    //                             }
    //                         }
    //                         else {
    //                             var responseResult = {
    //                                 "success": false,
    //                                 "message": "USer not found"
    //                             }
    //                             return cb(responseResult);
    //                         }
    //                     }
    //                 })


    //             }
    //             else {
    //                 var responseResult = {
    //                     "success": false,
    //                     "message": "Please provide valid color value"
    //                 }
    //                 return cb(responseResult);
    //             }
    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'changesColorNotes',
    //     {
    //         http: { path: '/:id/changesColorNotes', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    Notes.changesColorNotes = function (data, req, cb) {
        try {
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                if (data.color != null && data.color != undefined && data.color != "") {
                    var colorRegex = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/;
                    if (!colorRegex.test(data.color)) {
                        var responseResult = {
                            "success": false,
                            "message": "Invalid color code"
                        }
                        return cb(responseResult);
                    }
                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    userService.checkAndGetUserService(userId, function (err, userdetails) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": "Some error occured, please try in sometimes."
                            }
                            return cb(responseResult);
                        }
                        else {
                            if (userdetails != null && userdetails.length > 0) {
                                var subscription = userdetails[0].service;
                                if (subscription.toLowerCase() == "advance") {
                                    notesService.updateNotesAsyncService(data.noteIdList, userId, { "color": data.color }, function (err, updateResult) {
                                        if (err) {
                                            var responseResult = {
                                                "success": false,
                                                "message": err
                                            }
                                            return cb(responseResult);
                                        }
                                        else {
                                            var responseResult = {
                                                "success": true,
                                                "message": "Note updated sucessfully"
                                            }
                                            return cb(null, responseResult);
                                        }
                                    })
                                }
                                else {
                                    var responseResult = {
                                        "success": false,
                                        "message": "You dont have permission to change color of the notes"
                                    }
                                    return cb(responseResult);
                                }
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "USer not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid color value"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }
    }
    Notes.remoteMethod(
        'changesColorNotes',
        {
            http: { path: '/changesColorNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    // Notes.addUpdateReminderNotes = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {
    //             if (data.reminderDate != null && data.reminderDate != undefined && data.reminderDate != "") {
    //                 data.reminderDate = new Date(data.reminderDate);
    //             }
    //             else {
    //                 data.reminderDate = null;
    //             }
    //             var userId = "";
    //             if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                 userId = req.accessToken.userId;
    //             }
    //             userService.checkAndGetUserService(userId, function (err, userdetails) {
    //                 if (err) {
    //                     var responseResult = {
    //                         "success": false,
    //                         "message": "Some error occured, please try in sometimes."
    //                     }
    //                     return cb(responseResult);
    //                 }
    //                 else {
    //                     if (userdetails != null && userdetails.length > 0) {
    //                         var subscription = userdetails[0].service;
    //                         if (subscription.toLowerCase() == "advance") {
    //                             notesService.validateNotes(id, userId, function (err, notesResult) {
    //                                 if (err) {
    //                                     var responseResult = {
    //                                         "success": false,
    //                                         "message": err
    //                                     }
    //                                     return cb(responseResult);
    //                                 }
    //                                 else {
    //                                     notesService.updateNote(id, { "reminder": data.reminderDate }, userId, function (err, updateResult) {
    //                                         if (err) {
    //                                             var responseResult = {
    //                                                 "success": false,
    //                                                 "message": err
    //                                             }
    //                                             return cb(responseResult);
    //                                         }
    //                                         else {
    //                                             var responseResult = {
    //                                                 "success": true,
    //                                                 "message": updateResult
    //                                             }
    //                                             return cb(null, responseResult);
    //                                         }
    //                                     })
    //                                 }
    //                             })
    //                         }
    //                         else {
    //                             var responseResult = {
    //                                 "success": false,
    //                                 "message": "You dont have permission to change color of the notes"
    //                             }
    //                             return cb(responseResult);
    //                         }
    //                     }
    //                     else {
    //                         var responseResult = {
    //                             "success": false,
    //                             "message": "USer not found"
    //                         }
    //                         return cb(responseResult);
    //                     }
    //                 }
    //             })


    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'addUpdateReminderNotes',
    //     {
    //         http: { path: '/:id/addUpdateReminderNotes', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );

    Notes.addUpdateReminderNotes = function (data, req, cb) {
        try {
            console.log(data);
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                if (data.reminder != null && data.reminder != undefined && data.reminder != "") {
                    //data.reminderDate = new Date(data.reminderDate);
                    try {
                        var reminderDate = new Date(data.reminder);
                        data.reminder = [reminderDate];
                    }
                    catch (ex) {
                        var responseResult = {
                            "success": false,
                            "message": "Invalid reminder date"
                        }
                        return cb(responseResult);
                    }
                }
                else {
                    // data.reminderDate = null;
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid reminder"
                    }
                    return cb(responseResult);
                }
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                userService.checkAndGetUserService(userId, function (err, userdetails) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": "Some error occured, please try in sometimes."
                        }
                        return cb(responseResult);
                    }
                    else {
                        if (userdetails != null && userdetails.length > 0) {
                            var subscription = userdetails[0].service;
                            if (subscription.toLowerCase() == "advance") {
                                // notesService.validateNotes(id, userId, function (err, notesResult) {
                                //     if (err) {
                                //         var responseResult = {
                                //             "success": false,
                                //             "message": err
                                //         }
                                //         return cb(responseResult);
                                //     }
                                //     else {
                                //notesService.updateNote(id, { "reminder": data.reminderDate }, userId, function (err, updateResult) {
                                notesService.updateNotesAsyncService(data.noteIdList, userId, { "reminder": data.reminder }, function (err, updateResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": updateResult
                                        }
                                        return cb(null, responseResult);
                                    }
                                })
                                //     }
                                // })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "You dont have permission to change color of the notes"
                                }
                                return cb(responseResult);
                            }
                        }
                        else {
                            var responseResult = {
                                "success": false,
                                "message": "USer not found"
                            }
                            return cb(responseResult);
                        }
                    }
                })


            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'addUpdateReminderNotes',
        {
            http: { path: '/addUpdateReminderNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.removeReminderNotes = function (data, req, cb) {
        try {
            console.log(data);
            if (data.noteIdList != null && data.noteIdList != undefined && data.noteIdList.length > 0) {
                //if (data.reminder != null && data.reminder != undefined && data.reminder != "") {
                //data.reminderDate = new Date(data.reminderDate);
                // try {
                //     var reminderDate = new Date(data.reminder);
                //     data.reminder = [reminderDate];
                // }
                // catch (ex) {
                //     var responseResult = {
                //         "success": false,
                //         "message": "Invalid reminder date"
                //     }
                //     return cb(responseResult);
                // }
                // }
                // else {
                //     // data.reminderDate = null;
                //     var responseResult = {
                //         "success": false,
                //         "message": "Please provide valid reminder"
                //     }
                //     return cb(responseResult);
                // }
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                userService.checkAndGetUserService(userId, function (err, userdetails) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": "Some error occured, please try in sometimes."
                        }
                        return cb(responseResult);
                    }
                    else {
                        if (userdetails != null && userdetails.length > 0) {
                            var subscription = userdetails[0].service;
                            if (subscription.toLowerCase() == "advance") {
                                // notesService.validateNotes(id, userId, function (err, notesResult) {
                                //     if (err) {
                                //         var responseResult = {
                                //             "success": false,
                                //             "message": err
                                //         }
                                //         return cb(responseResult);
                                //     }
                                //     else {
                                //notesService.updateNote(id, { "reminder": data.reminderDate }, userId, function (err, updateResult) {
                                notesService.updateNotesAsyncService(data.noteIdList, userId, { "reminder": [] }, function (err, updateResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": updateResult
                                        }
                                        return cb(null, responseResult);
                                    }
                                })
                                //     }
                                // })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "You dont have permission to change color of the notes"
                                }
                                return cb(responseResult);
                            }
                        }
                        else {
                            var responseResult = {
                                "success": false,
                                "message": "USer not found"
                            }
                            return cb(responseResult);
                        }
                    }
                })


            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'removeReminderNotes',
        {
            http: { path: '/removeReminderNotes', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    // Notes.updateNotes1 = function (id, data, req, cb) {
    //     try {
    //         if (id != null && id != undefined && id != "") {

    //             var userId = "";
    //             if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //                 userId = req.accessToken.userId;
    //             }
    //             notesService.validateNotes(id, userId, function (err, notesResult) {
    //                 if (err) {
    //                     var responseResult = {
    //                         "success": false,
    //                         "message": err
    //                     }
    //                     return cb(responseResult);
    //                 }
    //                 else {
    //                     var currentDate = new Date();
    //                     // var updateData={
    //                     //     "title": "",
    //                     //     "description": "",
    //                     //     "reminder": [
    //                     //     ],
    //                     //     "modifiedDate": currentDate,
    //                     //     "label": [
    //                     //       "test"
    //                     //     ],
    //                     //     "checkList": [
    //                     //       {}
    //                     //     ],
    //                     //     "ImageUrl": "string",
    //                     //     "linkUrl": "string",
    //                     //     "collaberator": [
    //                     //       {}
    //                     //     ]
    //                     //   }
    //                     var updateDate = { "modifiedDate": currentDate };
    //                     if (data.title != null && data.title != undefined && data.title != "") {
    //                         updateDate.title = data.title;
    //                     }
    //                     if (data.description != null && data.description != undefined && data.description != "") {
    //                         updateDate.description = data.description;
    //                     }
    //                     if (data.description != null && data.description != undefined && data.description != "") {
    //                         updateDate.description = data.description;
    //                     }
    //                     notesService.updateNote(id, updateDate, userId, function (err, updateResult) {
    //                         if (err) {
    //                             var responseResult = {
    //                                 "success": false,
    //                                 "message": err
    //                             }
    //                             return cb(responseResult);
    //                         }
    //                         else {
    //                             var responseResult = {
    //                                 "success": true,
    //                                 "message": updateResult
    //                             }
    //                             return cb(null, responseResult);
    //                         }
    //                     })
    //                 }
    //             })

    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide node id"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         callback(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'updateNotes1',
    //     {
    //         http: { path: '/:id/updateNotes1', verb: 'post' },
    //         accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
    //         { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );



    Notes.updateLabelListNotes = function (id, data, req, cb) {
        try {
            //console.log( data);
            if (id != null && id != undefined && id != "") {
                //console.log(typeof (data.labelList));
                //console.log( data.labelList);
                if (data.labelList != null && data.labelList != undefined) {

                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    userService.checkAndGetUserService(userId, function (err, userdetails) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": "Some error occured, please try in sometimes."
                            }
                            return cb(responseResult);
                        }
                        else {
                            if (userdetails != null && userdetails.length > 0) {
                                var subscription = userdetails[0].service;
                                if (subscription.toLowerCase() == "advance") {

                                    notesService.validateNotes(id, userId, function (err, notesResult) {
                                        if (err) {
                                            var responseResult = {
                                                "success": false,
                                                "message": err
                                            }
                                            return cb(responseResult);
                                        }
                                        else {
                                            notesService.updateNote(id, { "label": data.labelList }, userId, function (err, updateResult) {
                                                if (err) {
                                                    var responseResult = {
                                                        "success": false,
                                                        "message": err
                                                    }
                                                    return cb(responseResult);
                                                }
                                                else {
                                                    var responseResult = {
                                                        "success": true,
                                                        "message": updateResult
                                                    }
                                                    return cb(null, responseResult);
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    var responseResult = {
                                        "success": false,
                                        "message": "You dont have permission to label of the notes"
                                    }
                                    return cb(responseResult);
                                }
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "USer not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid label list"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }
    }
    Notes.remoteMethod(
        'updateLabelListNotes',
        {
            http: { path: '/:id/updateLabelListNotes', verb: 'post' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notes.updateLinkNotes = function (id, data, req, cb) {
        try {
            if (id != null && id != undefined && id != "") {
                if (data.linkUrl != null && data.linkUrl != undefined && data.linkUrl != '') {
                    var linkUrlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
                    if (!linkUrlRegex.test(data.linkUrl)) {
                        var responseResult = {
                            "success": false,
                            "message": "Invalid link url"
                        }
                        return cb(responseResult);
                    }
                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    notesService.validateNotes(id, userId, function (err, notesResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {
                            notesService.updateNote(id, { "linkUrl": data.linkUrl }, userId, function (err, updateResult) {
                                if (err) {
                                    var responseResult = {
                                        "success": false,
                                        "message": err
                                    }
                                    return cb(responseResult);
                                }
                                else {
                                    var responseResult = {
                                        "success": true,
                                        "message": updateResult
                                    }
                                    return cb(null, responseResult);
                                }
                            })
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid link"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }
    }
    Notes.remoteMethod(
        'updateLinkNotes',
        {
            http: { path: '/:id/updateLinkNotes', verb: 'post' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notes.AddcollaboratorsNotes = function (id, data, req, cb) {
        try {
            if (id != null && id != undefined && id != "") {
                if (data != null && data != undefined) {

                    if (data.firstName != null && data.firstName != undefined && data.firstName != "" &&
                        data.lastName != null && data.lastName != undefined && data.lastName != "" &&
                        data.email != null && data.email != undefined && data.email != "" &&
                        data.userId != null && data.userId != undefined && data.userId != "") {

                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "Please provide valid collaberator details"
                        }
                        return cb(responseResult);
                    }

                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    notesService.validateNotes(id, userId, function (err, notesResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {

                            var existingCollaberator = notesResult[0].collaborators;
                            if (existingCollaberator != null && existingCollaberator != undefined) {
                                for (var i = 0; i < existingCollaberator.length; i++) {
                                    if (String(existingCollaberator[i].userId) == String(data.userId)) {
                                        var responseResult = {
                                            "success": false,
                                            "message": "Provided collaberator already present"
                                        }
                                        return cb(responseResult);
                                    }
                                }
                            }
                            else {
                                existingCollaberator = [];
                            }
                            //console.log(existingCollaberator);
                            existingCollaberator.push(data);

                            notesService.updateNote(id, { "collaborators": existingCollaberator }, userId, function (err, updateResult) {
                                if (err) {
                                    var responseResult = {
                                        "success": false,
                                        "message": err
                                    }
                                    return cb(responseResult);
                                }
                                else {
                                    if (data.email != null && data.email != undefined && data.email != "") {
                                        var template = "<p>Hi,</p><p>"+req.accessToken.firstName+" added you as a collaraberator in his note, please <a href='http://localhost:4200/'>Click here</a> to see note</p> <p>Thanks</p>";
                                        app.models.Email.send({
                                            to: data.email,
                                            from: 'noreply@bridgelabz.com',
                                            subject: 'New Note added to you',
                                            text: 'New Note added to you',
                                            html: template
                                        }, function (err, mail) {
                                            console.log('email sent!');
                                        });
                                    }
                                    var responseResult = {
                                        "success": true,
                                        "message": updateResult
                                    }
                                    return cb(null, responseResult);
                                }
                            })
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid link"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }
    }
    Notes.remoteMethod(
        'AddcollaboratorsNotes',
        {
            http: { path: '/:id/AddcollaboratorsNotes', verb: 'post' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );



    Notes.removeCollaboratorsNotes = function (id, collaboratorUserId, req, cb) {
        try {
            if (id != null && id != undefined && id != "") {
                if (collaboratorUserId != null && collaboratorUserId != undefined && collaboratorUserId != "") {
                    var userId = "";
                    if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    console.log(id);
                    console.log(collaboratorUserId);

                    notesService.validateNotes(id, userId, function (err, notesResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {

                            var newCollaberator = [];//notesResult[0].collaberator;
                            if (notesResult[0].collaborators != null && notesResult[0].collaborators != undefined) {
                                for (var i = 0; i < notesResult[0].collaborators.length; i++) {
                                    if (notesResult[0].collaborators[i].userId == collaboratorUserId) {

                                    }
                                    else {
                                        newCollaberator.push(notesResult[0].collaborators[i])
                                    }
                                }
                            }
                            console.log(newCollaberator);

                            notesService.updateNote(id, { "collaborators": newCollaberator }, userId, function (err, updateResult) {
                                if (err) {
                                    var responseResult = {
                                        "success": false,
                                        "message": err
                                    }
                                    return cb(responseResult);
                                }
                                else {
                                    var responseResult = {
                                        "success": true,
                                        "message": updateResult
                                    }
                                    return cb(null, responseResult);
                                }
                            })
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid collaboratorUserId"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'removeCollaboratorsNotes',
        {
            http: { path: '/:id/removeCollaboratorsNotes/:collaboratorUserId', verb: 'delete' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { arg: 'collaboratorUserId', type: 'string', http: { source: 'path' } },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    //var guid = createGuid(); 
    Notes.getNotesList = function (req, cb) {
        try {
            // var objectId =  createGuid(); ;
            // console.log("objectId ", objectId)
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                notesService.getNotesListService(userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })

            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getNotesList',
        {
            http: { path: '/getNotesList', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // checking and creating uploads folder where files will be uploaded
            var dirPath = 'client/images/'
            if (!fs.existsSync(dirPath)) {
                var dir = fs.mkdirSync(dirPath);
            }
            cb(null, dirPath + '/');
        },
        filename: function (req, file, cb) {
            // file will be accessible in `file` variable
            var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
            var fileName = Date.now() + ext;
            uploadedFileName = fileName;
            console.log(fileName);
            cb(null, fileName);
        }
    });
    var upload = multer({
        storage: storage
    }).array('file', 12);


    // Notes.upload = function (req, res, cb) {
    //     // var Container = app.models.attachment; 
    //     upload(req, res, function (err, fileurl) {
    //         if (err) {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": err
    //             }
    //             return cb(responseResult);
    //         }
    //         else {
    //             console.log(req.files[0]);
    //             console.log(req.body);
    //             var responseResult = {
    //                 "success": true,
    //                 "message": "",
    //                 "data": uploadedFileName
    //             }
    //             return cb(null, responseResult);
    //         }
    //     });
    // }
    // Notes.remoteMethod(
    //     'upload',
    //     {
    //         http: { path: '/uploadDisplayPic', verb: 'post' },
    //         accepts: [
    //             { arg: 'req', type: 'object', 'http': { source: 'req' } },
    //             { arg: 'res', type: 'object', 'http': { source: 'res' } }
    //         ],
    //         returns: { arg: 'status', type: 'object' }
    //     }
    // );

    Notes.addNotes = function (req, res, file, title, description, labelIdList, checklist, isPined, isArchived, color, reminder, collaberators, cb) {
        // var Container = app.models.attachment; 
        var userId = "";
        if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
            userId = req.accessToken.userId;
        }
        if (userId != "") {


            upload(req, res, function (err, fileurl) {
                if (err) {
                    var responseResult = {
                        "success": false,
                        "message": err
                    }
                    return cb(responseResult);
                }
                else {
                    //console.log(req.files[0]);
                    //console.log(req.body);

                    var data = {
                        title: req.body.title,
                        description: "",
                        userId: userId,
                        label: [],
                        reminder: [],
                        color: "",
                        linkUrl: "",
                        imageUrl: "",
                        collaberator: [],
                        isPined: false
                    }
                    if (req.body.title == null && req.body.title == undefined) {
                        var responseResult = {
                            "success": false,
                            "message": "Please provide note title"
                        }
                        return cb(responseResult);
                    }
                    if (req.body.description != null && req.body.description != undefined) {
                        data.description = req.body.description;
                    }
                    if (req.body.labelIdList != null && req.body.labelIdList != undefined) {

                        try {
                            data.labelIdList = JSON.parse(req.body.labelIdList);
                        }
                        catch (e) {
                            data.labelIdList = [];
                        }
                    }
                    if (req.body.isPined != null && req.body.isPined != undefined && (req.body.isPined == true || req.body.isPined == 'true')) {
                        //console.log("in .....");
                        data.isPined = true;
                    }
                    if (req.body.isArchived != null && req.body.isArchived != undefined && (req.body.isArchived == true || req.body.isArchived == 'true')) {
                        data.isArchived = true;
                    }
                    if (req.body.reminder != null && req.body.reminder != undefined && req.body.reminder != "") {
                        try {
                            var reminderDate = new Date(req.body.reminder);
                            data.reminder = [reminderDate];
                        }
                        catch (ex) {
                            var responseResult = {
                                "success": false,
                                "message": "Invalid reminder date"
                            }
                            return cb(responseResult);
                        }

                    }
                    var collaberator = [];
                    if (req.body.collaberators != null && req.body.collaberators != undefined) {

                        try {

                            req.body.collaberators = JSON.parse(req.body.collaberators);

                            for (var i = 0; i < req.body.collaberators.length; i++) {
                                if (req.body.collaberators[i].firstName != null && req.body.collaberators[i].firstName != undefined && req.body.collaberators[i].firstName != "" &&
                                    req.body.collaberators[i].lastName != null && req.body.collaberators[i].lastName != undefined && req.body.collaberators[i].lastName != "" &&
                                    req.body.collaberators[i].email != null && req.body.collaberators[i].email != undefined && req.body.collaberators[i].email != "" &&
                                    req.body.collaberators[i].userId != null && req.body.collaberators[i].userId != undefined && req.body.collaberators[i].userId != "") {
                                    collaberator.push({ firstName: req.body.collaberators[i].firstName, lastName: req.body.collaberators[i].lastName, email: req.body.collaberators[i].email, userId: req.body.collaberators[i].userId })
                                }
                                else {
                                    var responseResult = {
                                        "success": false,
                                        "message": "Please provide valide collaberator details"
                                    }
                                    return cb(responseResult);
                                }
                            }
                        }
                        catch (e) {
                            req.body.collaberators = [];
                        }
                    }


                    if (req.body.color != null && req.body.color != undefined && req.body.color != "") {
                        data.color = req.body.color;
                        var colorRegex = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/;
                        if (!colorRegex.test(data.color)) {
                            var responseResult = {
                                "success": false,
                                "message": "Invalid color code"
                            }
                            return cb(responseResult);
                        }
                    }
                    if (uploadedFileName != "") {
                        data.imageUrl = "images/" + uploadedFileName;
                    }
                    // console.log(collaberator)
                    data.collaborators = collaberator;
                    // console.log(data)
                    //console.log("is pined ", req.body);
                    notesService.addNoteService(data, userId, function (err, addResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {

                            if (collaberator != null && collaberator != undefined && collaberator.length > 0) {
                                for (var i = 0; i < collaberator.length; i++) {
                                    var template = "<p>Hi,</p><p>" + req.accessToken.firstName + " added you as a collaraberator in his note, please <a href='http://localhost:4200/'>Click here</a> to see note</p> <p>Thanks</p>";
                                    app.models.Email.send({
                                        to: collaberator[i].email,
                                        from: 'noreply@bridgelabz.com',
                                        subject: 'New Note added to you',
                                        text: 'New Note added to you',
                                        html: template
                                    }, function (err, mail) {
                                        console.log('email sent!');
                                    });
                                }
                            }


                            var noteId = addResult.id;
                            //console.log("req.body.checklist : ", typeof req.body.checklist);
                            if (req.body.checklist != undefined && req.body.checklist != null && req.body.checklist.length > 0) {
                                try {
                                    req.body.checklist = JSON.parse(req.body.checklist);
                                }
                                catch (e) {
                                    req.body.checklist = [];
                                }
                                checkListService.addCheckListService(noteId, req.body.checklist, userId, function (err, addchecklistResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        notesService.findNotes(noteId, function (err, notesData) {
                                            if (err) {
                                                var responseResult = {
                                                    "success": false,
                                                    "message": err
                                                }
                                                return cb(responseResult);
                                            }
                                            else {
                                                var responseResult = {
                                                    "success": true,
                                                    "message": "Note added successfully",
                                                    "details": notesData[0]
                                                }
                                                return cb(null, responseResult);
                                            }
                                        })

                                    }
                                })
                            }
                            else {
                                notesService.findNotes(noteId, function (err, notesData) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": "Note added successfully",
                                            "details": notesData[0]
                                        }
                                        return cb(null, responseResult);
                                    }
                                })
                                // var responseResult = {
                                //     "success": true,
                                //     "message": "Note added successfully",
                                //     "details":addResult
                                // }
                                // return cb(null, responseResult);
                            }

                        }
                    })
                }
            });
        }
        else {
            var responseResult = {
                "success": false,
                "message": "User not specified"
            }
            return cb(responseResult);
        }
    }
    Notes.remoteMethod(
        'addNotes',
        {
            http: { path: '/addNotes', verb: 'post' },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } },
                { arg: 'file', type: 'file', http: { source: 'form' } },
                { arg: 'title', type: 'string', 'http': { source: 'form' } },
                { arg: 'description', type: 'string', 'http': { source: 'form' } },
                { arg: 'labelIdList', type: 'array', 'http': { source: 'form' } },
                { arg: 'checklist', type: 'array', 'http': { source: 'form' } },
                { arg: 'isPined', type: 'boolean', 'http': { source: 'form' } },
                { arg: 'isArchived', type: 'boolean', 'http': { source: 'form' } },
                { arg: 'color', type: 'string', 'http': { source: 'form' } },
                { arg: 'reminder', type: 'string', 'http': { source: 'form' } },
                { arg: 'collaberators', type: 'array', 'http': { source: 'form' }, "description": "[{'firstName':'','lastName':'','email':'','userId':''}]" }

            ],
            returns: { arg: 'status', type: 'object' }
        }
    );
    Notes.updateNotes = function (req, res, noteId, file, title, description, cb) {
        try {
            //console.log( data)
            upload(req, res, function (err, fileurl) {
                if (err) {
                    var responseResult = {
                        "success": false,
                        "message": err
                    }
                    return cb(responseResult);
                }
                else {
                    var noteId = req.body.noteId;
                    if (noteId != null && noteId != undefined && noteId != "") {
                        console.log(typeof (noteId));
                        //console.log( data.labelList);


                        var userId = "";
                        if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                            userId = req.accessToken.userId;
                        }
                        console.log(userId);
                        notesService.validateNotes(noteId, userId, function (err, notesResult) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                if (req.body.title == null || req.body.title == undefined) {
                                    var responseResult = {
                                        "success": false,
                                        "message": "Please provide note title"
                                    }
                                    return cb(responseResult);
                                }
                                if (req.body.description == null || req.body.description == undefined) {
                                    var responseResult = {
                                        "success": false,
                                        "message": "Please provide note description"
                                    }
                                    return cb(responseResult);
                                }
                                var data = {
                                    title: req.body.title,
                                    description: req.body.description
                                }
                                if (uploadedFileName != "") {
                                    data.imageUrl = "client/images/" + uploadedFileName;
                                }
                                console.log(userId);
                                notesService.updateNote(noteId, data, userId, function (err, Result) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": Result
                                        }
                                        return cb(null, responseResult);
                                    }
                                })

                            }
                        })
                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "Please provide note id"
                        }
                        return cb(responseResult);
                    }
                }
            });
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'updateNotes',
        {
            http: { path: '/updateNotes', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'form' } },
            { arg: 'file', type: 'file', http: { source: 'form' } },
            { arg: 'title', type: 'string', 'http': { source: 'form' } },
            { arg: 'description', type: 'string', 'http': { source: 'form' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );
    Notes.addCheckListNotes = function (req, res, noteId, checklistdata, cb) {
        try {
            if (noteId != null && noteId != undefined && noteId != "") {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                notesService.validateNotes(noteId, userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        if (checklistdata.itemName == null || checklistdata.itemName == undefined) {
                            var responseResult = {
                                "success": false,
                                "message": "Please provide checklist name"
                            }
                            return cb(responseResult);
                        }
                        if (checklistdata.status == null || checklistdata.status == undefined) {
                            checklistdata.status = "open";
                        }
                        else {
                            if (checklistdata.status == "open" || checklistdata.status == "close") {

                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "Please provide valid checklist status."
                                }
                                return cb(responseResult);

                            }
                        }
                        var data = {
                            itemName: checklistdata.itemName,
                            status: checklistdata.status
                        }
                        checkListService.addSingleCheckListService(noteId, data, userId, function (err, Result) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                var responseResult = {
                                    "success": true,
                                    "message": "Checklist added succesfully",
                                    "details": Result
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide note id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'addCheckListNotes',
        {
            http: { path: '/:noteId/checklist/add', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'path' } },
            { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true }],
            returns: { arg: 'data', type: 'object' }
        }
    );
    Notes.updateCheckListNotes = function (req, res, noteId, checklistId, checklistdata, cb) {
        try {
            if (noteId != null && noteId != undefined && noteId != "") {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                notesService.validateNotes(noteId, userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        if (checklistdata.itemName == null || checklistdata.itemName == undefined) {
                            var responseResult = {
                                "success": false,
                                "message": "Please provide checklist name"
                            }
                            return cb(responseResult);
                        }
                        if (checklistdata.status == null || checklistdata.status == undefined) {
                            checklistdata.status = "open";
                        }
                        else {
                            if (checklistdata.status == "open" || checklistdata.status == "close") {

                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "Please provide valid checklist status."
                                }
                                return cb(responseResult);

                            }
                        }
                        var currentdate = new Date();
                        var data = {
                            itemName: checklistdata.itemName,
                            status: checklistdata.status,
                            modifiedDate: currentdate
                        }
                        checkListService.updateSingleCheckListByQueryService(checklistId, data, userId, function (err, Result) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                var responseResult = {
                                    "success": true,
                                    "message": Result
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide note id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'updateCheckListNotes',
        {
            http: { path: '/:noteId/checklist/:checklistId/update', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'path' } },
            { arg: 'checklistId', type: 'string', http: { source: 'path' } },
            { arg: 'checklistdata', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.removeCheckListNotes = function (req, res, noteId, checklistId, cb) {
        try {
            if (noteId != null && noteId != undefined && noteId != "") {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                notesService.validateNotes(noteId, userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var currentdate = new Date();
                        var data = {
                            isDeleted: true,
                            modifiedDate: currentdate
                        }
                        checkListService.updateSingleCheckListByQueryService(checklistId, data, userId, function (err, Result) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                var responseResult = {
                                    "success": true,
                                    "message": Result
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide note id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'removeCheckListNotes',
        {
            http: { path: '/:noteId/checklist/:checklistId/remove', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'path' } },
            { arg: 'checklistId', type: 'string', http: { source: 'path' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notes.addLabelToNotes = function (req, res, noteId, lableId, cb) {
        try {
            if (noteId != null && noteId != undefined && noteId != "") {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                notesService.validateNotes(noteId, userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var currentdate = new Date();
                        var data = {
                            isDeleted: true,
                            modifiedDate: currentdate
                        }
                        notesService.mapNoteWithLabelService(noteId, lableId, userId, function (err, Result) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                var responseResult = {
                                    "success": true,
                                    "message": Result
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide note id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'addLabelToNotes',
        {
            http: { path: '/:noteId/addLabelToNotes/:lableId/add', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'path' } },
            { arg: 'lableId', type: 'string', http: { source: 'path' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.removeLabelToNotes = function (req, res, noteId, lableId, cb) {
        try {
            if (noteId != null && noteId != undefined && noteId != "") {
                var userId = "";
                if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                notesService.validateNotes(noteId, userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var currentdate = new Date();
                        var data = {
                            isDeleted: true,
                            modifiedDate: currentdate
                        }
                        notesService.removeNoteWithLabelService(noteId, lableId, userId, function (err, Result) {
                            if (err) {
                                var responseResult = {
                                    "success": false,
                                    "message": err
                                }
                                return cb(responseResult);
                            }
                            else {
                                var responseResult = {
                                    "success": true,
                                    "message": Result
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide note id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e)
            return cb(e);
        }
    }
    Notes.remoteMethod(
        'removeLabelToNotes',
        {
            http: { path: '/:noteId/addLabelToNotes/:lableId/remove', verb: 'post' },
            accepts: [{ arg: 'req', type: 'object', 'http': { source: 'req' } },
            { arg: 'res', type: 'object', 'http': { source: 'res' } },
            { arg: 'noteId', type: 'string', http: { source: 'path' } },
            { arg: 'lableId', type: 'string', http: { source: 'path' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    // Notes.getUserLabelList = function (req, cb) {
    //     try {

    //         var userId = "";
    //         if (req.accessToken!=null && req.accessToken!=undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //             userId = req.accessToken.userId;
    //             console.log(req.accessToken)
    //         }

    //         if (userId != null && userId != undefined && userId != "") {

    //             notesService.getUserLabelListService(userId, function (err, notesResult) {
    //                 if (err) {
    //                     var responseResult = {
    //                         "success": false,
    //                         "message": err
    //                     }
    //                     return cb(responseResult);
    //                 }
    //                 else {
    //                     var responseResult = {
    //                         "success": true,
    //                         "message": "",
    //                         "data": notesResult
    //                     }
    //                     return cb(null, responseResult);
    //                 }
    //             })

    //         }
    //         else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide valid token"
    //             }
    //             return cb(responseResult);
    //         }

    //     } catch (e) {
    //         cb(e);
    //     }
    // }
    // Notes.remoteMethod(
    //     'getUserLabelList',
    //     {
    //         http: { path: '/label', verb: 'get' },
    //         accepts: [
    //             { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    Notes.getTrashNotesList = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                //console.log(req.accessToken)
            }
            if (userId != null && userId != undefined && userId != "") {
                notesService.getTrashNotesListService(userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })

            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getTrashNotesList',
        {
            http: { path: '/getTrashNotesList', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );
    Notes.getArchiveNotesList = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                notesService.getArchiveNotesListService(userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getArchiveNotesList',
        {
            http: { path: '/getArchiveNotesList', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.getNotesListByLabel = function (req, labelName, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {
                if (labelName != null && labelName != undefined && labelName != "") {


                    notesService.getNotesListByLabelService(userId, labelName, function (err, notesResult) {
                        if (err) {
                            var responseResult = {
                                "success": false,
                                "message": err
                            }
                            return cb(responseResult);
                        }
                        else {
                            var responseResult = {
                                "success": true,
                                "message": "",
                                "data": notesResult
                            }
                            return cb(null, responseResult);
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid label name"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getNotesListByLabel',
        {
            http: { path: '/getNotesListByLabel/:labelName', verb: 'post' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } },
                { arg: 'labelName', type: 'string', http: { source: 'path' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notes.getReminderNotesList = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                notesService.getReminderNotesListService(userId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getReminderNotesList',
        {
            http: { path: '/getReminderNotesList', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notes.getReminderNotesListTest = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                notesService.getReminderByDateTimeNotesListService(function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getReminderNotesListTest',
        {
            http: { path: '/getReminderNotesListTest', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Notes.getNotesDetail = function (noteId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {
                notesService.findNotes(noteId, function (err, notesResult) {
                    if (err) {
                        var responseResult = {
                            "success": false,
                            "message": err
                        }
                        return cb(responseResult);
                    }
                    else {
                        var responseResult = {
                            "success": true,
                            "message": "",
                            "data": notesResult
                        }
                        return cb(null, responseResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }
        } catch (e) {
            cb(e);
        }
    }
    Notes.remoteMethod(
        'getNotesDetail',
        {
            http: { path: '/getNotesDetail/:noteId', verb: 'get' },
            accepts: [
                { arg: 'noteId', type: 'string', http: { source: 'path' } },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );
};
