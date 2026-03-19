const mongoose = require('mongoose');
const crypto = require('crypto');

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};
const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
    },
    phone: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: null
    },
    token: {
        type: String,
        default: generateToken
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false

});


module.exports = mongoose.model('Account', accountSchema, 'accounts');