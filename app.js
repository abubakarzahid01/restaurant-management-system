require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const os = require('os');

const User = require('./models/user');
const { authenticateToken, isAdmin } = require('./middleware/auth');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

//  Serve static files for frontend and admin
app.use('/frontend', express.static(path.join(__dirname, 'public/frontend')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

//  Middleware
app.use(cors());
app.use(express.json());

//  MongoDB connection
mongoose.connect(
  process.env.MONGODB_URI ||
    'mongodb+srv://restaurant_admin:JtLmc8BMwzqgnZDU@cluster0.i2vsj.mongodb.net/restaurantDB?retryWrites=true&w=majority'
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

//  API routes
app.use('/api/users', usersRouter);
app.use('/api/menu', require('./routes/menu'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/orders', require('./routes/orders'));

//  Serve admin login directly
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/admin-login.html'));
});

//  Redirect root "/" to frontend
app.get('/', (req, res) => {
  res.redirect('/frontend/index.html');
});

//  Helper: Get LAN IP (for local testing)
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

//  Start server
const localIp = getLocalIp();
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://${localIp}:${port}`);
});
