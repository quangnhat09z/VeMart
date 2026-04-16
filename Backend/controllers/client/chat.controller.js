const ChatUser = require('../../models/chatUser.model.js');
const User = require('../../models/user.model.js');

// [GET] /chat
module.exports.index = async (req, res) => {
    const chats = await ChatUser.find();

    for (let chat of chats) {
        if (chat.user_id) {
            const userInfo = await User.findById(chat.user_id).select('fullname');
            chat.infoUser = userInfo ? userInfo.fullname : 'Unknown User';
        }

        if (chat.images && chat.images.length > 0) {
            chat.images = chat.images.map((img) => {
                const buffer =
                    img?.buffer ||
                    img?.data ||
                    img?.buffer?.buffer ||
                    img?.data?.buffer;

                if (!buffer) return null;

                const base64 = Buffer.from(buffer).toString('base64');
                const mimeType = img?.mimeType || 'image/jpeg';
                return `data:${mimeType};base64,${base64}`;
            }).filter(Boolean);
        }
    }

    res.render('client/pages/chat/index', {
        title: 'Chat with us',
        chats: chats
    });
}

module.exports.initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected, socket id: ' + socket.id);

        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            try {
                // Lưu vào database
                const user = socket.user || null;
                const chat = new ChatUser({
                    user_id: user ? user._id : null,
                    content: data.content,
                    images: data.images
                });
                await chat.save();
                console.log('Received message from client: ' + data.content);

                // Phát lại cho tất cả client
                io.emit('SERVER_RETURN_MESSAGE', {
                    content: data.content,
                    images: data.images,
                    user_id: user ? user._id : null,
                    fullname: user ? user.fullname : 'Guest',
                    // timestamp: chat.createdAt
                });
            } catch (err) {
                console.error('Error:', err);
            }
        });

        // typing
        socket.on('CLIENT_SEND_TYPING', (isTyping) => {
            const user = socket.user || null;
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                user_id: user ? user._id : null,
                fullname: user ? user.fullname : 'Guest',
                isTyping: isTyping
            });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}