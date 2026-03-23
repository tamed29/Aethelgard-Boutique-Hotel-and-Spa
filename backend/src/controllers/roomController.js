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
    const { name, roomType, roomNumber, description, price, capacity, sizeSqM, bedType, view, amenities, images, floor, videoUrl, bathroomImages, units } = req.body;
    const room = new Room({
        name, roomType, roomNumber, description, price, capacity, sizeSqM, bedType, view, amenities, images, floor, videoUrl, bathroomImages, units
    });
    const createdRoom = await room.save();
    
    const io = req.app.get('io');
    if (io) {
        io.emit('roomCreate', { roomId: createdRoom._id });
    }

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

const updateUnitStatus = async (req, res) => {
    const { roomId, unitNumber, status } = req.body;
    const room = await Room.findById(roomId);

    if (!room) {
        return res.status(404).json({ message: 'Room Type not found' });
    }

    const unit = room.units.find(u => u.number === unitNumber);
    if (!unit) {
        return res.status(404).json({ message: 'Unit not found' });
    }

    unit.status = status;
    await room.save();

    // Emit socket event for real-time unit status
    const io = req.app.get('io');
    if (io) {
        io.emit('unitStatusUpdate', { roomId, unitNumber, status });
    }

    res.json({ message: 'Unit status updated', unit });
};

const updateRoom = async (req, res) => {
    try {
        const { name, roomType, roomNumber, description, price, capacity, sizeSqM, bedType, view, amenities, floor, videoUrl, units } = req.body;
        const room = await Room.findById(req.params.id);

        if (room) {
            if (name) room.name = name;
            if (roomType) room.roomType = roomType;
            if (roomNumber) room.roomNumber = roomNumber;
            if (description !== undefined) room.description = description;
            if (price !== undefined) room.price = price;
            if (capacity !== undefined) room.capacity = capacity;
            if (sizeSqM !== undefined) room.sizeSqM = sizeSqM;
            if (bedType !== undefined) room.bedType = bedType;
            if (view !== undefined) room.view = view;
            if (amenities) {
                room.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
            }
            if (floor !== undefined) room.floor = floor;
            if (videoUrl !== undefined) room.videoUrl = videoUrl;
            if (units) {
                room.units = typeof units === 'string' ? JSON.parse(units) : units;
            }

            // Handle Image Arrays (Merge existing + new uploads)
            if (req.body.current_images) {
                try {
                    room.images = JSON.parse(req.body.current_images);
                } catch(e) {
                    console.error("Error parsing current_images:", e);
                }
            }
            if (req.body.current_bathroomImages) {
                try {
                    room.bathroomImages = JSON.parse(req.body.current_bathroomImages);
                } catch(e) {
                    console.error("Error parsing current_bathroomImages:", e);
                }
            }

            if (req.files) {
                if (req.files['images']) {
                    const newImages = req.files['images'].map(f => f.path);
                    room.images = [...(room.images || []), ...newImages];
                }
                if (req.files['bathroomImages']) {
                    const newBathImages = req.files['bathroomImages'].map(f => f.path);
                    room.bathroomImages = [...(room.bathroomImages || []), ...newBathImages];
                }
            }

            const updatedRoom = await room.save();
            
            const io = req.app.get('io');
            if (io) {
                io.emit('roomUpdate', { roomId: updatedRoom._id });
            }

            res.json(updatedRoom);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            await room.deleteOne();
            
            const io = req.app.get('io');
            if (io) {
                io.emit('roomDelete', { roomId: req.params.id });
            }

            res.json({ message: 'Room removed' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getRooms, 
    getRoomById, 
    createRoom, 
    updateRoomPrice, 
    updateRoomStatus,
    updateUnitStatus,
    updateRoom,
    deleteRoom
};
