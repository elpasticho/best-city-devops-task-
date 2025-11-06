const client = require('prom-client');
const logger = require('./logger');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({
    register,
    prefix: 'bestcity_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// Custom Metrics

// HTTP Request Duration
const httpRequestDuration = new client.Histogram({
    name: 'bestcity_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
    registers: [register],
});

// HTTP Request Counter
const httpRequestCounter = new client.Counter({
    name: 'bestcity_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

// Active Connections Gauge
const activeConnections = new client.Gauge({
    name: 'bestcity_active_connections',
    help: 'Number of active connections',
    registers: [register],
});

// Database Connection Status
const dbConnectionStatus = new client.Gauge({
    name: 'bestcity_db_connection_status',
    help: 'Database connection status (1 = connected, 0 = disconnected)',
    registers: [register],
});

// Notes API Metrics
const notesCreated = new client.Counter({
    name: 'bestcity_notes_created_total',
    help: 'Total number of notes created',
    registers: [register],
});

const notesDeleted = new client.Counter({
    name: 'bestcity_notes_deleted_total',
    help: 'Total number of notes deleted',
    registers: [register],
});

const notesUpdated = new client.Counter({
    name: 'bestcity_notes_updated_total',
    help: 'Total number of notes updated',
    registers: [register],
});

const notesRetrieved = new client.Counter({
    name: 'bestcity_notes_retrieved_total',
    help: 'Total number of notes retrieved',
    registers: [register],
});

// Error Counter
const errorCounter = new client.Counter({
    name: 'bestcity_errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'route'],
    registers: [register],
});

// Database Query Duration
const dbQueryDuration = new client.Histogram({
    name: 'bestcity_db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
});

// Middleware to track HTTP metrics
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    // Increment active connections
    activeConnections.inc();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;

        // Record metrics
        httpRequestDuration.observe(
            {
                method: req.method,
                route: route,
                status_code: res.statusCode,
            },
            duration
        );

        httpRequestCounter.inc({
            method: req.method,
            route: route,
            status_code: res.statusCode,
        });

        // Decrement active connections
        activeConnections.dec();
    });

    next();
};

// Function to update database connection status
const updateDbConnectionStatus = (status) => {
    dbConnectionStatus.set(status ? 1 : 0);
    logger.info('Database connection status updated', { connected: status });
};

// Export metrics
module.exports = {
    register,
    metricsMiddleware,
    updateDbConnectionStatus,
    metrics: {
        httpRequestDuration,
        httpRequestCounter,
        activeConnections,
        dbConnectionStatus,
        notesCreated,
        notesDeleted,
        notesUpdated,
        notesRetrieved,
        errorCounter,
        dbQueryDuration,
    },
};
