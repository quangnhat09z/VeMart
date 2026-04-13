// const socket = window.socket = io();

// const form = document.getElementById('chat-form');
// const input = document.getElementById('chat-input');
// const messages = document.getElementById('chat-messages');

// if (form && input && messages) {
//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         if (input.value) {
//             socket.emit('CLIENT_SEND_MESSAGE', input.value);
//             input.value = '';
//         }
//     });

//     socket.on('SERVER_RETURN_MESSAGE', (msg) => {
//         const item = document.createElement('div');
//         item.className = 'chat__message chat__message--bot';
//         const contentEl = document.createElement('div');
//         contentEl.className = 'chat__message-content';
//         contentEl.textContent = msg;
//         item.appendChild(contentEl);
//         messages.appendChild(item);
//         messages.scrollTop = messages.scrollHeight;
//     });
// }