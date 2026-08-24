const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'AI Customer Support API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;