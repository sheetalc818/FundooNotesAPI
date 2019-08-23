'use strict';
var noteLabelService = require('../services/noteLabelService');
var disableAllMethods = require('./helper').disableAllMethods;
module.exports = function (Notelabel) {
    disableAllMethods(Notelabel, ['create']);


    Notelabel.updateNoteLabel = function (id, data, req, cb) {
        try {
            if (id != null && id != undefined && id != "") {
                if (data.label != null && data.label != undefined && data.label != "") {
                    var userId = "";
                    if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    noteLabelService.updateNoteLabelService(id, { "label": data.label }, userId, function (err, updateResult) {
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
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid label value"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node label id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            callback(e);
        }
    }
    Notelabel.remoteMethod(
        'updateNoteLabel',
        {
            http: { path: '/:id/updateNoteLabel', verb: 'post' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );



    Notelabel.deleteNoteLabel = function (id, req, cb) {
        try {
            if (id != null && id != undefined && id != "") {
               
                    var userId = "";
                    if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    noteLabelService.updateNoteLabelService(id, { "isDeleted": true }, userId, function (err, updateResult) {
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
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide node label id"
                }
                return cb(responseResult);
            }

        } catch (e) {
            cb(e);
        }
    }
    Notelabel.remoteMethod(
        'deleteNoteLabel',
        {
            http: { path: '/:id/deleteNoteLabel', verb: 'delete' },
            accepts: [{ arg: 'id', type: 'string', http: { source: 'path' } },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Notelabel.getNoteLabelList = function (req, cb) {
        try {

            var userId = "";
            if (req.accessToken!=null && req.accessToken!=undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                noteLabelService.getNoteLabelListService(userId, function (err, Result) {
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
                            "details": Result
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
    Notelabel.remoteMethod(
        'getNoteLabelList',
        {
            http: { path: '/getNoteLabelList', verb: 'get' },
            accepts: [{ "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );
};
