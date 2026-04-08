(function () {
    // const toggle = document.getElementById('chat-toggle');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('chat-close');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messagesEl = document.getElementById('chat-messages');

    if (!toggle || !windowEl || !form || !messagesEl) return;

    function getWelcomeMessage() {
        return 'Xin chào! Tôi là trợ lý AI của VeMart. Bạn cần tôi hỗ trợ gì?';
    }

    function clearMessages() {
        messagesEl.innerHTML = '';
    }

    function appendMessage(content, isUser) {
        const div = document.createElement('div');
        div.className = `chat__message chat__message--${isUser ? 'user' : 'bot'}`;
        const contentEl = document.createElement('div');
        contentEl.className = 'chat__message-content';
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
        div.className = 'chat__message chat__message--bot chat__message--typing';
        div.id = 'chat-typing';
        div.innerHTML = '<div class="chat__message-content">Đang suy nghĩ...</div>';
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('chat-typing');
        if (el) el.remove();
    }


    function openChat() {
        windowEl.classList.add('chat__window--open');
        loadHistory();
        input.focus();
    }

    function closeChat() {
        windowEl.classList.remove('chat__window--open');
    }

    toggle.addEventListener('click', function () {
        if (windowEl.classList.contains('chat__window--open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeBtn.addEventListener('click', closeChat);

})();