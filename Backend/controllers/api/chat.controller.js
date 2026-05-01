const crypto = require('crypto');
const ChatMessage = require('../../models/chatAI.model.js');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

// [GET] /api/chat/:conversationId - Lấy lịch sử chat
module.exports.getHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ success: false, error: 'Thiếu conversationId' });
        }

        const messages = await ChatMessage.find({ conversationId })
            .sort({ createdAt: 1 })
            .select('role content')
            .lean();

        res.json({
            success: true,
            messages: messages.map(m => ({ role: m.role, content: m.content }))
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({
            success: false,
            error: 'Không thể tải lịch sử chat'
        });
    }
};

// [POST] /api/chat - Gửi tin nhắn, RAG trả lời
module.exports.chat = async (req, res) => {
    try {
        const { message, conversationId: clientConversationId } = req.body;

        if (!message?.trim())
            return res.status(400).json({ success: false, error: 'Vui lòng nhập tin nhắn' });

        const conversationId  = clientConversationId || crypto.randomUUID();
        const trimmedMessage  = message.trim();

        // 1. Lấy lịch sử từ MongoDB để truyền cho RAG làm context
        const history = await ChatMessage.find({ conversationId })
            .sort({ createdAt: 1 })
            .select('role content')
            .lean();

        const chatHistory = history.map(m => ({ role: m.role, content: m.content }));

        // 2. Gọi Python RAG service
        const ragResponse = await fetch(`${RAG_SERVICE_URL}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question:     trimmedMessage,
                chat_history: chatHistory
            }),
            signal: AbortSignal.timeout(30000)  // timeout 30s
        });

        if (!ragResponse.ok) {
            const err = await ragResponse.json().catch(() => ({}));
            throw new Error(err.detail || 'RAG service lỗi');
        }

        const { answer, sources } = await ragResponse.json();

        // 3. Lưu vào MongoDB
        await ChatMessage.insertMany([
            { conversationId, role: 'user',      content: trimmedMessage },
            { conversationId, role: 'assistant',  content: answer }
        ]);

        res.json({ success: true, reply: answer, sources, conversationId });

    } catch (error) {
        console.error('Chat error:', error.message);

        const isTimeout = error.name === 'TimeoutError';
        res.status(isTimeout ? 504 : 500).json({
            success: false,
            error: isTimeout
                ? 'RAG service phản hồi quá chậm, thử lại sau.'
                : 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        });
    }
};