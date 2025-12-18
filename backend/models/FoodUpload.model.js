const mongoose = require('mongoose');

const foodUploadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        imagePath: {
            type: String,
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        },
        analysis: {
            edibilityStatus: {
                type: String,
                enum: ['safe', 'questionable', 'spoiled', 'unknown'],
                default: 'unknown',
            },
            confidence: {
                type: Number,
                min: 0,
                max: 100,
            },
            spoilageIndicators: [String],
            estimatedShelfLife: String,
            aiResponse: String,
            sustainabilityScore: {
                type: Number,
                min: 1,
                max: 10,
                default: 5
            },
            compostable: {
                type: Boolean,
                default: false
            }
        },
        // AI & Admin Moderation
        moderation: {
            isFlagged: {
                type: Boolean,
                default: false
            },
            flagReason: {
                type: String,
                default: null
            },
            flagStatus: {
                type: String,
                enum: ['unresolved', 'resolved'],
                default: 'unresolved'
            },
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            resolvedAt: Date
        },
        suggestions: {
            reuseIdeas: [String],
            recipes: [String],
            storageTips: [String],
            donationOptions: [String],
        },
        userAction: {
            type: String,
            enum: ['reused', 'donated', 'discarded', 'stored', 'pending'],
            default: 'pending',
        },
        foodType: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            min: 0,
            comment: 'Quantity in grams',
        },
        country: {
            type: String,
            required: true,
            default: 'Unknown'
        },
        state: {
            type: String,
            required: true,
            default: 'Unknown'
        },
        wasteStatus: {
            type: String,
            enum: ['prevented', 'wasted', 'pending'],
            default: 'pending',
        },
        notes: {
            type: String,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
foodUploadSchema.index({ userId: 1, createdAt: -1 });
foodUploadSchema.index({ wasteStatus: 1 });
foodUploadSchema.index({ 'analysis.edibilityStatus': 1 });

// Virtual for determining if waste was prevented
foodUploadSchema.virtual('wastePrevented').get(function () {
    return ['reused', 'donated', 'stored'].includes(this.userAction);
});

// Update waste status based on user action
foodUploadSchema.pre('save', function (next) {
    if (this.isModified('userAction')) {
        if (['reused', 'donated', 'stored'].includes(this.userAction)) {
            this.wasteStatus = 'prevented';
        } else if (this.userAction === 'discarded') {
            this.wasteStatus = 'wasted';
        }
    }
    next();
});

module.exports = mongoose.model('FoodUpload', foodUploadSchema);
