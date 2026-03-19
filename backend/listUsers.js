const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function listUsers() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');
        
        const User = require('./src/models/User');
        const users = await User.find({});
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        
        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

listUsers();
