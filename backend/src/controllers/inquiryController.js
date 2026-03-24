const Inquiry = require('../models/Inquiry');
const { z } = require('zod');

const inquirySchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    subject: z.string(),
    message: z.string().min(10)
});

// @desc    Submit a general inquiry
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
    try {
        const validated = inquirySchema.parse(req.body);
        const inquiry = await Inquiry.create({
            ...validated,
            ip: req.ip
        });

        // Emit to admin dashboard
        const io = req.app.get('io');
        if (io) {
            io.emit('newInquiry', inquiry);
        }

        res.status(201).json({ success: true, message: 'Your enquiry has been transmitted to the Concierge.' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an inquiry (Admin)
// @route   DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (inquiry) {
            await inquiry.deleteOne();
            res.json({ message: 'Inquiry removed' });
        } else {
            res.status(404).json({ message: 'Inquiry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createInquiry, getInquiries, deleteInquiry };
