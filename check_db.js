const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Fixed paths
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

async function check() {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined. Check .env path.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const Gallery = require('./backend/src/models/Gallery');
        const Settings = require('./backend/src/models/Settings');
        const Room = require('./backend/src/models/Room');

        const galleryCount = await Gallery.countDocuments();
        console.log('Gallery count:', galleryCount);

        const settingsCount = await Settings.countDocuments();
        console.log('Settings count:', settingsCount);

        const roomCount = await Room.countDocuments();
        console.log('Room count:', roomCount);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
