const FoodUpload = require('../models/FoodUpload.model');
const User = require('../models/User.model');
const WasteAnalytics = require('../models/WasteAnalytics.model');

/**
 * Calculate personal analytics for a user
 */
const calculatePersonalAnalytics = async (userId, period = 'monthly') => {
    try {
        const uploads = await FoodUpload.find({ userId });

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
        }

        const periodUploads = uploads.filter(
            (upload) => upload.createdAt >= startDate
        );

        // Calculate metrics
        const metrics = {
            totalUploads: periodUploads.length,
            wastePreventedGrams: 0,
            wastedGrams: 0,
            reusedCount: 0,
            donatedCount: 0,
            discardedCount: 0,
            storedCount: 0,
            pendingCount: 0,
        };

        const foodTypeBreakdown = {};

        periodUploads.forEach((upload) => {
            // Count actions
            switch (upload.userAction) {
                case 'reused':
                    metrics.reusedCount++;
                    metrics.wastePreventedGrams += upload.quantity || 0;
                    break;
                case 'donated':
                    metrics.donatedCount++;
                    metrics.wastePreventedGrams += upload.quantity || 0;
                    break;
                case 'stored':
                    metrics.storedCount++;
                    metrics.wastePreventedGrams += upload.quantity || 0;
                    break;
                case 'discarded':
                    metrics.discardedCount++;
                    metrics.wastedGrams += upload.quantity || 0;
                    break;
                case 'pending':
                    metrics.pendingCount++;
                    break;
            }

            // Food type breakdown
            const foodType = upload.foodType || 'Unknown';
            if (!foodTypeBreakdown[foodType]) {
                foodTypeBreakdown[foodType] = {
                    count: 0,
                    wasteAmount: 0,
                    preventedAmount: 0,
                };
            }
            foodTypeBreakdown[foodType].count++;
            if (upload.wasteStatus === 'wasted') {
                foodTypeBreakdown[foodType].wasteAmount += upload.quantity || 0;
            } else if (upload.wasteStatus === 'prevented') {
                foodTypeBreakdown[foodType].preventedAmount += upload.quantity || 0;
            }
        });

        // Calculate waste prevention rate
        const totalProcessed = metrics.reusedCount + metrics.donatedCount + metrics.storedCount + metrics.discardedCount;
        const wastePreventionRate = totalProcessed > 0
            ? ((metrics.reusedCount + metrics.donatedCount + metrics.storedCount) / totalProcessed) * 100
            : 0;

        return {
            period,
            startDate,
            endDate: new Date(),
            metrics,
            wastePreventionRate: Math.round(wastePreventionRate),
            foodTypeBreakdown: Object.entries(foodTypeBreakdown).map(
                ([type, data]) => ({
                    type,
                    ...data,
                })
            ),
        };
    } catch (error) {
        throw new Error(`Analytics calculation failed: ${error.message}`);
    }
};

/**
 * Calculate system-wide analytics (for admin)
 */
const calculateSystemAnalytics = async (period = 'monthly') => {
    try {
        const now = new Date();
        let startDate;

        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
        }

        // Get all uploads in period
        const uploads = await FoodUpload.find({
            createdAt: { $gte: startDate },
        });

        // Get total users
        const totalUsers = await User.countDocuments();
        const activeUsers = await FoodUpload.distinct('userId', {
            createdAt: { $gte: startDate },
        });

        // Calculate metrics
        const metrics = {
            totalUsers,
            activeUsers: activeUsers.length,
            totalUploads: uploads.length,
            wastePreventedGrams: 0,
            wastedGrams: 0,
            reusedCount: 0,
            donatedCount: 0,
            discardedCount: 0,
        };

        uploads.forEach((upload) => {
            if (upload.wasteStatus === 'prevented') {
                metrics.wastePreventedGrams += upload.quantity || 0;
            } else if (upload.wasteStatus === 'wasted') {
                metrics.wastedGrams += upload.quantity || 0;
            }

            switch (upload.userAction) {
                case 'reused':
                    metrics.reusedCount++;
                    break;
                case 'donated':
                    metrics.donatedCount++;
                    break;
                case 'discarded':
                    metrics.discardedCount++;
                    break;
            }
        });

        // Get top contributors
        const topContributors = await User.find()
            .sort({ 'stats.totalUploads': -1 })
            .limit(10)
            .select('name email stats');

        return {
            period,
            startDate,
            endDate: new Date(),
            metrics,
            topContributors,
        };
    } catch (error) {
        throw new Error(`System analytics calculation failed: ${error.message}`);
    }
};

/**
 * Get waste trends over time
 */
const getWasteTrends = async (userId = null, days = 30) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const query = { createdAt: { $gte: startDate } };
        if (userId) {
            query.userId = userId;
        }

        const uploads = await FoodUpload.find(query).sort({ createdAt: 1 });

        // Group by date
        const trendData = {};
        uploads.forEach((upload) => {
            const date = upload.createdAt.toISOString().split('T')[0];
            if (!trendData[date]) {
                trendData[date] = {
                    date,
                    uploads: 0,
                    prevented: 0,
                    wasted: 0,
                };
            }
            trendData[date].uploads++;
            if (upload.wasteStatus === 'prevented') {
                trendData[date].prevented += upload.quantity || 0;
            } else if (upload.wasteStatus === 'wasted') {
                trendData[date].wasted += upload.quantity || 0;
            }
        });

        return Object.values(trendData);
    } catch (error) {
        throw new Error(`Trend calculation failed: ${error.message}`);
    }
};

module.exports = {
    calculatePersonalAnalytics,
    calculateSystemAnalytics,
    getWasteTrends,
};
