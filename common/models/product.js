'use strict';
var disableAllMethods = require('./helper').disableAllMethods;
module.exports = function(Product) {
    disableAllMethods(Product, []);
};
