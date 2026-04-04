const User = require('../../models/user.model');
const fs = require("fs");

function dealImage(imagePath) {
    if (imagePath) {
        fs.unlink(imagePath.path, (err) => {
            if (err) console.log(err);
        });
    }
}

function showAlert(req, res, message, redirectUrl) {
    req.flash('error', message);
    res.redirect(redirectUrl);
}

async function checkExistEmail(email) {
    const existingUser = await User.findOne({ email: email });
    return existingUser;
}

module.exports.register = async (req, res, next) => {
    const { fullname, email, password } = req.body;
    if (!fullname) {
        return showAlert(req, res, 'Full name is required', '/user/register');
    }
    if (!email) {
        return showAlert(req, res, 'Email is required', '/user/register');
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return showAlert(req, res, 'Invalid email format', '/user/register');
    }
    const existingUser = await checkExistEmail(email);
    if (existingUser) {
        return showAlert(req, res, 'Email already exists', '/user/register');
    }
    if (!password) {
        return showAlert(req, res, 'Password is required', '/user/register');
    }
    
    next();
}

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        return showAlert(req, res, 'Email is required', `/user/login`);
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return showAlert(req, res, 'Invalid email format', `/user/login`);
    }
    if (!password) {
        return showAlert(req, res, 'Password is required', `/user/login`);
    }
    next();
}

module.exports.forgotPassword = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return showAlert(req, res, 'Email is required', `/user/password/forgot-password`);
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return showAlert(req, res, 'Invalid email format', `/user/password/forgot-password`);
    }
    next();
}

module.exports.resetPassword = (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword) {
        return showAlert(req, res, 'New password is required', `/user/password/reset-password`);
    }
    if (!confirmPassword) {
        return showAlert(req, res, 'Confirm password is required', `/user/password/reset-password`);
    }
    if (newPassword !== confirmPassword) {
        return showAlert(req, res, 'Passwords do not match', `/user/password/reset-password`);
    }
    next();
}

module.exports.otp = (req, res, next) => {
    const { otp, email } = req.body;
    if (!otp) {
        return showAlert(req, res, 'OTP is required', `/user/password/otp/email=${email}`);
    }
    next();
}

module.exports.editProfile = async (req, res, next) => {
    const { fullname, email } = req.body;
    if (!fullname) {
        dealImage(req.file);
        return showAlert(req, res, 'Full name is required', `/user/profile/edit`);
    }
    if (!email) {
        dealImage(req.file);
        return showAlert(req, res, 'Email is required', `/user/profile/edit`);
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        dealImage(req.file);
        return showAlert(req, res, 'Invalid email format', `/user/profile/edit`);
    }
    if (checkExistEmail(email)) {
        dealImage(req.file);
        return showAlert(req, res, 'Email already exists', `/user/profile/edit`);
    }
    next();
}

module.exports.changePassword = async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser: tokenUser });

    if (!user) {
        return showAlert(req, res, 'User not found', `/user/profile/change-password`);
    }
    if (!currentPassword) {
        return showAlert(req, res, 'Current password is required', `/user/profile/change-password`);
    }
    if (currentPassword !== user.password) {
        return showAlert(req, res, 'Current password is incorrect', `/user/profile/change-password`);
    }
    if (!newPassword) {
        return showAlert(req, res, 'New password is required', `/user/profile/change-password`);
    }
    if (!confirmNewPassword) {
        return showAlert(req, res, 'Confirm password is required', `/user/profile/change-password`);
    }
    if (newPassword !== confirmNewPassword) {
        return showAlert(req, res, 'Passwords do not match', `/user/profile/change-password`);
    }
    next();
}
