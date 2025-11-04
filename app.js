require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const os = require('os');

const User = require('./models/user');
const { authenticateToken, isAdmin } = require('./middleware/auth'); // FIX: Import the functions
const usersRouter = require('./routes/users');

const app = express();
const port = 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mywebapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes - Use /api/users for the API
app.use('/api/users', usersRouter);
app.use('/api/menu', require('./routes/menu'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/orders', require('./routes/orders'));

// OLD Login/Signup routes - You can remove these now since they're in usersRouter
// But I'll keep them commented out so you can remove them later
/*
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
*/

// Serve admin login page (no authentication required)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin/admin-login.html'));
});

// Serve other admin pages (they check authentication in JavaScript)
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// Landing page route
app.use('/', express.static(path.join(__dirname, 'public/landing')));

// Helper: get LAN IP
function getLocalIp() {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

// Use Render's assigned port or fallback to 3000 for local
const PORT = process.env.PORT || port || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
