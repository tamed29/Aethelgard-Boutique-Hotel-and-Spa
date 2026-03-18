const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getRooms, getRoomById, createRoom, updateRoomPrice, updateRoomStatus } = require('../controllers/roomController');

router.route('/').get(getRooms).post(protect, admin, createRoom);
router.route('/:id').get(getRoomById);
// Admin route specifically for pushing price updates
router.route('/:id/price').put(protect, admin, updateRoomPrice);
router.route('/:id/status').put(protect, admin, updateRoomStatus);

module.exports = router;
