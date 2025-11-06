const mongoose = require('mongoose');
const logger = require('./logger');
const { updateDbConnectionStatus } = require('./metrics');

const connectDatabase = () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        logger.warn('MongoDB URI not found in environment variables');
        logger.warn('Please configure MONGO_URI in .env file');
        updateDbConnectionStatus(false);
        return;
    }

    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((data) => {
        logger.info('✅ MongoDB Connected', {
            host: data.connection.host,
            database: data.connection.name
        });
        updateDbConnectionStatus(true);
    })
    .catch((err) => {
        logger.error('❌ MongoDB Connection Error:', {
            error: err.message,
            stack: err.stack
        });
        updateDbConnectionStatus(false);
    });

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        updateDbConnectionStatus(false);
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        updateDbConnectionStatus(true);
    });
}

module.exports = connectDatabase;