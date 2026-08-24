const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        orderId: {
            type: String,
            default: null
        },

        message: {
            type: String,
            required: true
        },

        reply: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Conversation', conversationSchema);