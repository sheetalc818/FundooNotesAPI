/**
 * @file user.js
 * @description User model, Adding functionality for the user. add / update users
 * 
 * @since 14th Sep 2018
 * @author Nagendra Singh
 * @todo  Add/update user details
 *      - Add/Update profile details
 *      - List of service activated.
 * @license None
 */
'use strict';

/**
 * @var {Object} disableAllMethods 
 * @requires helper 
 */
var disableAllMethods = require('./helper').disableAllMethods;
var userService = require('../services/userService');
var noteLabelService = require('../services/noteLabelService');
var pushTokenService = require('../services/pushTokenService');
var productService = require('../services/productService');
var productCartService = require('../services/productCartService');
var app = require('../../server/server');
var multer = require('multer');
var fs = require('fs');
var Client = require('node-rest-client').Client;
/**
 * 
 * @param {function} User 
 */
module.exports = function (User) {

    // Disabling the User REST API for the user.
    disableAllMethods(User, ["login", "logout", "find", "findById", "resetPassword", "setPassword"]);

    // /**
    //  * 
    //  * @param {Object} data 
    //  * @param {Object} req 
    //  * @param {function} cb 
    //  */
    // User.userSignUp = function (userDetails, req, cb) {
    //     var responseResult = {
    //         "success": false,
    //         "message": "Something bad happened. Please contact system administrator."
    //     }
    //     try {
    //         if (userDetails != null && userDetails != undefined) {
    //             var currentDate = new Date();
    //             var signupDate = {
    //                 "firstName": "",
    //                 "lastName": "",
    //                 "phoneNumber": "",
    //                 "role": "user",
    //                 "service": "",
    //                 "createdDate": currentDate,
    //                 "modifiedDate": currentDate,
    //                 "username": "",
    //                 "email": "",
    //                 "emailVerified": true
    //             }
    //             // if (userDetails.username != null && userDetails.username != undefined && userDetails.username != "") {
    //             //     signupDate.username = userDetails.username;
    //             // } else {
    //             //     responseResult.message = "Please provide username";
    //             //     return cb(responseResult);
    //             // }
    //             if (userDetails.email != null && userDetails.email != undefined && userDetails.email != "") {
    //                 signupDate.email = userDetails.email;
    //                 signupDate.username = userDetails.email;
    //             } else {
    //                 responseResult.message = "Please provide email";
    //                 return cb(responseResult);
    //             }
    //             if (userDetails.password != null && userDetails.password != undefined && userDetails.password != "") {
    //                 signupDate.password = userDetails.password;
    //             } else {
    //                 responseResult.message = "Please provide password";
    //                 return cb(responseResult);
    //             }
    //             if (userDetails.service != null && userDetails.service != undefined && userDetails.service != "") {
    //                 signupDate.service = userDetails.service.toLowerCase();
    //             } else {
    //                 responseResult.message = "Please provide service";
    //                 return cb(responseResult);
    //             }
    //             signupDate.firstName = userDetails.firstName;
    //             signupDate.lastName = userDetails.lastName;
    //             signupDate.phoneNumber = userDetails.phoneNumber;
    //             //signupDate.service = userDetails.service;

    //             User.create(signupDate, function (err, count) {
    //                 if (err) {
    //                     console.log(err);
    //                     return cb(err);
    //                 } else {
    //                     responseResult.success = true;
    //                     responseResult.message = "User registered sucessfully";
    //                     return cb(null, responseResult);
    //                 }
    //             });
    //         } else {
    //             var responseResult = {
    //                 "success": false,
    //                 "message": "Please provide mandatory fields required for registration."
    //             }
    //             return cb(responseResult);
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         cb(responseResult);
    //     }
    // }

    // User.remoteMethod(
    //     'userSignUp',
    //     {
    //         http: { path: '/userSignUp', verb: 'post' },
    //         accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
    //         { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    /**
     * 
     * @param {Object} data 
     * @param {Object} req 
     * @param {function} cb 
     */
    User.userSignUp = function (userDetails, req, cb) {
        var responseResult = {
            "success": false,
            "message": "Something bad happened. Please contact system administrator."
        }
        try {
            if (userDetails != null && userDetails != undefined) {
                var currentDate = new Date();
                var signupDate = {
                    "firstName": "",
                    "lastName": "",
                    "phoneNumber": "",
                    "role": "user",
                    "service": "",
                    "createdDate": currentDate,
                    "modifiedDate": currentDate,
                    "username": "",
                    "email": "",
                    "emailVerified": true
                }
                if (userDetails.email != null && userDetails.email != undefined && userDetails.email != "") {
                    signupDate.email = userDetails.email;
                    signupDate.username = userDetails.email;
                } else {
                    responseResult.message = "Please provide email";
                    return cb(responseResult);
                }
                if (userDetails.password != null && userDetails.password != undefined && userDetails.password != "") {
                    signupDate.password = userDetails.password;
                } else {
                    responseResult.message = "Please provide password";
                    return cb(responseResult);
                }
                if (userDetails.service != null && userDetails.service != undefined && userDetails.service != "") {
                    signupDate.service = userDetails.service.toLowerCase();
                } else {
                    responseResult.message = "Please provide service";
                    return cb(responseResult);
                }
                signupDate.firstName = userDetails.firstName;
                signupDate.lastName = userDetails.lastName;
                signupDate.phoneNumber = userDetails.phoneNumber;

                User.create(signupDate, function (err, signupdata) {
                    if (err) {
                        console.log(err);
                        return cb(err);
                    } else {
                        if (userDetails.cartId != null && userDetails.cartId != undefined && userDetails.cartId != "") {
                            var updateCart = { userId: signupdata.id,status:"user_assign" }
                            productCartService.findAndUpdateProductCartById(userDetails.cartId, updateCart, function (err, updateCartResult) {
                                responseResult.success = true;
                                responseResult.message = "User registered sucessfully";
                                return cb(null, responseResult);
                            })

                        }
                        else {
                            responseResult.success = true;
                            responseResult.message = "User registered sucessfully";
                            return cb(null, responseResult);
                        }
                    }
                });
            } else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide mandatory fields required for registration."
                }
                return cb(responseResult);
            }
        } catch (e) {
            console.log(e);
            cb(responseResult);
        }
    }

    User.remoteMethod(
        'userSignUp',
        {
            http: { path: '/userSignUp', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"firstName": "","lastName": "", "phoneNumber": "","imageUrl": "","service": "","email": "","cartId": ""}', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );



    User.adminSignUp = function (data, req, cb) {
        var responseResult = {
            "success": false,
            "message": "Something bad happened. Please contact system administrator."
        }
        try {
            if (data != null && data != undefined) {
                // var userId = "";
                // if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                //     userId = req.accessToken.userId;
                // }
                var currentDate = new Date();
                var signupDate = {
                    "firstName": "",
                    "lastName": "",
                    "phoneNumber": "",
                    "role": "admin",
                    "service": "",
                    "createdDate": currentDate,
                    "modifiedDate": currentDate,
                    "username": "",
                    "email": "",
                    "emailVerified": true
                }
                signupDate.firstName = data.firstName;
                signupDate.lastName = data.lastName;
                signupDate.phoneNumber = data.phoneNumber;
                // signupDate.service = data.service;
                // if (data.username != null && data.username != undefined && data.username != "") {
                //     signupDate.username = data.username;
                // }
                // else {
                //     var responseResult = {
                //         "success": false,
                //         "message": "please provide username"
                //     }
                //     return cb(responseResult);
                // }
                if (data.email != null && data.email != undefined && data.email != "") {
                    signupDate.username = data.email;
                    signupDate.email = data.email;
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "please provide email"
                    }
                    return cb(responseResult);
                }
                if (data.password != null && data.password != undefined && data.password != "") {
                    signupDate.password = data.password;
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "please provide password"
                    }
                    return cb(responseResult);
                }
                // if (data.service != null && data.service != undefined && data.service != "") {
                //     signupDate.service = data.service.toLowerCase();
                // } else {
                //     responseResult.message = "Please provide service";
                //     return cb(responseResult);
                // }
                signupDate.service = "advance";
                User.create(signupDate, function (err, count) {
                    if (err) {
                        return cb(err);
                    } else {
                        responseResult.success = true;
                        responseResult.message = "Admin registered sucessfully";
                        return cb(null, responseResult);
                    }
                });
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid signup details"
                }
                return cb(responseResult);
            }


        } catch (e) {
            cb(responseResult);
        }
    }
    User.remoteMethod(
        'adminSignUp',
        {
            http: { path: '/adminSignUp', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    User.afterRemote('login', function (ctx, modelInstance, next) {
        // if (ctx.result) {
        //   if (Array.isArray(modelInstance)) {
        //     var answer = [];
        //     ctx.result.forEach(function (result) {
        //       var replacement ={};
        //       WHITE_LIST_FIELDS.forEach(function(field) {
        //         replacement[field] = result[field];
        //       });
        //       answer.push(replacement);
        //     });
        //   } else {
        //     var answer ={};
        //     WHITE_LIST_FIELDS.forEach(function(field) {
        //       answer[field] = ctx.result[field];
        //     });
        //   }
        //   ctx.result = answer;
        // }
        console.log("cred data ", ctx.args.credentials.cartId);
        userService.checkAndGetUserService(ctx.result.userId, function (err, resultdata) {
            if (err) {
                ctx.result.role = "user";
            }
            else {
                if (resultdata.length > 0) {
                    ctx.result.role = resultdata[0].role;
                    ctx.result.firstName = resultdata[0].firstName;
                    ctx.result.lastName = resultdata[0].lastName;
                    ctx.result.email = resultdata[0].email;
                    if (resultdata[0].imageUrl != null && resultdata[0].imageUrl != undefined) {
                        ctx.result.imageUrl = resultdata[0].imageUrl;
                    }
                    else {
                        ctx.result.imageUrl = "";
                    }
                }
                else {
                    ctx.result.role = "user";
                    ctx.result.firstName = "";
                    ctx.result.lastName = "";
                    ctx.result.email = "";
                    ctx.result.imageUrl = "";
                }
            }

            var cartId = ctx.args.credentials.cartId;
            if (cartId != null && cartId != undefined && cartId != "") {
                var updateCart = { userId: ctx.result.userId , status:"user_assign" }
                var dicardCart = { status:"discard",isCanceled:true }
                productCartService.discardPreviousProductCartByUserId(cartId,ctx.result.userId,dicardCart,function(err, discardCartResult) {
                    
                })
                productCartService.findAndUpdateProductCartById(cartId, updateCart, function (err, updateCartResult) {
                    
                })
            }
            next();
        })


        //console.log(ctx);
        //console.log(modelInstance);
        //next();
        //next(new Error('must be logged in to update'))
    });


    User.getAdminUserList = function (req, cb) {
        try {

            userService.getUserList(function (err, resultdata) {
                if (err) {
                    var responseResult = {
                        "success": false,
                        "message": "some error occured"
                    }
                    return cb(responseResult);
                }
                else {
                    var responseResult = {
                        "success": true,
                        "message": "",
                        "data": resultdata
                    }
                    return cb(null, responseResult);
                }

            })

        } catch (e) {
            cb(e);
        }
    }
    User.remoteMethod(
        'getAdminUserList',
        {
            http: { path: '/getAdminUserList', verb: 'get' },
            accepts: [{ "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    User.on('resetPasswordRequest', function (info) {
        console.log(info); // the email of the requested user
        // console.log(info.accessToken.id); // the temp access token to allow password reset

        // requires AccessToken.belongsTo(User)
        // var user = app.models.user;
        var email = info.email;
        if (email != null && email != undefined && email != "") {
            var template = "<p>Hi,</p><p>Here is the link to reset password <a href='http://localhost:4200/resetpassword/" + info.accessToken.id + "'>Click here</a></p> <p>Thanks</p>";
            app.models.Email.send({
                to: email,
                from: 'noreply@bridgelabz.com',
                subject: 'Reset password request',
                text: 'Reset password request',
                html: template
            }, function (err, mail) {
                console.log('email sent!');
                // cb(err);
            });

            info.accessToken.user(function (err, user) {
                //console.log(user); // the actual user
            });
        }
    });


    User.afterRemote('resetPassword', function (ctx, modelInstance, next) {
        // console.log(ctx);
        ctx.result = {};
        var responseResult = {
            "success": true,
            "message": "Set password link sent to you registered email, please check."
        }
        ctx.result = responseResult;
        //console.log(modelInstance);
        next();
        //next(new Error('must be logged in to update'))
    });

    User.getUserServiceList = function (req, cb) {
        try {

            productService.ProductList(function (err, productResult) {
                if (err) {
                    var responseResult = {
                        "success": false,
                        "message": "Product not found"
                    }
                    return cb(responseResult);
                }
                else {
                    //var resultdata = [{ "name": "basic", "description": "Ability to add only title and description" }, { "name": "advance", "description": "Ability to add title, description, images, labels, checklist and colors" }]

                    var responseResult = {
                        "success": true,
                        "message": "",
                        "data": productResult
                    }
                    return cb(null, responseResult);
                }
            })


        } catch (e) {
            cb(e);
        }
    }
    User.remoteMethod(
        'getUserServiceList',
        {
            http: { path: '/service', verb: 'get' },
            accepts: [{ "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    User.adminLogin = function (credentials, include, callback) {

        // Invoke the default login function
        return User.login(credentials, include, function (loginErr, loginToken) {
            if (loginErr)
                return callback(loginErr);
			/* If we got to this point, the login call was successfull and we
			 * have now access to the token generated by the login function.
			 *
			 * This means that now we can add extra logic and manipulate the
			 * token before returning it. Unfortunately, the login function
			 * does not return the user data, so if we need it we need to hit
			 * the datasource again to retrieve it.
			 */

            // If needed, here we can use loginToken.userId to retrieve
            // the user from the datasource
            return User.findById(loginToken.userId, function (findErr, userData) {
                if (findErr) {
                    return callback(findErr);
                }
                else {

                    // Here you can do something with the user info, or the token, or both

                    // Return the access token
                    // console.log(userData);

                    if (userData.role.toLowerCase() == "admin") {
                        loginToken.role = userData.role.toLowerCase();
                        return callback(null, loginToken.toObject());
                    }
                    else {
                        return callback("Invalid admin login credentials");
                    }

                }

            });
        });
    };

	/** Register a path for the new login function
	 */
    User.remoteMethod('adminLogin', {
        'http': {
            'path': '/adminLogin',
            'verb': 'post'
        },
        'accepts': [
            {
                'arg': 'credentials',
                'type': 'object',
                'description': 'Login credentials',
                'required': true,
                'http': {
                    'source': 'body'
                }
            },
            {
                'arg': 'include',
                'type': 'string',
                'description': 'Related objects to include in the response. See the description of return value for more details.',
                'http': {
                    'source': 'query'
                }
            }
        ],
        'returns': [
            {
                'arg': 'token',
                'type': 'object',
                'root': true
            }
        ]
    });


    User.getUserStatics = function (req, cb) {
        try {

            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                console.log(req.accessToken)
            }

            if (userId != null && userId != undefined && userId != "") {

                userService.getUserStaticsService(function (err, Result) {
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
    User.remoteMethod(
        'getUserStatics',
        {
            http: { path: '/UserStatics', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    User.searchUserList = function (req, data, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
                // console.log(req.accessToken)
            }
            if (userId != null && userId != undefined && userId != "") {
                if (data.searchWord != null && data.searchWord != undefined && data.searchWord != "") {
                    var obj = { searchWord: data.searchWord }
                    userService.searchUserListService(obj, function (err, Result) {
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
                        "message": "Please provide search word"
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
    User.remoteMethod(
        'searchUserList',
        {
            http: { path: '/searchUserList', verb: 'post' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } },
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": 'JSON object in body', "required": true }],
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

    User.uploadProfileImage = function (req, res, file, cb) {
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
                    console.log("file ,:", req.files)
                    var images = "";
                    if (req.files != null && req.files != undefined && req.files.length > 0) {
                        images = "images/" + req.files[0].filename;
                        //console.log(images);
                        userService.updateUser(userId, { imageUrl: images }, function (err, Result) {
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
                                    "message": Result,
                                    "imageUrl": images
                                }
                                return cb(null, responseResult);
                            }
                        })
                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "Image not found"
                        }
                        return cb(responseResult);
                    }
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
    User.remoteMethod(
        'uploadProfileImage',
        {
            http: { path: '/uploadProfileImage', verb: 'post' },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } },
                { arg: 'file', type: 'file', http: { source: 'form' } }
            ],
            returns: { arg: 'status', type: 'object' }
        }
    );
    // User.getNoteLabelList = function (req, cb) {
    //     try {

    //         var userId = "";
    //         if (req.accessToken!=null && req.accessToken!=undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
    //             userId = req.accessToken.userId;
    //             console.log(req.accessToken)
    //         }

    //         if (userId != null && userId != undefined && userId != "") {

    //             noteLabelService.getNoteLabelListService(userId, function (err, Result) {
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
    //                         "details": Result
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
    // User.remoteMethod(
    //     'getNoteLabelList',
    //     {
    //         http: { path: '/getNoteLabelList', verb: 'get' },
    //         accepts: [{ "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
    //         returns: { arg: 'data', type: 'object' }
    //     }
    // );


    User.registerPushToken = function (data, req, cb) {
        var responseResult = {
            "success": false,
            "message": "Something bad happened. Please contact system administrator."
        }
        try {
            var userId = "";
            if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
            }
            if (userId != "") {
                if (data != null && data != undefined) {
                    var currentDate = new Date();
                    var pushData = { "pushToken": "", "userId": userId, "createdDate": currentDate, "modifiedDate": currentDate }
                    if (data.pushToken != null && data.pushToken != undefined && data.pushToken != "") {
                        pushData.pushToken = data.pushToken;
                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "please provide push token"
                        }
                        return cb(responseResult);
                    }
                    pushTokenService.addPushTokenService(pushData, userId, function (err, count) {
                        if (err) {
                            return cb(err);
                        } else {
                            responseResult.success = true;
                            responseResult.message = "Push Token registered sucessfully";
                            return cb(null, responseResult);
                        }
                    });
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid push token details"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid auth token"
                }
                return cb(responseResult);
            }


        } catch (e) {
            console.log(e)
            cb(responseResult);
        }
    }
    User.remoteMethod(
        'registerPushToken',
        {
            http: { path: '/registerPushToken', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"pushToken":""}', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    User.unRegisterPushToken = function (data, req, cb) {
        var responseResult = {
            "success": false,
            "message": "Something bad happened. Please contact system administrator."
        }
        try {
            var userId = "";
            if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
            }
            if (userId != "") {
                if (data != null && data != undefined) {
                    var currentDate = new Date();
                    var pushData = { "isDeleted": false, "modifiedDate": currentDate }
                    if (data.pushToken != null && data.pushToken != undefined && data.pushToken != "") {
                        pushData.isDeleted = true;
                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "please provide push token"
                        }
                        return cb(responseResult);
                    }
                    pushTokenService.updatePushTokenUsingTokenService(data.pushToken, pushData, function (err, resultdata) {
                        if (err) {
                            return cb(err);
                        } else {
                            responseResult.success = true;
                            responseResult.message = "Push Token unregistered sucessfully";
                            return cb(null, responseResult);
                        }
                    });
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid push token details"
                    }
                    return cb(responseResult);
                }
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid auth token"
                }
                return cb(responseResult);
            }


        } catch (e) {
            console.log(e)
            cb(responseResult);
        }
    }
    User.remoteMethod(
        'unRegisterPushToken',
        {
            http: { path: '/unRegisterPushToken', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"pushToken":""}', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    User.testNotification = function (data, req, cb) {
        var responseResult = {
            "success": false,
            "message": "Something bad happened. Please contact system administrator."
        }
        try {
            var userId = "";
            if (req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
            }
            if (userId != "") {
                // console.log(process.env.FIREBASE_SERVER_KEY)
                if (data.pushToken != null && data.pushToken != undefined && data.pushToken != "") {
                    var client = new Client();

                    var fullapiurl = "https://android.googleapis.com/gcm/send";
                    var body = {
                        "notification": { "title": "Note reminder notification", "body": "This is the reminder of your notes", "click_action": "http://localhost:4200" },
                        "to": data.pushToken
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
                            console.log("data : ", data);
                            //console.log("response : ",response);
                            responseResult.status = true;
                            responseResult.message = "all good";
                            //responseResult.data = "";
                            return cb(null, responseResult);
                        });
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid push token details"
                    }
                    return cb(responseResult);

                }


            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid auth token"
                }
                return cb(responseResult);
            }


        } catch (e) {
            console.log(e)
            cb(responseResult);
        }
    }
    User.remoteMethod(
        'testNotification',
        {
            http: { path: '/testNotification', verb: 'post' },
            accepts: [{ arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"pushToken":""}', "required": true },
            { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

};
