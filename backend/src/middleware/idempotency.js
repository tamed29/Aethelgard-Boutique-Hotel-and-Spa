const crypto = require('crypto');

const idempotencyStore = new Map();

/**
 * Idempotency Middleware
 * Ensures that if a client retries a request with the same key, they get the same result
 * without re-executing the logic.
 */
const idempotency = (req, res, next) => {
    const key = req.headers['x-idempotency-key'];
    
    if (!key) {
        return next();
    }

    if (idempotencyStore.has(key)) {
        const cachedResponse = idempotencyStore.get(key);
        return res.status(cachedResponse.status).json(cachedResponse.body);
    }

    // Wrap res.json to cache the response
    const originalJson = res.json;
    res.json = function(body) {
        idempotencyStore.set(key, {
            status: res.statusCode,
            body: body,
            timestamp: Date.now()
        });
        
        // Cleanup old keys (expiring after 1 hour)
        if (idempotencyStore.size > 1000) {
            const oneHourAgo = Date.now() - 3600000;
            for (const [k, v] of idempotencyStore.entries()) {
                if (v.timestamp < oneHourAgo) idempotencyStore.delete(k);
            }
        }

        return originalJson.call(this, body);
    };

    next();
};

module.exports = idempotency;
