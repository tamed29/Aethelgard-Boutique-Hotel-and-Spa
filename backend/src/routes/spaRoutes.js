const express = require('express');
const router = express.Router();
const { getReservations, createReservation, updateReservationStatus, updateReservation, deleteReservation } = require('../controllers/spaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getReservations)
    .post(createReservation); // Public can create

router.route('/:id')
    .put(protect, admin, updateReservation)
    .delete(protect, admin, deleteReservation);

router.route('/:id/status')
    .put(protect, admin, updateReservationStatus);

module.exports = router;
