const {
    calculatePersonalAnalytics,
    calculateSystemAnalytics,
    getWasteTrends,
} = require('../services/analytics.service');

// @desc    Get personal analytics for logged-in user
// @route   GET /api/analytics/personal
// @access  Private
const getPersonalAnalytics = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        const analytics = await calculatePersonalAnalytics(req.user._id, period);

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        console.error('Personal analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching personal analytics',
            error: error.message,
        });
    }
};

// @desc    Get waste trends for logged-in user
// @route   GET /api/analytics/trends
// @access  Private
const getPersonalTrends = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const trends = await getWasteTrends(req.user._id, parseInt(days));

        res.status(200).json({
            success: true,
            data: trends,
        });
    } catch (error) {
        console.error('Trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching waste trends',
            error: error.message,
        });
    }
};

module.exports = {
    getPersonalAnalytics,
    getPersonalTrends,
};
