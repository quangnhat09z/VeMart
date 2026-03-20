const Account = require('../../models/account.model.js')
const systemConfig = require('../../config/system.js');

// [GET] /admin/auth/login
module.exports.index = async (req, res) => {  
    if (req.cookies.token) {
        try {
            const account = await Account.findOne({ 
                token: req.cookies.token,
                deleted: false 
            });
            
            if (account && account.status === 'active') {
                return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }
    }
    
    res.render('admin/pages/auth/login', {
        title: 'Admin Login'
    });
}

// [POST] /admin/auth/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email tồn tại
        const account = await Account.findOne({
            email: email,
            deleted: false
        });

        // Email không tồn tại hoặc password sai
        if (!account || password !== account.password) {
            req.flash('error', 'Invalid email or password');
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }

        if (account.status === 'inactive') {
            req.flash('error', 'Your account is inactive. Please contact the administrator.');
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }

        // // Login thành công - lưu session
        // req.session.userId = account._id;
        // req.session.email = account.email;
        // req.session.fullName = account.fullName;
        // req.session.role = account.role_id;

        req.flash('success', 'Login successful');
        res.cookie('token', account.token);

        // res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
        res.render('admin/pages/auth/login', {
            title: 'Admin Login',
            // showAlert: true 
        });
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login');
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
}

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Logout successful');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
