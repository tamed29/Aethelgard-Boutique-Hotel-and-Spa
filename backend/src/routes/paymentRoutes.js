const express = require('express');
const router = express.Router();
const { 
    initializeChapaPayment, 
    chapaCallback, 
    verifyChapaPayment 
} = require('../controllers/paymentController');

router.post('/chapa/initialize', initializeChapaPayment);
router.get('/chapa/callback', chapaCallback);
router.get('/chapa/verify/:tx_ref', verifyChapaPayment);

module.exports = router;
