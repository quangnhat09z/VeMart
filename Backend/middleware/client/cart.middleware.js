const Cart = require('../../models/cart.model.js');

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.cookies.cartId) {
            const newCart = new Cart();
            await newCart.save();
            res.cookie('cartId', newCart._id.toString(), { 
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true,
                sameSite: 'strict'
            });
            res.locals.cartQuantity = 0;
        } else {
            // Validate cartId tồn tại
            const cart = await Cart.findById(req.cookies.cartId);
            if (!cart) {
                // Nếu cart không tồn tại, tạo cart mới
                const newCart = new Cart();
                await newCart.save();
                res.cookie('cartId', newCart._id.toString(), { 
                    httpOnly: true, 
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'strict'
                });
                res.locals.cartQuantity = 0;
            } else {
                let totalQuantity = 0;
                if (cart.products && Array.isArray(cart.products)) {
                    cart.products.forEach(item => {
                        totalQuantity += item.quantity || 0;
                    });
                }
                res.locals.cartQuantity = totalQuantity;
            }
        }
    } catch (error) {
        console.error('Cart middleware error:', error);
        res.locals.cartQuantity = 0;
    }
    next();
}