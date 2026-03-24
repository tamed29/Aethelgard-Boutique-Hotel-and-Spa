const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, deleteInquiry } = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(createInquiry)
    .get(protect, admin, getInquiries);

router.route('/:id')
    .delete(protect, admin, deleteInquiry);

module.exports = router;
