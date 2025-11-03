const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        trim: true,
        lowercase: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    review: {
        type: String,
        required: [true, 'Please provide review text'],
        maxlength: [500, 'Review cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;