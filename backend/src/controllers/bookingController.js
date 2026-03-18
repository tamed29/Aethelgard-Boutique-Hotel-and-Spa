const { z } = require('zod');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Settings = require('../models/Settings');
const { sendBookingConfirmation, sendNewBookingAlertToAdmin } = require('../services/emailService');

const bookingSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    addons: z.array(z.string()).optional(),
    specialRequests: z.string().optional()
});

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const validated = bookingSchema.parse(req.body);
        const { roomId, checkIn, checkOut, addons, specialRequests } = validated;

        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404);
            throw new Error('Room not found');
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.ceil((checkOut - checkIn) / msPerDay);
        if (days <= 0) {
            res.status(400);
            throw new Error('Invalid dates selected');
        }

        const peakSetting = await Settings.findOne({ key: 'peakSeasonMultiplier' });
        const multiplier = peakSetting ? parseFloat(peakSetting.value) || 1 : 1;

        let basePrice = room.price * days * multiplier;
        const addonCosts = { 'Champagne on arrival': 120, 'Spa package': 250, 'Airport transfer': 80 };
        const addonsPrice = addons ? addons.reduce((sum, a) => sum + (addonCosts[a] || 50), 0) : 0;

        const totalPrice = basePrice + addonsPrice;

        const booking = await Booking.create({
            user: req.user._id,
            room: roomId,
            checkIn,
            checkOut,
            totalPrice,
            status: 'confirmed', // Assuming direct confirmation for now unless payment gateway is added
            addons: addons || [],
            specialRequests
        });

        const fullBooking = await Booking.findById(booking._id).populate('user', 'name email').populate('room', 'name price');

        // Non-blocking email sending
        sendBookingConfirmation(fullBooking, req.user, room).catch(console.error);
        sendNewBookingAlertToAdmin(fullBooking, req.user, room).catch(console.error);

        const io = req.app.get('io');
        if (io) {
            io.emit('newBooking', fullBooking);
            io.emit('occupancyUpdate', { roomId, checkIn, checkOut });
        }

        res.status(201).json(fullBooking);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.errors });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
    const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('room', 'name')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('room', 'name images status view bedType')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        booking.status = status;
        const updatedBooking = await booking.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('bookingUpdate', updatedBooking);
        }

        res.json(updatedBooking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
};

module.exports = { createBooking, getBookings, getMyBookings, updateBookingStatus };
