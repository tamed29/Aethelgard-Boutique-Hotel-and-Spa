const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (res, userId, role = 'user') => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Also set a non-httpOnly cookie for the role to simplify middleware checks if needed
    // or keep it httpOnly for security and decode JWT in middleware.
    res.cookie('userRole', role, {
        httpOnly: false, // Accessible by middleware/client
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    return token;
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            generateToken(res, user._id, user.role);
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // --- PRIORITY: Check hardcoded admin credentials from .env first ---
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aethelgard.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

    if (email === adminEmail && password === adminPassword) {
        console.log('Admin authenticated via environment fallback');
        const token = jwt.sign(
            { userId: 'admin-001', role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.cookie('userRole', 'admin', {
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            _id: 'admin-001',
            name: 'Aethelgard Admin',
            email: adminEmail,
            role: 'admin'
        });
    }

    // --- FALLBACK: Try DB lookup — if DB is down just return 401 ---
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            generateToken(res, user._id, user.role);
            return res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        }
    } catch (dbError) {
        console.error('DB lookup failed during login:', dbError.message);
        // DB is down and admin fallback didn't match — credentials are wrong
    }

    console.log('Invalid credentials');
    return res.status(401).json({ message: 'Invalid email or password' });
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, authUser, logoutUser };
