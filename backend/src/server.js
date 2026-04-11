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
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://aethelgard-boutique-hotel-spa.vercel.app'
];

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const isAllowed = allowedOrigins.includes(origin) || 
                             (origin.endsWith('.vercel.app') && origin.includes('aethelgard-boutique-hotel'));
            
            if (isAllowed) {
                callback(null, true);
            } else {
                console.error(`[Socket.io] CORS Blocked: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    },
});

app.enable('trust proxy'); // Trust Render/Vercel // Robust CORS Configuration

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.includes(origin) || 
                         origin.endsWith('.vercel.app') && origin.includes('aethelgard-boutique-hotel');
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
}));

// Global Request Logger with Status
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms) - Origin: ${req.headers.origin}`);
    });
    next();
});

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting (placeholder for middleware)
// Routes
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const spaRoutes = require('./routes/spaRoutes');

app.use('/api/rooms', roomRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', apiRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/spa', spaRoutes);

// Error Middleware
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
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
