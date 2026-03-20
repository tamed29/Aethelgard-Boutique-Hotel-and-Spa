const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    // Log to file for agent debugging
    const logPath = path.join(__dirname, '../../error.log');
    const logEntry = `\n[${new Date().toISOString()}] ${req.method} ${req.url}\n${err.stack}\n`;
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

    res.status(statusCode).json({
        message: err.stack || err.message,
        stack: err.stack,
    });
};

module.exports = { errorHandler };
