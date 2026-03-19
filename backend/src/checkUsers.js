const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);
        const users = await User.find({}, 'email role');
        console.log('Users:', users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
