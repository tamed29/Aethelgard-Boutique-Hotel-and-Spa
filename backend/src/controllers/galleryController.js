const Gallery = require('../models/Gallery');

const getGalleryItems = async (req, res) => {
    try {
        const items = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addGalleryItem = async (req, res) => {
    try {
        const { url, alt, category, size } = req.body;
        const newItem = new Gallery({ url, alt, category, size });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Media removed from library' });
        } else {
            res.status(404).json({ message: 'Media not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            item.url = req.body.url || item.url;
            item.alt = req.body.alt || item.alt;
            item.category = req.body.category || item.category;
            item.size = req.body.size || item.size;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Media not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGalleryItems, addGalleryItem, deleteGalleryItem, updateGalleryItem };
