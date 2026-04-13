const ChatUser = require('../../models/chatUser.model.js');
const User = require('../../models/user.model.js');

// [GET] /chat
module.exports.index = async (req, res) => {
    const chats = await ChatUser.find();
    console.log(chats);
    for (let chat of chats) {
        if (chat.user_id) {
            const userInfo = await User.findById(chat.user_id).select('fullname');
            chat.infoUser = userInfo ? userInfo.fullname : 'Unknown User';
        }
    }
    console.log("Chat user IDs:", chats.map(chat => chat.user_id));
    console.log("Current user ID:", res.locals.user._id);
    res.render('client/pages/chat/index', {
        title: 'Chat with us',
        chats: chats
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