'use strict';
var app = require('../../server/server');
var userService = require('../services/userService');
function productCartService() {

}
productCartService.prototype.addProductCart = (data, cb) => {
    var productcart = app.models.productcart;
    try {
        var currentDate = new Date();
        data.createdDate = currentDate;
        data.modifiedDate = currentDate;
        productcart.create(data, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                self.findProductCartById(result.id, function (err, searchResult) {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        return cb(null, searchResult)
                    }
                })
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};
productCartService.prototype.findProductCartById = (id, cb) => {
    var productcart = app.models.productcart;
    try {
        productcart.find({ where: { "id": id }, include: ['product'], limit: 1000 }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                if (result.length > 0) {
                    return cb(null, result[0])
                }
                else {
                    return cb("Product cart not found");
                }
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};


productCartService.prototype.findProductCartByUserId = (userId, cb) => {
    var productcart = app.models.productcart;
    try {
        productcart.find({ where: { "userId": userId, isDeleted: false, isCanceled: false,isPaymentDone:false }, include: ['product'], limit: 1000 }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, result)
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};

productCartService.prototype.findProductCartList = ( cb) => {
    var productcart = app.models.productcart;
    try {
        productcart.find({ where: { isOrderPlaced: true, isPaymentDone:false, isDeleted: false, isCanceled: false }, include: ['product','user'], limit: 1000 }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, result)
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};


productCartService.prototype.findAndUpdateProductCartById = (id, data, cb) => {
    var productcart = app.models.productcart;
    try {
        productcart.find({ where: { "id": id }, include: ['product'], limit: 1000 }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                if (result.length > 0) {
                    var productName = JSON.parse(JSON.stringify(result[0])).product.name;
                    //console.log(JSON.parse(JSON.stringify(result[0])).product.name)
                    var currentDate = new Date();
                    data.modifiedDate = currentDate;
                    productcart.updateAll({ id: id }, data, function (err, updateresult) {
                        if (err) {
                            return cb(err);
                        } else {
                            if (data.userId != null && data.userId != undefined && data.userId != "") {
                                // userService.updateUser(data.userId,{"service":productName},function(err,userUpdateResult){
                                //     return cb(null, "Product cart updated successfully")
                                // })
                                return cb(null, "Product cart updated successfully")
                            }
                            else {
                                return cb(null, "Product cart updated successfully")
                            }
                        }
                    });
                }
                else {
                    return cb("Product cart not found");
                }
            }
        });

    }
    catch (e) {
        return cb(e);
    }
};


productCartService.prototype.discardPreviousProductCartByUserId = (id, userId, data, cb) => {
    var productcart = app.models.productcart;
    try {
        var currentDate = new Date();
        data.modifiedDate = currentDate;
        data.isCanceled = true;
        productcart.updateAll({ "userId": userId, isOrderPlaced: false, isDeleted: false, isCanceled: false, id: { neq: id } }, data, function (err, updateresult) {
            if (err) {
                return cb(err);
            } else {
                if (data.userId != null && data.userId != undefined && data.userId != "") {
                    return cb(null, "Product cart updated successfully")
                }
                else {
                    return cb(null, "Product cart updated successfully")
                }
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};
var self = module.exports = new productCartService();