const express = require('express');
const router = express.Router();

const pageRoutes = require('./pages.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

router.use('/', adminRoutes);
router.use('/', authRoutes);
router.use('/', pageRoutes);

module.exports = router;
