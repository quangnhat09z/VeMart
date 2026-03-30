
module.exports.updateQuantity = async (req, res, next) => {
    // console.log('Validating quantity:', req.params.quantity);

    if (isNaN(req.params.quantity) ) {
        req.flash('error', 'Quantity must be a number');
        return res.redirect(req.header('Referer') || '/cart');  
    }
    if (req.params.quantity.includes('+') || req.params.quantity.includes('-') || req.params.quantity.includes('.')) {
        req.flash('error', 'Invalid quantity format');
        return res.redirect(req.header('Referer') || '/cart');
    }
    const quantity = parseInt(req.params.quantity);

    if (quantity < 1) {
        req.flash('error', 'Quantity must be at least 1');
        return res.redirect(req.header('Referer') || '/cart');
    } else if (quantity > 100) {
        req.flash('error', 'Quantity cannot exceed 100');
        return res.redirect(req.header('Referer') || '/cart');
    }

    next();
}