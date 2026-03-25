const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const PricingMultiplier = require('../models/PricingMultiplier');
const Recommendation = require('../models/Recommendation');

const PricingRule = require('../models/PricingRule');

// Analytics: Revenue and Occupancy
const getAnalytics = async (req, res, next) => {
    try {
        console.log('Fetching analytics data...');
        const bookings = await Booking.find({ status: 'confirmed' });
        console.log(`Found ${bookings.length} confirmed bookings`);

        // Basic revenue calculation
        const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0);

        // Mock occupancy forecasting for next 30 days
        const occupancyData = Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            rate: Math.floor(Math.random() * 40) + 60 // Mock rate between 60-100%
        }));

        res.json({
            totalRevenue,
            occupancyData,
            revenueForecast: totalRevenue * 1.4,
            guestSentiment: {
                score: 88,
                trend: '+4%',
                topKeywords: ['Tranquil', 'Authentic', 'Impeccable Service', 'Heritage'],
                recentFeedback: [
                    { guest: 'Elowen T.', comment: 'The ritual induction was transformative.', sentiment: 'positive' },
                    { guest: 'Cyrus V.', comment: 'Exquisite attention to detail in the Grand Suite.', sentiment: 'positive' }
                ]
            }
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        next(error);
    }
};

// Pricing Multipliers
const getMultipliers = async (req, res, next) => {
    try {
        const multipliers = await PricingMultiplier.find({});
        res.json(multipliers);
    } catch (error) {
        next(error);
    }
};

const createMultiplier = async (req, res) => {
    try {
        const { multiplier, startDate, endDate, description } = req.body;
        const newMultiplier = new PricingMultiplier({ multiplier, startDate, endDate, description });
        await newMultiplier.save();
        res.status(201).json(newMultiplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pricing Rules (Dynamic Yield)
const getPricingRules = async (req, res) => {
    try {
        const rules = await PricingRule.find({});
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPricingRule = async (req, res) => {
    try {
        const { type, threshold, adjustment, description } = req.body;
        const rule = new PricingRule({ type, threshold, adjustment, description });
        await rule.save();
        res.status(201).json(rule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Recommendations
const getRecommendations = async (req, res, next) => {
    try {
        const recommendations = await Recommendation.find({});
        res.json(recommendations);
    } catch (error) {
        next(error);
    }
};

const createRecommendation = async (req, res) => {
    try {
        const { title, description, category, imageUrl, isFeatured } = req.body;
        const recommendation = new Recommendation({ title, description, category, imageUrl, isFeatured });
        await recommendation.save();
        res.status(201).json(recommendation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecommendation = async (req, res) => {
    try {
        const { title, description, category, imageUrl, isFeatured } = req.body;
        const recommendation = await Recommendation.findById(req.params.id);

        if (recommendation) {
            if (title) recommendation.title = title;
            if (description) recommendation.description = description;
            if (category) recommendation.category = category;
            if (imageUrl !== undefined) recommendation.imageUrl = imageUrl;
            if (isFeatured !== undefined) recommendation.isFeatured = isFeatured;

            const updatedRecommendation = await recommendation.save();
            res.json(updatedRecommendation);
        } else {
            res.status(404).json({ message: 'Recommendation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.id);

        if (recommendation) {
            await recommendation.deleteOne();
            res.json({ message: 'Recommendation removed' });
        } else {
            res.status(404).json({ message: 'Recommendation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog.find({}).populate('userId', 'name email').sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};

const Settings = require('../models/Settings');

const getSettings = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connecting/disconnected. Please try again in a moment.' });
        }
        const settings = await Settings.find({});
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        // Emit socket event for site-wide settings
        const io = req.app.get('io');
        if (io) {
            io.emit('settingUpdate', { key, value });
        }

        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAnalytics,
    getMultipliers,
    createMultiplier,
    getRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getPricingRules,
    createPricingRule,
    getAuditLogs,
    getSettings,
    updateSetting,
    changePassword
};
