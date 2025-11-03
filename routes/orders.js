const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET all orders (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Search by order number, customer name, email, or phone
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } },
                { 'customer.email': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } }
            ];
        }
        
        // Execute query with pagination
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        // Get total count
        const count = await Order.countDocuments(query);
        
        res.json({
            success: true,
            data: {
                orders,
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

// GET single order by ID (Admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create new order (Public - no auth required)
router.post('/', async (req, res) => {
    try {
        const { customer, items, totalAmount, paymentMethod, notes } = req.body;
        
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
        }
        
        const order = new Order({
            customer,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'cash',
            notes
        });
        
        await order.save();
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update order status (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        
        const updateData = {};
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE order (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET order statistics (Admin only)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const preparingOrders = await Order.countDocuments({ status: 'preparing' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
        
        // Calculate today's revenue
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayOrders = await Order.find({
            createdAt: { $gte: todayStart },
            status: { $ne: 'cancelled' }
        });
        
        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Calculate total revenue
        const allOrders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                preparingOrders,
                deliveredOrders,
                todayRevenue,
                totalRevenue
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;