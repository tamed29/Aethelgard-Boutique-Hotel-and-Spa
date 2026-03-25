const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    // Log to file for agent debugging
    const logPath = path.join(__dirname, '../../error.log');
    const logEntry = `\n[${new Date().toISOString()}] ${req.method} ${req.url}\n${err.stack || JSON.stringify(err, null, 2) || err.message || err}\n`;
    console.error(`ERROR on ${req.method} ${req.url}:`, err.message || err);
    try {
        fs.appendFileSync(logPath, logEntry);
    } catch (e) {
        console.error('Failed to write to error.log', e);
    }

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found (Invalid ID format)';
    }

    // Ensure CORS headers are present even on errors
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'https://aethelgard-boutique-hotel-spa.vercel.app',
        'https://aethelgard-boutique-hotel-spa.vercel.app/'
    ];

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    } else {
        res.header('Access-Control-Allow-Origin', '*'); // Fallback for simple requests
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    res.status(statusCode).json({
        message: err.stack || err.message,
        stack: err.stack,
    });
};

module.exports = { errorHandler };
