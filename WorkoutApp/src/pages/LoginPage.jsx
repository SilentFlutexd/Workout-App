import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Use AuthContext login function
                login(data.user, data.token);
                
                console.log('Login successful:', data.user);
                
                // Redirect to account page
                navigate('/account');
            } else {
                // Handle login errors
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please check if the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                <h2>Login</h2>
                {error && (
                    <div style={{ 
                        color: '#ff6b6b', 
                        backgroundColor: '#2b1f1f', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginBottom: '15px',
                        border: '1px solid #ff6b6b'
                    }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Enter your email"
                    />

                    <br />

                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        placeholder="Enter your password"
                    />

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        style={{
                            opacity: isLoading ? 0.6 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', color: '#ccc' }}>
                    Don't have an account?{' '}
                    <a 
                        href="/signup" 
                        style={{ color: '#ff914d' }}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/signup');
                        }}
                    >
                        Sign up here
                    </a>
                </p>
            </div>
        </>
    );
}