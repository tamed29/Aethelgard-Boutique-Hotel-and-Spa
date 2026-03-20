const express = require('express');
const router = express.Router();
const { getGalleryItems, addGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public access for the main site
router.get('/', getGalleryItems);

// Protected admin routes
router.post('/', protect, admin, addGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);

module.exports = router;
