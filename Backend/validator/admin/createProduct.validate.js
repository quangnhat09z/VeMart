const systemConfig = require('../../config/system.js');
const Product = require('../../models/product.model.js');
const fs = require("fs");


function dealImage(imagePath) {
    if (imagePath) {
        fs.unlink(imagePath.path, (err) => {
            if (err) console.log(err);
        });
    }
}

function checkExistASIN(asin) {
    const existingProduct = Product.findOne({ asin: asin });
    return existingProduct;
}

function showArlert() {
    req.flasg('error', module)
}

module.exports.validateCreateProduct = (req, res, next) => {
    const productData = req.body;
    // console.log(productData);
    if (checkExistASIN(productData.asin)) {
        dealImage(req.file);
        req.flash('error', 'ASIN already exists.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    }

    if (!productData.title || !productData.title.trim()) {
        dealImage(req.file);
        req.flash('error', 'Product title is required.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    } 

    if (!productData.price || isNaN(productData.price)) {
        dealImage(req.file);
        req.flash('error', 'Product price must be a number.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    }

    next();
}
