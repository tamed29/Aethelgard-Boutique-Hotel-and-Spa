const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: 'Database connecting/disconnected. Please try again in a moment.' 
        });
    }
    next();
};

module.exports = checkDbConnection;
