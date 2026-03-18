const mongoose = require('mongoose');
const Room = require('../models/Room');

const getRooms = async (req, res) => {
    const rooms = await Room.find({});
    res.json(rooms);
};

const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log(`[Backend] Invalid Room ID format requested: "${id}". Returning 404.`);
            return res.status(404).json({ message: 'Room not found (Invalid ID format)' });
        }

        const room = await Room.findById(id);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error(`[Backend] CRITICAL ERROR fetching room "${req.params.id}":`, error);
        res.status(500).json({
            message: 'Server error fetching room details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const createRoom = async (req, res) => {
    const { name, description, price, capacity, amenities, images } = req.body;
    const room = new Room({
        name, description, price, capacity, amenities, images
    });
    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
};

const updateRoomPrice = async (req, res) => {
    const { price } = req.body;
    const room = await Room.findById(req.params.id);

    if (room) {
        room.price = price;
        const updatedRoom = await room.save();

        // Emit socket event for real-time price update
        const io = req.app.get('io');
        if (io) {
            io.emit('roomPriceUpdate', { roomId: updatedRoom._id, price: updatedRoom.price });
        }

        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
};

const updateRoomStatus = async (req, res) => {
    const { status } = req.body;
    const room = await Room.findById(req.params.id);

    if (room) {
        room.status = status;
        const updatedRoom = await room.save();

        // Emit socket event for real-time room status
        const io = req.app.get('io');
        if (io) {
            io.emit('roomStatusUpdate', { roomId: updatedRoom._id, status: updatedRoom.status });
        }

        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error('Room not found');
    }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoomPrice, updateRoomStatus };
