const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET all bookings (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, date, search, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by date
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            
            query.date = {
                $gte: startDate,
                $lt: endDate
            };
        }
        
        // Search by name or phone
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Execute query with pagination
        const bookings = await Booking.find(query)
            .sort({ date: 1, time: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Get total count
        const count = await Booking.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                bookings,
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

// GET single booking by ID (Admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new booking (Public - no auth required)
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, partySize, date, time, specialRequests } = req.body;
        
        const booking = new Booking({
            name,
            phone,
            email,
            partySize,
            date,
            time,
            specialRequests
        });
        
        await booking.save();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update booking status (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, phone, email, partySize, date, time, status, specialRequests } = req.body;
        
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, partySize, date, time, status, specialRequests },
            { new: true, runValidators: true }
        );
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        res.json({
            success: true,
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE booking (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET booking statistics (Admin only)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const todayBookings = await Booking.countDocuments({
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });
        
        res.json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                todayBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;