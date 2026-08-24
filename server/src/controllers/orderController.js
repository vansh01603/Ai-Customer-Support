const Order = require('../models/Order');

const CATALOG = [
    { id: 'ITEM001', name: 'Wireless Mouse', price: 499 },
    { id: 'ITEM002', name: 'Mechanical Keyboard', price: 2499 },
    { id: 'ITEM003', name: 'USB-C Hub', price: 999 },
    { id: 'ITEM004', name: 'Laptop Stand', price: 1299 },
    { id: 'ITEM005', name: 'Noise Cancelling Headphones', price: 3999 }
];

const createOrder = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        const catalogItem = CATALOG.find((i) => i.id === itemId);

        if (!catalogItem) {
            return res.status(400).json({
                message: 'Invalid item selected'
            });
        }

        const qty = Number(quantity) > 0 ? Number(quantity) : 1;
        const totalAmount = catalogItem.price * qty;
        const orderId = 'ORD' + Date.now();

        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        const order = await Order.create({
            orderId,
            userId: req.userId,
            items: [
                {
                    name: catalogItem.name,
                    quantity: qty,
                    price: catalogItem.price
                }
            ],
            totalAmount,
            estimatedDelivery
        });

        res.status(201).json({
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            orderId,
            userId: req.userId
        });

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch order',
            error: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

const getCatalog = (req, res) => {
    res.json(CATALOG);
};

module.exports = {
    createOrder,
    getOrder,
    getMyOrders,
    getCatalog
};