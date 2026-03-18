const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc    Get all reviews
// @route   GET /api/reviews
const getReviews = async (req, res) => {
    // Optionally filter by roomId
    const { roomId } = req.query;
    const filter = roomId ? { room: roomId } : {};

    const reviews = await Review.find(filter)
        .populate('user', 'name')
        .populate('room', 'name')
        .sort({ createdAt: -1 });

    res.json(reviews);
};

// @desc    Create a new review
// @route   POST /api/reviews
const createReview = async (req, res) => {
    const { roomId, rating, comment } = req.body;

    // Check if the user has a confirmed booking for this room to set isVerifiedStay
    const pastBooking = await Booking.findOne({
        user: req.user._id,
        room: roomId,
        status: 'confirmed'
    });

    const isVerifiedStay = !!pastBooking;

    const review = await Review.create({
        user: req.user._id,
        room: roomId,
        rating,
        comment,
        isVerifiedStay
    });

    res.status(201).json(review);
};

module.exports = { getReviews, createReview };
