const Wishlist = require('../../models/wishlist.model.js');


// [GET] /wishlist
module.exports.wishlistPage = async (req, res) => {
    const userId = res.locals.user ? res.locals.user._id : null;
    const wishlist = await Wishlist.findOne({
        user_id: userId
    }).populate('products.productId');
    
    
    console.log('Wishlist items:', wishlist ? wishlist.products : []);
    res.render('client/pages/wishlist/index', {
        title: 'Wishlist',
        wishlistItems: wishlist ? wishlist.products : []
    });
}

module.exports.addToWishlist = async (req, res) => {
    const userId = res.locals.user ? res.locals.user._id : null;
    const { productId } = req.body;
    if (userId) {
        let wishlist = await Wishlist.findOne({ user_id: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user_id: userId, products: [] });
        }
        // Check if product is already in wishlist
        const productExists = wishlist.products.some(item => item.productId.equals(productId));
        if (!productExists) {
            wishlist.products.push({ productId });
            await wishlist.save();
        }
        req.flash('success', 'Product added to wishlist');
        res.redirect('/home');
    }
}