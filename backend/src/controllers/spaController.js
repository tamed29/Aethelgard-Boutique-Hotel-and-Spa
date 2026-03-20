const SpaReservation = require('../models/SpaReservation');

const getReservations = async (req, res) => {
    try {
        const reservations = await SpaReservation.find({}).sort({ date: 1, timeSlot: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReservation = async (req, res) => {
    try {
        const newReservation = new SpaReservation(req.body);
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await SpaReservation.findById(req.params.id);
        
        if (reservation) {
            reservation.status = status;
            const updatedReservation = await reservation.save();
            res.json(updatedReservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReservation = async (req, res) => {
    try {
        const reservation = await SpaReservation.findById(req.params.id);
        if (reservation) {
            ['guestName', 'guestEmail', 'therapyType', 'date', 'timeSlot', 'status', 'specialRequests'].forEach(field => {
                if (req.body[field] !== undefined) {
                    reservation[field] = req.body[field];
                }
            });
            const updated = await reservation.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const reservation = await SpaReservation.findById(req.params.id);
        if (reservation) {
            await reservation.deleteOne();
            res.json({ message: 'Reservation removed' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReservations, createReservation, updateReservationStatus, updateReservation, deleteReservation };
