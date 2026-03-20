const express = require('express');
const router = express.Router();
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getItems);
router.post('/', protect, admin, addItem);
router.put('/:id', protect, admin, updateItem);
router.delete('/:id', protect, admin, deleteItem);

module.exports = router;
