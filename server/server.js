// Load environment variables (if dotenv is available)
try {
    require('dotenv').config();
} catch (err) {
    console.log('⚠️  dotenv not installed, using system environment variables');
}

const app = require('./app');
const connectDatabase = require('./config/database');
const logger = require('./config/logger');
const PORT = process.env.PORT || 4000;

// UncaughtException Error
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', {
        error: err.message,
        stack: err.stack
    });
    process.exit(1);
});

// Connect to MongoDB
connectDatabase();

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', {
        error: err.message,
        stack: err.stack
    });
    server.close(() => {
        process.exit(1);
    });
});
