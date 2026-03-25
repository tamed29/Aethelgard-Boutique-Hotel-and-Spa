const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check Authorization Header FIRST (more reliable for cross-domain)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('[Auth] Token found in Authorization header');
    } 
    // Fallback to cookie
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log('[Auth] Token found in Cookie');
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Handle fallback admin token
        if (decoded.userId === 'admin-001' && decoded.role === 'admin') {
            req.user = {
                _id: 'admin-001',
                name: 'Aethelgard Admin',
                email: process.env.ADMIN_EMAIL || 'admin@aethelgard.com',
                role: 'admin'
            };
            return next();
        }

        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        res.status(401).json({ message: 'Not authorized, token failed' });
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
