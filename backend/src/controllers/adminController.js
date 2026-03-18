const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const PricingMultiplier = require('../models/PricingMultiplier');
const Recommendation = require('../models/Recommendation');

// Analytics: Revenue and Occupancy
const getAnalytics = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'confirmed' });

        // Basic revenue calculation
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        // Mock occupancy forecasting for next 30 days
        const occupancyData = Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            rate: Math.floor(Math.random() * 40) + 60 // Mock rate between 60-100%
        }));

        res.json({
            totalRevenue,
            occupancyData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pricing Multipliers
const getMultipliers = async (req, res) => {
    const multipliers = await PricingMultiplier.find({});
    res.json(multipliers);
};

const createMultiplier = async (req, res) => {
    const { multiplier, startDate, endDate, description } = req.body;
    const newMultiplier = new PricingMultiplier({ multiplier, startDate, endDate, description });
    await newMultiplier.save();
    res.status(201).json(newMultiplier);
};

// Recommendations
const getRecommendations = async (req, res) => {
    const recommendations = await Recommendation.find({});
    res.json(recommendations);
};

const createRecommendation = async (req, res) => {
    const { title, description, category, imageUrl, isFeatured } = req.body;
    const recommendation = new Recommendation({ title, description, category, imageUrl, isFeatured });
    await recommendation.save();
    res.status(201).json(recommendation);
};

module.exports = {
    getAnalytics,
    getMultipliers,
    createMultiplier,
    getRecommendations,
    createRecommendation
};
