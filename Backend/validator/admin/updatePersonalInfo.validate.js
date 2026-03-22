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

function showAlert(req, res, message) {
    req.flash('error', message);
    return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/personal/edit`);
}


module.exports.validateUpdatePersonalInfo = async (req, res, next) => {
    const accountData = req.body;
    const accountId = res.locals.user._id;

    if (!accountData.email || !accountData.email.trim()) {
        dealImage(req.file);
        return showAlert(req, res, 'Email is required.');
    }

    // Check email tồn tại nhưng loại trừ account hiện tại
    const existingAccount = await Account.findOne({
        email: accountData.email,
        _id: { $ne: accountId }
    });
    if (existingAccount) {
        dealImage(req.file);
        return showAlert(req, res, 'Email already exists.');
    }

    next();
}

module.exports.validateUpdatePassword = async (req, res, next) => {
    const currentPassword = req.body.currentPassword;
    const hasNewPassword = req.body.newPassword && req.body.newPassword.trim() !== '';

    if (!currentPassword) {
        return showAlert(req, res, 'Current password is required to update information.');
    }
    if (hasNewPassword) {
        // Chỉ bắt buộc currentPassword khi đổi password
        if (!req.body.currentPassword) {
            return showAlert(req, res, 'Current password is required to update password.');
        }
        const account = await Account.findOne({ _id: res.locals.user._id });
        // const isPasswordValid = await comparePassword(
        //     req.body.currentPassword,
        //     account.password
        // );
        const isPasswordValid = req.body.currentPassword === account.password;
        if (!isPasswordValid) {
            return showAlert(req, res, 'Current password is incorrect.');
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return showAlert(req, res, 'New password and confirm password do not match.');
        }

    } else {
        req.flash('error', 'New password is required to update password.');
        return res.redirect(req.get('Referrer') || `${systemConfig.prefixAdmin}/personal/change-password`);
    }
    next();
}

