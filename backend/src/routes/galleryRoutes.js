const express = require('express');
const router = express.Router();
const { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem } = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public access for the main site
router.get('/', getGalleryItems);

// Protected admin routes
router.post('/', protect, admin, upload.array('images'), addGalleryItem);
router.put('/:id', protect, admin, updateGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);

module.exports = router;
