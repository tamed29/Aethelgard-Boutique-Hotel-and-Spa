const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');

const getGalleryItems = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connecting/disconnected. Please try again in a moment.' });
        }
        const items = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addGalleryItem = async (req, res) => {
    try {
        console.log('Gallery upload request received');
        const { alt, category, size } = req.body;
        const savedItems = [];

        if (req.files && req.files.length > 0) {
            console.log(`Processing ${req.files.length} files`);
            // Helper to get value from potential array or string
            const getVal = (val, index) => {
                if (Array.isArray(val)) return val[index];
                return val; // Return the single value for all if it's not an array
            };

            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const itemCategory = getVal(category, i);
                const itemAlt = getVal(alt, i);
                const itemSize = getVal(size, i);

                const newItem = new Gallery({
                    url: file.path,
                    alt: itemAlt || 'Aethelgard Visual',
                    category: itemCategory || 'other',
                    size: itemSize || 'square'
                });
                const savedItem = await newItem.save();
                savedItems.push(savedItem);
            }
        } else if (req.body.url) {
            console.log('Processing URL-based upload');
            const newItem = new Gallery({ 
                url: req.body.url, 
                alt: Array.isArray(alt) ? alt[0] : alt, 
                category: Array.isArray(category) ? category[0] : category, 
                size: (Array.isArray(size) ? size[0] : size) || 'square'
            });
            const savedItem = await newItem.save();
            savedItems.push(savedItem);
        } else {
            console.warn('No images or URL provided in gallery upload');
            return res.status(400).json({ message: 'No image source provided (files or URL required)' });
        }

        console.log('Gallery upload successful');
        res.status(201).json(savedItems.length === 1 ? savedItems[0] : savedItems);
    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ message: error.message }); // Changed to 500 for better visibility of real errors
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
