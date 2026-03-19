const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Admin Seeding');

        const adminExists = await User.findOne({ email: 'admin@aethelgard.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        await User.create({
            name: 'Aethelgard Admin',
            email: 'admin@aethelgard.com',
            password: 'AdminPassword123!', // User should change this
            role: 'admin'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@aethelgard.com');
        console.log('Password: AdminPassword123!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:');
        if (err.name === 'ValidationError') {
            Object.keys(err.errors).forEach((key) => {
                console.error(`${key}: ${err.errors[key].message}`);
            });
        } else {
            console.error(err);
        }
        process.exit(1);
    }
};

seedAdmin();
