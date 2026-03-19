const AuditLog = require('../models/AuditLog');

const auditLogger = async (req, res, next) => {
    // Only log mutations (POST, PUT, DELETE) for administrative routes
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const originalSend = res.send;
        
        res.send = function (body) {
            res.send = originalSend;
            
            // Only log if the request was successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const logEntry = new AuditLog({
                    userId: req.user ? req.user._id : null,
                    action: `${req.method}_${req.originalUrl.split('/').pop().toUpperCase()}`,
                    method: req.method,
                    resource: req.originalUrl,
                    payload: req.body
                });
                
                logEntry.save().catch(err => console.error('Audit Logging Error:', err));
            }
            
            return res.send(body);
        };
    }
    next();
};

module.exports = auditLogger;
