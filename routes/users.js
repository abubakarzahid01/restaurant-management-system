const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken, authenticateToken, isAdmin, isOwnerOrAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// PUBLIC ROUTES (No authentication required)

// POST register new user (Public signup)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role = 'user' } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role === 'admin' ? 'user' : role
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// POST login user (Public login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is inactive' });
        }
        
        // Verify password
       const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = generateToken(user._id, user.role);
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ADMIN ROUTES (Authentication required)

// Get all users (Admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;
        
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            query.role = role;
        }

        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching users',
            error: error.message 
        });
    }
});

// Create a new user (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and password' 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        const newUser = new User({ 
            name, 
            email, 
            password,
            role: role || 'user'
        });
        
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.error('Create user error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: messages 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error creating user',
            error: error.message 
        });
    }
});

// Get a user by ID
router.get('/:id', authenticateToken, isOwnerOrAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching user',
            error: error.message 
        });
    }
});

// Update a user
router.put('/:id', authenticateToken, isOwnerOrAdmin, async (req, res) => {
    try {
        const { name, email, password, role, isActive } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        if (req.user.role === 'admin') {
            if (role) updateData.role = role;
            if (typeof isActive !== 'undefined') updateData.isActive = isActive;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        updateData.updatedAt = Date.now();

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: 'Validation error',
                errors: messages 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Error updating user',
            error: error.message 
        });
    }
});

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ 
                success: false,
                message: 'You cannot delete your own account' 
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        res.json({ 
            success: true,
            message: 'User deleted successfully' 
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting user',
            error: error.message 
        });
    }
});

// Get current logged-in user profile
router.get('/me/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching profile',
            error: error.message 
        });
    }
});

module.exports = router;