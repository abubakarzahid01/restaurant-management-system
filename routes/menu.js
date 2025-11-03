const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET all menu items (Public - no auth required)
router.get('/', async (req, res) => {
    try {
        const { category, search, available, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }
        
        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by availability
        if (available !== undefined) {
            query.isAvailable = available === 'true';
        }
        
        // Execute query with pagination
        const menuItems = await Menu.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Get total count
        const count = await Menu.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                menuItems,
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

// GET single menu item by ID (Public - no auth required)
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        
        res.json({ success: true, data: menuItem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new menu item (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable, discount } = req.body;
        
        const menuItem = new Menu({
            name,
            description,
            price,
            category,
            image,
            isAvailable,
            discount
        });
        
        await menuItem.save();
        
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update menu item (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, description, price, category, image, isAvailable, discount } = req.body;
        
        const menuItem = await Menu.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, image, isAvailable, discount },
            { new: true, runValidators: true }
        );
        
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        
        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE menu item (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const menuItem = await Menu.findByIdAndDelete(req.params.id);
        
        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        
        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET menu statistics (Admin only)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalItems = await Menu.countDocuments();
        const availableItems = await Menu.countDocuments({ isAvailable: true });
        const unavailableItems = await Menu.countDocuments({ isAvailable: false });
        
        // Count by category
        const categories = await Menu.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            data: {
                totalItems,
                availableItems,
                unavailableItems,
                categories
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;