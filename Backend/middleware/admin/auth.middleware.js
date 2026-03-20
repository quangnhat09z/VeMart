
const Account = require('../../models/account.model.js');
const systemConfig = require('../../config/system.js');

module.exports.authRequired = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.flash('error', `You must login by admin's account in to access this page`);
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        try {
            const account = await Account.findOne({ token: token });
            if (!account) {
                req.flash('error', `You must login by admin's account in to access this page`);
                return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            }
        } catch (error) {
            console.error('Auth error:', error);
            req.flash('error', 'An error occurred during authentication');
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
    }
    next();
}