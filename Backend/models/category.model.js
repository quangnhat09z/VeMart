const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'Title must be at most 100 characters long.'],
            unique: true,
        },
        slug: { type: String, slug: "title", unique: true },
        description: {
            type: String,
            trim: true,
        },
        imgUrl: {
            type: String,
            default: null,
        },
        iconUrl: {
            type: String,
            default: null,
        },
        parentCategory: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: {
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: Date
            }
        ],
    },
    {
        timestamps: true,
        versionKey: false
    });



const Category = mongoose.model('Category', categorySchema, 'categories');
module.exports = Category;