const systemConfig = require('../../config/system.js');
const fs = require("fs");

// Danh sách các định dạng ảnh được phép
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

module.exports.validateCreateCategory = (req, res, next) => {
    const categoryData = req.body;
    // console.log(categoryData);
    if (!categoryData.title || !categoryData.title.trim()) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
            });
        }
        req.flash('error', 'Category title is required.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/categories/create`);
    } 
    next();
}
