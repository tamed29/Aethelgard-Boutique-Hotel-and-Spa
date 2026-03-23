const { z } = require('zod');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Settings = require('../models/Settings');
const { sendBookingConfirmation, sendNewBookingAlertToAdmin } = require('../services/emailService');

const bookingSchema = z.object({
    roomType: z.string().min(1, "Room type is required"),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guestName: z.string().min(2, "Guest name is required"),
    guestEmail: z.string().email("Valid email required"),
    guestPhone: z.string().optional(),
    paymentMethod: z.string().optional(),
    guests: z.number().min(1).max(10).optional(),
    addons: z.array(z.string()).optional(),
    specialRequests: z.string().optional()
});

// @desc    Check availability for a room type or all room types
// @route   GET /api/bookings/availability?checkIn=...&checkOut=...
const checkAvailability = async (req, res) => {
    try {
        const { roomType, checkIn, checkOut } = req.query;
        if (!checkIn || !checkOut) {
            return res.status(400).json({ message: 'checkIn and checkOut are required' });
        }

        const query = roomType ? { roomType } : {};
        const rooms = await Room.find(query);
        
        if (roomType && rooms.length === 0) return res.status(404).json({ message: 'Room type not found' });

        const results = await Promise.all(rooms.map(async (room) => {
            const overlappingBookings = await Booking.find({
                room: room._id,
                status: 'confirmed',
                $or: [
                    { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
                ]
            });

            const availableUnitsCount = room.units.length - overlappingBookings.length;

            return {
                roomType: room.roomType,
                roomId: room._id,
                totalUnits: room.units.length,
                availableUnits: Math.max(0, availableUnitsCount),
                units: room.units.map(u => u.number),
                isAvailable: availableUnitsCount > 0
            };
        }));

        res.json(roomType ? results[0] : results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const mongoose = require('mongoose');

// @desc    Create new booking (picks first available room of requested type)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const validated = bookingSchema.parse(req.body);
        const { roomType, checkIn, checkOut, guestName, guestEmail, guestPhone, paymentMethod, guests, addons, specialRequests } = validated;

        // 1. Fetch Room Type and Units under transaction
        let room = await Room.findOne({ roomType }).session(session);
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: `Room type '${roomType}' not found in inventory cluster.` });
        }

        // 2. Conflict Guard: Find overlapping bookings for this room type
        const overlappingBookings = await Booking.find({
            room: room._id,
            status: 'confirmed',
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
            ]
        }).session(session);

        // 3. Select an available unit based on total capacity (Conflict Guard)
        if (overlappingBookings.length >= room.units.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({
                available: false,
                message: `All ${roomType} units are currently occupied for the selected dates.`
            });
        }

        // 4. Calculate Price
        const msPerDay = 1000 * 60 * 60 * 24;
        const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / msPerDay);
        if (days <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid dates selected' });
        }

        const peakSetting = await Settings.findOne({ key: 'peakSeasonMultiplier' }).catch(() => null);
        const multiplier = peakSetting ? parseFloat(peakSetting.value) || 1 : 1;

        const addonCosts = { champagne: 120, spa: 350, late_checkout: 75, airport_transfer: 80 };
        const addonsPrice = addons ? addons.reduce((sum, a) => sum + (addonCosts[a] || 50), 0) : 0;
        const totalPrice = (room.price * days * multiplier) + addonsPrice;

        // 5. Atomic Creation
        const booking = await Booking.create([{
            user: req.user ? req.user._id : null,
            guestName,
            guestEmail,
            guestPhone,
            paymentMethod,
            room: room._id,
            roomNumber: 'Pending Assignment',
            assignedUnit: 'Pending Assignment',
            checkIn,
            checkOut,
            totalPrice,
            status: 'confirmed',
            addons: addons || [],
            specialRequests,
            guests: guests || 2
        }], { session });

        await session.commitTransaction();
        session.endSession();

        let fullBooking = null;
        try {
            fullBooking = await Booking.findById(booking[0]._id).populate('room', 'name roomType price');
        } catch (findErr) {
            console.error('Failed to immediately fetch populated booking:', findErr);
        }

        // 6. Real-time Dashboard Sync
        const io = req.app.get('io');
        if (io) {
            if (fullBooking) {
                io.emit('newBooking', { 
                    ...fullBooking.toObject(), 
                    guestName, 
                    guestEmail,
                    isAtomic: true,
                    timestamp: new Date()
                });
            }
        }

        // 7. Non-blocking Email Alerts
        const guestUser = { name: guestName, email: guestEmail };
        if (fullBooking) {
            sendBookingConfirmation(fullBooking, guestUser, room).catch(err => console.error('Email failed:', err));
            sendNewBookingAlertToAdmin(fullBooking, guestUser, room).catch(err => console.error('Admin alert failed:', err));
        }

        res.status(201).json({
            success: true,
            booking: fullBooking || booking[0],
            assignedUnit: 'Pending Assignment'
        });

    } catch (error) {
        console.error('Create Booking Error:', error);
        try {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
        } catch (abortError) {
            console.error('Session Abort Error:', abortError);
        } finally {
            if (!session.hasEnded) session.endSession();
        }
        
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
    const bookings = await Booking.find({})
        .populate('room', 'name roomType roomNumber')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('room', 'name images status view bedType roomType roomNumber')
        .sort({ createdAt: -1 });
    res.json(bookings);
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('room');

    if (booking) {
        booking.status = status;
        await booking.save();

        // When cancelled, free up the room
        if (status === 'cancelled' && booking.room) {
            await Room.findByIdAndUpdate(booking.room._id, { status: 'available' });
            const io = req.app.get('io');
            if (io) io.emit('roomStatusUpdate', { roomId: booking.room._id, status: 'available' });
        }

        const io = req.app.get('io');
        if (io) io.emit('bookingUpdate', booking);

        res.json(booking);
    } else {
        res.status(404);
        throw new Error('Booking not found');
    }
};

// @desc    Update entire booking (Admin)
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('room');
        if (booking) {
            const updatableFields = ['guestName', 'guestEmail', 'guestPhone', 'roomNumber', 'assignedUnit', 'totalPrice', 'status', 'checkIn', 'checkOut'];
            updatableFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    booking[field] = req.body[field];
                }
            });
            const updatedBooking = await booking.save();
            const io = req.app.get('io');
            if (io) io.emit('bookingUpdate', updatedBooking);
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getBookings, getMyBookings, updateBookingStatus, checkAvailability, updateBooking };
