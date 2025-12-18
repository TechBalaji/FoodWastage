const User = require('../models/User.model');
const FoodUpload = require('../models/FoodUpload.model');

// @desc    Get all users with stats
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get recent uploads for context
        const recentUploads = await FoodUpload.find({ userId: user._id })
            .select('foodType uploadDate analysis.edibilityStatus')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                ...user.toObject(),
                recentActivity: recentUploads
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update user limits and plan
// @route   PUT /api/admin/users/:id/limit
const updateUserLimit = async (req, res) => {
    try {
        const { maxDailyRequests } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 'usage.maxDailyRequests': maxDailyRequests },
            { new: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({
            success: true,
            message: `Limit updated to ${maxDailyRequests}`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
const suspendUser = async (req, res) => {
    try {
        const { days, reason } = req.body; // Use 'days' as requested text box input

        let suspensionEndDate = null;
        let isSuspended = false;

        if (days && parseInt(days) > 0) {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(days));
            suspensionEndDate = date;
            isSuspended = true;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                'status.isSuspended': isSuspended,
                'status.suspensionEndDate': suspensionEndDate,
                'status.notes': reason
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: isSuspended ? `Suspended for ${days} days` : 'Suspension lifted',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get flagged content
// @route   GET /api/admin/flagged
const getFlaggedContent = async (req, res) => {
    try {
        const { status } = req.query; // 'unresolved' or 'resolved'
        const query = { 'moderation.isFlagged': true };

        if (status) {
            query['moderation.flagStatus'] = status;
        }

        const flaggedItems = await FoodUpload.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: flaggedItems.length,
            data: flaggedItems
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Resolve flag
// @route   PUT /api/admin/flagged/:id/resolve
const resolveFlag = async (req, res) => {
    try {
        const { action } = req.body; // 'dismiss' (false positive) or 'confirm' (keep flagged but mark resolved)

        const update = {
            'moderation.flagStatus': 'resolved',
            'moderation.resolvedBy': req.user._id,
            'moderation.resolvedAt': new Date()
        };

        if (action === 'dismiss') {
            update['moderation.isFlagged'] = false; // It was a mistake, clear flag
        }

        const item = await FoodUpload.findByIdAndUpdate(req.params.id, update, { new: true });

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserDetails,
    updateUserLimit,
    suspendUser,
    getFlaggedContent,
    resolveFlag
};
