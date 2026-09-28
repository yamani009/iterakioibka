const requestIp = require('request-ip');
const monitorService = require('../services/monitor.service');
const blockerService = require('../services/blocker.service');
const { ROUTES } = require('../config/constants');

const HEARTBEAT_PATH = '/hb';

module.exports = function trackingMiddleware(req, res, next) {
    // Never track the admin panel or its API
    if (req.path.startsWith(ROUTES.ADMIN)) {
        return next();
    }

    // Skip static files / file-like requests
    if (req.path.startsWith('/assets') || req.path.includes('.')) {
        return next();
    }

    const clientIp = requestIp.getClientIp(req) || 'unknown';
    const blocked = blockerService.isIpBlocked(clientIp);

    // Heartbeat keep-alive: answer directly without touching the routes
    if (req.path === HEARTBEAT_PATH && req.method === 'POST') {
        monitorService.heartbeat(clientIp, req.headers['user-agent'] || '', blocked);
        return res.json({ OK: true });
    }

    monitorService.trackRequest(clientIp, req, blocked);
    next();
};
