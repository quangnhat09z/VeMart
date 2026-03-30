function showAlert(req, res, message, redirectUrl) {
    req.flash('error', message);
    res.redirect(redirectUrl);
}

module.exports.register = (req, res, next) => {
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