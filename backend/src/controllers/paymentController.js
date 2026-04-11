const Booking = require('../models/Booking');

/**
 * @desc    Initialize Chapa payment for ETB
 * @route   POST /api/payments/chapa/initialize
 */
const initializeChapaPayment = async (req, res) => {
    try {
        const { bookingId, amount, email, firstName, lastName, phone } = req.body;
        
        const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHAPA_TEST_SECRET';
        const tx_ref = `AETHEL-${Date.now()}-${bookingId.substring(0,8)}`;
        
        const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'ETB',
                email: email,
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                tx_ref: tx_ref,
                callback_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/chapa/callback`,
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reservations/success?ref=${tx_ref}`,
                customization: {
                    title: "Aethelgard Boutique Hotel",
                    description: "Sanctuary Reservation Payment"
                }
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            // Update booking with tx_ref and set status to pending
            await Booking.findByIdAndUpdate(bookingId, { 
                $set: { 
                    'paymentDetails.tx_ref': tx_ref,
                    'paymentDetails.method': 'Chapa',
                    status: 'pending' 
                }
            });
            res.json(data);
        } else {
            console.error('Chapa Initialization Error:', data);
            res.status(400).json(data);
        }
    } catch (error) {
        console.error('Chapa Controller Error:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Chapa Webhook/Callback
 * @route   GET /api/payments/chapa/callback
 */
const chapaCallback = async (req, res) => {
    // Note: Chapa sends verification data mostly to callback_url
    // For simplicity in this dev environment, we will implement a verify endpoint
    res.json({ message: 'Callback received' });
};

/**
 * @desc    Verify Chapa payment status
 * @route   GET /api/payments/chapa/verify/:tx_ref
 */
const verifyChapaPayment = async (req, res) => {
    try {
        const { tx_ref } = req.params;
        const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHAPA_TEST_SECRET';

        const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`
            }
        });

        const data = await response.json();
        
        if (data.status === 'success' && data.data.status === 'success') {
            // Update booking to confirmed
            const booking = await Booking.findOneAndUpdate(
                { 'paymentDetails.tx_ref': tx_ref },
                { $set: { status: 'confirmed' } },
                { new: true }
            );
            res.json({ success: true, booking });
        } else {
            res.status(400).json({ success: false, data });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    initializeChapaPayment,
    chapaCallback,
    verifyChapaPayment
};
