const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongo() {
    try {
        console.log('Connecting to MONGO_URI from .env...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections found:', collections.map(c => c.name));
        
        const bookingCount = await mongoose.model('Booking', new mongoose.Schema({})).countDocuments();
        console.log('Booking count:', bookingCount);
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
    }
}

checkMongo();
