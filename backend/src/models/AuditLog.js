const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE_ROOM', 'UPDATE_PRICE'
    method: { type: String, required: true }, // e.g., 'POST', 'PUT'
    resource: { type: String, required: true }, // e.g., '/api/admin/multipliers'
    payload: { type: Object },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
