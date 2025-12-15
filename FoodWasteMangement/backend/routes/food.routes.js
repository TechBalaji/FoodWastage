const express = require('express');
const {
    uploadFood,
    getFoodHistory,
    getFoodById,
    updateFoodAction,
    deleteFoodUpload,
} = require('../controllers/food.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Food upload and management
router.post('/upload', upload.single('image'), uploadFood);
router.get('/history', getFoodHistory);
router.get('/:id', getFoodById);
router.put('/:id/action', updateFoodAction);
router.delete('/:id', deleteFoodUpload);

module.exports = router;
