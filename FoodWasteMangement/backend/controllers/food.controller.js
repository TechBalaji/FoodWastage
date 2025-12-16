const FoodUpload = require('../models/FoodUpload.model');
const User = require('../models/User.model');
const { analyzeFoodImage } = require('../services/ai.service');
const path = require('path');
const fs = require('fs');

// @desc    Upload and analyze food image
// @route   POST /api/food/upload
// @access  Private
const uploadFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file',
            });
        }

        const { quantity, notes, foodType } = req.body;

        // Get image path and URL
        const imagePath = req.file.path;
        const imageUrl = `/uploads/${req.file.filename}`;

        // Analyze image with AI
        console.log('🤖 Analyzing food image with AI...');
        const aiAnalysis = await analyzeFoodImage(imagePath);

        // Create food upload record
        const foodUpload = await FoodUpload.create({
            userId: req.user._id,
            imageUrl,
            imagePath,
            quantity: quantity ? parseInt(quantity) : undefined,
            notes,
            foodType: foodType || aiAnalysis.data.foodType,
            analysis: {
                edibilityStatus: aiAnalysis.data.edibilityStatus,
                confidence: aiAnalysis.data.confidence,
                spoilageIndicators: aiAnalysis.data.spoilageIndicators,
                estimatedShelfLife: aiAnalysis.data.estimatedShelfLife,
                aiResponse: aiAnalysis.data.summary,
            },
            suggestions: {
                reuseIdeas: aiAnalysis.data.reuseIdeas,
                recipes: aiAnalysis.data.recipes,
                storageTips: aiAnalysis.data.storageTips,
                donationOptions: aiAnalysis.data.donationOptions,
            },
        });

        // Update user stats
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.totalUploads': 1 },
            $set: { 'stats.lastUploadDate': new Date() },
        });

        res.status(201).json({
            success: true,
            message: 'Food uploaded and analyzed successfully',
            data: foodUpload,
        });
    } catch (error) {
        console.error('Upload error:', error);
        // Clean up uploaded file if there was an error
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error uploading and analyzing food',
            error: error.message,
        });
    }
};

// @desc    Get user's food upload history
// @route   GET /api/food/history
// @access  Private
const getFoodHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, action } = req.query;

        const query = { userId: req.user._id };

        // Add filters if provided
        if (status) {
            query['analysis.edibilityStatus'] = status;
        }
        if (action) {
            query.userAction = action;
        }

        const uploads = await FoodUpload.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await FoodUpload.countDocuments(query);

        res.status(200).json({
            success: true,
            data: uploads,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching food history',
            error: error.message,
        });
    }
};

// @desc    Get specific food upload details
// @route   GET /api/food/:id
// @access  Private
const getFoodById = async (req, res) => {
    try {
        const foodUpload = await FoodUpload.findById(req.params.id);

        if (!foodUpload) {
            return res.status(404).json({
                success: false,
                message: 'Food upload not found',
            });
        }

        // Check if user owns this upload or is admin
        if (
            foodUpload.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource',
            });
        }

        res.status(200).json({
            success: true,
            data: foodUpload,
        });
    } catch (error) {
        console.error('Get food by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching food upload',
            error: error.message,
        });
    }
};

// @desc    Update user action on food upload
// @route   PUT /api/food/:id/action
// @access  Private
const updateFoodAction = async (req, res) => {
    try {
        const { action, quantity } = req.body;

        const validActions = ['reused', 'donated', 'discarded', 'stored', 'pending'];
        if (!validActions.includes(action)) {
            return res.status(400).json({
                success: false,
                message: `Invalid action. Must be one of: ${validActions.join(', ')}`,
            });
        }

        const foodUpload = await FoodUpload.findById(req.params.id);

        if (!foodUpload) {
            return res.status(404).json({
                success: false,
                message: 'Food upload not found',
            });
        }

        // Check if user owns this upload
        if (foodUpload.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this resource',
            });
        }

        // Update action and quantity if provided
        foodUpload.userAction = action;
        if (quantity) {
            foodUpload.quantity = parseInt(quantity);
        }

        await foodUpload.save();

        // Update user stats if waste was prevented
        if (['reused', 'donated', 'stored'].includes(action) && foodUpload.quantity) {
            await User.findByIdAndUpdate(req.user._id, {
                $inc: { 'stats.totalWastePrevented': foodUpload.quantity },
            });
        }

        res.status(200).json({
            success: true,
            message: 'Food action updated successfully',
            data: foodUpload,
        });
    } catch (error) {
        console.error('Update action error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating food action',
            error: error.message,
        });
    }
};

// @desc    Delete food upload
// @route   DELETE /api/food/:id
// @access  Private
const deleteFoodUpload = async (req, res) => {
    try {
        const foodUpload = await FoodUpload.findById(req.params.id);

        if (!foodUpload) {
            return res.status(404).json({
                success: false,
                message: 'Food upload not found',
            });
        }

        // Check if user owns this upload or is admin
        if (
            foodUpload.userId.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this resource',
            });
        }

        // Delete image file
        if (foodUpload.imagePath && fs.existsSync(foodUpload.imagePath)) {
            fs.unlinkSync(foodUpload.imagePath);
        }

        await foodUpload.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Food upload deleted successfully',
        });
    } catch (error) {
        console.error('Delete food error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting food upload',
            error: error.message,
        });
    }
};

module.exports = {
    uploadFood,
    getFoodHistory,
    getFoodById,
    updateFoodAction,
    deleteFoodUpload,
};
