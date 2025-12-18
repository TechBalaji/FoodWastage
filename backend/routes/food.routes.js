const express = require('express');
const {
    uploadFood,
    getFoodHistory,
    getFoodById,
    updateFoodAction,
    deleteFoodUpload,
    deleteBatch
} = require('../controllers/food.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { checkDailyLimit } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Food upload and management
router.post('/upload', checkDailyLimit, upload.single('image'), uploadFood);
router.get('/history', getFoodHistory);
router.get('/:id', getFoodById);
router.put('/:id/action', updateFoodAction);
router.post('/batch-delete', deleteBatch);
router.delete('/:id', deleteFoodUpload);

module.exports = router;
