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

// [POST] /checkout/order
exports.createOrder = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findById(cartId).populate('products.productId');
        const orderUserData = {
            email : req.body.email,
            phone : req.body.phone,
            address : req.body.address + ', ' + req.body.country,
            fullname : req.body.fullname,
        }
        const orderProducts = cart.products.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
            listPrice: item.productId.listPrice,
            discountPercentage: item.productId.discountPercentage
        }));
        const totalAmount = cart.products.reduce((total, item) => {
            return total + item.productId.price * item.quantity;
        }, 0);

        const newOrder = new Order({
            cart_id: cartId,
            userInfo: orderUserData,
            products: orderProducts,
            totalAmount: totalAmount.toFixed(2),
            shipppingMethod: req.body.shippingMethod,
            paymentMethod: req.body.paymentMethod
        });
        
        await newOrder.save();


        req.flash('success', 'Your order has been placed successfully!');
        // res.clearCookie('cartId');
        await Cart.findById(cartId).then(cart => {
            cart.products = [];
            cart.save();
        });

        res.redirect(req.header('Referer') || '/');
        
    } catch (error) {
        req.flash('error', 'Failed to place order. Please try again.');
        console.error('Error creating order:', error);
        res.redirect(req.header('Referer') || '/checkout');
    }
}