const NewsEvent = require('../models/NewsEvent');

const getItems = async (req, res) => {
    try {
        const items = await NewsEvent.find({}).sort({ date: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addItem = async (req, res) => {
    try {
        const itemData = { ...req.body };
        if (req.file) {
            itemData.imageUrl = req.file.path; // Cloudinary URL
        }
        const newItem = new NewsEvent(itemData);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const item = await NewsEvent.findById(req.params.id);
        if (item) {
            Object.assign(item, req.body);
            if (req.file) {
                item.imageUrl = req.file.path; // Cloudinary URL
            }
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const item = await NewsEvent.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
