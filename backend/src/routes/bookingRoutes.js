const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const idempotency = require('../middleware/idempotency');
const { createBooking, getBookings, getMyBookings, updateBookingStatus, checkAvailability } = require('../controllers/bookingController');

// Public availability check (no auth needed)
router.get('/availability', checkAvailability);

// Booking creation - no login required (guest booking)
router.route('/')
    .post(idempotency, createBooking)
    .get(protect, admin, getBookings);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id/status')
    .put(protect, admin, updateBookingStatus);

module.exports = router;
