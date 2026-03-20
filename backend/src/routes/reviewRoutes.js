const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

router.route('/:id')
    .delete(protect, admin, deleteReview);

module.exports = router;
