const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedRooms = [
    { name: 'The Grand Aethelgard Suite', description: 'Experience the pinnacle of luxury with panoramic views', price: 850, capacity: 2, floor: 4, amenities: ['Private Balcony', 'King Bed', 'Jacuzzi'], images: [] },
    { name: 'The Runestone Chamber', description: 'A mystical and relaxing retreat', price: 400, capacity: 2, floor: 1, amenities: ['Spa Access', 'Queen Bed', 'Fireplace'], images: [] },
    { name: 'The Citadel Room', description: 'Spacious and grand, fit for royalty', price: 600, capacity: 4, floor: 3, amenities: ['City View', '2 King Beds', 'Lounge Area'], images: [] },
    { name: 'The Enchanted Garden Lodge', description: 'A serene hideaway surrounded by exotic flora', price: 550, capacity: 2, floor: 1, amenities: ['Private Garden', 'King Bed'], images: [] }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Seeding');
        await Room.deleteMany();
        await Room.insertMany(seedRooms);
        console.log('Rooms seeded successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
