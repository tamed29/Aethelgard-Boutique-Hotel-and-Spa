const mongoose = require('mongoose');

const newsEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['news', 'event'],
        required: true,
        default: 'news'
    }
}, { timestamps: true });

const NewsEvent = mongoose.model('NewsEvent', newsEventSchema);

module.exports = NewsEvent;
