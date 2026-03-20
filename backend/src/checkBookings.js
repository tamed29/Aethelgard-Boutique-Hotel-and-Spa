const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Booking = require('./models/Booking');

async function checkBookings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Booking.countDocuments();
        console.log(`Total bookings: ${count}`);
        const bookings = await Booking.find().limit(5);
        console.log('Last 5 bookings:', JSON.stringify(bookings, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkBookings();
