// [GET] /chat
module.exports.index = (req, res) => {
    res.render('client/pages/chat/index', {
        title: 'Chat with us',
    });
}

module.exports.initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected, socket id: ' + socket.id);
        
        socket.on('CLIENT_SEND_MESSAGE', (message) => {
            console.log('Received message from client: ' + message);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}