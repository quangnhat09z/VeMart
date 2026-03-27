const Cart = require('../../models/cart.model.js');
const Product = require('../../models/product.model.js');

module.exports.addToCart = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    const cartId = req.cookies.cartId;
    
    // const cart = await Cart.findOne({ _id: cartId });
    // cart.products.push({ productId, quantity });
    // await cart.save();

    const slug = await Product.findOne({ _id: productId }).select('slug');

    req.flash('success', 'Product added to cart successfully!');
    res.redirect(`/product/detail/${slug.slug}`);
}