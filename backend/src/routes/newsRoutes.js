const express = require('express');
const router = express.Router();
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getItems);
router.post('/', protect, admin, upload.single('image'), addItem);
router.put('/:id', protect, admin, upload.single('image'), updateItem);
router.delete('/:id', protect, admin, deleteItem);

module.exports = router;
