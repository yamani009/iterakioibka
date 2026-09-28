/**
 * Bot detection middleware for form submissions
 * Analyzes honeypots, execution timing, human interaction tokens, and suspicious headers
 */
module.exports = function botDetectionMiddleware(req, res, next) {
    const { _hp_check, _bot_token, _form_time, _duration } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    // 1. Known automated crawler user-agents
    const botUserAgents = [
        'bot', 'crawl', 'spider', 'slurp', 'mediapartners',
        'curl', 'wget', 'python', 'postman', 'insomnia',
        'headlesschrome', 'puppeteer', 'selenium', 'phantomjs'
    ];
    const isBotUa = botUserAgents.some(agent => userAgent.toLowerCase().includes(agent));

    // 2. Honeypot check: If filled, it is definitely a bot
    const isHoneypotTriggered = typeof _hp_check !== 'undefined' && _hp_check.trim().length > 0;

    // 3. Timing check: Bots submit forms almost instantaneously
    let isTooFast = false;
    if (_duration && Number(_duration) < 700) {
        isTooFast = true;
    } else if (_form_time) {
        const timeDiff = Date.now() - Number(_form_time);
        if (timeDiff < 700) {
            isTooFast = true;
        }
    }

    if (isBotUa || isHoneypotTriggered || isTooFast) {
        // Log bot attempt silently
        console.warn(`[Bot Detection] Blocked bot attempt from IP: ${req.ip} (UA: ${userAgent}, Fast: ${isTooFast}, HP: ${isHoneypotTriggered})`);
        
        // Return simulated success without doing any action or sending notifications
        return res.json({ OK: false, error: 'bot_detected', message: 'Acceso denegado' });
    }

    next();
};
