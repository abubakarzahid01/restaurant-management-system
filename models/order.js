const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    customer: {
        name: {
            type: String,
            required: [true, 'Customer name is required']
        },
        email: {
            type: String,
            required: [true, 'Customer email is required']
        },
        phone: {
            type: String,
            required: [true, 'Customer phone is required']
        },
        address: {
            type: String,
            required: [true, 'Delivery address is required']
        }
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: 500
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

// Generate order number 
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        const count = await mongoose.model('Order').countDocuments();
        const orderNum = String(count + 1).padStart(4, '0');
        
        this.orderNumber = `ORD${year}${month}${day}${orderNum}`;
    }
    next();
});

orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

orderSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;