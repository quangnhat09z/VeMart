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

async function checkExistEmail(email) {
    const existingAccount = await Account.findOne({ email: email });
    return existingAccount;   
}

function showAlert(req, res,message) {
    req.flash('error', message);
    return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/accounts/create`);
}

module.exports.validateCreateAccount = async (req, res, next) => {
    const accountData = req.body;
    // console.log(accountData);
    if (!accountData.email || !accountData.email.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Email is required.');
    }

    if (await checkExistEmail(accountData.email)) {
        dealImage(req.file);
        return showAlert(req, res, 'Email already exists.');
    }

    if (!accountData.password || !accountData.password.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Password is required.');
    }

    if (!accountData.role_id || !accountData.role_id.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Role is required.');
    }

    next();
}

module.exports.validateUpdateAccount = async (req, res, next) => {
    const accountData = req.body;
    // console.log(accountData);
    if (!accountData.email || !accountData.email.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Email is required.');
    }

    if (!accountData.password || !accountData.password.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Password is required.');
    }

    if (!accountData.role_id || !accountData.role_id.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Role is required.');
    }

    next();
}