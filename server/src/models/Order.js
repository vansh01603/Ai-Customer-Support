const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },

        items: [
            {
                name: String,
                quantity: Number,
                price: Number
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        estimatedDelivery: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);