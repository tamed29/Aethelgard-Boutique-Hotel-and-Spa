const mongoose = require('mongoose');
const Booking = require('../models/Booking');

class BookingService {
    static async createBooking(data) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { room, checkIn, checkOut } = data;

            // Check for overlapping bookings (confirmed or currently locked)
            const overlapping = await Booking.findOne({
                room,
                status: { $in: ['confirmed', 'locked'] },
                $or: [
                    { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
                ]
            }).session(session);

            if (overlapping) {
                throw new Error('Room is currently locked or already booked for these dates');
            }

            // Create a 10-minute lock for checkout
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const newBooking = new Booking({ ...data, status: 'locked', expiresAt });
            await newBooking.save({ session });

            await session.commitTransaction();
            session.endSession();

            return newBooking;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

module.exports = BookingService;
