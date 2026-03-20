const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./src/models/Gallery');
const Settings = require('./src/models/Settings');
const Room = require('./src/models/Room');

dotenv.config();

async function check() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const g = await Gallery.countDocuments();
        const s = await Settings.countDocuments();
        const r = await Room.countDocuments();

        console.log(`Counts: Gallery=${g}, Settings=${s}, Rooms=${r}`);
        process.exit(0);
    } catch (err) {
        console.error('CRITICAL ERROR:', err);
        process.exit(1);
    }
}
check();
