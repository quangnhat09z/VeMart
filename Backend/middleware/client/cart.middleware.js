const Cart = require('../../models/cart.model.js');

module.exports.cartId = async (req, res, next) => {
    // console.log(req.cookies.cartId);
    if (!req.cookies.cartId) {
        const newCart = new Cart();
        await newCart.save();
        res.cookie('cartId', newCart._id.toString(), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie expires in 7 days
    }
    next();
}