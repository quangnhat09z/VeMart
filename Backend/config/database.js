const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connect to MongoDB successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}