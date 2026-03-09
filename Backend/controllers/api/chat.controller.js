const crypto = require('crypto');
const ChatMessage = require('../../models/chat.model.js');

const CHAT_SYSTEM_PROMPT = `Bạn là trợ lý AI của VeMart - một cửa hàng thương mại điện tử. 
Hãy trả lời thân thiện, ngắn gọn về sản phẩm, đơn hàng, chính sách vận chuyển, 
đổi trả hoặc các câu hỏi khác của khách hàng. Trả lời bằng tiếng Việt.`;

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

// [POST] /api/chat - Gửi tin nhắn và nhận phản hồi từ AI (Groq)
module.exports.chat = async (req, res) => {
    try {
        const { message, conversationId: clientConversationId } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Chat AI chưa được cấu hình. Vui lòng thêm GROQ_API_KEY vào file .env'
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập tin nhắn'
            });
        }

        const conversationId = clientConversationId || crypto.randomUUID();
        const trimmedMessage = message.trim();

        // Lấy lịch sử từ DB (nếu có)
        const history = await ChatMessage.find({ conversationId })
            .sort({ createdAt: 1 })
            .select('role content')
            .lean();

        // Xây dựng messages cho Groq: system + history + message mới
        const messages = [
            { role: 'system', content: CHAT_SYSTEM_PROMPT },
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: trimmedMessage }
        ];
        console.log(messages);

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
                messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: data.error?.message || 'Không thể kết nối AI'
            });
        }

        const reply = data.choices?.[0]?.message?.content?.trim() || 'Xin lỗi, tôi không thể phản hồi.';

        // Lưu user message
        await ChatMessage.create({
            conversationId,
            role: 'user',
            content: trimmedMessage
        });

        // Lưu assistant response
        await ChatMessage.create({
            conversationId,
            role: 'assistant',
            content: reply
        });

        res.json({
            success: true,
            reply,
            conversationId
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            success: false,
            error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        });
    }
};
