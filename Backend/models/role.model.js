const mongoose = require('mongoose');


const rolesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: {
            type: [String],
            default: []
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
        versionKey: false
    });



const Role = mongoose.model('Role', rolesSchema, 'roles');
module.exports = Role;