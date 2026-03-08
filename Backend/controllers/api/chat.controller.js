// [POST] /api/chat - Gửi tin nhắn và nhận phản hồi từ AI
const CHAT_SYSTEM_PROMPT = `Bạn là trợ lý AI của VeMart - một cửa hàng thương mại điện tử. 
Hãy trả lời thân thiện, ngắn gọn về sản phẩm, đơn hàng, chính sách vận chuyển, 
đổi trả hoặc các câu hỏi khác của khách hàng. Trả lời bằng tiếng Việt.`;

module.exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        
        const apiKey = process.env.OPENAI_API_KEY;
        console.log(apiKey);

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Chat AI chưa được cấu hình. Vui lòng thêm OPENAI_API_KEY vào file .env'
            });
        }

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Vui lòng nhập tin nhắn'
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: CHAT_SYSTEM_PROMPT },
                    { role: 'user', content: message.trim() }
                ],
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

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            success: false,
            error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        });
    }
};
