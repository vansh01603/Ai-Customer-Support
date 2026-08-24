import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Landing() {
    return (
        <div className="landing-page">
            <h1 className="landing-title">AI Customer Support System</h1>
            <div className="Landing">
                <div className="Landing-links">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/register" className="register-btn">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Landing;