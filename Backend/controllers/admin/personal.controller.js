const { request } = require('express');
const Account = require('../../models/account.model.js');
const systemConfig = require('../../config/system.js');


// GET /admin/personal
module.exports.index = (req, res) => {
    res.render('admin/pages/personal/index', {
        title: 'Personal Information',
    });
}

// GET /admin/personal/edit
module.exports.edit = (req, res) => {
    res.render('admin/pages/personal/edit', {
        title: 'Edit Personal Information'
    });
}

// PATCH /admin/personal/edit
module.exports.update = async (req, res) => {
    const accountId = res.locals.user._id;
    try {
        const updateData = req.body;
        // console.log(updateData);
        if (req.file) {
            uploadedFilename = req.file.filename;
            updateData.avatar = `/uploads/${req.file.filename}`;
        }

        // updateData.password = await hashPassword(updateData.newPassword);
        updateData.password = updateData.newPassword;
        // console.log(updateData);

        await Account.findByIdAndUpdate(accountId, updateData);

        req.flash('success', 'Updated information successfully');
        res.redirect(`${systemConfig.prefixAdmin}/personal`);
    } catch (error) {
        console.error('Error updating information:', error);
        req.flash('error', 'An error occurred while updating information.');
        res.redirect(`${systemConfig.prefixAdmin}/personal/edit`);
    }
}

// GET /admin/personal/change-password
module.exports.changePassword = (req, res) => {
    res.render('admin/pages/personal/change-password', {
        title: 'Change Password'
    });
}

// PATCH /admin/personal/change-password
module.exports.updatePassword = async (req, res) => {
    const accountId = res.locals.user._id;
    
    try {
        const passwordData = req.body;
        await Account.findByIdAndUpdate(accountId, { password: passwordData.newPassword });

        req.flash('success', 'Password changed successfully');
        res.redirect(`${systemConfig.prefixAdmin}/personal`);
    } catch (error) {
        console.error('Error changing password:', error);
        req.flash('error', 'An error occurred while changing the password.');
        res.redirect(`${systemConfig.prefixAdmin}/personal/change-password`);
    }
}

