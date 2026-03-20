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
    specialRequests: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const SpaReservation = mongoose.model('SpaReservation', spaReservationSchema);

module.exports = SpaReservation;
