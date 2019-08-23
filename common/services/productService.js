'use strict';
var app = require('../../server/server');
function productService() {

}
productService.prototype.findProductById = (productId, cb) => {
    var product = app.models.product;
    try {
        product.find({ where: { "id": productId }, limit: 1000 }, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                if(result.length>0)
                {
                    return cb(null, result)
                }
                else{
                    return cb("Product not found");
                }                
            }
        });
    }
    catch (e) {
        return cb(e);
    }
};

productService.prototype.ProductList = ( cb) => {
    var product = app.models.product;
    try {
        product.find({ limit: 1000 }, function (err, result) {
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
var self = module.exports = new productService();