const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    sizeSqM: { type: Number },
    bedType: { type: String },
    view: { type: String },
    amenities: [String],
    images: [String],
    status: { type: String, enum: ['available', 'occupied', 'cleaning', 'maintenance'], default: 'available' },
    videoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
