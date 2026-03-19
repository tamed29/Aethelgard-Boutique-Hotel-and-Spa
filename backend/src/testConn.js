const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const test = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED SUCCESSFULLY');
        process.exit(0);
    } catch (err) {
        console.error('CONNECTION FAILED:', err.message);
        process.exit(1);
    }
};

test();
