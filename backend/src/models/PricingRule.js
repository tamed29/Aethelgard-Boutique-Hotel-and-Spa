const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
    type: { type: String, enum: ['occupancy_above', 'occupancy_below'], required: true },
    threshold: { type: Number, required: true }, // e.g., 80 for 80%
    adjustment: { type: Number, required: true }, // e.g., 1.15 for 15% increase
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
