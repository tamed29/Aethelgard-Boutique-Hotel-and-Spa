const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String },
    paymentMethod: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    roomNumber: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['locked', 'pending', 'confirmed', 'cancelled', 'checked-in', 'checked-out'], default: 'locked' },
    addons: [{ type: String }],
    specialRequests: { type: String },
    guests: { type: Number, default: 2 },
    expiresAt: { type: Date },
    transactionId: { type: String }
}, { timestamps: true });

// TTL index to automatically remove locked bookings that haven't been confirmed within 10 minutes
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Booking', bookingSchema);
