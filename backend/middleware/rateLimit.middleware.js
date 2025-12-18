const User = require('../models/User.model');

const checkDailyLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check for suspension
        if (user.status && user.status.isSuspended) {
            if (user.status.suspensionEndDate && new Date() < user.status.suspensionEndDate) {
                return res.status(403).json({
                    success: false,
                    message: `Account suspended until ${user.status.suspensionEndDate.toLocaleDateString()}`
                });
            } else {
                // Auto-unsuspend if time passed
                user.status.isSuspended = false;
                user.status.suspensionEndDate = null;
                await user.save();
            }
        }

        const today = new Date();
        const lastRequest = new Date(user.usage.lastRequestDate);

        // Reset if it's a new day (simple check: different day/month/year)
        const isNewDay =
            today.getDate() !== lastRequest.getDate() ||
            today.getMonth() !== lastRequest.getMonth() ||
            today.getFullYear() !== lastRequest.getFullYear();

        if (isNewDay) {
            user.usage.dailyRequests = 0;
            user.usage.lastRequestDate = today;
        }

        // Check Limit
        if (user.usage.dailyRequests >= user.usage.maxDailyRequests) {
            return res.status(429).json({
                success: false,
                message: `Daily limit reached (${user.usage.maxDailyRequests} requests/day). Please try again tomorrow.`
            });
        }

        // Attach user object to req to save a DB call later if needed, 
        // but typically we just increment in the controller or a post-middleware.
        // For accurate counting, we should increment HERE or just let the controller do it?
        // Better to increment here to "reserve" the slot, or wait for success?
        // User requested "requests he sent", implying attempts. Let's increment here.

        user.usage.dailyRequests += 1;
        user.usage.lastRequestDate = today;
        await user.save();

        next();

    } catch (error) {
        console.error('Rate Limit Error:', error);
        res.status(500).json({ success: false, message: 'Server error checking limits' });
    }
};

module.exports = { checkDailyLimit };
