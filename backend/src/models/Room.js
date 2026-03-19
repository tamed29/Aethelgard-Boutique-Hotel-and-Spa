const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roomType: { type: String, enum: ['forest', 'double', 'grand', 'botanical', 'family', 'single'], required: true },
    roomNumber: { type: String, required: true }, // e.g. 'FOREST-01'
    description: { type: String },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    sizeSqM: { type: Number },
    bedType: { type: String },
    view: { type: String },
    amenities: [String],
    images: [String],
    bathroomImages: [String],
    status: { type: String, enum: ['available', 'occupied', 'cleaning', 'maintenance'], default: 'available' },
    floor: { type: Number, default: 1 },
    videoUrl: { type: String }
}, { timestamps: true });

// Compound unique index so each room number per type is unique
roomSchema.index({ roomType: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
