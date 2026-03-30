function showAlert(req, res, message) {
    req.flash('error', message);
    return res.redirect('/checkout');
}

module.exports.createOrder = async (req, res, next) => {
    const orderData = req.body;

    if (!orderData.email) {
        return showAlert(req, res, 'Email is required');
    }
    if (!/\S+@\S+\.\S+/.test(orderData.email)) {
        return showAlert(req, res, 'Invalid email format');
    }
    if (!orderData.phone) {
        return showAlert(req, res, 'Phone number is required');
    }
    if (!/^\+?[0-9\s\-()]+$/.test(orderData.phone)) {
        return showAlert(req, res, 'Invalid phone number format');
    }
    if (!orderData.country) {
        return showAlert(req, res, 'Country is required');
    }
    if (!orderData.fullname) {
        return showAlert(req, res, 'Full name is required');
    }
    if (!orderData.address) {
        return showAlert(req, res, 'Address is required');
    }
   
    next();
}