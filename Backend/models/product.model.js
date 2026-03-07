const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    asin: { type: String, required: true, unique: true },
    title: String,
    imgUrl: String,
    productURL: String,
    stars: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    listPrice: { type: Number, default: 0 },
    category_id: Number,
    isBestSeller: { type: Boolean, default: false },
    boughtInLastMonth: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

const Product = mongoose.model('Product', productSchema, 'product-demo');

module.exports = Product;