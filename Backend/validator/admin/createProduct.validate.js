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

async function checkExistASIN(asin) {
    const existingProduct = await Product.findOne({ asin: asin });
    return existingProduct;
}

function showAlert(req, res, message) {
    req.flash('error', message);
    return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
}

module.exports.validateCreateProduct = async (req, res, next) => {
    const productData = req.body;
    // console.log(productData);
    if (await checkExistASIN(productData.asin)) {
        dealImage(req.file);
        return showAlert(req, res, 'ASIN already exists.');
    }

    if (!productData.title || !productData.title.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Product title is required.');
    }

    if (!productData.price || isNaN(productData.price)) {
        dealImage(req.file);
        return showAlert(req, res, 'Product price must be a number.');
    }

    next();
}
