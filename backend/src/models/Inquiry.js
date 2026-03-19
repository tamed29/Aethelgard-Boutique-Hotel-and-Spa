const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { 
        type: String, 
        required: true,
        enum: ['General Restorative Enquiries', 'Private Events & Gatherings', 'Culinary Narrative Requests', 'Heritage Tour Bookings', 'Press & Media']
    },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['new', 'read', 'responded', 'archived'], 
        default: 'new' 
    },
    ip: String
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
