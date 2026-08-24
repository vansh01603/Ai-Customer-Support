const Order = require('../models/Order');
const Conversation = require('../models/Conversation');
const { getAIResponse } = require('../services/aiService');

const sendMessage = async (req, res) => {
    try {
        const { message, orderId } = req.body;

        if (!message) {
            return res.status(400).json({
                message: 'Message is required'
            });
        }

        let order = null;

        if (orderId) {
            order = await Order.findOne({
                orderId,
                userId: req.userId
            });
        }

        const reply = await getAIResponse(message, order);

        const conversation = await Conversation.create({
            userId: req.userId,
            orderId: orderId || null,
            message,
            reply
        });

        res.json({
            reply,
            conversationId: conversation._id
        });

    } catch (error) {
        console.error('Chat error:', error.message);

        res.status(500).json({
            message: 'Failed to process message',
            error: error.message
        });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            userId: req.userId
        }).sort({ createdAt: 1 });

        res.json(conversations);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch chat history',
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getChatHistory
};