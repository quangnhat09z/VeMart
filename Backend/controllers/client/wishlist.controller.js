const Wishlist = require('../../models/wishlist.model.js');


// [GET] /wishlist
module.exports.wishlistPage = async (req, res) => {
    const userId = res.locals.user ? res.locals.user._id : null;
    const wishlist = await Wishlist.findOne({
        user_id: userId
    }).populate('products.productId');

    res.render('client/pages/wishlist/index', {
        title: 'Wishlist',
        wishlistItems: wishlist ? wishlist.products : []
    });
}

// [POST] /wishlist/add
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
        res.redirect('/');
    }
}

// [DELETE] /wishlist/remove
module.exports.removeFromWishlist = async (req, res) => {
    const userId = res.locals.user ? res.locals.user._id : null;
    const { productId } = req.body;
    
    if (userId) {
        const result = await Wishlist.updateOne(
            { user_id: userId }, 
            { $pull: { products: { productId: productId } } } 
        );
       
        req.flash('success', 'Product removed from wishlist');
        res.redirect('/wishlist');
    }
}