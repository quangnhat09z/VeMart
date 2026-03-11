const systemConfig = require('../../config/system.js');
const fs = require("fs");

module.exports.validateCreateProduct = (req, res, next) => {
    const productData = req.body;
    // console.log(productData);
    if (!productData.title || !productData.title.trim()) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
            });
        }
        req.flash('error', 'Tên sản phẩm là bắt buộc');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    } else if (!productData.price || isNaN(productData.price)) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
            });
        }
        req.flash('error', 'Giá sản phẩm phải là một số');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/products/create`);
    }
    next();
}
