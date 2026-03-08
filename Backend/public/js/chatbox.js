/**
 * AI Chatbox - VeMart
 */
(function () {
    const toggle = document.getElementById('chatbox-toggle');
    const windowEl = document.getElementById('chatbox-window');
    const closeBtn = document.getElementById('chatbox-close');
    const form = document.getElementById('chatbox-form');
    const input = document.getElementById('chatbox-input');
    const messagesEl = document.getElementById('chatbox-messages');

    if (!toggle || !windowEl || !form || !messagesEl) return;

    function openChat() {
        windowEl.classList.add('chatbox__window--open');
        input.focus();
    }

    function closeChat() {
        windowEl.classList.remove('chatbox__window--open');
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

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            removeTypingIndicator();

            if (data.success) {
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
