const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    userInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            listPrice: { type: Number},
            discountPercentage: { type: Number, default: 0 },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema, 'orders');