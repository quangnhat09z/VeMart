const chatRoutes = require('./chat.route.js');

module.exports = (app) => {
    app.use('/api/chat', chatRoutes);
}