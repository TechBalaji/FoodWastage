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

        const { quantity, notes, foodType, country, state } = req.body;

        // Get image path and URL
        const imagePath = req.file.path;
        const imageUrl = `/uploads/${req.file.filename}`;

        const userLocation = (country && state) ? `${state}, ${country}` : 'Global';

        // Analyze image with AI (text-based analysis using food type)
        console.log(`🤖 Analyzing food image with AI (Location: ${userLocation})...`);
        const aiAnalysis = await analyzeFoodImage(imagePath, foodType || 'leftover food', userLocation);

        // Create food upload record
        const foodUpload = await FoodUpload.create({
            userId: req.user._id,
            imageUrl,
            imagePath,
            quantity: quantity ? parseInt(quantity) : undefined,
            notes,
            foodType: foodType || aiAnalysis.data.foodType,
            country: country || 'Unknown',
            state: state || 'Unknown',
            analysis: {
                edibilityStatus: aiAnalysis.data.edibilityStatus,
                confidence: aiAnalysis.data.confidence,
                spoilageIndicators: aiAnalysis.data.spoilageIndicators,
                estimatedShelfLife: aiAnalysis.data.estimatedShelfLife,
                aiResponse: aiAnalysis.data.summary,
                sustainabilityScore: aiAnalysis.data.sustainabilityScore, // New field
                compostable: aiAnalysis.data.compostable, // New field
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

    } catch (error) {
        console.error('Delete food error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting food upload',
            error: error.message,
        });
    }
};

// @desc    Delete multiple food uploads
// @route   POST /api/food/batch-delete
// @access  Private
const deleteBatch = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of IDs to delete',
            });
        }

        // Find items to get image paths
        const foodsToDelete = await FoodUpload.find({
            _id: { $in: ids },
            userId: req.user._id // Security: ensure user owns these items
        });

        // Delete images safely
        foodsToDelete.forEach(food => {
            if (food.imagePath && fs.existsSync(food.imagePath)) {
                try {
                    fs.unlinkSync(food.imagePath);
                } catch (err) {
                    console.error(`Warning: Failed to delete file ${food.imagePath}`, err);
                }
            }
        });

        // Delete database records
        console.log(`🗑️ Batch deleting ${ids.length} items for user ${req.user._id}`);
        const result = await FoodUpload.deleteMany({
            _id: { $in: ids },
            userId: req.user._id
        });
        console.log(`✅ Deleted count: ${result.deletedCount}`);

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} items`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Batch delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting items',
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
    deleteBatch
};
