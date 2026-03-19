const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
        try {
            token = req.cookies.jwt;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Handle fallback admin token (no real DB user needed)
            if (decoded.userId === 'admin-001' && decoded.role === 'admin') {
                req.user = {
                    _id: 'admin-001',
                    name: 'Aethelgard Admin',
                    email: process.env.ADMIN_EMAIL || 'admin@aethelgard.com',
                    role: 'admin'
                };
                return next();
            }

            // Normal DB lookup
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
