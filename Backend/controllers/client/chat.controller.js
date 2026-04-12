const ChatUser = require('../../models/chatUser.model.js');

// [GET] /chat
module.exports.index = (req, res) => {
    res.render('client/pages/chat/index', {
        title: 'Chat with us',
    });
}

module.exports.initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected, socket id: ' + socket.id);

        socket.on('CLIENT_SEND_MESSAGE', async (message) => {
            try {
                const user = socket.user || null;

                const chat = new ChatUser({
                    user_id: user ? user._id : null,
                    content: message,
                });
                await chat.save();

                console.log('Received message from client: ' + message);
            } catch (err) {
                console.error('Error:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}