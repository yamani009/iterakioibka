const requestIp = require('request-ip');
const userActionService = require('../services/userAction.service');
const { ROUTES } = require('../config/constants');

// Applies a per-user redirect scheduled from the admin dashboard.
// Runs after tracking and before the blocker so the redirect takes
// precedence and the action is consumed on the visitor's next page request.
module.exports = function userActionMiddleware(req, res, next) {
    // Only ever fire on real page (document) requests, so a pending redirect is
    // not wasted on the admin panel, an XHR/post endpoint, or a sub-resource such
    // as /favicon.ico or /assets/*. This keeps the one-shot redirect reliable
    // instead of being consumed by a browser sub-request that arrives first.
    if (req.method !== 'GET') {
        return next();
    }
    if (req.path.startsWith(ROUTES.ADMIN)) {
        return next();
    }
    if (req.path.startsWith('/hb') || req.path.startsWith('/assets/') || req.path.includes('.')) {
        return next();
    }

    const clientIp = requestIp.getClientIp(req);
    if (!userActionService.has(clientIp)) {
        return next();
    }

    const target = userActionService.consume(clientIp);
    if (target) {
        return res.redirect(target);
    }

    return next();
};