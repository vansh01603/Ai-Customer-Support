import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Register.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                '/auth/register',
                {
                    name,
                    email,
                    password
                }
            );

            alert('Registration successful');
            navigate('/login');

        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Registration failed'
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Register</h1>

                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;