const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ email: 'admin@aethelgard.com' });
        if (admin) {
            console.log('Admin user found:', admin.email, 'Role:', admin.role);
        } else {
            console.log('Admin user NOT found');
        }
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

checkAdmin();
