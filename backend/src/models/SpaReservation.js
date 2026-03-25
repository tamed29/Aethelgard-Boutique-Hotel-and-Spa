const mongoose = require('mongoose');

const spaReservationSchema = new mongoose.Schema({
    guestName: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    therapyType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number,
        default: 0
    },
    referenceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    specialRequests: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const SpaReservation = mongoose.model('SpaReservation', spaReservationSchema);

module.exports = SpaReservation;
