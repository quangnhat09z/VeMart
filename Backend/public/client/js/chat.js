console.log('Chat script loaded');
const socket = window.socket = io();

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const chatBody = document.querySelector('.chat__body');
chatBody.scrollTop = chatBody.scrollHeight;

if (chatForm && chatInput && chatMessages) {
    // Send message to server
    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message != '') {

            // Hiển thị tin nhắn của người dùng
            const userMessageEl = document.getElementById('chat-messages');
            const div = document.createElement('div');
            const htmlString = `
                <div class="chat__message chat__message--user">
                    <div class="chat__message-content">${message}</div>
                </div>
            `;
            div.innerHTML = htmlString;
            userMessageEl.appendChild(div);

            // Gửi tin nhắn đến server
            socket.emit('CLIENT_SEND_MESSAGE', message);

            const chatBody = document.querySelector('.chat__body');
            chatBody.scrollTop = chatBody.scrollHeight;
            chatInput.value = ''
        }
    });


    // Listen for messages from server  
    socket.on('SERVER_RETURN_MESSAGE', function (data) {
        const botMessageEl = document.getElementById('chat-messages');
        if (botMessageEl.getAttribute('myid') !== data.user_id) {
            const div = document.createElement('div');
            const htmlString = `
            <div class="chat__message chat__message--bot">
                <div class="chat__message-name">${data.fullname}</div>
                <div class="chat__message-content">${data.content}</div>
            </div>`;
            div.innerHTML = htmlString;
            botMessageEl.appendChild(div);
            if (botMessageEl.querySelector('.chat__messages-typing')) {
                botMessageEl.querySelector('.chat__messages-typing').remove();
            }
            const chatBody = document.querySelector('.chat__body');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    });

    chatInput.addEventListener('keyup', function () {
        socket.emit('CLIENT_SEND_TYPING', true);
    });

    socket.on('SERVER_RETURN_TYPING', function (data) {
        const typingEl = document.querySelector('.chat__messages');
        if (data.isTyping) {
            const div = document.createElement('div');
            const htmlString = `
            <div class="chat__messages-typing">
                <div class="chat__message chat__message--bot">
                    <div class="chat__message-name">${data.fullname} is typing</div>
                    <div class="chat__message-typing">
                        <div class="typing-indicator">
                            <span></span><span></span><span></span>
                            </div></div></div></div>
            `

            div.innerHTML = htmlString;
            if (!typingEl.querySelector('.chat__messages-typing')) {
                typingEl.appendChild(div);
            }
            const chatBody = document.querySelector('.chat__body');
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    });

}

// Emoji picker
const emojiButton = document.querySelector('.chat-emoji');
const emojiPicker = document.querySelector('.emoji-picker');

if (emojiButton && emojiPicker) {
    emojiButton.addEventListener('click', () => {
        emojiPicker.classList.toggle('active');
    });

    emojiPicker.addEventListener('emoji-click', event => {
        const emoji = event.detail.unicode;
        chatInput.value += emoji;
    });

    document.addEventListener('click', (event) => {
        const clickedOutside =
            !emojiPicker.contains(event.target) &&
            !emojiButton.contains(event.target);

        if (clickedOutside) {
            emojiPicker.classList.remove('active');
        }
    });
}

