/**
 * AI Chatbox - VeMart (với lưu lịch sử chat)
 */
(function () {
    const CHATBOX_STORAGE_KEY = 'vemart_chat_conversation_id';
    const toggle = document.getElementById('chatbox-toggle');
    const windowEl = document.getElementById('chatbox-window');
    const closeBtn = document.getElementById('chatbox-close');
    const form = document.getElementById('chatbox-form');
    const input = document.getElementById('chatbox-input');
    const messagesEl = document.getElementById('chatbox-messages');

    if (!toggle || !windowEl || !form || !messagesEl) return;

    function getConversationId() {
        return localStorage.getItem(CHATBOX_STORAGE_KEY);
    }

    function setConversationId(id) {
        if (id) localStorage.setItem(CHATBOX_STORAGE_KEY, id);
    }

    function getWelcomeMessage() {
        return 'Xin chào! Tôi là trợ lý AI của VeMart. Bạn cần tôi hỗ trợ gì?';
    }

    function clearMessages() {
        messagesEl.innerHTML = '';
    }

    function appendMessage(content, isUser) {
        const div = document.createElement('div');
        div.className = `chatbox__message chatbox__message--${isUser ? 'user' : 'bot'}`;
        const contentEl = document.createElement('div');
        contentEl.className = 'chatbox__message-content';
        contentEl.textContent = content;
        div.appendChild(contentEl);
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderHistory(messages) {
        clearMessages();
        if (messages.length === 0) {
            appendMessage(getWelcomeMessage(), false);
        } else {
            messages.forEach(function (m) {
                appendMessage(m.content, m.role === 'user');
            });
        }
    }

    function appendTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'chatbox__message chatbox__message--bot chatbox__message--typing';
        div.id = 'chatbox-typing';
        div.innerHTML = '<div class="chatbox__message-content">Đang suy nghĩ...</div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('chatbox-typing');
        if (el) el.remove();
    }

    async function loadHistory() {
        const conversationId = getConversationId();
        if (!conversationId) return;

        try {
            const res = await fetch('/api/chat/' + encodeURIComponent(conversationId));
            const data = await res.json();
            if (data.success && Array.isArray(data.messages)) {
                renderHistory(data.messages);
            }
        } catch (err) {
            console.warn('Không thể tải lịch sử chat:', err);
        }
    }

    function openChat() {
        windowEl.classList.add('chatbox__window--open');
        loadHistory();
        input.focus();
    }

    function closeChat() {
        windowEl.classList.remove('chatbox__window--open');
    }

    toggle.addEventListener('click', function () {
        if (windowEl.classList.contains('chatbox__window--open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeBtn.addEventListener('click', closeChat);

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        appendMessage(text, true);
        input.value = '';
        appendTypingIndicator();

        const payload = { message: text };
        const conversationId = getConversationId();
        if (conversationId) payload.conversationId = conversationId;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            removeTypingIndicator();

            if (data.success) {
                if (data.conversationId) setConversationId(data.conversationId);
                appendMessage(data.reply, false);
            } else {
                appendMessage(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.', false);
            }
        } catch (err) {
            removeTypingIndicator();
            appendMessage('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.', false);
        }
    });
})();
