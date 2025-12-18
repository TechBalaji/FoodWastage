const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        // Admin Management Fields
        usage: {
            dailyRequests: {
                type: Number,
                default: 0,
            },
            lastRequestDate: {
                type: Date,
                default: Date.now,
            },
            maxDailyRequests: {
                type: Number,
                default: 10, // Increased limit per user request
            },
        },
        status: {
            isSuspended: {
                type: Boolean,
                default: false,
            },
            suspensionEndDate: {
                type: Date,
            },
            plan: {
                type: String,
                enum: ['free', 'premium'],
                default: 'free',
            },
            notes: String, // Admin notes
        },
        stats: {
            totalUploads: {
                type: Number,
                default: 0,
            },
            totalWastePrevented: {
                type: Number,
                default: 0,
            },
            lastUploadDate: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
