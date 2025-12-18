const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/admin.middleware');
const {
    getAllUsers,
    getUserDetails,
    updateUserLimit,
    suspendUser,
    getFlaggedContent,
    resolveFlag
} = require('../controllers/admin.controller');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/limit', updateUserLimit);
router.put('/users/:id/suspend', suspendUser);

// Flagged Content Routes
router.get('/flagged', getFlaggedContent);
router.put('/flagged/:id/resolve', resolveFlag);

module.exports = router;
