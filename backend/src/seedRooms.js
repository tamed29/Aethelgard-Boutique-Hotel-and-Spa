const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const roomTypes = [
    { 
        name: 'Forest Retreat', 
        roomType: 'forest', 
        price: 320, 
        capacity: 2, 
        description: 'Earthy sanctuary integrated with the Wychwood pines.',
        amenities: ['Copper Tub', 'Stone Hearth', 'Heated Slate']
    },
    { 
        name: 'Heritage Double', 
        roomType: 'double', 
        price: 280, 
        capacity: 2, 
        description: '12th-century stone walls paired with velvet luxury.',
        amenities: ['Oak Beams', 'Marble En-suite', 'Antique Decor']
    },
    { 
        name: 'Grand Estate Suite', 
        roomType: 'grand', 
        price: 950, 
        capacity: 2, 
        description: 'The pinnacle of Aethelgard. Sovereign and palatial.',
        amenities: ['Four-Poster Bed', 'Butler Service', '360 View']
    },
    { 
        name: 'Botanical Oasis', 
        roomType: 'botanical', 
        price: 380, 
        capacity: 2, 
        description: 'Verdant chambers with direct garden portals.',
        amenities: ['Living Walls', 'Porcelain Tub', 'Herb Bar']
    },
    { 
        name: 'Family Forest Suite', 
        roomType: 'family', 
        price: 650, 
        capacity: 4, 
        description: 'Interconnected master chambers for multi-generational rest.',
        amenities: ['Childrens Den', 'Dual Baths', 'Hollow Access']
    },
    { 
        name: 'Single Sanctuary', 
        roomType: 'single', 
        price: 195, 
        capacity: 1, 
        description: 'Monastic refinement for the reflective solo traveler.',
        amenities: ['Writing Nook', 'Curated Library', 'Rainfall Shower']
    }
];

const generateUnits = (type) => {
    const prefix = type.charAt(0).toUpperCase() + type.slice(1);
    return Array.from({ length: 7 }, (_, i) => ({
        number: `${prefix} ${(i + 1).toString().padStart(2, '0')}`,
        status: 'available',
        notes: ''
    }));
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Room.deleteMany({});
        console.log('Cleared existing rooms');

        const roomsToInsert = roomTypes.map(rt => ({
            ...rt,
            units: generateUnits(rt.roomType),
            roomNumber: `${rt.roomType.toUpperCase()}-BASE` // Keeping for legacy if needed
        }));

        await Room.insertMany(roomsToInsert);
        console.log('Successfully seeded 6 room types with 7 units each.');

        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seed();
