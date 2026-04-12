const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    conversationId: { type: String, required: true, index: true },
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    content: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema, 'chat-messages');

module.exports = ChatMessage;
