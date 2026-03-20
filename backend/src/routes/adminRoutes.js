const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getMultipliers,
    createMultiplier,
    getRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getPricingRules,
    createPricingRule,
    getAuditLogs,
    getSettings,
    updateSetting
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const auditLogger = require('../middleware/auditMiddleware');

router.use(protect);
router.use(admin);
router.use(auditLogger);

router.get('/analytics', getAnalytics);
router.get('/multipliers', getMultipliers);
router.post('/multipliers', createMultiplier);
router.get('/recommendations', getRecommendations);
router.post('/recommendations', createRecommendation);
router.put('/recommendations/:id', updateRecommendation);
router.delete('/recommendations/:id', deleteRecommendation);
router.get('/pricing-rules', getPricingRules);
router.post('/pricing-rules', createPricingRule);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getSettings);
router.put('/settings', updateSetting);

module.exports = router;
