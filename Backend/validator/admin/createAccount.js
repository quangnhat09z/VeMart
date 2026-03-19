const systemConfig = require('../../config/system.js');
const fs = require("fs");

module.exports.validateCreateAccount = (req, res, next) => {
    const accountData = req.body;
    // console.log(accountData);
    if (!accountData.email || !accountData.email.trim() ) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
            });
        }   
        req.flash('error', 'Email is required.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts/create`);
    }
    if (!accountData.password || !accountData.password.trim()) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.log(err);
            });
        }   
        req.flash('error', 'Password is required.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts/create`);
    }   
    

    next();
}