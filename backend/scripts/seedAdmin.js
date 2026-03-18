const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@aethelgard.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('Aethelgard2026!', 12);
        await User.create({
            name: 'Master Concierge',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
