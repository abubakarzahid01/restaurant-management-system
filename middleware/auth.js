const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role: role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. User not found.' 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ 
                success: false,
                message: 'Account is deactivated.' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token.' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired.' 
            });
        }
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error.' 
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin privileges required.' 
        });
    }
};

const isOwnerOrAdmin = (req, res, next) => {
    const userId = req.params.id;
    
    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
        next();
    } else {
        return res.status(403).json({ 
            success: false,
            message: 'Access denied. You can only access your own data.' 
        });
    }
};

module.exports = {
    generateToken,
    authenticateToken,
    isAdmin,
    isOwnerOrAdmin
};