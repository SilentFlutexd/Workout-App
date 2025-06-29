import React, { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //Login logic here
        console.log('Logging in with', email, password);
    };

    return (
        <>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}/>
        <label>Email:</label>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        <button type="submit">Log In</button>
        </>
    );
}