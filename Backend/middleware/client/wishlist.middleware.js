const Wisthlist = require('../../models/wishlist.model.js');

module.exports.wishlistId = async (req, res, next) => {
    try {
        const userId = res.locals.user ? res.locals.user._id : null;
        if (userId) {
            let wishlist = await Wisthlist.findOne({ user_id: userId });
            res.locals.wishlistQuantity = wishlist ? wishlist.products.length : 0;
        } else {
            res.locals.wishlistQuantity = 0;
        }
    }
    catch (error) {
        console.error('Wishlist middleware error:', error);
    }
    next();
}