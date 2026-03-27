const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user_id: String,
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product',   
                required: true 
            },
            quantity: { type: Number, default: 1 }
        }
    ]
},{ timestamps: true });

const Cart = mongoose.model("Cart", cartSchema, 'carts');

module.exports = Cart;