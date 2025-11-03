const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide phone number'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    partySize: {
        type: Number,
        required: [true, 'Please provide party size'],
        min: [1, 'Party size must be at least 1'],
        max: [20, 'Party size cannot exceed 20']
    },
    date: {
        type: Date,
        required: [true, 'Please provide booking date']
    },
    time: {
        type: String,
        required: [true, 'Please provide booking time']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field 
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field 
bookingSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;