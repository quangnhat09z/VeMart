const User = require('../../models/user.model.js');
const ForgotPassword = require('../../models/forgot-password.model.js');
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
        expireAt: Date.now() + 1 * 60 * 1000 // OTP het han sau 1 phut
    }
    console.log('Object forgot password:', objectForgotPassword);

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    req.flash('success', 'An OTP has been sent to your email. Please check your inbox.');

    res.redirect('/user/password/forgot-password');
}