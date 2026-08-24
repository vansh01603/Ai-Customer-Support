import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Dashboard.css';

function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get(
                    '/chat/history',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to load chat history');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchHistory();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="dashboard-options">
                <Link to="/orders" className="dashboard-card">Orders</Link>
                <Link to="/chat" className="dashboard-card">Chat</Link>
            </div>

            <div className="dashboard-history">
                <h3>Chat History</h3>

                {loading && <p>Loading...</p>}

                {!loading && history.length === 0 && (
                    <p>No chat history yet.</p>
                )}

                {!loading && history.length > 0 && (
                    <div className="history-list">
                        {history.map((chat, index) => (
                            <div key={index} className="history-item">
                                <p className="history-user"><strong>You:</strong> {chat.message}</p>
                                <p className="history-ai"><strong>AI:</strong> {chat.reply}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;