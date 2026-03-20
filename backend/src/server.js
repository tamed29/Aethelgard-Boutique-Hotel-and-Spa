require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/api');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
    },
});

app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rate limiting (placeholder for middleware)
// Routes
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', apiRoutes);
app.use('/api/gallery', galleryRoutes);

// Error Middleware
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        const logPath = path.join(__dirname, '../error.log');
        const logEntry = `\n[${new Date().toISOString()}] MONGO_CONNECTION_ERROR\n${err.stack}\n`;
        try { fs.appendFileSync(logPath, logEntry); } catch (e) {}
    });

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Chat System
    socket.on('joinChat', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined chat room ${roomId}`);
    });

    socket.on('sendMessage', (data) => {
        // Broadcast message to everyone in the room
        io.to(data.roomId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
