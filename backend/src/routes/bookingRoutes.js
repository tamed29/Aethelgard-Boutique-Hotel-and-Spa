const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createBooking, getBookings, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');

router.route('/')
    .post(protect, createBooking)
    .get(protect, admin, getBookings);

router.route('/mybookings')
    .get(protect, getMyBookings);

router.route('/:id/status')
    .put(protect, admin, updateBookingStatus);

module.exports = router;
