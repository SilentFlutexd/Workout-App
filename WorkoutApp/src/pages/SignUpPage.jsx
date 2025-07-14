import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                    confirmPassword: confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Use AuthContext login function
                login(data.user, data.token);
                
                setSuccess('Account created successfully! Redirecting...');
                console.log('Signup successful:', data.user);
                
                // Redirect to account page after a short delay
                setTimeout(() => {
                    navigate('/account');
                }, 1500);
            } else {
                // Handle signup errors
                setError(data.error || 'Signup failed');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Network error. Please check if the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Create an Account</h2>
            
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
            
            {success && (
                <div style={{ 
                    color: '#4caf50', 
                    backgroundColor: '#1f2b1f', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    marginBottom: '15px',
                    border: '1px solid #4caf50'
                }}>
                    {success}
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
                    placeholder="Enter your email address"
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
                    placeholder="At least 8 characters with letters and numbers"
                />

                <br />

                <label>Confirm Password:</label>
                <br />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    disabled={isLoading}
                    placeholder="Confirm your password"
                />
                
                <button 
                    type="submit"
                    disabled={isLoading}
                    style={{
                        opacity: isLoading ? 0.6 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
            
            <p style={{ marginTop: '20px', color: '#ccc' }}>
                Already have an account?{' '}
                <a 
                    href="/login" 
                    style={{ color: '#ff914d' }}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                    }}
                >
                    Login here
                </a>
            </p>
        </>
    );
}