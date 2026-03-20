const systemConfig = require('../../config/system.js');

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        req.flash('error', 'Email is required');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    if (!password) {
        req.flash('error', 'Password is required');
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    next();
}