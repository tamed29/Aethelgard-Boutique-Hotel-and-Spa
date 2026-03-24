const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aethelgard',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
