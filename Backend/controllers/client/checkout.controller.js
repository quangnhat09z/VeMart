const Order = require('../../models/order.model.js');
const Cart = require('../../models/cart.model.js');

// [GET] /checkout
exports.viewCheckout = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId).populate('products.productId');

    cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.productId.price * item.quantity;
    }, 0);

    res.render('client/pages/checkout/viewCheckout', { 
        cart:cart,
        totalPrice: cart.totalPrice.toFixed(2)
    }); 
}