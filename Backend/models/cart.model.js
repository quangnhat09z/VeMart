const monngoose = require("mongoose");

const cartSchema = new monngoose.Schema({
    user_id: { 
        type: String,
        // required: true 
    },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],

},{ timestamps: true });

const Cart = monngoose.model("Cart", cartSchema, 'carts');

module.exports = Cart;