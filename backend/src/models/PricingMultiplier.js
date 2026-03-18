const mongoose = require('mongoose');

const pricingMultiplierSchema = new mongoose.Schema({
    multiplier: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PricingMultiplier', pricingMultiplierSchema);
