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
        const newItem = new NewsEvent(req.body);
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
            item.title = req.body.title || item.title;
            item.content = req.body.content || item.content;
            item.date = req.body.date || item.date;
            item.imageUrl = req.body.imageUrl || item.imageUrl;
            item.type = req.body.type || item.type;
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
