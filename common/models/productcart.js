'use strict';
var disableAllMethods = require('./helper').disableAllMethods;
var productService = require('../services/productService');
var productCartService = require('../services/productCartService');
var userService = require('../services/userService');
module.exports = function (Productcart) {
    disableAllMethods(Productcart, []);

    Productcart.addToCart = function (data, req, cb) {
        try {
            if (data.productId != null && data.productId != undefined && data.productId != "") {
                productService.findProductById(data.productId, function (err, productResult) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        if (productResult.length > 0) {
                            var cartData = {
                                productId: data.productId,
                                status: "initialized",
                                price: productResult[0].price
                            }
                            productCartService.addProductCart(cartData, function (err, cartResult) {
                                if (err) {
                                    return cb(err);
                                }
                                else {
                                    var responseResult = {
                                        "success": true,
                                        "message": "Product added to cart successfully",
                                        "details": cartResult
                                    }
                                    return cb(null, responseResult);
                                }
                            })
                        }
                        else {
                            return cb("product not found");
                        }
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid product id"
                }
                return cb(responseResult);
            }



        } catch (e) {
            return cb(e);
        }

    }
    Productcart.remoteMethod(
        'addToCart',
        {
            http: { path: '/addToCart', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"productId":""}', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Productcart.getCartDetails = function (cartId, req, cb) {
        try {
            if (cartId != null && cartId != undefined && cartId != "") {
                productCartService.findProductCartById(cartId, function (err, productCartResult) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        return cb(null, productCartResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid product cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }

    }
    Productcart.remoteMethod(
        'getCartDetails',
        {
            http: { path: '/getCartDetails/:cartId', verb: 'get' },
            accepts: [
                { arg: 'cartId', type: 'string', http: { source: 'path' } },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );



    Productcart.getUserCartData = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
            }
            if (userId != null && userId != undefined && userId != "") {
                productCartService.findProductCartByUserId(userId, function (err, productCartResult) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        return cb(null, productCartResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid product cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }

    }
    Productcart.remoteMethod(
        'getUserCartData',
        {
            http: { path: '/myCart', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Productcart.placeOrderAgainstCart = function (data, req, cb) {
        try {
            var userId = "";
            if (data.cartId != null && data.cartId != undefined && data.cartId != "") {
                if (data.address != null && data.address != undefined && data.address != "") {
                    if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                        userId = req.accessToken.userId;
                    }
                    if (userId != null && userId != undefined && userId != "") {
                        var updateAddressData = { "addresses": [{ "address": data.address }] };
                        userService.updateUser(userId, updateAddressData, function (err, updateUserResult) {
                            if (err) {
                                return cb(err);
                            }
                            else {
                                var cartData = {
                                    isOrderPlaced: true,
                                    status: "pending"
                                }
                                productCartService.findAndUpdateProductCartById(data.cartId, cartData, function (err, cartUpdateResult) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    else {
                                        var responseResult = {
                                            "success": true,
                                            "message": "Order placed successfully"
                                        }
                                        return cb(null, responseResult);
                                    }
                                })
                            }
                        });
                    }
                    else {
                        var responseResult = {
                            "success": false,
                            "message": "Please provide valid token"
                        }
                        return cb(responseResult);
                    }
                }
                else {
                    var responseResult = {
                        "success": false,
                        "message": "Please provide valid address"
                    }
                    return cb(responseResult);
                }

            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }

    }
    Productcart.remoteMethod(
        'placeOrderAgainstCart',
        {
            http: { path: '/placeOrder', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"cartId":"","address":""}', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );


    Productcart.adminCompleteOrderAgainstCart = function (data, req, cb) {
        try {
            var userId = "";
            if (data.cartId != null && data.cartId != undefined && data.cartId != "") {
                if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                if (userId != null && userId != undefined && userId != "") {
                    var cartData = {
                        isPaymentDone: true,
                        status: "completed"
                    }
                    productCartService.findAndUpdateProductCartById(data.cartId, cartData, function (err, cartUpdateResult) {
                        if (err) {
                            return cb(err);
                        }
                        else {
                            var responseResult = {
                                "success": true,
                                "message": "Order completed successfully"
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
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }
    }
    Productcart.remoteMethod(
        'adminCompleteOrderAgainstCart',
        {
            http: { path: '/adminCompleteOrder', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"cartId":""}', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

    Productcart.adminCancelOrderAgainstCart = function (data, req, cb) {
        try {
            var userId = "";
            if (data.cartId != null && data.cartId != undefined && data.cartId != "") {
                if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                    userId = req.accessToken.userId;
                }
                if (userId != null && userId != undefined && userId != "") {
                    var cartData = {
                        isCanceled: true,
                        status: "admin_canceled"
                    }
                    productCartService.findAndUpdateProductCartById(data.cartId, cartData, function (err, cartUpdateResult) {
                        if (err) {
                            return cb(err);
                        }
                        else {
                            var responseResult = {
                                "success": true,
                                "message": "Order completed successfully"
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
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }
    }
    Productcart.remoteMethod(
        'adminCancelOrderAgainstCart',
        {
            http: { path: '/adminCancelOrder', verb: 'post' },
            accepts: [
                { arg: 'data', type: 'object', http: { source: 'body' }, "description": '{"cartId":""}', "required": true },
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );



    Productcart.adminGetUserCartDataList = function (req, cb) {
        try {
            var userId = "";
            if (req.accessToken != null && req.accessToken != undefined && req.accessToken.userId != null && req.accessToken.userId != undefined) {
                userId = req.accessToken.userId;
            }
            if (userId != null && userId != undefined && userId != "") {
                productCartService.findProductCartList( function (err, productCartResult) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        return cb(null, productCartResult);
                    }
                })
            }
            else {
                var responseResult = {
                    "success": false,
                    "message": "Please provide valid product cart id"
                }
                return cb(responseResult);
            }
        } catch (e) {
            return cb(e);
        }

    }
    Productcart.remoteMethod(
        'adminGetUserCartDataList',
        {
            http: { path: '/userCartList', verb: 'get' },
            accepts: [
                { "arg": 'req', "type": 'object', "http": { "source": 'req' } }],
            returns: { arg: 'data', type: 'object' }
        }
    );

};