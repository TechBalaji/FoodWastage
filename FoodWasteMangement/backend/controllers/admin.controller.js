const User = require('../models/User.model');
const FoodUpload = require('../models/FoodUpload.model');
const {
    calculateSystemAnalytics,
    getWasteTrends,
} = require('../services/analytics.service');

// @desc    Get all users with stats
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

// @desc    Get specific user details with upload history
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Get user's uploads
        const uploads = await FoodUpload.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user analytics
        const { calculatePersonalAnalytics } = require('../services/analytics.service');
        const analytics = await calculatePersonalAnalytics(user._id, 'monthly');

        res.status(200).json({
            success: true,
            data: {
                user,
                recentUploads: uploads,
                analytics,
            },
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: error.message,
        });
    }
};

// @desc    Get all food uploads (monitoring)
// @route   GET /api/admin/uploads
// @access  Private/Admin
const getAllUploads = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, userId } = req.query;

        const query = {};
        if (status) {
            query['analysis.edibilityStatus'] = status;
        }
        if (userId) {
            query.userId = userId;
        }

        const uploads = await FoodUpload.find(query)
            .populate('userId', 'name email')
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
        console.error('Get all uploads error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching uploads',
            error: error.message,
        });
    }
};

// @desc    Get system-wide analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSystemAnalytics = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        const analytics = await calculateSystemAnalytics(period);

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('System analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system analytics',
            error: error.message,
        });
    }
};

// @desc    Get system-wide waste trends
// @route   GET /api/admin/trends
// @access  Private/Admin
const getSystemTrends = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const trends = await getWasteTrends(null, parseInt(days));

        res.status(200).json({
            success: true,
            data: trends,
        });
    } catch (error) {
        console.error('System trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system trends',
            error: error.message,
        });
    }
};

// @desc    Generate sustainability report
// @route   GET /api/admin/reports
// @access  Private/Admin
const generateReport = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        // Get comprehensive data
        const analytics = await calculateSystemAnalytics(period);
        const trends = await getWasteTrends(null, 30);

        // Get top waste preventers
        const topPreventers = await User.find()
            .sort({ 'stats.totalWastePrevented': -1 })
            .limit(10)
            .select('name email stats');

        // Calculate environmental impact (rough estimates)
        const totalWastePrevented = analytics.metrics.wastePreventedGrams;
        const co2Saved = (totalWastePrevented / 1000) * 2.5; // ~2.5kg CO2 per kg of food waste prevented
        const waterSaved = (totalWastePrevented / 1000) * 1000; // ~1000L water per kg of food

        const report = {
            period: analytics.period,
            generatedAt: new Date(),
            summary: {
                totalUsers: analytics.metrics.totalUsers,
                activeUsers: analytics.metrics.activeUsers,
                totalUploads: analytics.metrics.totalUploads,
                wastePreventedKg: (totalWastePrevented / 1000).toFixed(2),
                wastedKg: (analytics.metrics.wastedGrams / 1000).toFixed(2),
                wastePreventionRate: (
                    (analytics.metrics.wastePreventedGrams /
                        (analytics.metrics.wastePreventedGrams + analytics.metrics.wastedGrams)) *
                    100
                ).toFixed(1),
            },
            environmentalImpact: {
                co2SavedKg: co2Saved.toFixed(2),
                waterSavedLiters: waterSaved.toFixed(0),
                mealsPreserved: Math.floor(totalWastePrevented / 400), // ~400g per meal
            },
            topContributors: topPreventers,
            trends,
        };

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating report',
            error: error.message,
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users',
            });
        }

        // Delete user's uploads
        await FoodUpload.deleteMany({ userId: user._id });

        // Delete user
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getAllUploads,
    getSystemAnalytics,
    getSystemTrends,
    generateReport,
    deleteUser,
};
