const express = require('express');
const {
    getAllUsers,
    getUserById,
    getAllUploads,
    getSystemAnalytics,
    getSystemTrends,
    generateReport,
    deleteUser,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/admin.middleware');

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Upload monitoring
router.get('/uploads', getAllUploads);

// System analytics
router.get('/analytics', getSystemAnalytics);
router.get('/trends', getSystemTrends);
router.get('/reports', generateReport);

module.exports = router;
