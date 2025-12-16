const mongoose = require('mongoose');

const wasteAnalyticsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        period: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            required: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        metrics: {
            totalUploads: {
                type: Number,
                default: 0,
            },
            wastePreventedGrams: {
                type: Number,
                default: 0,
            },
            wastedGrams: {
                type: Number,
                default: 0,
            },
            reusedCount: {
                type: Number,
                default: 0,
            },
            donatedCount: {
                type: Number,
                default: 0,
            },
            discardedCount: {
                type: Number,
                default: 0,
            },
        },
        foodTypeBreakdown: [
            {
                type: String,
                count: Number,
                wasteAmount: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
wasteAnalyticsSchema.index({ userId: 1, period: 1, date: -1 });

module.exports = mongoose.model('WasteAnalytics', wasteAnalyticsSchema);
