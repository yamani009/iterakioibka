const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { ROUTES } = require('../config/constants');

// Admin panel view and IP blocking action
router.get(ROUTES.ADMIN, (req, res) => adminController.renderAdmin(req, res));
router.post(ROUTES.ADMIN, (req, res) => adminController.handleBlockAction(req, res));

// Live dashboard data (polling endpoint)
router.get(`${ROUTES.ADMIN}/api/stats`, (req, res) => adminController.getStats(req, res));

// Redirect URL settings
router.get(`${ROUTES.ADMIN}/api/redirect`, (req, res) => adminController.getRedirectUrl(req, res));
router.post(`${ROUTES.ADMIN}/api/redirect`, (req, res) => adminController.updateRedirectUrl(req, res));

// Per-user redirect scheduled from the dashboard
router.post(`${ROUTES.ADMIN}/api/user-redirect`, (req, res) => adminController.scheduleUserRedirect(req, res));

module.exports = router;
