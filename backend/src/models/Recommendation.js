const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['hike', 'dining', 'experience', 'other'], default: 'other' },
    imageUrl: { type: String },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
