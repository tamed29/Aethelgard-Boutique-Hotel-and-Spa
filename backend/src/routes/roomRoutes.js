const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getRooms, getRoomById, createRoom, updateRoomPrice, updateRoomStatus, updateUnitStatus, updateRoom, deleteRoom } = require('../controllers/roomController');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getRooms)
    .post(protect, admin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'bathroomImages', maxCount: 10 }]), createRoom);

router.route('/:id')
    .get(getRoomById)
    .put(protect, admin, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'bathroomImages', maxCount: 10 }]), updateRoom)
    .delete(protect, admin, deleteRoom);

// Admin route specifically for pushing price updates
router.route('/:id/price').put(protect, admin, updateRoomPrice);
router.route('/:id/status').put(protect, admin, updateRoomStatus);
router.route('/unit-status').put(protect, admin, updateUnitStatus);

module.exports = router;
