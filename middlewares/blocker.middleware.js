const requestIp = require('request-ip');
const blockerService = require('../services/blocker.service');
const redirectService = require('../services/redirect.service');
const { ROUTES } = require('../config/constants');

module.exports = function blockerMiddleware(req, res, next) {
    // Exclude the admin panel and its API from blocker check so admin can always access
    if (req.path.startsWith(ROUTES.ADMIN)) {
        return next();
    }

    const clientIp = requestIp.getClientIp(req);
    if (blockerService.isIpBlocked(clientIp)) {
        return res.redirect(redirectService.getUrl());
    }

    next();
};
