const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;