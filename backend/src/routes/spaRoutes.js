const express = require('express');
const router = express.Router();
const { getReservations, createReservation, updateReservationStatus, updateReservation, deleteReservation, getByReference } = require('../controllers/spaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getReservations)
    .post(createReservation); // Public can create

// Public reference lookup — no auth required
router.get('/lookup/:ref', getByReference);

router.route('/:id')
    .put(protect, admin, updateReservation)
    .delete(protect, admin, deleteReservation);

router.route('/:id/status')
    .put(protect, admin, updateReservationStatus);

module.exports = router;

