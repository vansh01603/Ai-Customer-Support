import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Order.css';
import api from '../api/axios';

function Order() {
    const [tab, setTab] = useState('view');
    const [orders, setOrders] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [placing, setPlacing] = useState(false);

    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get(
                '/orders',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalog = async () => {
        try {
            const response = await api.get(
                '/orders/catalog',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCatalog(response.data);
            if (response.data.length > 0) {
                setSelectedItem(response.data[0].id);
            }
        } catch (error) {
            console.error('Failed to load catalog');
        }
    };

    useEffect(() => {
        if (tab === 'view') {
            fetchOrders();
        } else {
            fetchCatalog();
        }
    }, [tab]);

    const placeOrder = async (e) => {
        e.preventDefault();
        setPlacing(true);

        try {
            await api.post(
                '/orders',
                {
                    itemId: selectedItem,
                    quantity: Number(quantity)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Order placed successfully');
            setTab('view');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="order-page">
            <div className="order-header">
                <h2>Orders</h2>
                <Link to="/dashboard" className="back-link">Back to Dashboard</Link>
            </div>

            <div className="order-tabs">
                <button
                    className={tab === 'view' ? 'active' : ''}
                    onClick={() => setTab('view')}
                >
                    View Orders
                </button>
                <button
                    className={tab === 'place' ? 'active' : ''}
                    onClick={() => setTab('place')}
                >
                    Place Order
                </button>
            </div>

            {tab === 'view' && (
                <div className="order-list">
                    {loading && <p>Loading...</p>}

                    {!loading && orders.length === 0 && (
                        <p>No orders yet.</p>
                    )}

                    {!loading && orders.map((order) => (
                        <div key={order._id} className="order-item">
                            <p><strong>Order ID:</strong> {order.orderId}</p>
                            {order.items.map((item, i) => (
                                <p key={i}>{item.name} x{item.quantity} — ₹{item.price}</p>
                            ))}
                            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            {order.estimatedDelivery && (
                                <p><strong>Est. Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'place' && (
                <form className="place-order-form" onSubmit={placeOrder}>
                    <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        {catalog.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name} — ₹{item.price}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <button type="submit" disabled={placing || !selectedItem}>
                        {placing ? 'Placing...' : 'Place Order'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Order;