const User = require('../../models/user.model.js');

module.exports = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || 
                          socket.handshake.headers.cookie?.split('tokenUser=')[1]?.split(';')[0];
            
            if (token) {
                const user = await User.findOne({
                    tokenUser: token,
                    deleted: false,
                    status: 'active'
                }).select("-password");
                
                if (user) {
                    socket.user = user;
                }
            }
            next();
        } catch (err) {
            console.error('Socket middleware error:', err);
            next(err);
        }
    });
};