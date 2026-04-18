const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    user_id: String,
    products: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product',   
                required: true 
            },
        }
    ]
},{ timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishListSchema, 'wishlists');

module.exports = Wishlist;