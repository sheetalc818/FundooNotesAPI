'use strict';
var disableAllMethods = require('./helper').disableAllMethods;
var questionAndAnswerNotesService = require('../services/questionAndAnswerNotesService');
var userService = require('../services/userService');
var notesService = require('../services/notesService');

module.exports = function (Questionandanswernotes) {
    disableAllMethods(Questionandanswernotes, []);


    function createGuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }

    Questionandanswernotes.addQuestionAndAnswer = function (data, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (data.notesId != null && data.notesId != undefined && data.notesId != "") {
                    if (data.message != null && data.message != undefined && data.message != "") {

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
                                        notesService.validateNotes(data.notesId, userId, function (err, notesResult) {
                                            if (err) {
                                                var responseResult = {
                                                    "success": false,
                                                    "message": err
                                                }
                                                return cb(responseResult);
                                            }
                                            else {
                                                var currentDate = new Date();
                                                var newThreadId = createGuid();
                                                var addData = {
                                                    "message": data.message,
                                                    "like": [],
                                                    "rate": [],
                                                    "createdDate": currentDate,
                                                    "modifiedDate": currentDate,
                                                    "threadId": newThreadId,
                                                    "notesId": data.notesId,
                                                    "userId": userId,
                                                    "isApproved": true,
                                                    "isCanceled": false
                                                }
                                                questionAndAnswerNotesService.addQuestionAndAnswerService(addData, function (err, addResult) {
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
                                                            "message": "added sucessfully",
                                                            "details": addResult
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
                            "message": "Please provide message"
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
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid token"
                }
                return cb(responseResult);
            }



        } catch (e) {
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'addQuestionAndAnswer',
        {
            http: { path: '/addQuestionAndAnswer', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"message":"","notesId":""}', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Questionandanswernotes.addQuestionAndAnswerForParentMsg = function (data, parentId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (parentId != null && parentId != undefined && parentId != "") {
                    if (data.message != null && data.message != undefined && data.message != "") {

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
                                        //retrive parent data first
                                        questionAndAnswerNotesService.findQuestionAndAnswerNotes(parentId, function (err, questionAnswerResult) {
                                            if (err) {
                                                var responseResult = {
                                                    "success": false,
                                                    "message": err
                                                }
                                                return cb(responseResult);
                                            }
                                            else {
                                                if (questionAnswerResult.length > 0) {
                                                    var threadId = questionAnswerResult[0].threadId;
                                                    var notesId = questionAnswerResult[0].notesId;
                                                    notesService.validateNotes(notesId, userId, function (err, notesResult) {
                                                        if (err) {
                                                            var responseResult = {
                                                                "success": false,
                                                                "message": err
                                                            }
                                                            return cb(responseResult);
                                                        }
                                                        else {
                                                            var currentDate = new Date();
                                                            // var newThreadId =  createGuid();
                                                            var addData = {
                                                                "message": data.message,
                                                                "like": [],
                                                                "rate": [],
                                                                "createdDate": currentDate,
                                                                "modifiedDate": currentDate,
                                                                "threadId": threadId,
                                                                "notesId": notesId,
                                                                "userId": userId,
                                                                "parentId": parentId,
                                                                "isApproved": false,
                                                                "isCanceled": false
                                                            }
                                                            questionAndAnswerNotesService.addQuestionAndAnswerService(addData, function (err, addResult) {
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
                                                                        "message": "added sucessfully",
                                                                        "details": addResult
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
                                                        "message": "questionAndAnswerNotes not found"
                                                    }
                                                    return cb(responseResult);
                                                }
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
                                        "message": "User not found"
                                    }
                                    return cb(responseResult);
                                }
                            }
                        })

                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "Please provide message"
                        }
                        return cb(responseResult);
                    }
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide parent id"
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'addQuestionAndAnswerForParentMsg',
        {
            http: { path: '/reply/:parentId', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"message":""}', "required": true },
                { arg: 'parentId', type: 'string', http: { source: 'path' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Questionandanswernotes.likeQuestionAndAnswerMsg = function (data, parentId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (parentId != null && parentId != undefined && parentId != "") {
                    if (data.like != null && data.like != undefined && (data.like == true || data.like == false)) {

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
                                        //retrive parent data first
                                        questionAndAnswerNotesService.findQuestionAndAnswerNotes(parentId, function (err, questionAnswerResult) {
                                            if (err) {
                                                var responseResult = {
                                                    "success": false,
                                                    "message": err
                                                }
                                                return cb(responseResult);
                                            }
                                            else {
                                                if (questionAnswerResult.length > 0) {
                                                    // threadId = questionAnswerResult[0].threadId;
                                                    var notesId = questionAnswerResult[0].notesId;
                                                    var allLike = questionAnswerResult[0].like;
                                                    notesService.validateNotes(notesId, userId, function (err, notesResult) {
                                                        if (err) {
                                                            var responseResult = {
                                                                "success": false,
                                                                "message": err
                                                            }
                                                            return cb(responseResult);
                                                        }
                                                        else {
                                                            var currentDate = new Date();
                                                            var flag = false;
                                                            if (allLike.length > 0) {
                                                                for (var i = 0; i < allLike.length; i++) {
                                                                    if (String(allLike[i].userId) == userId) {
                                                                        flag = true;
                                                                        allLike[i].like = data.like

                                                                    }
                                                                }
                                                            }
                                                            if (flag == false) {
                                                                allLike.push({ "userId": userId, "like": data.like });
                                                            }
                                                            var updateData = {
                                                                "like": allLike,
                                                                "modifiedDate": currentDate
                                                            }
                                                            questionAndAnswerNotesService.updateQuestionAndAnswerService(parentId, updateData, function (err, addResult) {
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
                                                                        "message": "updated sucessfully",
                                                                        "details": addResult
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
                                                        "message": "questionAndAnswerNotes not found"
                                                    }
                                                    return cb(responseResult);
                                                }
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
                            "message": "Please provide like value"
                        }
                        return cb(responseResult);
                    }
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide parent id"
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'likeQuestionAndAnswerMsg',
        {
            http: { path: '/like/:parentId', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"like":true}', "required": true },
                { arg: 'parentId', type: 'string', http: { source: 'path' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Questionandanswernotes.rateQuestionAndAnswerMsg = function (data, parentId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (parentId != null && parentId != undefined && parentId != "") {
                    if (data.rate != null && data.rate != undefined && data.rate != "") {

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
                                        //retrive parent data first
                                        questionAndAnswerNotesService.findQuestionAndAnswerNotes(parentId, function (err, questionAnswerResult) {
                                            if (err) {
                                                var responseResult = {
                                                    "success": false,
                                                    "message": err
                                                }
                                                return cb(responseResult);
                                            }
                                            else {
                                                if (questionAnswerResult.length > 0) {
                                                    // threadId = questionAnswerResult[0].threadId;
                                                    var notesId = questionAnswerResult[0].notesId;
                                                    var allRate = questionAnswerResult[0].rate;
                                                    notesService.validateNotes(notesId, userId, function (err, notesResult) {
                                                        if (err) {
                                                            var responseResult = {
                                                                "success": false,
                                                                "message": err
                                                            }
                                                            return cb(responseResult);
                                                        }
                                                        else {
                                                            var currentDate = new Date();
                                                            var flag = false;
                                                            if (allRate.length > 0) {
                                                                for (var i = 0; i < allRate.length; i++) {
                                                                    if (String(allRate[i].userId) == userId) {
                                                                        flag = true;
                                                                        allRate[i].rate = parseInt(data.rate);

                                                                    }
                                                                }
                                                            }
                                                            if (flag == false) {
                                                                allRate.push({ "userId": userId, "rate": parseInt(data.rate) });
                                                            }
                                                            var updateData = {
                                                                "rate": allRate,
                                                                "modifiedDate": currentDate
                                                            }
                                                            questionAndAnswerNotesService.updateQuestionAndAnswerService(parentId, updateData, function (err, addResult) {
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
                                                                        "message": "added sucessfully",
                                                                        "details": addResult
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
                                                        "message": "questionAndAnswerNotes not found"
                                                    }
                                                    return cb(responseResult);
                                                }
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
                            "message": "Please provide rate value"
                        }
                        return cb(responseResult);
                    }
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide parent id"
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'rateQuestionAndAnswerMsg',
        {
            http: { path: '/rate/:parentId', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"rate":"4"}', "required": true },
                { arg: 'parentId', type: 'string', http: { source: 'path' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Questionandanswernotes.adminApproveQuestionAndAnswer = function (parentId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (parentId != null && parentId != undefined && parentId != "") {

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
                                questionAndAnswerNotesService.findQuestionAndAnswerNotes(parentId, function (err, questionAnswerResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        if (questionAnswerResult.length > 0) {
                                            var currentDate = new Date();

                                            var updateData = {
                                                "isApproved": true,
                                                "isCanceled": false,
                                                "modifiedDate": currentDate
                                            }
                                            questionAndAnswerNotesService.updateQuestionAndAnswerService(parentId, updateData, function (err, addResult) {
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
                                                        "message": "approved sucessfully",
                                                        "details": addResult
                                                    }
                                                    return cb(null, responseResult);
                                                }
                                            })
                                        }
                                        else {
                                            var responseResult = {
                                                "success": false,
                                                "message": "questionAndAnswerNotes not found"
                                            }
                                            return cb(responseResult);
                                        }
                                    }
                                })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "User not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide parent id"
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'adminApproveQuestionAndAnswer',
        {
            http: { path: '/approve/:parentId', verb: 'post' },
            accepts: [
                { arg: 'parentId', type: 'string', http: { source: 'path' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Questionandanswernotes.adminRejectQuestionAndAnswer = function (parentId, req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                if (parentId != null && parentId != undefined && parentId != "") {

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
                                questionAndAnswerNotesService.findQuestionAndAnswerNotes(parentId, function (err, questionAnswerResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        if (questionAnswerResult.length > 0) {
                                            var currentDate = new Date();

                                            var updateData = {
                                                "isApproved": false,
                                                "isCanceled": true,
                                                "modifiedDate": currentDate
                                            }
                                            questionAndAnswerNotesService.updateQuestionAndAnswerService(parentId, updateData, function (err, addResult) {
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
                                                        "message": "approved sucessfully",
                                                        "details": addResult
                                                    }
                                                    return cb(null, responseResult);
                                                }
                                            })
                                        }
                                        else {
                                            var responseResult = {
                                                "success": false,
                                                "message": "questionAndAnswerNotes not found"
                                            }
                                            return cb(responseResult);
                                        }
                                    }
                                })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "User not found"
                                }
                                return cb(responseResult);
                            }
                        }
                    })
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide parent id"
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'adminRejectQuestionAndAnswer',
        {
            http: { path: '/reject/:parentId', verb: 'post' },
            accepts: [
                { arg: 'parentId', type: 'string', http: { source: 'path' }, "description": 'JSON object in body ', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Questionandanswernotes.adminGetUnApprovedQuestionAndAnswer = function ( req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
               

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
                                questionAndAnswerNotesService.findUnApprovedQuestionAndAnswer( function (err, questionAnswerResult) {
                                    if (err) {
                                        var responseResult = {
                                            "success": false,
                                            "message": err
                                        }
                                        return cb(responseResult);
                                    }
                                    else {
                                        return cb(null, questionAnswerResult);
                                    }
                                })
                            }
                            else {
                                var responseResult = {
                                    "success": false,
                                    "message": "User not found"
                                }
                                return cb(responseResult);
                            }
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
            return cb(e);
        }

    }
    Questionandanswernotes.remoteMethod(
        'adminGetUnApprovedQuestionAndAnswer',
        {
            http: { path: '/getUnApprovedAnswer', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );
};
