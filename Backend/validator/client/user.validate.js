const User = require('../../models/user.model');

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