const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected, socket id: ' + socket.id);
    socket.emit('SERVER_SEND_SOCKET_ID', socket.id);
    
    socket.on('CLIENT_SEND_MESSAGE', (msg) => {
        socket.broadcast.emit('SERVER_RETURN_MESSAGE', msg);
    });
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});