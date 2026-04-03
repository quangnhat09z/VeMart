const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/user.controller.js')
const validate = require('../../validator/client/user.validate.js');

router.get('/register', controller.registerPage);
router.post('/register',
    validate.register,
    controller.register
);

router.get('/login', controller.loginPage);
router.post('/login',
    validate.login,
    controller.login
);
router.get('/logout', controller.logout);
router.get('/profile', controller.profilePage);

// Password reset routes
router.get('/password/forgot-password', controller.forgotPasswordPage);
router.post('/password/forgot-password',
    validate.forgotPassword,
    controller.forgotPassword
);
router.get('/password/otp/email=:email', controller.otpPage);
router.post('/password/otp',
    validate.otp,
    controller.otp
);
router.get('/password/reset-password', controller.resetPasswordPage);
router.post('/password/reset-password',
    validate.resetPassword,
    controller.resetPassword
);
module.exports = router;