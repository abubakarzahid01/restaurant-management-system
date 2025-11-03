const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET all reviews (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Execute query with pagination
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Get total count
        const count = await Review.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                reviews,
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

// GET approved reviews only (Public - no auth required)
router.get('/approved', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single review by ID (Admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        res.json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new review (Public - no auth required)
router.post('/', async (req, res) => {
    try {
        const { name, email, rating, review } = req.body;
        
        const newReview = new Review({
            name,
            email,
            rating,
            review
        });
        
        await newReview.save();
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully! It will be published after moderation.',
            data: newReview
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update review status (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        res.json({
            success: true,
            message: 'Review status updated successfully',
            data: review
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE review (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET review statistics (Admin only)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments();
        const pendingReviews = await Review.countDocuments({ status: 'pending' });
        const approvedReviews = await Review.countDocuments({ status: 'approved' });
        const rejectedReviews = await Review.countDocuments({ status: 'rejected' });
        
        res.json({
            success: true,
            data: {
                totalReviews,
                pendingReviews,
                approvedReviews,
                rejectedReviews
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;