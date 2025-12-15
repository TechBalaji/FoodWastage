const express = require('express');
const {
    getPersonalAnalytics,
    getPersonalTrends,
} = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Personal analytics
router.get('/personal', getPersonalAnalytics);
router.get('/trends', getPersonalTrends);

module.exports = router;
