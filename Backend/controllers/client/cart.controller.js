const Cart = require('../../models/cart.model.js');
const Product = require('../../models/product.model.js');

// [GET] /cart
module.exports.viewCart = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId).populate('products.productId');

    cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.productId.price * item.quantity;
    }, 0);

    res.render('client/pages/cart/viewCart', {
        cart: cart,
    });
}

// [POST] /cart/add/:productId
module.exports.addToCart = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;
    const cartId = req.cookies.cartId;

    const existingProduct = await Cart.findOne(
        {
            _id: cartId,
            'products.productId': productId
        });
    if (existingProduct) {
        await Cart.updateOne(
            { _id: cartId, 'products.productId': productId },
            { $inc: { 'products.$.quantity': quantity } }
        );
    } else {
        const cart = await Cart.findOne({ _id: cartId });
        cart.products.push({ productId, quantity });
        await cart.save();
    }

    // const slug = await Product.findOne({ _id: productId }).select('slug');

    req.flash('success', 'Product added to cart successfully!');
    res.redirect(req.header('Referer') || '/');
}