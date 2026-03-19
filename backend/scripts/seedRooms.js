/**
 * seedRooms.js
 * Seeds 10 rooms per room type (60 total) into MongoDB.
 * Run with: node scripts/seedRooms.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Room = require('../src/models/Room');

const ROOM_CONFIGS = {
    forest: {
        name: 'Forest Retreat',
        price: 320, capacity: 2, sizeSqM: 72,
        bedType: 'California King', view: 'Wychwood Forest',
        amenities: ['Stone Fireplace', 'Copper Soaking Tub', 'Heated Slate Floors', 'Heritage Garden Portal', 'Yoga Mat Service', 'Aesop Toiletries'],
        images: ['/images/rooms/forest/r1.png','/images/rooms/forest/r2.png','/images/rooms/forest/r3.png','/images/rooms/forest/r4.png','/images/rooms/forest/r5.png','/images/rooms/forest/r6.png'],
        bathroomImages: ['/images/rooms/forest/r7.png', '/images/rooms/forest/r8.png'],
        floors: [1,1,1,2,2,2,3,3,4,4]
    },
    double: {
        name: 'Double Heritage Room',
        price: 280, capacity: 2, sizeSqM: 52,
        bedType: 'Heritage King', view: 'Manor Courtyard',
        amenities: ['Exposed Oak Beams', 'Marble En-Suite', 'Antique Furnishings', 'Manor Courtyard View', 'Artisan Coffee Station', 'Aesop Toiletries'],
        images: ['/images/rooms/double/d1.png','/images/rooms/double/d2.png','/images/rooms/double/d3.png','/images/rooms/double/d4.png','/images/rooms/double/d5.png','/images/rooms/double/d6.png'],
        bathroomImages: ['/images/rooms/double/d7.png', '/images/rooms/double/d8.png'],
        floors: [1,1,2,2,3,3,4,4,5,5]
    },
    grand: {
        name: 'Grand Estate Suite',
        price: 950, capacity: 4, sizeSqM: 145,
        bedType: 'Grand Four-Poster', view: '360° Wychwood Panorama',
        amenities: ['Four-Poster Canopy Bed', 'Private Dining Salon', 'Copper Grand Tub', '360° Forest Panorama', 'Personal Chef On Call', 'Butler Service'],
        images: ['/images/rooms/grand/g1.png','/images/rooms/grand/g2.png','/images/rooms/grand/g3.png','/images/rooms/grand/g4.png','/images/rooms/grand/g5.png','/images/rooms/grand/g6.png'],
        bathroomImages: ['/images/rooms/grand/g7.png', '/images/rooms/grand/g8.png'],
        floors: [5,5,6,6,7,7,8,8,9,9]
    },
    botanical: {
        name: 'Botanical Oasis Suite',
        price: 380, capacity: 2, sizeSqM: 78,
        bedType: 'Linen King', view: 'Heritage Blossom Garden',
        amenities: ['Living Botanical Bath', 'Heritage Garden Terrace', 'Circadian Lighting', 'Heritage Herb Bar', 'Aesop Toiletries', 'Floral Butler'],
        images: ['/images/rooms/botanical/b1.png','/images/rooms/botanical/b2.png','/images/rooms/botanical/b3.png','/images/rooms/botanical/b4.png','/images/rooms/botanical/b5.png','/images/rooms/botanical/b6.png'],
        bathroomImages: ['/images/rooms/botanical/b7.png', '/images/rooms/botanical/b8.png'],
        floors: [1,1,1,2,2,2,3,3,3,4]
    },
    family: {
        name: 'Family Forest Suite',
        price: 650, capacity: 6, sizeSqM: 98,
        bedType: 'Double King Suites', view: 'Hollow Forest Edge',
        amenities: ['Connecting Chambers', 'Dual Heritage Baths', "Children's Discovery Den", 'Direct Hollow Access', 'Evening Cocoa Service', 'Family Library'],
        images: ['/images/rooms/family/f1.png','/images/rooms/family/f2.png','/images/rooms/family/f3.png','/images/rooms/family/f4.png','/images/rooms/family/f5.png','/images/rooms/family/f6.png'],
        bathroomImages: ['/images/rooms/family/f7.png', '/images/rooms/family/f8.png'],
        floors: [1,1,2,2,3,3,4,4,5,5]
    },
    single: {
        name: 'Single Sanctuary',
        price: 195, capacity: 1, sizeSqM: 34,
        bedType: 'Elite Queen', view: 'Tapestry Garden',
        amenities: ['Artisan Writing Nook', 'Compact Marble Bath', 'Curated Library', 'Garden Tapestry View', 'Heritage Tea Selection', 'Aesop Toiletries'],
        images: ['/images/rooms/single/s1.png','/images/rooms/single/s2.png','/images/rooms/single/s3.png','/images/rooms/single/s4.png','/images/rooms/single/s5.png','/images/rooms/single/s6.png'],
        bathroomImages: ['/images/rooms/single/s7.png', '/images/rooms/single/s8.png'],
        floors: [1,2,3,4,1,2,3,4,1,2]
    }
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing rooms
        await Room.deleteMany({});
        console.log('🗑️  Cleared existing rooms');

        const rooms = [];
        for (const [type, config] of Object.entries(ROOM_CONFIGS)) {
            for (let i = 1; i <= 10; i++) {
                const num = String(i).padStart(2, '0');
                rooms.push({
                    name: `${config.name} ${num}`,
                    roomType: type,
                    roomNumber: `${type.toUpperCase()}-${num}`,
                    description: `${config.name} — Room ${num}. ${config.view} views.`,
                    price: config.price,
                    capacity: config.capacity,
                    sizeSqM: config.sizeSqM,
                    bedType: config.bedType,
                    view: config.view,
                    amenities: config.amenities,
                    images: config.images,
                    bathroomImages: config.bathroomImages,
                    status: 'available',
                    floor: config.floors[i - 1] || 1,
                });
            }
        }

        await Room.insertMany(rooms);
        console.log(`✅ Seeded ${rooms.length} rooms (10 per type × 6 types)`);
        console.log('\nRoom Distribution:');
        Object.keys(ROOM_CONFIGS).forEach(type => {
            console.log(`  ${type.toUpperCase()}-01 to ${type.toUpperCase()}-10`);
        });

    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

seed();
