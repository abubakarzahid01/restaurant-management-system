const express = require('express');
const router = express.Router();
const Newsletter = require('../models/newsletter');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET all newsletter subscribers (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        // Search by email
        if (search) {
            query.email = { $regex: search, $options: 'i' };
        }
        
        // Execute query with pagination
        const subscribers = await Newsletter.find(query)
            .sort({ subscribedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Get total count
        const count = await Newsletter.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                subscribers,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST subscribe to newsletter (Public - no auth required)
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if already subscribed
        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        
        if (existing) {
            if (existing.isActive) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'This email is already subscribed to our newsletter' 
                });
            } else {
                // Reactivate subscription
                existing.isActive = true;
                await existing.save();
                return res.json({
                    success: true,
                    message: 'Successfully resubscribed to our newsletter!'
                });
            }
        }
        
        const subscriber = new Newsletter({ email });
        await subscriber.save();
        
        res.status(201).json({
            success: true,
            message: 'Successfully subscribed! Welcome to our community!'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE unsubscribe (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
        
        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Subscriber not found' });
        }
        
        res.json({
            success: true,
            message: 'Subscriber removed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET newsletter statistics (Admin only)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
        const totalUnsubscribed = await Newsletter.countDocuments({ isActive: false });
        
        res.json({
            success: true,
            data: {
                totalSubscribers,
                totalUnsubscribed
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;