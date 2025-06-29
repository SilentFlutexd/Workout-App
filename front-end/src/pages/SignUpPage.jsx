import React, { useState } from 'react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // This is where sign-up logic will go
        console.log('Signing up with', email, password);
    };

    return (
        <>
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit}>

            <label>Email:</label>
            <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />


            <label>Password:</label>
            <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            />

            <label>Confirm Password:</label>
            <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            />
        <button type="submit">Sign Up</button>
        </form>
    </>
    );
}
