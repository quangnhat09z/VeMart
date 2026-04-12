const mongoose = require('mongoose');

const chatUserSchema = new mongoose.Schema({
    user_id: String,
    room_chat_id: String,
    content : String,
    images: Array,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}
, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('ChatUser', chatUserSchema, 'chat-users');