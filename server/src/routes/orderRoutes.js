const express = require('express');

const {
    createOrder,
    getOrder,
    getMyOrders,
    getCatalog
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder);

router.get('/catalog', authMiddleware, getCatalog);

router.get('/', authMiddleware, getMyOrders);

router.get('/:orderId', authMiddleware, getOrder);

module.exports = router;