import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Chat.css';
import api from '../api/axios';

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || loading) return;

        const userMessage = message;

        setMessages((prev) => [
            ...prev,
            {
                sender: 'user',
                text: userMessage
            }
        ]);

        setMessage('');
        setLoading(true);

        try {
            const response = await api.post(
                '/chat',
                {
                    message: userMessage,
                    orderId: orderId || undefined
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    text: response.data.reply
                }
            ]);

        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    text: 'Sorry, something went wrong. Please try again.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-page">

            <div className="chat-header">
                <h2>AI Customer Support</h2>

                <div className="chat-header-actions">
                    <Link to="/dashboard" className="back-btn">Dashboard</Link>

                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="order-input">
                <input
                    type="text"
                    placeholder="Enter Order ID (e.g. ORD1001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
            </div>

            <div className="messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <h3>Hello! 👋</h3>
                        <p>
                            I'm your AI customer support assistant.
                            How can I help you today?
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender}`}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && (
                    <div className="message ai typing">
                        AI is typing...
                    </div>
                )}
            </div>

            <form
                className="message-form"
                onSubmit={sendMessage}
            >
                <input
                    type="text"
                    placeholder={
                        loading
                            ? 'Waiting for AI response...'
                            : 'Ask something...'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>

        </div>
    );
}

export default Chat;