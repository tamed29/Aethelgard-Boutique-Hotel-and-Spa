const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    url: { type: String, required: true },
    alt: { type: String, default: 'Aethelgard Visual' },
    category: { 
        type: String, 
        enum: ['pool', 'rooms', 'spa', 'dining', 'outdoors', 'heritage', 'forest', 'other'],
        default: 'other' 
    },
    size: { 
        type: String, 
        enum: ['square', 'wide', 'tall'],
        default: 'square'
    }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
