const path = require('path');
const multer = require('multer');
const systemConfig = require('../config/system.js');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('invalid_file_type'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Middleware xử lý lỗi Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'File không được vượt quá 5MB.');
        } else {
            req.flash('error', 'Lỗi khi upload file.');
        }
    } else if (err && err.message === 'invalid_file_type') {
        req.flash('error', 'Allowed file types are: jpg, png, gif, webp.');
    } else if (err) {
        req.flash('error', err.message);
    }
    
    // Redirect về trang trước
    return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/categories`);
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;