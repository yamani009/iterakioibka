const path = require('path');
const express = require('express');
const session = require('express-session');

const config = require('./config');
const trackingMiddleware = require('./middlewares/tracking.middleware');
const blockerMiddleware = require('./middlewares/blocker.middleware');
const userActionMiddleware = require('./middlewares/userAction.middleware');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session Configuration
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Body Parsers & Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Visitor Tracking (live monitor) - runs before blocker so blocked IPs are still logged
app.use(trackingMiddleware);

// Per-user redirect scheduled from the dashboard
app.use(userActionMiddleware);

// Global IP Blocker Middleware
app.use(blockerMiddleware);

// Application Routes
app.use('/', routes);

// Global Error Handler
app.use(errorHandler);

// Process Safety: Catch unexpected errors gracefully
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

// Start Server
app.listen(config.PORT, () => {
    console.log(`[Server] Application running successfully on port: ${config.PORT}`);
});

module.exports = app;