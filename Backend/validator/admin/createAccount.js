const systemConfig = require('../../config/system.js');
const Account = require('../../models/account.model.js');
const fs = require("fs");

function dealImage(imagePath) {
    if (imagePath) {
        fs.unlink(imagePath.path, (err) => {
            if (err) console.log(err);
        });
    }
}

function checkExistEmail(email) {
    const existingAccount = Account.findOne({ email: email });
    return existingAccount;   
}

function showAlert(message) {
    req.flash('error', message);
    return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts/create`);
}

module.exports.validateCreateAccount = (req, res, next) => {
    const accountData = req.body;
    // console.log(accountData);
    if (!accountData.email || !accountData.email.trim()) {
        dealImage(req.file);
        showAlert('Email is required.');
    }

    if (checkExistEmail(accountData.email)) {
        dealImage(req.file);
        showAlert('Email already exists.');
    }

    if (!accountData.password || !accountData.password.trim()) {
        dealImage(req.file);
        showAlert('Password is required.');
    }

    if (!accountData.role_id || !accountData.role_id.trim()) {
        dealImage(req.file);
        showAlert('Role is required.');
    }

    next();
}