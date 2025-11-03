const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide menu item name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please provide category'],
        enum: ['All', 'Burger', 'Pizza', 'Fries', 'Ice-cream', 'Coffee', 'Other'],
        default: 'Other'
    },
    image: {
        type: String,
        required: [true, 'Please provide image URL']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot be more than 100%']
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
menuSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field 
menuSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;