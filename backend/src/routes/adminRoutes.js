const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getMultipliers,
    createMultiplier,
    getRecommendations,
    createRecommendation
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/analytics', getAnalytics);
router.get('/multipliers', getMultipliers);
router.post('/multipliers', createMultiplier);
router.get('/recommendations', getRecommendations);
router.post('/recommendations', createRecommendation);

module.exports = router;
