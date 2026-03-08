module.exports = (err, req, res, next) => {
    const multer = require('multer');

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'File quá lớn. Tối đa 5MB');
        } else if (err.code === 'LIMIT_PART_COUNT') {
            req.flash('error', 'Quá nhiều files');
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            req.flash('error', 'Chỉ được upload 1 file');
        } else {
            req.flash('error', `Lỗi upload: ${err.message}`);
        }
    } else if (err) {
        req.flash('error', err.message);
    }

    console.error('Multer error:', err);
    res.redirect(req.get('Referrer') || '/admin/products/create');
};