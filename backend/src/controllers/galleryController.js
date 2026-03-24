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
        const { alt, category, size } = req.body;
        const savedItems = [];

        if (req.files && req.files.length > 0) {
            // Handle multiple file uploads
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                // Determine category for this file (specific or bulk)
                const itemCategory = Array.isArray(category) ? category[i] : category;
                const itemAlt = Array.isArray(alt) ? alt[i] : alt;
                const itemSize = Array.isArray(size) ? size[i] : size;

                const newItem = new Gallery({
                    url: file.path,
                    alt: itemAlt || '',
                    category: itemCategory || 'other',
                    size: itemSize || 'square'
                });
                const savedItem = await newItem.save();
                savedItems.push(savedItem);
            }
        } else if (req.body.url) {
            // Fallback for direct URL submission if still used
            const newItem = new Gallery({ 
                url: req.body.url, 
                alt, 
                category, 
                size: size || 'square'
            });
            const savedItem = await newItem.save();
            savedItems.push(savedItem);
        } else {
            return res.status(400).json({ message: 'No image source provided (files or URL required)' });
        }

        res.status(201).json(savedItems.length === 1 ? savedItems[0] : savedItems);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
