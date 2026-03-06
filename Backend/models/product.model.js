const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    asin: { type: String, required: true, unique: true },
    title: String,
    imgUrl: String,
    productURL: String,
    stars: Number,
    reviews: Number,
    price: Number,
    listPrice: Number,
    category_id: Number,
    isBestSeller: Boolean,
    boughtInLastMonth: Number,
    discountPercentage: Number,
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }
});

const Product = mongoose.model('Product', productSchema, 'product-demo');

module.exports = Product;