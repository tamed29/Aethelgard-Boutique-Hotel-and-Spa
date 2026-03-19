const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testConn = async () => {
    try {
        console.log('Attempting to connect to:', process.env.MONGO_URI.replace(/:([^:@/]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected to MongoDB Atlas');
        process.exit(0);
    } catch (err) {
        console.error('CONNECTION ERROR TYPE:', err.name);
        console.error('CONNECTION ERROR MESSAGE:', err.message);
        console.error('FULL ERROR:', JSON.stringify(err, null, 2));
        process.exit(1);
    }
};

testConn();
