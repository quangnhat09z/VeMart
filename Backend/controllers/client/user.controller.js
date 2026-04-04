const User = require('../../models/user.model.js');
const ForgotPassword = require('../../models/forgot-password.model.js');
const  sendMailHelper  = require('../../helpers/sendMail.js');
const crypto = require('crypto');

// GET /user/register
module.exports.registerPage = async (req, res) => {
    res.render('client/pages/user/register');
}

// POST /user/register
module.exports.register = async (req, res) => {
    const { fullname, email, password } = req.body;
    const newUser = new User({ fullname, email, password });
    await newUser.save();
    // console.log('Registered user:', { fullname, email, password });

    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/user/login');
}

// GET /user/login
module.exports.loginPage = async (req, res) => {
    res.render('client/pages/user/login');
}

// POST /user/login
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        req.flash('error', 'Email does not exist');
        return res.redirect('/user/login');
    }
    if (user.password !== password) {
        req.flash('error', 'Email or password is incorrect');
        return res.redirect('/user/login');
    }
    if (user.status !== 'active') {
        req.flash('error', 'Your account is inactive. Please contact support.');
        return res.redirect('/user/login');
    }

    // req.session.user = user;
    res.cookie('tokenUser', user.tokenUser, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    req.flash('success', 'Login successful.');
    res.redirect('/');
}

// GET /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('tokenUser');
    req.flash('success', 'Logout successful.');
    res.redirect('/');
}

// GET /user/profile
module.exports.profilePage = async (req, res) => {
    res.render('client/pages/user/profile');
}

// GET /user/profile/edit
module.exports.editProfilePage = async (req, res) => {
    res.render('client/pages/user/edit-profile');
}
// POST /user/profile/edit
module.exports.editProfile = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        const updateData = req.body;
        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }
        await User.findOneAndUpdate({ tokenUser: tokenUser }, updateData);
        req.flash('success', 'Profile updated successfully');
        res.redirect('/user/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'An error occurred while updating profile.');
        return res.redirect('/user/profile/edit');
    }
}

// GET /user/password/forgot-password
module.exports.forgotPasswordPage = async (req, res) => {
    res.render('client/pages/user/forgot-password');
}
// POST /user/password/forgot-password
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        req.flash('error', 'Email does not exist');
        return res.redirect('/user/password/forgot-password');
    }

    const otp = crypto.randomInt(100000, 1000000);
    const objectForgotPassword = {
        email: email,
        otp: otp.toString(),
        expireAt: Date.now() + 5 * 60 * 1000 // OTP het han sau 1 phut
    }
    console.log('Object forgot password:', objectForgotPassword);

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    req.flash('success', 'An OTP has been sent to your email. Please check your inbox.');
    const subject = 'VeMart OTP for Password Reset';
    const html = `Your OTP for password reset is: <b>${otp}</b>. It will expire in 5 minutes. Please do not share this OTP with anyone.`;
    await sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp/email=${email}`);
}

// GET /user/password/otp/email=:email
module.exports.otpPage = async (req, res) => {
    const { email } = req.params;
    res.render('client/pages/user/otp', {
        email
    });
}

// POST /user/password/otp
module.exports.otp = async (req, res) => {
    const { email, otp } = req.body;
    console.log('Received OTP verification request:', { email, otp });
    const forgotPassword = await ForgotPassword.findOne({ email: email, otp: otp });
    if (!forgotPassword) {
        req.flash('error', 'Invalid OTP');
        return res.redirect(`/user/password/otp/email=${email}`);
    }
    if (forgotPassword.expireAt < Date.now()) {
        req.flash('error', 'OTP has expired');
        return res.redirect(`/user/password/otp/email=${email}`);
    }

    const user = await User.findOne({
        email: email,
        deleted: false,
        status: 'active'
    });
    if (!user) {
        req.flash('error', 'User is inactive. Please contact support.');
        return res.redirect(`/user/password/otp/email=${email}`);
    } else {
        req.flash('success', 'OTP verification successful. You can now reset your password.');
    }
    await ForgotPassword.deleteOne({ _id: forgotPassword._id });
    res.cookie("tokenUser", user.tokenUser, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.redirect('/user/password/reset-password');
}

// GET /user/password/reset-password
module.exports.resetPasswordPage = async (req, res) => {
    res.render('client/pages/user/reset-password');
}

// POST /user/password/reset-password
module.exports.resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const tokenUser = req.cookies.tokenUser;
    if (!tokenUser) {
        req.flash('error', 'Invalid token');
        return res.redirect('/user/password/reset-password');
    }
    const user = await User.findOne({ tokenUser: tokenUser });
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/user/password/reset-password');
    }
    await User.updateOne(
        { _id: user._id }, 
        { password: newPassword }
    );
    
    await ForgotPassword.deleteOne({ email: user.email });

    res.clearCookie('tokenUser');
    req.flash('success', 'Password reset successful. Please log in.');
    res.redirect('/user/login');
}