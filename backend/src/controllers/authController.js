const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
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
            generateToken(res, user._id);
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
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        // --- FALLBACK: Check hardcoded admin credentials from .env ---
        // This allows login even if MongoDB is temporarily unavailable
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
            return res.json({
                _id: 'admin-001',
                name: 'Aethelgard Admin',
                email: adminEmail,
                role: 'admin'
            });
        }

        // --- NORMAL: Check DB if fallback doesn't match ---
        const user = await User.findOne({ email });
        console.log(`User found in DB: ${!!user}`);

        if (user && (await user.comparePassword(password))) {
            generateToken(res, user._id);
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        // If DB is down but fallback already ran, this won't be reached
        res.status(500).json({ message: 'Authentication service temporarily unavailable. Please try the admin bypass credentials.' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, authUser, logoutUser };
