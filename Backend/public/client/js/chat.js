const socket = window.socket = io();

const TYPING_TIMEOUT = 2000;
const MAX_TEXTAREA_HEIGHT = 150;
const INITIAL_TEXTAREA_HEIGHT = 40;

const elements = {
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    chatMessages: document.getElementById('chat-messages'),
    chatBody: document.querySelector('.chat__body'),
    emojiButton: document.querySelector('.chat-emoji'),
    emojiPicker: document.querySelector('.emoji-picker')
};

// State
let typingTimeout;

function scrollToBottom() {
    elements.chatBody.scrollTop = elements.chatBody.scrollHeight;
}

function createMessageElement(content, fullname, isUser = false) {
    const div = document.createElement('div');
    if (isUser) {
        div.innerHTML = `
            <div class="chat__message chat__message--user">
                <div class="chat__message-content">${content}</div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="chat__message chat__message--bot">
                <div class="chat__message-name">${fullname}</div>
                <div class="chat__message-content">${content}</div>
            </div>
        `;
    }
    return div;
}

function createTypingIndicator(fullname) {
    const div = document.createElement('div');
    div.classList.add('typing-indicator');
    div.innerHTML = `
        <div class="chat__messages-typing">
            <div class="chat__message chat__message--bot">
                <div class="chat__message-name">${fullname} is typing</div>
                <div class="chat__message-typing">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    return div;
}

function removeTypingIndicator() {
    const typingEl = elements.chatMessages.querySelector('.typing-indicator');
    if (typingEl) typingEl.remove();
}

// Textarea Auto-Resize
function initTextareaAutoResize() {
    elements.chatInput.addEventListener('input', () => {
        elements.chatInput.style.height = 'auto';
        elements.chatInput.style.height = Math.min(elements.chatInput.scrollHeight, MAX_TEXTAREA_HEIGHT) + 'px';
    });
}

// Form Submission
function initFormSubmit() {
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            elements.chatForm.dispatchEvent(new Event('submit'));
        }
    });

    elements.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = elements.chatInput.value.trim();
        
        if (message) {
            elements.chatMessages.appendChild(createMessageElement(message, '', true));
            socket.emit('CLIENT_SEND_MESSAGE', message);
            scrollToBottom();
            
            elements.chatInput.value = '';
            elements.chatInput.style.height = INITIAL_TEXTAREA_HEIGHT + 'px';
        }
    });
}

// Typing Indicator
function showTypingIndicator() {
    socket.emit('CLIENT_SEND_TYPING', true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', false);
    }, TYPING_TIMEOUT);
}

function initTypingIndicator() {
    elements.chatInput.addEventListener('keyup', showTypingIndicator);

    socket.on('SERVER_RETURN_TYPING', (data) => {
        if (data.isTyping) {
            if (!elements.chatMessages.querySelector('.typing-indicator')) {
                elements.chatMessages.appendChild(createTypingIndicator(data.fullname));
            }
            scrollToBottom();
        } else {
            removeTypingIndicator();
        }
    });
}

// Socket Events
function initSocketEvents() {
    socket.on('SERVER_RETURN_MESSAGE', (data) => {
        if (elements.chatMessages.getAttribute('myid') !== data.user_id) {
            elements.chatMessages.appendChild(createMessageElement(data.content, data.fullname));
            removeTypingIndicator();
            scrollToBottom();
        }
    });
}

// Emoji Picker
function initEmojiPicker() {
    if (!elements.emojiButton || !elements.emojiPicker) return;

    elements.emojiButton.addEventListener('click', () => {
        elements.emojiPicker.classList.toggle('active');
    });

    elements.emojiPicker.addEventListener('emoji-click', (event) => {
        elements.chatInput.value += event.detail.unicode;
        elements.chatInput.focus();
        showTypingIndicator();
    });

    document.addEventListener('click', (event) => {
        const clickedOutside = 
            !elements.emojiPicker.contains(event.target) && 
            !elements.emojiButton.contains(event.target);
        
        if (clickedOutside) {
            elements.emojiPicker.classList.remove('active');
        }
    });
}


function init() {
    if (!elements.chatForm || !elements.chatInput || !elements.chatMessages) return;

    scrollToBottom();
    initTextareaAutoResize();
    initFormSubmit();
    initTypingIndicator();
    initSocketEvents();
    initEmojiPicker();
}

init();