const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getReviews, createReview } = require('../controllers/reviewController');

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

module.exports = router;
