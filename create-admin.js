require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-web-app';

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('⚠ Admin user already exists!');
            await mongoose.connection.close();
            process.exit(0);
        }

        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            isActive: true
        });

        await admin.save();
        
        console.log('\n✓ Admin user created successfully!');
        console.log('================================');
        console.log('Email:    admin@example.com');
        console.log('Password: admin123');
        console.log('Role:     admin');
        console.log('================================');
        console.log('\n⚠ IMPORTANT: Change this password after first login!\n');
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('✗ Error creating admin:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

createAdmin();